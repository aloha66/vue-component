import { computed, useSlots, reactive, watch, ref } from 'vue'
import { getScrollTop } from '../../utils'
import { useTouch } from '../../hooks'
import type { ScrollViewProps, PullDownStatus } from './type'

interface UseBounce extends ScrollViewProps {
  pullDownEmit: () => void
}

export const useBounce = (props: UseBounce) => {
  const isPulling = ref(false)
  const state = reactive({
    distance: 0,
    duration: 0,
    status: 'normal' as PullDownStatus,
  })
  const touch = useTouch()

  const isTouchable = () =>
    state.status !== 'loading' && state.status !== 'success' && props.bounce

  const pullDistance = 50 // 触发上下拉刷新的距离

  const ease = (distance: number) => {
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
      isPulling.value = true
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

  const onTouchEnd = () => {
    if (reachTop && touch.deltaY.value && isTouchable()) {
      state.duration = 300

      if (state.status === 'loosing') {
        setStatus(pullDistance, true) // 修改状态为loading
        props.pullDownEmit()
      } else {
        setStatus(0)
      }
    }
  }

  const showSuccessTip = () => {
    state.status = 'success'

    setTimeout(() => {
      setStatus(0)
      isPulling.value = false
    }, 300)
  }
  const loading = computed(() => props?.request?.loading)
  watch(loading, (val, old) => {
    state.duration = 300
    if (val) {
      setStatus(pullDistance, true)
    } else if (val === false && old === true) {
      showSuccessTip()
    } else {
      setStatus(0, false)
    }
  })

  const slots = useSlots()

  const pullDownText = computed(() => {
    const status = {
      success: '刷新成功',
      pulling: '下拉即可刷新',
      loosing: '释放即可刷新',
      loading: '加载中',
      normal: '',
    }

    return status[state.status]
  })

  const PullDownTextEle = () => {
    if (!isPulling.value) return
    if (slots[state.status]) {
      return slots[state.status]?.()
    }
    return pullDownText.value
  }

  const trackStyle = computed(() => {
    if (!isPulling.value) return
    return {
      transitionDuration: `${state.duration}ms`,
      transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : '',
    }
  })

  return {
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    trackStyle,
    PullDownTextEle,
  }
}
