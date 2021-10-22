import { computed, useSlots, reactive, ref, watch } from 'vue'
import { getScrollTop } from '../../utils'
import { useTouch } from '../../hooks'
import type { Props, PullDownStatus } from './type'

export const useLayout = (props: Props) => {
  const slot = useSlots()

  console.log('slot', slot)

  const pullupText = computed(() => {
    if (props.finished) return '到底了'
    return props.loading ? '加载中' : '加载更多'
  })

  return {
    pullupText,
  }
}

export const useBounce = (props: Props) => {
  const state = reactive({
    distance: 0,
    duration: 0,
    status: 'normal' as PullDownStatus,
  })
  const touch = useTouch()

  const isTouchable = () =>
    state.status !== 'loading' && state.status !== 'success' && props.bounce

  const isPullDownRefresh = props.pullDownRefresh
  const isPullUpLoad = props.pullUpLoad

  const ease = (distance: number) => {
    const pullDistance = 50 // 触发下拉刷新的距离
    if (distance > pullDistance) {
      // 当前距离小于预设两倍距离
      if (distance < pullDistance * 2) {
        // 修正距离 逐步递增
        distance = pullDistance + (distance - pullDistance) / 2
      } else {
        // 当前距离大于两倍预设距离
        distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
      }
    }

    return Math.round(distance)
  }

  const setStatus = (distance: number, isLoading?: boolean) => {
    const pullDistance = 50
    state.distance = distance //缓冲过的距离

    if (isLoading) {
      state.status = 'loading'
    } else if (distance === 0) {
      state.status = 'normal'
    } else if (distance < pullDistance) {
      state.status = 'pulling'
    } else {
      state.status = 'loosing'
    }
  }
  let reachTop: boolean
  let reachBottom: boolean
  const checkPosition = (event: TouchEvent) => {
    reachTop = getScrollTop(props.target) === 0

    if (reachTop) {
      state.duration = 0
      touch.start(event)
    }
  }
  const onTouchStart = (event: TouchEvent) => {
    if (isTouchable()) {
      checkPosition(event)
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!isTouchable()) return
    // 实时获取到顶状态
    if (!reachTop) {
      checkPosition(event)
    }

    const { deltaY } = touch // 第一次松手前应是0？
    touch.move(event)

    if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
      if (typeof event.cancelable !== 'boolean' || event.cancelable) {
        event.preventDefault()
      }

      setStatus(ease(deltaY.value))
    }
  }

  const loading = ref(false)
  const onTouchEnd = () => {
    // console.log('reachTop', reachTop, touch.deltaY.value, isTouchable())
    if (reachTop && touch.deltaY.value && isTouchable()) {
      state.duration = 300

      if (state.status === 'loosing') {
        setStatus(50, true) // 修改状态为loading
        loading.value = true
      } else {
        setStatus(0)
      }
    }
  }

  watch(loading, val => {
    state.duration = 300
    if (val) {
      setStatus(50, true)
    } else {
      setStatus(0, false)
    }
  })

  const trackStyle = computed(() => ({
    transitionDuration: `${state.duration}ms`,
    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : '',
  }))

  return {
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    trackStyle,
  }
}
