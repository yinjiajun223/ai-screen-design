<template>
  <div class="canvas-root">
    <div class="canvas-stage" @dragover.prevent @drop="onDrop" @mousedown.self="onClearSelected">
      <div
        class="canvas-node"
        v-for="node in nodes"
        :key="node.id"
        :style="getNodeStyle(node)"
        :data-node-id="node.id"
        @mousedown="onSelect(node, $event)"
      >
        <component :is="getMaterialComponent(node.type)" :schema="node"></component>
      </div>
    </div>
    <Moveable
      ref="moveable"
      :target="selectedTarget"
      :resizable="true"
      :draggable="true"
      :origin="false"
      @drag="onDrag"
      @resize="onResize"
    ></Moveable>
  </div>
</template>

<script lang="ts" setup>
import { createNode, getMaterialComponent } from '@/materials/index'
import Moveable, { type OnDrag, type OnResize } from 'vue3-moveable'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasRoot',
})

const moveableRef = useTemplateRef('moveable')
const selectedTarget = shallowRef<HTMLElement>()
const editorStore = useEditorStore()
const { nodes, selectedNode } = storeToRefs(editorStore)
const vm = getCurrentInstance()

const onDrop = (e: DragEvent) => {
  const data = e.dataTransfer.getData('schema')
  const node = createNode(JSON.parse(data))

  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  editorStore.addNode(node)
  editorStore.selectNode(node.id)
  // 这个时候node还没虚渲染出来 node.id拿不到
  nextTick(() => {
    selectedTarget.value = vm.proxy.$el.querySelector(`[data-node-id='${node.id}']`)
  })
}

/**
 * 移动: 改 css left top
 * 尺寸: 改 css width height
 */
const getNodeStyle = (node) => ({
  width: node.layout.width + 'px',
  height: node.layout.height + 'px',
  left: node.layout.x + 'px',
  top: node.layout.y + 'px',
})

const onSelect = (node, e: MouseEvent) => {
  selectedTarget.value = e.currentTarget as HTMLElement
  editorStore.selectNode(node.id)

  nextTick(() => {
    moveableRef.value.dragStart(e)
  })
}

const onDrag = (e: OnDrag) => {
  selectedTarget.value.style.left = e.left + 'px'
  selectedTarget.value.style.top = e.top + 'px'
  selectedNode.value.layout.x = e.left
  selectedNode.value.layout.y = e.top
}

const onResize = (e: OnResize) => {
  selectedTarget.value.style.width = e.width + 'px'
  selectedTarget.value.style.height = e.height + 'px'
  selectedNode.value.layout.width = e.width
  selectedNode.value.layout.height = e.height
  onDrag(e.drag)
}

const onClearSelected = () => {
  editorStore.clearSelected()
  selectedTarget.value = null
}
</script>

<style lang="scss" scoped>
.canvas-root {
  .canvas-stage {
    width: 900px;
    height: 600px;
    background: var(--editor-control);
    margin: 100px;
    position: relative;
    border: 1px solid var(--editor-border);
    box-shadow: 0 12px 32px rgb(0 0 0 / 28%);

    .canvas-node {
      position: absolute;
    }
  }
}
</style>
