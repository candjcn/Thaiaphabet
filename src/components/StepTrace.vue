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
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" :style="{ opacity: showGuide ? 0.15 : 0 }">
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
        @pointerdown="startDraw"
        @pointermove="draw"
        @pointerup="endDraw"
        @pointerleave="endDraw"
      ></canvas>
    </div>

    <!-- 工具栏 -->
    <div class="flex justify-center gap-3">
      <button @click="clearCanvas" class="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
        🗑️ 清除重写
      </button>
      <button @click="showGuide = !showGuide" class="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
        {{ showGuide ? '👁️ 隐藏引导' : '👁️‍🗨️ 显示引导' }}
      </button>
      <button @click="playStrokeAnimation" class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition">
        ▶️ 播放笔顺
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

const props = defineProps({ lesson: Object })
defineEmits(['complete'])

const canvasRef = ref(null)
const currentLetterIndex = ref(0)
const showGuide = ref(true)
const traced = ref(new Set())
let isDrawing = false
let ctx = null

const currentLetter = computed(() => props.lesson.consonants[currentLetterIndex.value])

onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  setupCanvas()
})

watch(currentLetterIndex, () => {
  clearCanvas()
})

function setupCanvas() {
  if (!ctx) return
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 4
  ctx.strokeStyle = '#6C63FF'
}

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  return {
    x: (e.clientX - rect.left) * (300 / rect.width),
    y: (e.clientY - rect.top) * (300 / rect.height),
  }
}

function startDraw(e) {
  isDrawing = true
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
  e.preventDefault()
}

function draw(e) {
  if (!isDrawing) return
  const pos = getPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  e.preventDefault()
}

function endDraw() {
  isDrawing = false
}

function clearCanvas() {
  if (!ctx) return
  ctx.clearRect(0, 0, 300, 300)
  setupCanvas()
}

function markTraced() {
  traced.value.add(currentLetterIndex.value)
  clearCanvas()
  // 自动跳到下一个未完成的字母
  for (let i = 0; i < props.lesson.consonants.length; i++) {
    if (!traced.value.has(i)) {
      currentLetterIndex.value = i
      return
    }
  }
}

function playStrokeAnimation() {
  clearCanvas()
  // 简单的笔顺动画：在 Canvas 上画出字母形状
  const char = currentLetter.value.char
  ctx.save()
  ctx.font = '200px "Noto Sans Thai"'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 用虚线渐进动画模拟笔顺
  let dashOffset = 1000
  const animate = () => {
    ctx.clearRect(0, 0, 300, 300)
    ctx.setLineDash([1000])
    ctx.lineDashOffset = dashOffset
    ctx.lineWidth = 2
    ctx.strokeStyle = '#6C63FF'
    ctx.strokeText(char, 150, 160)
    dashOffset -= 15
    if (dashOffset > -200) {
      requestAnimationFrame(animate)
    } else {
      ctx.setLineDash([])
      setupCanvas()
    }
  }
  animate()
  ctx.restore()
}
</script>
