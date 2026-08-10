<template>
  <div class="node-property">
    <div class="node-title">
      <span>{{ selectedNode.name }}</span>
      <span class="cursor-pointer" @click="previewJson"> <Icon icon="si:json-duotone" /></span>
    </div>

    <el-tabs v-model="activeTab" type="card" stretch>
      <el-tab-pane label="属性" name="property">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="组件属性" name="1">
            <FormCreate :setters="setters" :formData="selectedNode" />
          </el-collapse-item>
          <el-collapse-item title="布局属性" name="2">
            <FormCreate :setters="layoutSetters" :formData="selectedNode" />
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="数据源" name="dataSource">
        <DataSource />
      </el-tab-pane>
    </el-tabs>

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
import { getMaterialSetters } from '@/materials'
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import FormCreate from './FormCreate.vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import DataSource from './DataSource.vue'

defineOptions({
  name: 'NodeProperty',
})

const activeTab = ref('property')
const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)

const setters = computed(() => getMaterialSetters(selectedNode.value.type))
const activeCollapse = ref('1')
const visible = ref(false)
const layoutSetters = [
  { label: '宽度', key: 'layout.width', type: 'number', span: 12 },
  { label: '高度', key: 'layout.height', type: 'number', span: 12 },
  { label: 'X', key: 'layout.x', type: 'number' },
  { label: 'Y', key: 'layout.y', type: 'number' },
]
const jsonText = ref('')

const previewJson = () => {
  const jsonStr = JSON.stringify(selectedNode.value, null, 2)
  jsonText.value = jsonStr
  visible.value = true
}

const onConfirm = () => {
  // 在这里处理确认逻辑，例如保存 JSON 数据
  const newNode = JSON.parse(jsonText.value)
  editorStore.updateNode(selectedNode.value.id, {
    ...newNode,
    id: selectedNode.value.id, // 保留原来的 id 避免用户改id type
    type: selectedNode.value.type, // 保留原来的 type
  })
  visible.value = false
}
</script>

<style scoped lang="scss">
.node-property {
  padding: 16px;

  .node-title {
    height: 40px;
    margin-bottom: 12px;
    padding: 0 2px;
    color: var(--editor-text);
    font-size: 16px;
    font-weight: 650;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > span:last-child {
      display: grid;
      width: 28px;
      height: 28px;
      place-items: center;
      color: var(--editor-text-muted);
      border: 1px solid transparent;
      border-radius: 6px;
      transition: 150ms ease;

      &:hover {
        color: var(--editor-accent);
        background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-control));
        border-color: color-mix(in srgb, var(--editor-accent) 28%, var(--editor-border));
      }

      :deep(svg) {
        width: 16px;
        height: 16px;
      }
    }
  }

  :deep(.el-tabs) {
    display: block;
  }

  :deep(.el-tabs__header) {
    margin: 0 0 14px;
  }

  :deep(.el-tabs__nav-wrap) {
    &::after {
      display: none;
    }
  }

  :deep(.el-tabs__nav) {
    display: inline-flex;
    gap: 4px;
    padding: 4px;
    background: var(--editor-control);
    border: 1px solid var(--editor-border);
    border-radius: 8px;
  }

  :deep(.el-tabs__item) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 14px !important;
    color: var(--editor-text-muted);
    font-size: 13px;
    font-weight: 500;
    border: 0 !important;
    border-radius: 5px;
    transition: 150ms ease;

    &:hover {
      color: var(--editor-text);
      background: var(--editor-control-hover);
    }

    &.is-active {
      color: var(--editor-accent);
      background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-panel));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--editor-accent) 38%, transparent);
    }
  }

  :deep(.el-tabs__content) {
    min-width: 0;
  }

  :deep(.el-tab-pane) {
    min-height: 1px;
  }

  :deep(.el-collapse) {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 0;
  }

  :deep(.el-collapse-item) {
    overflow: hidden;
    border: 1px solid var(--editor-border);
    border-radius: 8px;
    background: var(--editor-control);
    box-shadow: 0 3px 10px rgb(0 0 0 / 10%);
  }

  :deep(.el-collapse-item__header) {
    height: 44px;
    padding: 0 14px;
    border: 0;
    background: transparent;
    color: var(--editor-text);
    font-size: 14px;
    font-weight: 600;
    transition:
      color 0.2s ease,
      background-color 0.2s ease;

    &::before {
      width: 3px;
      height: 14px;
      margin-right: 10px;
      border-radius: 999px;
      background: var(--editor-border-hover);
      content: '';
      transition: background-color 0.2s ease;
    }

    &:hover {
      background: var(--editor-control-hover);
    }

    &.is-active {
      color: var(--editor-accent);
      background: color-mix(in srgb, var(--editor-accent) 8%, var(--editor-control));

      &::before {
        background: var(--editor-accent);
      }
    }
  }

  :deep(.el-collapse-item__arrow) {
    color: var(--editor-text-muted);
    font-size: 14px;
  }

  :deep(.el-collapse-item__wrap) {
    border: 0;
    background: color-mix(in srgb, var(--editor-panel) 88%, var(--editor-control));
  }

  :deep(.el-collapse-item__content) {
    padding-bottom: 0;
    color: var(--editor-text-muted);
  }
}
</style>
