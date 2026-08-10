import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

export const useSelection = ({ stageRef, moveableRef }) => {
  const editorStore = useEditorStore()
  const { selectedNodeIds } = storeToRefs(editorStore)
  const selectedTarget = shallowRef<HTMLElement[]>()

  const onSelectEnd = (e) => {
    const ids = e.selected.map((el: HTMLElement) => el.getAttribute('data-node-id'))
    editorStore.selectedNodes(ids)
  }

  const onSelect = (node, e: MouseEvent) => {
    editorStore.selectNode(node.id)

    nextTick(() => {
      moveableRef.value.dragStart(e)
    })
  }

  const onClearSelected = () => {
    editorStore.clearSelected()
  }

  // 监听已选的id列表
  watch(
    () => [selectedNodeIds.value, editorStore.nodes] as const,
    ([ids]) => {
      const validIds = ids.filter((id) => editorStore.findNodeById(id))
      if (validIds.length !== ids.length) {
        editorStore.selectedNodes(validIds)
      }

      selectedTarget.value = validIds
        .map((id) => stageRef.value?.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`) as HTMLElement | null)
        .filter((target): target is HTMLElement => target !== null && target !== undefined)
    },
    { flush: 'post' },
  )

  return {
    onSelect,
    onSelectEnd,
    onClearSelected,
    selectedTarget,
  }
}
