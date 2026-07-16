<template>
  <div class="editor h-screen">
    <header class="editor-header h-56 border-b border-(--editor-border) flex items-center px-20">
      <ToolbarLeft class="w-300" />
      <div class="editor-title flex-1 text-center">AI Screen Design</div>
      <ToolbarRight class="w-300" />
    </header>
    <main class="h-[calc(100vh-56px)] flex">
      <!--  物料区 -->
      <Transition name="panel">
        <MaterialPanel
          v-show="panelVisible.material"
          class="editor-panel w-260 border-r border-(--editor-border)"
        />
      </Transition>
      <!--  图层   -->
      <Transition name="panel">
        <LayerPanel v-show="panelVisible.layer" class="editor-panel w-156 border-r border-(--editor-border)" />
      </Transition>
      <!--  画布   -->
      <div class="canvas flex-1">画布</div>
      <!--  属性   -->
      <Transition name="panel">
        <div v-show="panelVisible.property" class="editor-panel w-260 border-l border-(--editor-border)">属性</div>
      </Transition>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { ToolbarLeft, ToolbarRight, MaterialPanel } from './index'
import LayerPanel from './panel/layer.vue'

const { panelVisible } = storeToRefs(useEditorStore())

defineOptions({
  name: 'ScreenEditor',
})
</script>

<style lang="scss" scoped>
.editor {
  color: var(--editor-text);
  background: var(--editor-bg);
}

.editor-header {
  background: var(--editor-header);
}

.editor-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.editor-panel {
  flex-shrink: 0;
  color: var(--editor-text-muted);
  background: var(--editor-panel);
}

.panel-enter-active,
.panel-leave-active {
  overflow: hidden;
  white-space: nowrap;
  transition:
    width 180ms ease,
    padding 180ms ease,
    border-width 180ms ease,
    opacity 120ms ease;
}

.panel-enter-from,
.panel-leave-to {
  width: 0 !important;
  padding-right: 0;
  padding-left: 0;
  border-width: 0;
  opacity: 0;
}

.canvas {
  padding: 16px;
  color: var(--editor-text-muted);
  background: var(--editor-canvas);
}
</style>
