import { useUndoRedo } from '@/composables/useUndoRedo'
import { useEditorStore } from '@/stores/editor'
import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'

export const useMoveable = (moveableRef) => {
  const editorStore = useEditorStore()
  const { applyChange, startBatch, commitBatch } = useUndoRedo()

  // 拿到当前选中节点的dom元素, 通过dom元素的data-node-id属性找到对应的node
  const getNodeByTarget = (target: HTMLElement) => {
    const id = target.getAttribute('data-node-id')
    return editorStore.findNodeById(id)
  }

  const onStart = () => startBatch()
  const onEnd = () => commitBatch()
  const onDrag = (e: OnDrag) => {
    e.target.style.left = e.left + 'px'
    e.target.style.top = e.top + 'px'
    const node = getNodeByTarget(e.target as HTMLElement)
    if (!node) return
    applyChange(node, 'layout', { ...node.layout, x: e.left, y: e.top })
  }

  const onDragGroup = (e: OnDragGroup) => {
    e.events.forEach(onDrag)
  }

  const onResize = (e: OnResize) => {
    e.target.style.width = e.width + 'px'
    e.target.style.height = e.height + 'px'
    const node = getNodeByTarget(e.target as HTMLElement)
    if (!node) return
    applyChange(node, 'layout', { ...node.layout, width: e.width, height: e.height })
    onDrag(e.drag)
  }

  const onResizeGroup = (e: OnResizeGroup) => {
    e.events.forEach(onResize)
  }

  // 当layout发生变化的时候 手动更新 moveable 的选框
  watch(
    () =>
      editorStore.nodes.map((node) => {
        return node.layout
      }),
    () => {
      // 手动更新的方法
      moveableRef.value?.updateRect(undefined, true)
    },
    {
      flush: 'post',
    },
  )

  return {
    onDrag,
    onDragGroup,
    onResize,
    onResizeGroup,
    onStart,
    onEnd,
  }
}
