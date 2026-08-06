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
    selectedNodeIds,
    (ids) => {
      selectedTarget.value = ids.map(
        (id) => stageRef.value.querySelector(`[data-node-id='${id}']:not([data-node-locked='true'])`) as HTMLElement,
      )
    },
    { deep: true, flush: 'post' },
  )

  return {
    onSelect,
    onSelectEnd,
    onClearSelected,
    selectedTarget,
  }
}
