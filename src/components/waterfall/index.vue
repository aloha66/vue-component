<script setup lang="ts">
/**
 * 在可视化回调中，对比每列内容高度，在高度最少的列插入数据
 */

import {
  ref,
  onMounted,
  onBeforeUpdate,
  watch,
  computed,
  watchEffect,
  nextTick,
} from 'vue'
import { useRefEl } from '../../hooks'
import useLayout from './hooks/useLayout'
import ScrollView, { ScrollViewProps } from '../scroll-view'
// import type { Props } from './types'

export interface WaterfallProps extends ScrollViewProps {
  gap?: number
  width?: number
  colCount?: number
  // https://github.com/vuejs/vue-next/issues/4294 vue的类型bug
  request: any // 为了触发watcheffect  目前不显式表示无法挂载对应的字段做响应
}

const props = withDefaults(defineProps<WaterfallProps>(), {
  gap: 5,
  // width: 290,
  colCount: 3,
})

const { styles, colCount } = useLayout(props)
const [elList, setElList] = useRefEl()

const getMinhIndex = (): Promise<number> => {
  return new Promise(resolve => {
    nextTick(() => {
      const heightArr = elList.value.map(item => item.offsetHeight)
      const min = Math.min(...heightArr)
      resolve(heightArr.indexOf(min))
    })
  })
}

const list = ref<object[]>([])
type ListItem = {}[]

const renderIndex = ref(0)
watch(renderIndex, val => {
  requestAnimationFrame(renderWaterFall)
})

// watch(
//   list,
//   val => {
//     console.log('list', list.value)
//   },
//   { deep: true }
// )

const renderWaterFall = async () => {
  const col = colCount.value
  const minIndex = await getMinhIndex()
  const dataSource = props.request!.list

  if (minIndex === -1) {
    for (let n = 0; n < col; n++) {
      list.value[n] = [dataSource[n]]
    }
    renderIndex.value = col
  } else {
    const data = dataSource[renderIndex.value]
    list.value[minIndex].push(data)

    if (renderIndex.value < dataSource.length - 1) {
      renderIndex.value++
    }
  }
}

watchEffect(() => {
  const len = props.request?.list.length
  if (!len) return // 还没渲染

  renderWaterFall()
})

const emits = defineEmits<{
  (e: 'pull-up'): void
  (e: 'pull-down'): void
}>()

const pullDown = () => {
  emits('pull-down')
}

const pullUp = () => {
  emits('pull-up')
}
</script>

<template>
  <ScrollView :request="props.request" @pull-up="pullUp" @pull-down="pullDown">
    <div class="flex">
      <div class="column" v-for="(outer, i) in list" :key="i">
        <div class="test" :ref="setElList">
          <div class="column-item" v-for="(inner, k) in outer" :key="k">
            <slot v-bind="inner"></slot>
          </div>
        </div>
      </div>
      <template slot="merge-col">
        <!-- 合并内容...     -->
      </template>
      <!-- <button style="position: fixed; bottom: 0" @click="loadMore">
      加载更多
    </button> -->
    </div>
  </ScrollView>
</template>
<style scoped>
.flex {
  display: flex;
  overflow: hidden;
}
.column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.column-item {
  padding: v-bind('styles.gap');
  width: v-bind('styles.width');
}

@media screen and (max-width: 700px) {
  .flex {
    padding: 12px v-bind('styles.gap');
  }
}
</style>
