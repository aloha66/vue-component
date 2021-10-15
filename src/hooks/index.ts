import { ref, onBeforeUpdate, onUpdated, onUnmounted, Ref } from 'vue'

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
