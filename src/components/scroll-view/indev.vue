<script lang="ts" setup>
import { ref, watchEffect, computed, h } from 'vue'
import { useScroll, usePullUp } from '../../hooks'
import { useBounce } from './hooks'
import { throttle } from '../../utils'

interface Props {
  scrollX?: boolean
  scrollY?: boolean
  bounce?: boolean
  target?: any
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

const pullDownRefresh = computed(() => {
  const flag = props.pullDownRefresh
  if (!flag) return false
  if (flag === true) return { threshold: 50, stop: 40 }
  return flag
})

const pullUpLoad = computed(() => {
  const flag = props.pullUpLoad
  if (!flag) return false
  if (flag === true) return { threshold: 0 }
  return flag
})

// const { pullupText, pullDownText } = useLayout(props)
// const pullDownText = ref('')

const pullupText = computed(() => {
  if (props?.request?.finished) return '没有数据了'
  return props?.request?.loading ? '加载中' : '加载更多'
})

const emit = defineEmits<{ (e: 'pull-up'): void; (e: 'pull-down'): void }>()

const pullDownEmit = () => {
  emit('pull-down')
}
const { onTouchEnd, onTouchMove, onTouchStart, trackStyle, PullDownTextEle } =
  useBounce({
    ...props,
    pullDownRefresh: pullDownRefresh.value,
    pullDownEmit,
  })

// useScroll(e => {})

const handlePullupClick = () => {
  if (props?.request?.finished) return
  if (!props?.request?.loading) {
    emit('pull-up')
  }
}
usePullUp(
  throttle(() => {
    if (!props?.request?.loading && !props?.request?.finished) {
      emit('pull-up')
    }
  }, 50),
  // props
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
      <div class="head">
        <slot name="pulldown">
          <div @click="handlePullupClick" class="pullText">
            <PullDownTextEle />
          </div>
        </slot>
      </div>

      <slot />

      <slot name="pullup" :pullupClick="handlePullupClick">
        <div @click="handlePullupClick" class="pullText">
          {{ pullupText }}
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.head {
  position: absolute;
  left: 0;
  width: 100%;
  transform: translateY(-100%);
}
.pullText {
  text-align: center;
}
</style>
