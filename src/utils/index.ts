import { unref } from 'vue'
import { useMediaQuery } from '../hooks'
import type { MaybeRef } from './types'

export const inBrowser = typeof window !== 'undefined'

export function isWindow(val: unknown): val is Window {
  return val === window
}

export const isMobile = useMediaQuery('(max-width: 700px)')

export type ScrollElement = Element | Window

export const getScrollEleWidthAndHeight = (target: ScrollElement) => {
  const clientWidth = isWindow(target)
    ? document.documentElement.clientWidth
    : target.clientWidth
  const scrollWidth = isWindow(target)
    ? document.documentElement.scrollWidth
    : target.scrollWidth

  const clientHeight = isWindow(target)
    ? document.documentElement.clientHeight
    : target.clientHeight
  const scrollHeight = isWindow(target)
    ? document.documentElement.scrollHeight
    : target.scrollHeight

  return {
    clientWidth,
    scrollWidth,
    clientHeight,
    scrollHeight,
  }
}

export function getScrollTop(el: ScrollElement) {
  const top = 'scrolltop' in el ? el.scrolltop : el.pageYOffset
  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0)
}

export function isReachBottom(el: ScrollElement) {
  const top = 'scrolltop' in el ? el.scrolltop : el.pageYOffset
  const { scrollHeight, clientHeight } = getScrollEleWidthAndHeight(el)
  // iOS scroll bounce cause minus scrollTop
  return scrollHeight - top === clientHeight
}

export function throttle(invoke: Function, ms: MaybeRef<number>) {
  let lastExec = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  console.log('invoke', invoke)

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = undefined
    }
  }

  const duration = unref(ms)
  const elapsed = Date.now() - lastExec

  clear()

  if (duration < 0) {
    lastExec = Date.now()
    return invoke
  }

  if (elapsed > duration) {
    lastExec = Date.now()
    return invoke
  }
}
