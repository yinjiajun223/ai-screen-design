import { useUndoRedo } from '@/composables/useUndoRedo'
import type { MaterialSchema } from '@/schema/materials'
import type { PageSchema } from '@/schema/page'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const { applyChange } = useUndoRedo()
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
  const selectedNodeIds = ref<string[]>([]) // 当前选中节点ids
  const selectedNodeId = computed(() => (selectedNodeIds.value.length === 1 ? selectedNodeIds.value[0] : null)) // 当前选中节点id
  const selectedNode = computed(() => nodes.value.find((node) => node.id === selectedNodeId.value)) // 当前选中节点
  const addNode = (node: MaterialSchema) => setNodes([...nodes.value, node]) // 记录节点添加操作
  const selectNode = (id: string) => (selectedNodeIds.value = [id])
  const selectedNodes = (ids: string[]) => (selectedNodeIds.value = ids)
  const findNodeById = (id: string) => nodes.value.find((node) => node.id === id)
  const clearSelected = () => (selectedNodeIds.value = [])
  const setNodes = (newNodes: MaterialSchema[]) => applyChange(nodes, 'value', newNodes) // 记录节点批量更新操作

  /**
   * 右键菜单针对节点的处理
   * copyNode: 复制节点
   * removeNode: 删除节点
   * moveTop: 节点置顶
   * moveBottom: 节点置底
   * toggleLock: 锁定/解锁节点
   */
  const copyNode = (node: MaterialSchema) => {
    const newNode = JSON.parse(JSON.stringify(node))
    newNode.id = crypto.randomUUID()
    newNode.layout.x += 20
    newNode.layout.y += 20
    addNode(newNode)
    selectNode(newNode.id)
  }

  const removeNode = (node: MaterialSchema) => {
    setNodes(nodes.value.filter((n) => n.id !== node.id))

    selectedNodeIds.value = selectedNodeIds.value.filter((id) => id !== node.id)
  }

  const moveTop = (node: MaterialSchema) => {
    const index = nodes.value.findIndex((i) => i.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([node, ...splicedNodes])
  }

  const moveBottom = (node: MaterialSchema) => {
    const index = nodes.value.findIndex((i) => i.id === node.id)
    const splicedNodes = nodes.value.toSpliced(index, 1)
    setNodes([...splicedNodes, node])
  }

  const toggleLock = (node: MaterialSchema) => {
    node.locked = !node.locked
    applyChange(nodes, 'locked', !node.locked)
  }

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
    copyNode,
    removeNode,
    moveTop,
    moveBottom,
    toggleLock,
  }
})
