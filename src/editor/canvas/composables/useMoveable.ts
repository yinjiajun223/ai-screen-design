import { useEditorStore } from '@/stores/editor'
import type { OnDrag, OnDragGroup, OnResize, OnResizeGroup } from 'vue3-moveable'

export const useMoveable = () => {
  const editorStore = useEditorStore()

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

  return {
    onDrag,
    onDragGroup,
    onResize,
    onResizeGroup,
  }
}
