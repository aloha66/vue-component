import { computed } from 'vue'
import { isMobile } from '../../../utils'

interface Props {
  gap: number
  width?: number
  colCount?: number
  data: object[]
}

function useLayout(props: Props) {
  const width = computed(() => {
    return props.width ? props.width : document.body.clientWidth / 2
  })

  const colCount = computed(() => {
    if (props.colCount) return props.colCount
    if (isMobile.value) return 2

    // n * width + (n - 1) * gap <= bodyWidth - margin * 2
    return ~~(
      (document.body.offsetWidth - 32 + props.gap) /
      (width.value + props.gap)
    )
  })

  const styles = computed(() => {
    return {
      gap: props.gap + 'px',
      width: isMobile.value ? 'unset' : width.value + 'px',
      // width: width.value + 'px',
    }
  })

  return {
    styles,
    colCount,
  }
}

export default useLayout
