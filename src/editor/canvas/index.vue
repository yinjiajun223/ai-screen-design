<template>
  <div class="canvas-root" ref="canvasRoot">
    <SketchRuler
      v-model:scale="scale"
      :palette="palette"
      :width="rectWidth"
      :height="rectHeight"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :thick="20"
      :lines="lines"
      @zoomchange="onZoomChange"
    >
      <div
        ref="stage"
        class="canvas-stage"
        :style="canvasStyle"
        @dragover.prevent
        @drop="onDrop"
        @mousedown.self="onClearSelected"
      >
        <el-dropdown v-for="(node, index) in nodes" :key="node.id" trigger="contextmenu" @command="onCommand">
          <div
            class="canvas-node"
            :style="getNodeStyle(node, index)"
            :data-node-id="node.id"
            :data-node-locked="node.locked"
            @mousedown="onSelect(node, $event)"
          >
            <component :is="getMaterialComponent(node.type)" :schema="node"></component>
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="copy">复制</el-dropdown-item>
              <el-dropdown-item command="remove">移除</el-dropdown-item>
              <el-dropdown-item command="moveTop">置顶</el-dropdown-item>
              <el-dropdown-item command="moveBottom">置底</el-dropdown-item>
              <el-dropdown-item command="toggleLock"> {{ node.locked ? '解锁' : '锁定' }} </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </SketchRuler>

    <!-- Selecto mounted的时候  stageRef可能还没挂载 -->
    <Selecto
      v-if="stageRef"
      class-name="canvas-selecto"
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
      :use-resize-observer="true"
      :origin="false"
      @drag="onDrag"
      @resize="onResize"
      @drag-group="onDragGroup"
      @resize-group="onResizeGroup"
      @drag-start="onStart"
      @drag-end="onEnd"
      @resize-start="onStart"
      @resize-end="onEnd"
      @drag-group-start="onStart"
      @drag-group-end="onEnd"
      @resize-group-start="onStart"
      @resize-group-end="onEnd"
    ></Moveable>
  </div>
</template>

<script lang="ts" setup>
import { createNode, getMaterialComponent } from '@/materials/index'
import Moveable from 'vue3-moveable'
import Selecto from 'vue3-selecto'
import SketchRuler from 'vue3-sketch-ruler'

import 'vue3-sketch-ruler/lib/style.css'
import { useCanvasRuler } from './composables/useCanvasRuler'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { useMoveable } from './composables/useMoveable'
import { useSelection } from './composables/useSelection'

defineOptions({
  name: 'CanvasRoot',
})

const editorStore = useEditorStore()
const { nodes } = storeToRefs(editorStore)
const canvasRootRef = useTemplateRef('canvasRoot')
const stageRef = useTemplateRef('stage')
const moveableRef = useTemplateRef('moveable')

// prettier-ignore
const { scale, rectWidth, rectHeight, canvasWidth, canvasHeight, canvasStyle, palette, lines, onZoomChange } = useCanvasRuler({ moveableRef, canvasRootRef })
const { onDrag, onDragGroup, onResize, onResizeGroup, onStart, onEnd } = useMoveable(moveableRef)
const { onSelect, onSelectEnd, onClearSelected, selectedTarget } = useSelection({ stageRef, moveableRef })

const onDrop = (e: DragEvent) => {
  const data = e.dataTransfer.getData('schema')
  const node = createNode(JSON.parse(data))

  node.layout.x = e.offsetX - node.layout.width / 2
  node.layout.y = e.offsetY - node.layout.height / 2

  editorStore.addNode(node)
  editorStore.selectNode(node.id)
}

/**
 * 移动: 改 css left top
 * 尺寸: 改 css width height
 */
const getNodeStyle = (node, index) => ({
  width: node.layout.width + 'px',
  height: node.layout.height + 'px',
  left: node.layout.x + 'px',
  top: node.layout.y + 'px',
  zIndex: index + 1,
})

const commandMap = {
  copy: () => editorStore.copyNode(editorStore.selectedNode),
  remove: () => editorStore.removeNode(editorStore.selectedNode),
  moveBottom: () => editorStore.moveTop(editorStore.selectedNode),
  moveTop: () => editorStore.moveBottom(editorStore.selectedNode),
  toggleLock: () => {
    editorStore.toggleLock(editorStore.selectedNode)
    selectedTarget.value = null
  },
}
const onCommand = (commad: string) => {
  commandMap[commad]?.()
}
</script>

<style lang="scss" scoped>
.canvas-root {
  :deep(.moveable-control-box) {
    --moveable-color: var(--editor-accent);
  }

  :deep(.canvas-selecto) {
    border-color: var(--editor-accent);
    background: color-mix(in srgb, var(--editor-accent) 16%, transparent);
  }

  .canvas-stage {
    // background: var(--editor-control);
    position: relative;
    border: 1px solid var(--editor-border);
    box-shadow: 0 12px 32px rgb(0 0 0 / 28%);

    .canvas-node {
      position: absolute;
    }
  }
}
</style>
