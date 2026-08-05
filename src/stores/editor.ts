import type { MaterialSchema } from '@/schema/materials'
import type { PageSchema } from '@/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true, //
    layer: true,
    property: true,
  })

  const page = ref<PageSchema>({
    canvas: {
      width: 1920,
      height: 1080,
      backgroundColor: 'var(--editor-control)',
    },
    nodes: [],
  })

  const canvas = toRef(page.value, 'canvas') // 当前画布数据
  const nodes = toRef(page.value, 'nodes') // 当前画布节点数据
  const selectedNodeId = computed(() => (selectedNodeIds.value.length === 1 ? selectedNode.value[0].id : null)) // 当前选中节点id
  const selectedNodeIds = ref([]) // 当前选中节点ids
  const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedNodeId.value)) // 当前选中节点
  const addNode = (node: MaterialSchema) => nodes.value.push(node)
  const selectNode = (id: string) => (selectedNodeIds.value = [id])
  const selectedNodes = (ids: string[]) => (selectedNodeIds.value = ids)
  const findNodeById = (id: string) => nodes.value.find((node) => node.id === id)
  const clearSelected = () => (selectedNodeIds.value = [])

  return {
    panelVisible,
    nodes,
    canvas,
    selectedNodeId,
    findNodeById,
    selectedNodeIds,
    selectedNodes,
    selectedNode,
    addNode,
    selectNode,
    clearSelected,
  }
})
