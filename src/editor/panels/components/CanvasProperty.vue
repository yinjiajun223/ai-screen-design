<template>
  <div>
    <el-form class="p-20" size="small" label-width="60px">
      <el-form-item label="宽度">
        <el-input-number v-model="canvas.width"></el-input-number>
      </el-form-item>
      <el-form-item label="高度">
        <el-input-number v-model="canvas.height"></el-input-number>
      </el-form-item>
      <el-form-item label="背景色">
        <el-color-picker v-model="backgroundColor"></el-color-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'CanvasProperty',
})

const editorStore = useEditorStore()
const { canvas } = storeToRefs(editorStore)
const defaultBackgroundColor = 'var(--editor-control)'

// Element Plus 只能解析实际色值，画布数据仍保留 CSS 变量作为默认颜色
const backgroundColor = computed<string | null>({
  get: () => {
    if (canvas.value.backgroundColor !== defaultBackgroundColor) {
      return canvas.value.backgroundColor
    }

    return getComputedStyle(document.documentElement).getPropertyValue('--editor-control').trim()
  },
  set: (value) => {
    canvas.value.backgroundColor = value || defaultBackgroundColor
  },
})
</script>
