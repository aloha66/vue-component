<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import Waterfall from './components/waterfall/index.vue'
import ScrollView from './components/scroll-view'
import { list2, sku as list } from './components/waterfall/mogu'

let ss = ref(30)

const state = reactive({
  finished: false,
  loading: false,
  list: [],
})

setTimeout(() => {
  state.list = list2
}, 200)

const pulldown = () => {
  state.loading = true
  setTimeout(() => {
    state.list = list2
    state.loading = false
  }, 2000)
}

const loadMoreByWatchfall = () => {
  state.loading = true
  setTimeout(() => {
    state.loading = false
    // @ts-ignore
    state.list = [...state.list, ...list]
  }, 2000)
}

// const loadMoreByScroll = () => {
//   console.log('触发了pullup')
//   state.loading = true
//   setTimeout(() => {
//     state.loading = false
//   }, 2000)
//   ss.value += 30

//   if (ss.value > 250) {
//     state.finished = true
//   }
// }

// const refresh = () => {
//   state.loading = true
//   setTimeout(() => {
//     ss.value = 30
//     state.loading = false
//   }, 2000)
// }
</script>

<template>
  <!-- <ScrollView
    ref="scroll"
    :request="state"
    @pull-up="loadMoreByScroll"
    @pull-down="refresh"
  >
    <template #loosing>
      <div style="color: skyblue">突突突</div>
    </template>
    <template v-for="n in ss">
      <div class="li">{{ n }}</div>
    </template>
  </ScrollView> -->
  <Waterfall
    :request="state"
    @pull-up="loadMoreByWatchfall"
    @pull-down="pulldown"
  >
    <template v-slot:default="inner">
      <div>
        <div>
          <img v-imgFixed="inner.src" class="item" v-lazy="inner.src" alt="" />
        </div>

        <div class="title">{{ inner.title }}</div>
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

.li {
  padding: 10px 0;
  text-align: center;
  font-size: 32px;
  font-family: DINAlternate-Bold;
  background-color: #f0f0f0;
}
</style>
