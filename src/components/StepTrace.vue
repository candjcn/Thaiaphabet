<template>
  <div class="space-y-6">
    <!-- 字母选择 -->
    <div class="flex justify-center gap-4">
      <button
        v-for="(c, i) in props.lesson.consonants"
        :key="c.char"
        @click="currentLetterIndex = i"
        :class="[
          'thai text-3xl px-4 py-2 rounded-xl border-2 transition-all',
          currentLetterIndex === i
            ? 'border-(--color-primary) bg-purple-50 shadow-md'
            : traced.has(i)
              ? 'border-green-300 bg-green-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
        ]"
      >
        {{ c.char }}
        <span v-if="traced.has(i)" class="text-sm ml-1">✓</span>
      </button>
    </div>

    <!-- Canvas 临摹区域 -->
    <div class="relative mx-auto" style="width: 300px; height: 300px;">
      <!-- 底层：半透明字母骨架 -->
      <div
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
        :style="{ opacity: showGuide && !animating ? 0.15 : 0 }"
      >
        <span class="thai select-none" style="font-size: 14rem; line-height: 1;">
          {{ currentLetter.char }}
        </span>
      </div>

      <!-- Canvas 描红层 -->
      <canvas
        ref="canvasRef"
        width="300"
        height="300"
        class="absolute inset-0 rounded-2xl border-2 border-gray-200 cursor-crosshair bg-white/80"
        style="touch-action: none;"
        @pointerdown="startDraw"
        @pointermove="draw"
        @pointerup="endDraw"
        @pointerleave="endDraw"
      ></canvas>
    </div>

    <!-- 工具栏 -->
    <div class="flex justify-center gap-3 flex-wrap">
      <button @click="clearCanvas" class="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
        🗑️ 清除重写
      </button>
      <button @click="showGuide = !showGuide" class="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
        {{ showGuide ? '👁️ 隐藏引导' : '👁️‍🗨️ 显示引导' }}
      </button>
      <button
        @click="playStrokeAnimation"
        :disabled="animating"
        :class="[
          'px-4 py-2 rounded-lg text-sm transition',
          animating
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        ]"
      >
        {{ animating ? '⏳ 播放中...' : '▶️ 播放笔顺' }}
      </button>
    </div>

    <!-- 标记已练习 + 继续 -->
    <div class="text-center space-y-3">
      <button
        v-if="!traced.has(currentLetterIndex)"
        @click="markTraced"
        class="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
      >
        ✓ 练习完毕
      </button>
      <div>
        <button
          @click="$emit('complete')"
          :disabled="traced.size < props.lesson.consonants.length"
          :class="[
            'px-8 py-3 rounded-xl font-bold text-lg transition-all',
            traced.size >= props.lesson.consonants.length
              ? 'bg-(--color-primary) text-white hover:bg-(--color-primary-dark) shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          ]"
        >
          {{ traced.size >= props.lesson.consonants.length ? '继续 →' : `还有 ${props.lesson.consonants.length - traced.size} 个未练习` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { strokePaths } from '../data/strokePaths.js'

const props = defineProps({ lesson: Object })
defineEmits(['complete'])

const canvasRef = ref(null)
const currentLetterIndex = ref(0)
const showGuide = ref(true)
const traced = ref(new Set())
const animating = ref(false)
let isDrawing = false
let ctx = null
let animationId = null
let lastPos = null
let lastWidth = 4

// 笔画粗细范围
const MIN_WIDTH = 2
const MAX_WIDTH = 10

const currentLetter = computed(() => props.lesson.consonants[currentLetterIndex.value])

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  setupCanvas()
})

watch(currentLetterIndex, () => {
  cancelAnimation()
  clearCanvas()
})

function setupCanvas() {
  if (!ctx) return
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = '#6C63FF'
}

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (300 / rect.width),
    y: (e.clientY - rect.top) * (300 / rect.height),
  }
}

// 根据压感/接触面积计算笔画宽度
function getWidth(e) {
  // 触控笔/手写笔：直接用压力值
  if (e.pressure && e.pressure > 0 && e.pressure < 1) {
    return MIN_WIDTH + e.pressure * (MAX_WIDTH - MIN_WIDTH)
  }
  // 手指触摸：用接触面积（width 通常 20~60+）
  if (e.pointerType === 'touch' && e.width > 1) {
    const normalized = Math.min(1, (e.width - 10) / 50)
    return MIN_WIDTH + normalized * (MAX_WIDTH - MIN_WIDTH)
  }
  // 鼠标：固定中等粗细
  return 4
}

function startDraw(e) {
  if (animating.value) return
  isDrawing = true
  lastPos = getPos(e)
  lastWidth = getWidth(e)
  e.preventDefault()
}

function draw(e) {
  if (!isDrawing || animating.value) return
  const pos = getPos(e)
  const targetWidth = getWidth(e)

  // 平滑过渡，避免粗细突变
  const width = lastWidth * 0.6 + targetWidth * 0.4

  // 用两点之间的独立线段实现变宽笔画
  ctx.beginPath()
  ctx.lineWidth = width
  ctx.moveTo(lastPos.x, lastPos.y)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()

  lastPos = pos
  lastWidth = width
  e.preventDefault()
}

function endDraw() {
  isDrawing = false
  lastPos = null
}

function clearCanvas() {
  if (!ctx) return
  ctx.clearRect(0, 0, 300, 300)
  setupCanvas()
}

function cancelAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  animating.value = false
}

function markTraced() {
  traced.value.add(currentLetterIndex.value)
  clearCanvas()
  for (let i = 0; i < props.lesson.consonants.length; i++) {
    if (!traced.value.has(i)) {
      currentLetterIndex.value = i
      return
    }
  }
}

// ── 笔顺动画核心 ──

// 渲染字母到离屏 Canvas，返回 { canvas, imgData, bbox }
function renderOffscreen(char) {
  const off = document.createElement('canvas')
  off.width = 300
  off.height = 300
  const oc = off.getContext('2d')
  oc.font = '200px "IBM Plex Sans Thai Looped"'
  oc.textAlign = 'center'
  oc.textBaseline = 'middle'
  oc.fillStyle = '#6C63FF'
  oc.fillText(char, 150, 160)

  const imgData = oc.getImageData(0, 0, 300, 300)
  const d = imgData.data

  // 计算字母包围盒
  let top = 300, bottom = 0, left = 300, right = 0
  for (let y = 0; y < 300; y++) {
    for (let x = 0; x < 300; x++) {
      if (d[(y * 300 + x) * 4 + 3] > 50) {
        if (y < top) top = y
        if (y > bottom) bottom = y
        if (x < left) left = x
        if (x > right) right = x
      }
    }
  }

  return {
    canvas: off,
    imgData,
    bbox: { top, bottom, left, right, w: right - left, h: bottom - top },
  }
}

// 将归一化坐标 (0~1) 映射到画布坐标，并吸附到最近的字母像素
function mapAndSnap(normalizedPath, bbox, imgData) {
  const d = imgData.data
  const alpha = (x, y) => {
    const ix = Math.round(x)
    const iy = Math.round(y)
    if (ix < 0 || ix >= 300 || iy < 0 || iy >= 300) return 0
    return d[(iy * 300 + ix) * 4 + 3]
  }

  return normalizedPath.map(([nx, ny]) => {
    // 映射到画布坐标
    const cx = bbox.left + nx * bbox.w
    const cy = bbox.top + ny * bbox.h

    // 在半径 20px 内搜索最近的字母像素
    if (alpha(cx, cy) > 50) return { x: cx, y: cy }

    let bestX = cx, bestY = cy, bestDist = Infinity
    const r = 20
    for (let dy = -r; dy <= r; dy += 2) {
      for (let dx = -r; dx <= r; dx += 2) {
        if (alpha(cx + dx, cy + dy) > 50) {
          const dist = dx * dx + dy * dy
          if (dist < bestDist) {
            bestDist = dist
            bestX = cx + dx
            bestY = cy + dy
          }
        }
      }
    }
    return { x: bestX, y: bestY }
  })
}

// Catmull-Rom 样条插值，生成平滑路径
function interpolatePath(points, totalFrames) {
  if (points.length < 2) return points
  const result = []
  const segments = points.length - 1
  const framesPerSeg = Math.max(1, Math.ceil(totalFrames / segments))

  for (let i = 0; i < segments; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]

    for (let j = 0; j < framesPerSeg; j++) {
      const t = j / framesPerSeg
      const t2 = t * t
      const t3 = t2 * t
      result.push({
        x: 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      })
    }
  }
  result.push(points[points.length - 1])
  return result
}

// 执行动画帧循环
function runAnimation(path, offCanvas) {
  let frame = 0

  const animate = () => {
    ctx.clearRect(0, 0, 300, 300)

    // 底层：淡化的完整字母轮廓
    ctx.globalAlpha = 0.08
    ctx.drawImage(offCanvas, 0, 0)
    ctx.globalAlpha = 1.0

    // 用累积圆形剪切区域逐步显露字母
    ctx.save()
    ctx.beginPath()
    for (let i = 0; i <= frame && i < path.length; i++) {
      ctx.moveTo(path[i].x + 16, path[i].y)
      ctx.arc(path[i].x, path[i].y, 16, 0, Math.PI * 2)
    }
    ctx.clip()
    ctx.drawImage(offCanvas, 0, 0)
    ctx.restore()

    // 发光小球
    if (frame < path.length) {
      const p = path[frame]
      const grad = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 16)
      grad.addColorStop(0, 'rgba(255, 215, 0, 0.9)')
      grad.addColorStop(0.5, 'rgba(255, 215, 0, 0.3)')
      grad.addColorStop(1, 'rgba(255, 215, 0, 0)')
      ctx.beginPath()
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#FFD700'
      ctx.fill()
    }

    frame++
    if (frame < path.length) {
      animationId = requestAnimationFrame(animate)
    } else {
      ctx.clearRect(0, 0, 300, 300)
      ctx.drawImage(offCanvas, 0, 0)
      setTimeout(() => {
        if (animating.value) {
          clearCanvas()
          animating.value = false
          animationId = null
        }
      }, 1000)
    }
  }

  animationId = requestAnimationFrame(animate)
}

function playStrokeAnimation() {
  if (animating.value) return
  animating.value = true
  clearCanvas()

  const char = currentLetter.value.char
  const { canvas: off, imgData, bbox } = renderOffscreen(char)
  const manualPath = strokePaths[char]

  if (manualPath) {
    // 手工笔顺：归一化坐标 → 画布坐标 → 吸附到字母像素 → 样条插值
    const snapped = mapAndSnap(manualPath, bbox, imgData)
    const smooth = interpolatePath(snapped, 150)
    runAnimation(smooth, off)
  } else {
    // 无手工数据时回退：扫描线骨架 + 最近邻排序
    const isCharPixel = (x, y) => {
      if (x < 0 || x >= 300 || y < 0 || y >= 300) return false
      return imgData.data[(y * 300 + x) * 4 + 3] > 50
    }
    const skelPoints = []
    for (let y = 0; y < 300; y += 2) {
      let inRun = false, runStart = 0
      for (let x = 0; x <= 300; x++) {
        const ic = x < 300 && isCharPixel(x, y)
        if (ic && !inRun) { runStart = x; inRun = true }
        else if (!ic && inRun) {
          skelPoints.push({ x: Math.round((runStart + x - 1) / 2), y })
          inRun = false
        }
      }
    }
    if (skelPoints.length === 0) { animating.value = false; return }

    let startIdx = 0
    for (let i = 1; i < skelPoints.length; i++) {
      if (skelPoints[i].y < skelPoints[startIdx].y ||
          (skelPoints[i].y === skelPoints[startIdx].y && skelPoints[i].x > skelPoints[startIdx].x)) {
        startIdx = i
      }
    }
    const ordered = []
    const remaining = new Array(skelPoints.length).fill(true)
    let cur = startIdx
    remaining[cur] = false
    ordered.push(skelPoints[cur])
    for (let n = 1; n < skelPoints.length; n++) {
      let bestIdx = -1, bestDist = Infinity
      for (let i = 0; i < skelPoints.length; i++) {
        if (!remaining[i]) continue
        const dx = skelPoints[i].x - skelPoints[cur].x
        const dy = skelPoints[i].y - skelPoints[cur].y
        const d = dx * dx + dy * dy
        if (d < bestDist) { bestDist = d; bestIdx = i }
      }
      if (bestIdx === -1) break
      ordered.push(skelPoints[bestIdx])
      remaining[bestIdx] = false
      cur = bestIdx
    }
    const step = Math.max(1, Math.floor(ordered.length / 150))
    const path = ordered.filter((_, i) => i % step === 0)
    runAnimation(path, off)
  }
}
</script>
