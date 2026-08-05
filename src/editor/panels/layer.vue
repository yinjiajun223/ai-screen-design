<template>
  <div ref="layerPanel" class="layer-panel">
    <div
      v-for="node in nodes"
      :key="node.id"
      class="layer-item"
      @click="editorStore.selectNode(node.id)"
      :class="{ active: selectedNodeIds.includes(node.id) }"
    >
      <span>{{ node.name }} </span>
      <span><Icon icon="mdi:chart-bar" width="16" /></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { useDraggable } from 'vue-draggable-plus'

defineOptions({
  name: 'LayerPanel',
})

const editorStore = useEditorStore()
const { nodes, selectedNodeIds } = storeToRefs(editorStore)
const layerPanelRef = useTemplateRef<HTMLElement>('layerPanel')

// 字符串选择器只会查询组件根节点内部，无法匹配根节点自身，因此直接传入模板引用
useDraggable(layerPanelRef, nodes, { animation: 150, direction: 'horizontal' })
</script>

<style scoped lang="scss">
.layer-panel {
  display: flex;
  flex-direction: column-reverse;
  justify-content: start;
  gap: 6px;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;

  .layer-item {
    display: flex;
    flex: 0 0 32px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    color: var(--editor-text-muted);
    font-size: 12px;
    background: var(--editor-control);
    border: 1px solid var(--editor-border);
    border-radius: 6px;
    cursor: pointer;
    transition:
      color 150ms ease,
      background-color 150ms ease,
      border-color 150ms ease;

    &:hover {
      color: var(--editor-text);
      background: var(--editor-control-hover);
      border-color: var(--editor-border-hover);
    }

    &.active {
      color: var(--editor-text);
      background: var(--editor-accent);
    }
  }
}
</style>
