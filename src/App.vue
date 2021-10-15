<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue'
import Waterfall from './components/waterfall/index.vue'
import { list2, sku as list } from './components/waterfall/mogu'

const data = ref<object[]>([])

setTimeout(() => {
  data.value = list2
}, 200)

const loadMore = () => {
  data.value = [...data.value, ...list]
}
</script>

<template>
  <Waterfall :data="data" @load-more="loadMore">
    <template v-slot:default="inner">
      <div>
        <div>
          <img v-imgFixed="inner.src" class="item" v-lazy="inner.src" alt="" />
        </div>

        <div class="title">{{ inner.title }}</div>
        <!-- <div class="title">安娜款 经典百搭不挑人王炸风衣外套S18-7</div> -->
        <div>{{ inner.price }}</div>
      </div>
    </template>
  </Waterfall>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

body,
div {
  box-sizing: border-box;
}

.item {
  width: 100%;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
</style>
