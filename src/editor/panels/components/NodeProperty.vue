<template>
  <div class="node-property">
    <el-collapse v-model="activeCollapse">
      <el-collapse-item title="组件属性" name="1">
        <FormCreate :setters="setters" :formData="selectedNode" />
      </el-collapse-item>
      <el-collapse-item title="布局属性">
        <FormCreate :setters="layoutSetters" :formData="selectedNode" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { getMaterialSetters } from '@/materials'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import FormCreate from './FormCreate.vue'

defineOptions({
  name: 'NodeProperty',
})

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const setters = getMaterialSetters(selectedNode.value.type)
const activeCollapse = ref('1')

const layoutSetters = [
  { label: '宽度', key: 'layout.width', type: 'number', span: 12 },
  { label: '高度', key: 'layout.height', type: 'number', span: 12 },
  { label: 'X', key: 'layout.x', type: 'number' },
  { label: 'Y', key: 'layout.y', type: 'number' },
]
</script>

<style scoped lang="scss">
.node-property {
  padding: 12px;

  :deep(.el-collapse) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 0;
  }

  :deep(.el-collapse-item) {
    overflow: hidden;
    border: 1px solid var(--editor-border);
    border-radius: 8px;
    background: var(--editor-panel);
  }

  :deep(.el-collapse-item__header) {
    height: 44px;
    padding: 0 14px;
    border: 0;
    background: var(--editor-control);
    color: var(--editor-text);
    font-size: 14px;
    font-weight: 500;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &::before {
      width: 3px;
      height: 14px;
      margin-right: 10px;
      border-radius: 999px;
      background: var(--editor-border-hover);
      content: '';
      transition: background-color 0.2s ease;
    }

    &:hover {
      background: var(--editor-control-hover);
    }

    &.is-active {
      color: var(--editor-accent);
      background: color-mix(in srgb, var(--editor-accent) 8%, var(--editor-control));

      &::before {
        background: var(--editor-accent);
      }
    }
  }

  :deep(.el-collapse-item__arrow) {
    color: var(--editor-text-muted);
    font-size: 14px;
  }

  :deep(.el-collapse-item__wrap) {
    border: 0;
    background: var(--editor-panel);
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
    color: var(--editor-text-muted);
  }
}
</style>
