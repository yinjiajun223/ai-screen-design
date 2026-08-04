import type { MaterialSchema } from '@/materials/types'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true, //
    layer: true,
    property: true,
  })

  const nodes = ref<MaterialSchema[]>([]) // 当前编辑器中组件列表
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
