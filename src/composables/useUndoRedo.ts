import { getValue, setValue } from '@/utils'
const undoStack = shallowReactive([])
const redoStack = shallowReactive([])

export const useUndoRedo = () => {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)
  const applyChange = (target, key, newValue) => {
    // 改变之前
    const oldValue = getValue(target, key)

    if (oldValue === newValue) return

    const record = {
      target,
      newValue,
      oldValue,
      key,
    }

    undoStack.push(record)

    setValue(target, key, newValue)

    redoStack.length = 0
  }

  const undo = () => {
    // 撤销是退回老值 => oldValue
    const record = undoStack.pop()
    if (!record) return

    const { target, key, oldValue } = record
    setValue(target, key, oldValue)
    // 放入重做的栈
    redoStack.push(record)
  }

  const redo = () => {
    // 重置是设置为新值 => newValue
    const record = redoStack.pop()
    if (!record) return

    const { target, key, newValue } = record
    setValue(target, key, newValue)
    // 放入撤销的栈
    undoStack.push(record)
  }

  return {
    undo,
    redo,
    applyChange,
    canUndo,
    canRedo,
  }
}
