<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useScroll, usePullUp } from '../../hooks'
import { useLayout, useBounce } from './hooks'
// import { throttle } from '../../utils'
// @ts-ignore
import throttle from 'lodash.throttle'

interface Props {
  scrollX?: boolean
  scrollY?: boolean
  loading: boolean
  finished: boolean
  bounce: boolean
  target: any
  request?: {
    // 请求对象
    loading: boolean
    finished: boolean
  }
  // 下拉动作
  pullDownRefresh?:
    | boolean
    | {
        threshold: number
        stop: number
      }
  pullUpLoad?: true | { threshold: number }
}
const scrollRef = ref<HTMLDivElement>()

const props = withDefaults(defineProps<Props>(), {
  scrollY: true,
  threshold: 0,
  target: window,
  bounce: true,
})

const pullDownRefresh = computed(() => {
  const flag = props.pullDownRefresh
  if (!flag) return false
  if (flag === true) return { threshold: 90, stop: 40 }
  return flag
})

const pullUpLoad = computed(() => {
  const flag = props.pullUpLoad
  if (!flag) return false
  if (flag === true) return { threshold: 0 }
  return flag
})

const { pullupText } = useLayout(props)

const { onTouchEnd, onTouchMove, onTouchStart, trackStyle } = useBounce({
  ...props,
  pullDownRefresh: pullDownRefresh.value,
})

const emit = defineEmits<{ (e: 'pull-up'): void }>()

// useScroll(e => {})

const handlePullupClick = () => {
  if (props.finished) return
  if (!props.loading) {
    emit('pull-up')
  }
}
usePullUp(
  throttle(() => {
    if (!props.loading && !props.finished) {
      emit('pull-up')
    }
  }, 50),
  { ...props, pullUpLoad: pullUpLoad.value }
)
</script>

<template>
  <div>
    <div
      ref="scrollRef"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      :style="trackStyle"
    >
      <slot />

      <slot name="pullup" :pullupClick="handlePullupClick">
        <div @click="handlePullupClick" class="pullupText">
          {{ pullupText }}
        </div></slot
      >
    </div>
  </div>
</template>

<style scoped>
.pullupText {
  text-align: center;
}
</style>
