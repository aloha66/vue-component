<script lang="ts" setup>
import { ref, onMounted, Ref } from 'vue'
import { useScroll, usePullUp } from '../../hooks'
import { useLayout, useBounce } from './hooks'
// import { throttle } from '../../utils'
// @ts-ignore
import throttle from 'lodash.throttle'

interface Props {
  scrollX?: boolean
  scrollY?: boolean
  loading: boolean
  finished: boolean
  target: any
}
const scrollRef = ref<HTMLDivElement>()

const props = withDefaults(defineProps<Props>(), {
  scrollY: true,
  threshold: 0,
  target: window,
})

const { pullupText } = useLayout(props)

useBounce(props.target)

const emit = defineEmits<{ (e: 'pull-up'): void }>()

// useScroll(e => {})

const handlePullupClick = () => {
  if (props.finished) return
  if (!props.loading) {
    emit('pull-up')
  }
}
usePullUp(
  throttle(() => {
    if (!props.loading && !props.finished) {
      emit('pull-up')
    }
  }, 50),
  props
)
</script>

<template>
  <div ref="scrollRef">
    <slot />

    <slot name="pullup" :pullupClick="handlePullupClick">
      <div @click="handlePullupClick" class="pullupText">
        {{ pullupText }}
      </div></slot
    >
  </div>
</template>

<style scoped>
.pullupText {
  text-align: center;
}
</style>
