<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import Waterfall from './components/waterfall/index.vue'
import ScrollView from './components/scroll-view/indev.vue'
import { list2, sku as list } from './components/waterfall/mogu'

const data = ref<object[]>([])

setTimeout(() => {
  data.value = list2
}, 200)

let ss = ref(30)

const loadMore = () => {
  data.value = [...data.value, ...list]
}

const state = reactive({
  finished: false,
  loading: false,
})
const loadMore2 = () => {
  console.log('触发了pullup')
  state.loading = true
  setTimeout(() => {
    state.loading = false
  }, 2000)
  ss.value += 30

  if (ss.value > 250) {
    state.finished = true
  }
}

const refresh = () => {
  state.loading = true
  setTimeout(() => {
    state.loading = false
  }, 2000)
}
</script>

<template>
  <ScrollView
    ref="scroll"
    :request="state"
    @pull-up="loadMore2"
    @pull-down="refresh"
  >
    <template v-for="n in ss">
      <div class="li">{{ n }}</div>
    </template>

    <!-- <template #pullup="{ pullupClick }">
      <div @click="pullupClick">ddd</div>
    </template> -->
  </ScrollView>
  <!-- <Waterfall :data="data" @load-more="loadMore">
    <template v-slot:default="inner">
      <div>
        <div>
          <img v-imgFixed="inner.src" class="item" v-lazy="inner.src" alt="" />
        </div>

        <div class="title">{{ inner.title }}</div>
        <div>{{ inner.price }}</div>
      </div>
    </template>
  </Waterfall> -->
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

.li {
  padding: 10px 0;
  text-align: center;
  font-size: 32px;
  font-family: DINAlternate-Bold;
  background-color: #f0f0f0;
}
</style>
