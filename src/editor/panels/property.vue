<template>
  <div>
    <NodeProperty v-if="selectedNode"></NodeProperty>
    <CanvasProperty v-else></CanvasProperty>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import CanvasProperty from './components/CanvasProperty.vue'
import { storeToRefs } from 'pinia'
import NodeProperty from './components/NodeProperty.vue'

defineOptions({
  name: 'PropertyPanel',
})

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)
</script>
