import { computed, useSlots, reactive } from 'vue'
import { getScrollTop } from '../../utils'
import { useTouch } from '../../hooks'

interface Props {
  scrollX?: boolean
  scrollY?: boolean
  loading: boolean
  finished: boolean
}

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

export const useBounce = (el: Window) => {
  const state = reactive({
    distance: 0,
    duration: 0,
  })
  const touch = useTouch()
  let reachTop: boolean
  const checkPosition = (event: TouchEvent) => {
    reachTop = getScrollTop(el) === 0

    if (reachTop) {
      state.duration = 0
      touch.start(event)
    }
  }
  const onTouchStart = (event: TouchEvent) => {
    checkPosition(event)
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!reachTop) {
      checkPosition(event)
    }

    const { deltaY } = touch
    touch.start(event)
  }
}
