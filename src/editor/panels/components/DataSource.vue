<template>
  <div>
    <el-form>
      <el-form-item label="数据源">
        <el-select clearable v-model="selectedNode.dataId" placeholder="请选择数据源">
          <el-option v-for="dataSource in dataSources" :key="dataSource.id" :label="dataSource.name" :value="dataSource.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'DataSourcePanel',
})

const editorStore = useEditorStore()
const { dataSources, selectedNode } = storeToRefs(editorStore)
</script>
