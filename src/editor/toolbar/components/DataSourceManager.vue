<template>
  <div class="data-source-container">
    <div class="data-source-sidebar">
      <div class="data-source-sidebar__title">数据源列表</div>
      <div class="data-source-list">
        <el-button @click="onAdd" type="primary">新增</el-button>
        <div
          v-for="item in data"
          :key="item.id"
          class="data-source-list__item"
          :class="{ 'is-active': activeSource?.id === item.id }"
        >
          <button class="data-source-list__select" type="button" @click="selectSource(item)">
            <span class="data-source-list__indicator"></span>
            <span class="data-source-list__name">{{ item.name }}</span>
          </button>
          <button
            v-if="activeSource?.id === item.id"
            class="data-source-list__delete"
            title="删除数据源"
            type="button"
            @click.stop="onRemove(item.id)"
          >
            <Icon icon="fluent:delete-20-regular" />
          </button>
        </div>
      </div>
    </div>
    <div class="data-source-content">
      <el-form v-if="activeSource">
        <el-form-item label="名称"><el-input v-model="activeSource.name"></el-input> </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="activeSource.type">
            <el-radio-button label="静态" value="static"></el-radio-button>
            <el-radio-button label="API" value="api"></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="数据" v-if="activeSource.type === 'static'">
          <MonacoEditor v-model="activeSource.data" />
        </el-form-item>

        <div v-else class="data-source-api">
          <div class="data-source-api__heading">
            <span class="data-source-api__status"></span>
            <span>接口配置</span>
          </div>
          <el-form-item label="请求地址">
            <div class="data-source-api__url-field">
              <el-input v-model="activeSource.url" placeholder="请输入接口地址" />
              <el-button class="data-source-api__preview-button" type="primary" :loading="isRequesting" @click="onRequest">
                请求预览
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="请求方式">
            <el-radio-group v-model="activeSource.method">
              <el-radio-button label="GET" value="get"></el-radio-button>
              <el-radio-button label="POST" value="post"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="轮询周期">
            <el-input v-model="activeSource.interval" placeholder="单位：毫秒">
              <template #append>ms</template>
            </el-input>
          </el-form-item>
          <el-form-item label="参数">
            <div class="data-source-api__editor">
              <MonacoEditor v-model="activeSource.params" />
            </div>
          </el-form-item>

          <el-form-item label="响应路径">
            <el-input v-model="activeSource.responsePath"></el-input>
          </el-form-item>
          <el-form-item v-if="hasPreviewData" label="预览数据">
            <div class="data-source-api__editor data-source-api__editor--preview">
              <MonacoEditor v-model="responseText" />
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEditorStore } from '@/stores/editor'
import { storeToRefs } from 'pinia'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import { deepClone } from '@/utils'
import { Icon } from '@iconify/vue'
import { fetchData } from '@/composables/useDataSource'

defineOptions({
  name: 'DataSourceManager',
})

const editorStore = useEditorStore()
const { dataSources } = storeToRefs(editorStore)
const activeSource = ref()
const responseText = ref('')
const isRequesting = ref(false)
const hasPreviewData = ref(false)
/**
 * 深拷贝一份数据源
 * 1、data params 这些需要转字符串
 * 2、弹框需要确认才修改 并不是实时修改
 */
const data = ref(
  deepClone(dataSources.value).map((item) => {
    return {
      ...item,
      data: item.data ? JSON.stringify(item.data, null, 2) : '',
      params: item.params ? JSON.stringify(item.params, null, 2) : '',
    }
  }),
)

const onAdd = () => {
  data.value.push({
    id: crypto.randomUUID(),
    name: '未命名',
    type: 'static',
    data: '',
    params: '{}',
  })

  selectSource(data.value.at(-1))
}

const onRemove = (id: string) => {
  data.value = data.value.filter((item) => item.id !== id)

  if (activeSource.value?.id === id) {
    selectSource(data.value.at(0))
  }
}

const selectSource = (source) => {
  activeSource.value = source
  responseText.value = ''
  hasPreviewData.value = false
}

const onRequest = async () => {
  if (!activeSource.value?.url) return

  isRequesting.value = true
  try {
    const res = await fetchData({
      ...activeSource.value,
      params: activeSource.value.params ? JSON.parse(activeSource.value.params) : undefined,
    })
    responseText.value = JSON.stringify(res, null, 2)
    hasPreviewData.value = true
  } finally {
    isRequesting.value = false
  }
}

defineExpose({
  save() {
    const _data = deepClone(data.value).map((item) => {
      return {
        ...item,
        data: item.data ? JSON.parse(item.data) : undefined,
        params: item.params ? JSON.parse(item.params) : undefined,
      }
    })
    // 更新到 store
    editorStore.page.dataSources = _data
  },
})
</script>

<style lang="scss" scoped>
.data-source-container {
  display: flex;
  gap: 16px;
  height: 560px;

  .data-source-sidebar {
    display: flex;
    flex: 0 0 190px;
    flex-direction: column;
    overflow: hidden;
    background: var(--editor-panel);
    border: 1px solid var(--editor-border);
    border-radius: 6px;

    &__title {
      padding: 13px 14px 12px;
      color: var(--editor-text-muted);
      font-size: 12px;
      line-height: 1;
      letter-spacing: 0.04em;
      border-bottom: 1px solid var(--editor-border);
    }
  }

  .data-source-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    overflow-y: auto;

    &__item {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 34px;
      color: var(--editor-text-muted);
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      transition: 150ms ease;

      &:hover {
        color: var(--editor-text);
        background: var(--editor-control);
      }

      &.is-active {
        color: var(--editor-accent);
        background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-control));
        border-color: color-mix(in srgb, var(--editor-accent) 32%, var(--editor-border));
      }
    }

    &__select {
      display: flex;
      flex: 1;
      align-items: center;
      gap: 9px;
      min-width: 0;
      min-height: 32px;
      padding: 0 10px;
      color: inherit;
      text-align: left;
      background: transparent;
      border: 0;
      cursor: pointer;

      &:focus-visible {
        outline: 2px solid var(--editor-accent);
        outline-offset: -2px;
      }
    }

    &__indicator {
      width: 6px;
      height: 6px;
      background: currentcolor;
      border-radius: 999px;
      opacity: 0.85;
    }

    &__name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__delete {
      display: grid;
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      place-items: center;
      padding: 0;
      color: var(--editor-text-muted);
      background: transparent;
      border: 0;
      border-radius: 3px;
      cursor: pointer;
      transition: 150ms ease;

      &:hover {
        color: var(--editor-accent);
        background: color-mix(in srgb, var(--editor-accent) 12%, transparent);
      }

      &:focus-visible {
        outline: 2px solid var(--editor-accent);
        outline-offset: -2px;
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  .data-source-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    padding: 16px;
    background: var(--editor-panel);
    border: 1px solid var(--editor-border);
    border-radius: 6px;

    :deep(.el-form) {
      height: 100%;
    }

    :deep(.el-form-item) {
      margin-bottom: 18px;
    }

    :deep(.el-form-item__label) {
      color: var(--editor-text-muted);
      font-size: 13px;
    }

    :deep(.el-form-item:last-child) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      height: calc(100% - 88px);
      margin-bottom: 0;

      .el-form-item__label {
        justify-content: flex-start;
        height: 22px;
        line-height: 22px;
      }

      .el-form-item__content {
        flex: 1;
        min-height: 0;
        margin-left: 0 !important;
      }
    }

    :deep(.el-radio-button__inner) {
      padding: 7px 15px;
      background: var(--editor-control);
      border-color: var(--editor-border);
      box-shadow: none;
    }

    .data-source-api {
      display: flex;
      flex-direction: column;
      height: calc(100% - 88px);
      min-height: 0;
      padding: 14px;
      overflow-y: auto;
      background: color-mix(in srgb, var(--editor-control) 62%, var(--editor-panel));
      border: 1px solid var(--editor-border);
      border-radius: 6px;

      &__heading {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 14px;
        color: var(--editor-text);
        font-size: 13px;
        font-weight: 500;
      }

      &__status {
        width: 7px;
        height: 7px;
        background: var(--editor-accent);
        border-radius: 50%;
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--editor-accent) 16%, transparent);
      }

      :deep(.el-form-item) {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }

      :deep(.el-form-item__label) {
        width: 66px !important;
        padding-right: 10px;
        text-align: left;
      }

      :deep(.el-form-item__content) {
        min-width: 0;
        margin-left: 0 !important;
      }

      :deep(.el-input-group__append) {
        color: var(--editor-text-muted);
        background: var(--editor-control-hover);
        border-color: var(--editor-border);
        box-shadow: none;
      }

      &__url-field {
        display: flex;
        flex: 1;
        gap: 8px;
        min-width: 0;

        :deep(.el-input) {
          flex: 1;
          min-width: 0;
        }
      }

      &__preview-button {
        flex: 0 0 auto;
      }

      :deep(.el-form-item:last-child) {
        display: flex;
        flex: none;
        flex-direction: column;
        align-items: stretch;
        height: auto;
        margin: 4px 0 0;

        .el-form-item__label {
          width: auto !important;
          height: 22px;
          line-height: 22px;
        }

        .el-form-item__content {
          flex: 1;
          min-height: 0;
        }
      }

      &__editor {
        height: 150px;
        width: 100%;
        overflow: hidden;

        &--preview {
          height: 220px;
        }

        :deep(.editor-contaienr) {
          min-height: 0;
        }
      }
    }
  }
}
</style>
