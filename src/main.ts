import { createApp } from 'vue'
import App from './App.vue'
import { Lazyload } from '@vant/lazyload'
import { imgFixed } from './directive'

createApp(App)
  .use(Lazyload, {
    filter: {
      webp(listener, options) {
        //   if (!options.supportWebp) return
        //   const isCDN = /qiniudn.com/
        //   if (isCDN.test(listener.src)) {
        //       listener.src += '?imageView2/2/format/webp'
        //   }
      },
    },
  })
  .directive(
    'imgFixed',
    imgFixed(e => e.match(/_([0-9x]*)\./)![1].split('x'))
  )
  //   .directive('imgFixed', {
  //     // When the bound element is mounted into the DOM...
  //     mounted(el) {
  //       console.log('el', el)
  //     },
  //   })
  .mount('#app')
