<template>
  <div class="canvas-root">
    <div ref="stage" class="canvas-stage" @dragover.prevent @drop="onDrop" @mousedown.self="onClearSelected">
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
    <!-- Selecto mounted的时候  stageRef可能还没挂载 -->
    <Selecto
      v-if="stageRef"
      :container="stageRef"
      :drag-container="stageRef"
      :selectable-targets="['.canvas-node']"
      @select-end="onSelectEnd"
      :select-from-inside="false"
      toggle-continue-select="shift"
    ></Selecto>
    <Moveable
      ref="moveable"
      :target="selectedTarget"
      :resizable="true"
      :draggable="true"
      :origin="false"
      @drag="onDrag"
      @resize="onResize"
      @drag-group="onDragGroup"
      @resize-group="onResizeGroup"
    ></Moveable>
  </div>
</template>

<script lang="ts" setup>
import { createNode, getMaterialComponent } from '@/materials/index'
import Moveable, { type OnDrag, type OnDragGroup, type OnResize, type OnResizeGroup } from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasRoot',
})

const stageRef = useTemplateRef('stage')
const moveableRef = useTemplateRef('moveable')
const selectedTarget = shallowRef<HTMLElement>()
const editorStore = useEditorStore()
const { nodes } = storeToRefs(editorStore)
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

// 拿到当前选中节点的dom元素, 通过dom元素的data-node-id属性找到对应的node
const getNodeByTarget = (target: HTMLElement) => {
  const id = target.getAttribute('data-node-id')
  return editorStore.findNodeById(id)
}

const onDrag = (e: OnDrag) => {
  e.target.style.left = e.left + 'px'
  e.target.style.top = e.top + 'px'
  const node = getNodeByTarget(e.target as HTMLElement)
  node.layout.x = e.left
  node.layout.y = e.top
}

const onDragGroup = (e: OnDragGroup) => {
  e.events.forEach(onDrag)
}

const onResize = (e: OnResize) => {
  e.target.style.width = e.width + 'px'
  e.target.style.height = e.height + 'px'
  const node = getNodeByTarget(e.target as HTMLElement)
  node.layout.width = e.width
  node.layout.height = e.height
  onDrag(e.drag)
}

const onResizeGroup = (e: OnResizeGroup) => {
  e.events.forEach(onResize)
}

const onClearSelected = () => {
  editorStore.clearSelected()
  selectedTarget.value = null
}

const onSelectEnd = (e) => {
  selectedTarget.value = e.selected
  const ids = e.selected.map((el: HTMLElement) => el.getAttribute('data-node-id'))
  editorStore.selectedNodes(ids)
}
</script>

<style lang="scss" scoped>
.canvas-root {
  .canvas-stage {
    width: 900px;
    height: 600px;
    margin: 100px;
    background: var(--editor-control);
    position: relative;
    border: 1px solid var(--editor-border);
    box-shadow: 0 12px 32px rgb(0 0 0 / 28%);

    .canvas-node {
      position: absolute;
    }
  }
}
</style>
