<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate, onUpdated } from 'vue'
import { imgs, price, title, sku } from './mogu'

// const heightList = [
//   677, 400, 737, 400, 667, 400, 500, 400, 750, 400, 500, 400, 833, 400, 500,
//   400, 667, 400, 580, 400, 500, 400, 538, 400, 750, 400, 499, 400,
// ]
// const widthList = [
//   500, 400, 500, 400, 500, 400, 500, 400, 500, 400, 500, 400, 500, 400, 500,
//   400, 500, 400, 500, 400, 500, 400, 500, 400, 500, 400, 500, 400,
// ]

const useRefEl = () => {
  let itemRefs: HTMLImageElement[] = []
  const setItemRef = el => {
    if (el) {
      itemRefs.push(el)
    }
  }
  onBeforeUpdate(() => {
    itemRefs = []
  })
  onUpdated(() => {
    console.log(itemRefs)
  })
  return [setItemRef, itemRefs] as const
}

const [setItemRef, itemRefs] = useRefEl()
const [setwrappers, wrappers] = useRefEl()

onMounted(() => {
  console.log(itemRefs, wrappers)

  Array.from(itemRefs).forEach(function (img, index) {
    // let src = img.getAttribute('url')
    let src = img.getAttribute('src')
    let image = new Image()
    image.src = src!
    let width = img.width

    image.onload = function () {
      let w = image.width
      let h = image.height
      let height = Math.round((h * width) / w)
      img.src = src!
      // 设置当前跨越几个网格(每个网格10px)
      //   img.style.gridRowEnd = `span ${~~(height / 10)}`
      wrappers[index].style.gridRowEnd = `span ${~~(height / 10)}`
    }
  })
})
</script>
<template>
  <div class="grid">
    <!-- <img
      :ref="setItemRef"
      class="item"
      :src="i"
      :key="i"
      v-for="i in imgs"
      :alt="i"
    /> -->

    <div v-for="(item, i) in sku" :ref="setwrappers">
      <img class="item" :src="item.src" alt="" :ref="setItemRef" />
      <div>{{ item.title }}</div>
      <div>{{ item.price }}</div>
    </div>
  </div>
</template>

<style>
p {
  margin: 0;
}
</style>

<style scoped>
.grid {
  display: grid;
  /* grid-template-columns: 1fr 1fr 1fr; */
  grid-template-columns: 290px 290px 290px;
  column-gap: 5px;
}

.item {
  width: 100%;
}
</style>
