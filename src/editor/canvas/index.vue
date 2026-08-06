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
import SketchRuler, { type PaletteType } from 'vue3-sketch-ruler'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import { debounce } from '@/utils'

import 'vue3-sketch-ruler/lib/style.css'

defineOptions({
  name: 'CanvasRoot',
})

const rootStyle = getComputedStyle(document.documentElement)
const themeColor = (name: string) => rootStyle.getPropertyValue(name).trim()
const palette = {
  bgColor: themeColor('--editor-panel'),
  longfgColor: themeColor('--editor-border'),
  fontColor: themeColor('--editor-text-muted'),
  fontShadowColor: themeColor('--editor-accent'),
  shadowColor: themeColor('--editor-control-hover'),
  lineColor: themeColor('--editor-accent'),
  lineType: 'solid',
  lockLineColor: themeColor('--editor-border-hover'),
  borderColor: themeColor('--editor-border'),
  hoverBg: themeColor('--editor-control-hover'),
  hoverColor: themeColor('--editor-text'),
} satisfies PaletteType
const lines = ref({
  h: [],
  v: [],
})
const scale = ref(1)
const rectWidth = ref(1000)
const rectHeight = ref(800)
const canvasRootRef = useTemplateRef('canvasRoot')
const stageRef = useTemplateRef('stage')
const moveableRef = useTemplateRef('moveable')
const selectedTarget = shallowRef<HTMLElement[]>()
const editorStore = useEditorStore()
const { nodes, selectedNodeIds, canvas } = storeToRefs(editorStore)

const canvasWidth = toRef(canvas.value, 'width')
const canvasHeight = toRef(canvas.value, 'height')
const canvasStyle = computed(() => ({
  width: canvasWidth.value + 'px',
  height: canvasHeight.value + 'px',
  background: canvas.value.backgroundColor,
}))

const onRootResize = debounce((rect) => {
  rectWidth.value = rect.width
  rectHeight.value = rect.height
}, 300)

onMounted(() => {
  const { width, height } = canvasRootRef.value.getBoundingClientRect()
  rectWidth.value = width
  rectHeight.value = height

  // 监听dom尺寸变化
  const ob = new ResizeObserver((entries) => {
    const entrie = entries[0]
    const rect = entrie.contentRect
    onRootResize(rect)
  })

  ob.observe(canvasRootRef.value)

  // TIPS: 生命周期里是可以套生命周期的
  onUnmounted(() => {
    ob.disconnect()
  })
})

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

const onSelect = (node, e: MouseEvent) => {
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
}

const onSelectEnd = (e) => {
  const ids = e.selected.map((el: HTMLElement) => el.getAttribute('data-node-id'))
  editorStore.selectedNodes(ids)
}

const onZoomChange = () => {
  moveableRef.value.updateRect()
}

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

// 监听已选的id列表
watch(
  selectedNodeIds,
  (ids) => {
    selectedTarget.value = ids.map(
      (id) => stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`) as HTMLElement,
    )
  },
  { deep: true, flush: 'post' },
)
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
