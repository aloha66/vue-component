import { isWindow } from '../utils'
import { useEventListener } from './index'

type scrollCB = ({
  scrollTop,
  scrollLeft,
}: {
  scrollTop: number
  scrollLeft: number
}) => void

interface Options {
  target?: Window | Element
  scrollX?: boolean
  scrollY?: boolean
  threshold?: number
}

export const useScroll = (cb: scrollCB, options?: Options) => {
  const { target = window } = options ?? {}
  const onScroll = (e: Event) => {
    if (isWindow(target)) {
      cb({
        scrollTop: document.documentElement.scrollTop,
        scrollLeft: document.documentElement.scrollLeft,
      })
    } else {
      cb({
        scrollTop: target.scrollTop,
        scrollLeft: target.scrollLeft,
      })
    }
  }
  useEventListener('scroll', onScroll, { target })
}

export const usePullUp = (cb: any, options?: Options) => {
  const { target = window, scrollX, threshold = 300 } = options ?? {}
  useScroll(({ scrollTop, scrollLeft }) => {
    if (scrollX) {
      const clientWidth = isWindow(target)
        ? document.documentElement.clientWidth
        : target.clientWidth
      const scrollWidth = isWindow(target)
        ? document.documentElement.scrollWidth
        : target.scrollWidth

      if (scrollWidth - scrollLeft - threshold <= clientWidth) {
        cb()
      }
    } else {
      const clientHeight = isWindow(target)
        ? document.documentElement.clientHeight
        : target.clientHeight
      const scrollHeight = isWindow(target)
        ? document.documentElement.scrollHeight
        : target.scrollHeight

      if (scrollHeight - scrollTop - threshold <= clientHeight) {
        cb()
      }
    }
  }, options)
}
