<template>
  <div class="toolbar-left flex gap-20">
    <button
      v-for="item in toolbarItems"
      :key="item.icon"
      :class="{ active: item.panel && panelVisible[item.panel] }"
      :title="item.title"
      :disabled="item.disabled?.value"
      type="button"
      @click="item.onClick"
    >
      <Icon :icon="item.icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useUndoRedo } from '@/composables/useUndoRedo'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

const editorStore = useEditorStore()
const { panelVisible } = storeToRefs(editorStore)
const { undo, redo, canUndo, canRedo } = useUndoRedo()

type PanelName = keyof typeof panelVisible.value

interface ToolbarItem {
  title: string
  icon: string
  panel?: PanelName
  disabled?: ComputedRef<boolean>
  onClick: () => void
}

const toolbarItems: ToolbarItem[] = [
  {
    title: '物料面板',
    icon: 'fluent:box-20-regular',
    panel: 'material',
    onClick: () => togglePanel('material'),
  },
  {
    title: '属性面板',
    icon: 'fluent:settings-20-regular',
    panel: 'property',
    onClick: () => togglePanel('property'),
  },
  {
    title: '图层面板',
    icon: 'fluent:layer-20-regular',
    panel: 'layer',
    onClick: () => togglePanel('layer'),
  },
  {
    title: '撤销',
    icon: 'fluent:arrow-undo-20-regular',
    disabled: computed(() => !canUndo.value),
    onClick: () => undo(),
  },
  {
    title: '重做',
    icon: 'fluent:arrow-redo-20-regular',
    disabled: computed(() => !canRedo.value),
    onClick: () => redo(),
  },
]

function togglePanel(panel: PanelName) {
  panelVisible.value[panel] = !panelVisible.value[panel]
}

defineOptions({
  name: 'ToolbarLeft',
})
</script>

<style lang="scss" scoped>
.toolbar-left > button {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  padding: 0;
  color: var(--editor-text-muted);
  line-height: 1;
  background: var(--editor-control);
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  cursor: pointer;
  transition: 150ms ease;

  > svg {
    width: 18px;
    height: 18px;
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

  &.active {
    color: var(--editor-accent);
    background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-control));
    border-color: var(--editor-border-hover);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
