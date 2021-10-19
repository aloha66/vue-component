import {
  ref,
  onBeforeUpdate,
  unref,
  onMounted,
  onUnmounted,
  isRef,
  watch,
  Ref,
} from 'vue'
import { inBrowser } from '../utils'

export * from './useScroll'
export * from './useTouch'

type TargetRef = EventTarget | Ref<EventTarget | undefined>

export function useMediaQuery(query: string) {
  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  if ('addEventListener' in mediaQuery)
    mediaQuery.addEventListener('change', handler)
  else mediaQuery.addListener(handler)

  onUnmounted(() => {
    if ('removeEventListener' in mediaQuery)
      mediaQuery.removeEventListener('change', handler)
    else mediaQuery.removeListener(handler)
  })

  return matches
}

export const useRefEl = () => {
  const refList = ref<any[]>([])
  const setRefList = (el: any) => el && refList.value.push(el)

  // make sure to reset the refs before each update
  onBeforeUpdate(() => {
    refList.value = []
  })

  return [refList, setRefList] as const
}

export type UseEventListenerOptions = {
  target?: TargetRef
  capture?: boolean
  passive?: boolean
}

export function useEventListener(
  type: string,
  listener: EventListener,
  options: UseEventListenerOptions = {}
) {
  if (!inBrowser) {
    return
  }
  const { target = window, passive = false, capture = false } = options

  let attached: boolean

  const add = (target?: TargetRef) => {
    const element = unref(target)

    if (element && !attached) {
      element.addEventListener(type, listener, { capture, passive })
      attached = true
    }
  }

  const remove = (target?: TargetRef) => {
    const element = unref(target)
    if (element && attached) {
      element.removeEventListener(type, listener, capture)
      attached = false
    }
  }

  onUnmounted(() => remove(target))
  onMounted(() => add(target))

  if (isRef(target)) {
    watch(target, (val, old) => {
      remove(old)
      add(val)
    })
  }
}
