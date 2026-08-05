<template>
  <div>
    <el-collapse>
      <el-collapse-item title="布局属性">
        <FormCreate :setters="layoutSetters" :formData="selectedNode" />
      </el-collapse-item>
      <el-collapse-item title="组件属性">
        <FormCreate :setters="setters" :formData="selectedNode" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { getMaterialSetters } from '@/materials'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import FormCreate from './FormCreate.vue'

defineOptions({
  name: 'NodeProperty',
})

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const setters = getMaterialSetters(selectedNode.value.type)

const layoutSetters = [
  { label: '宽度', key: 'layout.width', type: 'number', span: 12 },
  { label: '高度', key: 'layout.height', type: 'number', span: 12 },
  { label: 'X', key: 'layout.x', type: 'number' },
  { label: 'Y', key: 'layout.y', type: 'number' },
]
</script>

<style></style>
