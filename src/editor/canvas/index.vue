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
    </SketchRuler>

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
import SketchRuler, { type PaletteType } from 'vue3-sketch-ruler'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import 'vue3-sketch-ruler/lib/style.css'
import { debounce } from '@/utils'

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
const selectedTarget = shallowRef<HTMLElement>()
const editorStore = useEditorStore()
const { nodes } = storeToRefs(editorStore)
const vm = getCurrentInstance()

const canvasWidth = ref(1920)
const canvasHeight = ref(1080)
const canvasStyle = computed(() => ({
  width: canvasWidth.value + 'px',
  height: canvasHeight.value + 'px',
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

const onZoomChange = () => {
  moveableRef.value.updateRect()
}
</script>

<style lang="scss" scoped>
.canvas-root {
  .canvas-stage {
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
