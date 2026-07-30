import type { MaterialSchema } from '@/materials/types'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const panelVisible = reactive({
    material: true, //
    layer: true,
    property: true,
  })

  const nodes = ref<MaterialSchema[]>([]) // 当前编辑器中组件列表
  const selectedNodeId = ref() // 当前选中节点id
  const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedNodeId.value)) // 当前选中节点
  const addNode = (node: MaterialSchema) => nodes.value.push(node)
  const selectNode = (id: string) => (selectedNodeId.value = id)
  const clearSelected = () => (selectedNodeId.value = null)

  return { panelVisible, nodes, selectedNodeId, selectedNode, addNode, selectNode, clearSelected }
})
