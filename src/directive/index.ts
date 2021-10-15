import type { DirectiveBinding } from 'vue'

type Rule = (s: string) => string[]

let width = 0

export const imgFixed = (rule: Rule) => {
  return {
    mounted(el: Element, binding: DirectiveBinding) {
      //   console.log('el', binding.value.match(/_([0-9x]*)\./)[1].split('x'))
      //   console.log(el)

      const [w, h] = rule(binding.value)
      if (!width) {
        width = el.parentElement!.offsetWidth
      }

      el.parentElement!.style.cssText = `height:${(+h * width) / +w}px`
      //   debugger
      //   console.log('w, h', w, h)
    },
  }
}
