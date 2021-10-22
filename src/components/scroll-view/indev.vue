<script lang="ts" setup>
import { ref, watchEffect, computed } from 'vue'
import { useScroll, usePullUp } from '../../hooks'
import { useLayout, useBounce } from './hooks'
// import { throttle } from '../../utils'
// @ts-ignore
import throttle from 'lodash.throttle'

interface Props {
  scrollX?: boolean
  scrollY?: boolean
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
  target: window,
  bounce: true,
})

// const pullDownRefresh = computed(() => {
//   const flag = props.pullDownRefresh
//   if (!flag) return false
//   if (flag === true) return { threshold: 90, stop: 40 }
//   return flag
// })

// const pullUpLoad = computed(() => {
//   const flag = props.pullUpLoad
//   if (!flag) return false
//   if (flag === true) return { threshold: 0 }
//   return flag
// })

// const { pullupText, pullDownText } = useLayout(props)
const pullDownText = ref('')
const pullupText = ref('加载中')

const pullFlag = ref('down')
watchEffect(() => {
  if (pullFlag.value === 'down') {
    pullDownText.value = props?.request?.loading ? '加载中' : '加载完成'
  } else {
    pullupText.value = props?.request?.loading ? '加载中' : '加载更多'
  }
})

const emit = defineEmits<{ (e: 'pull-up'): void; (e: 'pull-down'): void }>()

const pullDownEmit = () => {
  pullFlag.value = 'down'
  emit('pull-down')
}
const { onTouchEnd, onTouchMove, onTouchStart, trackStyle } = useBounce({
  ...props,
  // pullDownRefresh: pullDownRefresh.value,
  pullDownEmit,
})

// useScroll(e => {})

const handlePullupClick = () => {
  if (props?.request?.finished) return
  if (!props?.request?.loading) {
    pullFlag.value = 'pull-up'
    emit('pull-up')
  }
}
usePullUp(
  throttle(() => {
    if (!props?.request?.loading && !props?.request?.finished) {
      pullFlag.value = 'pull-up'
      emit('pull-up')
    }
  }, 50),
  props
  // { ...props, pullUpLoad: pullUpLoad.value }
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
      <slot name="pulldown">
        <div @click="handlePullupClick" class="pullupText">
          {{ pullDownText }}
        </div>
      </slot>
      <slot />

      <slot name="pullup" :pullupClick="handlePullupClick">
        <div @click="handlePullupClick" class="pullupText">
          {{ pullupText }}
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.pullupText {
  text-align: center;
}
</style>
