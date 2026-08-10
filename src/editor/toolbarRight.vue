<template>
  <div class="toolbar-right flex justify-end gap-20">
    <button v-for="item in toolbarItems" :key="item.icon" :title="item.title" type="button" @click="item.onClick">
      <Icon :icon="item.icon" />
    </button>

    <input
      ref="importFileInput"
      class="import-file-input"
      type="file"
      accept="application/json,.json"
      @change="onImportFileChange"
    />

    <el-drawer :destroy-on-close="true" v-model="visible" title="编辑 JSON" size="600">
      <MonacoEditor v-model="jsonText" />

      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'

defineOptions({
  name: 'ToolbarRight',
})

const editorStore = useEditorStore()
const { page } = storeToRefs(editorStore)
const importFileInput = useTemplateRef<HTMLInputElement>('importFileInput')

const toolbarItems = [
  { title: '预览', icon: 'fluent:eye-20-regular', onClick: () => ElMessage.info('预览功能待实现') },
  {
    title: '编辑 JSON',
    icon: 'fluent:braces-20-regular',
    onClick: () => {
      jsonText.value = JSON.stringify(page.value, null, 2)
      visible.value = true
    },
  },
  { title: '发布', icon: 'fluent:cloud-arrow-up-20-regular', onClick: () => ElMessage.info('发布功能待实现') },
  { title: '导入', icon: 'fluent:arrow-upload-20-regular', onClick: () => importFileInput.value?.click() },
  {
    title: '导出',
    icon: 'fluent:arrow-download-20-regular',
    onClick: () => {
      if (!page.value.nodes.length) {
        ElMessage.warning('当前页面没有节点，无法导出')
        return
      }

      const json = JSON.stringify(page.value, null, 2)
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'page.json'
      a.click()
      URL.revokeObjectURL(url)
    },
  },
]

const visible = ref(false)
const jsonText = ref('')

const onImportFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  file.text().then((text) => {
    try {
      const importedPage = JSON.parse(text)
      if (!importedPage.nodes.length || !Array.isArray(importedPage.nodes)) {
        throw new Error('导入的 JSON 文件格式不正确，缺少 nodes 数组')
      }
      editorStore.setPage(importedPage)
      ElMessage.success('导入成功')
    } catch (error) {
      console.error('导入失败', error)
      ElMessage.error('导入失败：' + (error as Error).message)
    }
    input.value = ''
  })
}

const onConfirm = () => {
  // 在这里处理确认逻辑，例如保存 JSON 数据
  const newPage = JSON.parse(jsonText.value)
  editorStore.setPage(newPage)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.toolbar-right > button {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  padding: 0;
  color: var(--editor-text-muted);
  line-height: 1;
  background: var(--editor-control);
  border: 1px solid var(--editor-border);
  border-radius: 4px;
  cursor: pointer;
  transition: 150ms ease;

  > svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--editor-text);
    background: var(--editor-control-hover);
    border-color: var(--editor-border-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--editor-accent);
    outline-offset: 2px;
  }
}

.import-file-input {
  display: none;
}
</style>
