<script setup lang="ts">
import Editor from './editor/index.vue'

/**
 * 撤销 重做 策略模式
 * 1.备忘录模式: 存快照,深拷贝 --> 缺点：比较浪费空间
 * 2.命令模式:  保存修改的基础信息 -> { target: App.vue, line:15, newValue:1,oldValue:null } --> 优点：节省空间
 */

// 命令模式简单实现
// const count = ref(0)
// const undoStack = []
// const redoStack = []

// const onClick = () => {
//   const oldValue = count.value
//   const newValue = oldValue + 1
//   undoStack.push({ oldValue, newValue, target: count, key: 'value' })
//   count.value = newValue
//   redoStack.length = 0 // 正常点击 清空重做栈
// }

// const undo = () => {
//   const record = undoStack.pop()
//   if (record) {
//     const { oldValue, target, key } = record
//     target[key] = oldValue
//     redoStack.push(record)
//   }
// }

// const redo = () => {
//   const record = redoStack.pop()
//   if (record) {
//     const { newValue, target, key } = record
//     target[key] = newValue
//     undoStack.push(record)
//   }
// }
</script>

<template>
  <Editor />
  <!-- <h1>{{ count }}</h1>
  <el-button @click="onClick">count++</el-button>
  <el-button @click="undo">撤销</el-button>
  <el-button @click="redo">重做</el-button> -->
</template>

<style scoped lang="scss"></style>
