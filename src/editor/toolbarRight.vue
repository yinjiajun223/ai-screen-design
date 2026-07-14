<template>
  <div class="toolbar-right flex justify-end gap-20">
    <button v-for="item in toolbarItems" :key="item.icon" :title="item.title" type="button" @click="item.onClick">
      <Icon :icon="item.icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { ElMessage } from 'element-plus'

const toolbarItems = [
  { title: '预览', icon: 'mage:preview', onClick: () => ElMessage.info('预览功能待实现') },
  { title: '查看 JSON', icon: 'si:json-duotone', onClick: () => ElMessage.info('JSON 功能待实现') },
  { title: '发布', icon: 'entypo:publish', onClick: () => ElMessage.info('发布功能待实现') },
  { title: '导入', icon: 'mdi:import', onClick: () => ElMessage.info('导入功能待实现') },
  { title: '导出', icon: 'mdi:export', onClick: () => ElMessage.info('导出功能待实现') },
]

defineOptions({
  name: 'ToolbarRight',
})
</script>

<style lang="scss" scoped>
.toolbar-right > button {
  display: grid;
  place-items: center;
  padding: 4px;
  color: var(--editor-text-muted);
  line-height: 1;
  background: var(--editor-control);
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  cursor: pointer;
  transition: 150ms ease;

  > svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: var(--editor-text);
    background: var(--editor-control-hover);
    border-color: var(--editor-border-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--editor-accent);
    outline-offset: 2px;
  }
}
</style>
