<template>
  <ScreenRender :page="{ canvas, nodes, dataSources }" />
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import ScreenRender from '@/components/ScreenRender/index.vue'

defineOptions({
  name: 'ScreenPreview',
})

/**
 * 点击预览 从 store 中获取数据，传给 ScreenRender 组件进行渲染
 */
const editorStore = useEditorStore()
const { nodes, canvas, dataSources } = storeToRefs(editorStore)
</script>
