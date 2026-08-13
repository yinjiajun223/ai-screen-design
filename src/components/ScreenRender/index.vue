<template>
  <div class="preview-container">
    <div class="canvas-root" :style="canvasStyle">
      <div class="canvas-node" v-for="(node, index) in nodes" :key="node.id" :style="getNodeStyle(node, index)">
        <component :is="getMaterialComponent(node.type)" :schema="node"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getMaterialComponent } from '@/materials/index'
import type { PageSchema } from '@/schema/page'

defineOptions({
  name: 'ScreenRender',
})

const props = defineProps<{ page: PageSchema }>()

const canvas = computed(() => props.page.canvas)
const nodes = computed(() => props.page.nodes)
const dataSources = computed(() => props.page.dataSources)

const scale = ref(1)
const left = ref(0)
const top = ref(0)

onMounted(() => {
  init()
  window.addEventListener('resize', init)

  onBeforeUnmount(() => window.removeEventListener('resize', init))
})

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
