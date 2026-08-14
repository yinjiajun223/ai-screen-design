<template>
  <div class="preview-container">
    <div class="canvas-root" :style="canvasStyle">
      <div class="canvas-node" v-for="(node, index) in nodes" :key="node.id" :style="getNodeStyle(node, index)">
        <component :ref="node.id" :is="getMaterialComponent(node.type)" v-on="createEvents(node)" :schema="node"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getMaterialComponent } from '@/materials/index'
import { createRuntimeContext } from '@/runtime/context'
import { runSandBox } from '@/runtime/sandbox'
import type { MaterialSchema } from '@/schema/materials'
import type { PageSchema } from '@/schema/page'

defineOptions({
  name: 'ScreenRender',
})

const props = defineProps<{ page: PageSchema }>()
const runtimePage = ref(props.page)
const context = createRuntimeContext(runtimePage)
const canvas = computed(() => runtimePage.value.canvas)
const nodes = computed(() => runtimePage.value.nodes)
const dataSources = computed(() => runtimePage.value.dataSources)

const scale = ref(1)
const left = ref(0)
const top = ref(0)
const vm = getCurrentInstance()

onMounted(() => {
  registerNodeInstance()
  init()
  window.addEventListener('resize', init)

  onBeforeUnmount(() => window.removeEventListener('resize', init))
})

const registerNodeInstance = () => {
  // vm 实例中的 refs 是一个对象，里面的每个属性都是一个数组，数组中存放着对应的组件实例
  const refs = {}
  for (const key in vm.refs) {
    refs[key] = vm.refs[key][0]
  }
  context.registerNodeInstance(refs)
}

const init = () => {
  // 等比缩放
  const y = window.innerHeight / canvas.value.height
  const x = window.innerWidth / canvas.value.width

  // 谁小用谁
  scale.value = Math.min(x, y)

  // 居中
  left.value = (window.innerWidth - canvas.value.width * scale.value) / 2
  top.value = (window.innerHeight - canvas.value.height * scale.value) / 2
}

const canvasStyle = computed(() => {
  return {
    width: canvas.value.width + 'px',
    height: canvas.value.height + 'px',
    background: canvas.value.backgroundColor,
    transform: `translate(${left.value}px, ${top.value}px) scale(${scale.value})`,
    transformOrigin: 'left top',
  }
})

const getNodeStyle = (node, index) => ({
  width: node.layout.width + 'px',
  height: node.layout.height + 'px',
  left: node.layout.x + 'px',
  top: node.layout.y + 'px',
  zIndex: index + 1,
})

/**
 * 根据节点的事件配置，创建对应的事件监听器
 * @param node 节点配置
 * @returns 事件监听器对象
 */
const createEvents = (node: MaterialSchema) => {
  const listeners = {}
  const events = node.events || []

  events.forEach((event) => {
    if (event.handler) {
      // 第二次渲染时，直接使用之前创建的事件处理函数，避免重复创建
      listeners[event.type] = event.handler
      return
    }
    event.handler = listeners[event.type] = (payload?: any) => {
      // 走沙箱环境 避免污染全局作用域
      runSandBox(event.code, { $context: context, $node: node, $payload: payload })
      // const fn = new Function('$context', '$node', '$payload', event.code)
      // fn(context, node, payload) // 执行函数体，确保函数体中的代码可以访问到当前作用域的变量
    }
  })

  return listeners
}

provide('dataSources', dataSources)
</script>

<style lang="scss" scoped>
.preview-container {
  width: 100vw;
  height: 100vh;

  .canvas-root {
    position: relative;
    .canvas-node {
      position: absolute;
    }
  }
}
</style>
