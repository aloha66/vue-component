<script setup lang="ts">
import { ref, onMounted, onBeforeUpdate, onUpdated, computed } from 'vue'
// import type { Props } from './types'
import { imgs, price, title, sku } from './mogu'

function getCols() {
  // n * width + (n - 1) * gap <= bodyWidth - margin * 2
  return ~~((document.body.offsetWidth - 32 + gap) / (width + gap))
}

const data = computed(() => {})
</script>
<template>
  <div class="flex">
    <div v-for="(item, i) in sku">
      <img class="item" :src="item.src" alt="" />
      <div>{{ item.title }}</div>
      <div>{{ item.price }}</div>
    </div>
  </div>
</template>
<style>
.flex {
  display: flex;
}
</style>
