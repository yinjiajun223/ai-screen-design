import { getValue, setValue } from '@/utils'

const MAX_HISTORY_LENGTH = 1000 // 撤销最大记录数
const undoStack = shallowReactive([])
const redoStack = shallowReactive([])

export const useUndoRedo = () => {
  const canUndo = computed(() => undoStack.length > 0)
  const canRedo = computed(() => redoStack.length > 0)
  let activeBatch = null

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

    if (activeBatch) {
      const _record = activeBatch.find((item) => item.target === target && item.key === key)
      // 如果已经存在相同的记录，则更新其 newValue，否则将新的记录添加到 activeBatch 中
      if (_record) {
        _record.newValue = newValue
      } else {
        // 第一次改,则记录
        activeBatch.push(record)
      }
    } else {
      pushRecoerd([record])
    }

    setValue(target, key, newValue)

    redoStack.length = 0
  }

  const undo = () => {
    // 撤销是退回老值 => oldValue
    const records = undoStack.pop()
    if (!records) return

    records.toReversed().forEach((record) => {
      const { target, key, oldValue } = record
      setValue(target, key, oldValue)
    })

    // 放入重做的栈
    redoStack.push(records)
  }

  const redo = () => {
    // 重置是设置为新值 => newValue
    const records = redoStack.pop()
    if (!records) return

    records.forEach((record) => {
      const { target, key, newValue } = record
      setValue(target, key, newValue)
    })

    // 放入撤销的栈
    pushRecoerd(records)
  }

  // 开始按批处理
  const startBatch = () => {
    activeBatch = []
  }

  // 提交这一批
  const commitBatch = () => {
    if (activeBatch.length) {
      pushRecoerd(activeBatch)
    }

    activeBatch = null
  }

  // 栈超过最大长度时，移除最早的记录
  const pushRecoerd = (record) => {
    undoStack.push(record)
    if (undoStack.length > MAX_HISTORY_LENGTH) {
      undoStack.shift()
    }
  }

  return {
    undo,
    redo,
    applyChange,
    canUndo,
    canRedo,
    startBatch,
    commitBatch,
  }
}
