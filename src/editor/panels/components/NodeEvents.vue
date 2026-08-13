<template>
  <div class="data-event-container">
    <div class="data-event-sidebar">
      <div class="data-event-sidebar__title">事件列表</div>
      <div class="data-event-list">
        <el-button @click="onAdd" type="primary"><Icon icon="fluent:add-20-regular" />新增</el-button>
        <div
          v-for="item in data"
          :key="item.name"
          class="data-event-list__item"
          :class="{ 'is-active': activeEvent?.name === item.name }"
        >
          <button class="data-event-list__select" type="button" @click="selectEvent(item)">
            <span class="data-event-list__indicator"></span>
            <span class="data-event-list__name">{{ item.name }}</span>
          </button>
          <button
            v-if="activeEvent?.name === item.name"
            class="data-event-list__delete"
            title="删除事件"
            type="button"
            @click.stop="onRemove(item.name)"
          >
            <Icon icon="fluent:delete-20-regular" />
          </button>
        </div>
      </div>
    </div>
    <div class="data-event-content">
      <el-form v-if="activeEvent">
        <el-form-item label="名称"><el-input v-model="activeEvent.name"></el-input> </el-form-item>

        <el-form-item label="类型">
          <el-input v-model="activeEvent.type"></el-input>
        </el-form-item>

        <el-form-item label="函数体">
          <div class="event-code-editor">
            <div class="event-code-editor__signature">function ($context, $node) {</div>
            <MonacoEditor v-model="activeEvent.code" class="event-code-editor__monaco" lang="javascript" />
            <div class="event-code-editor__signature">}</div>
          </div>
        </el-form-item>
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
import type { MaterialEvent } from '@/schema/materials'

defineOptions({
  name: 'NodeEvents',
})

const editorStore = useEditorStore()
const { selectedNode } = storeToRefs(editorStore)
const activeEvent = ref()

// 深拷贝事件列表
const data = ref(deepClone(selectedNode.value.events || []))

const onAdd = () => {
  data.value.push({
    name: '未命名',
    type: '',
    code: '',
  })

  selectEvent(data.value.at(-1))
}

const onRemove = (name: string) => {
  data.value = data.value.filter((item) => item.name !== name)

  if (activeEvent.value?.name === name) {
    selectEvent(data.value.at(0))
  }
}

const selectEvent = (event: MaterialEvent) => {
  activeEvent.value = event
}

defineExpose({
  save() {
    // 更新节点 events
    editorStore.updateNode(selectedNode.value.id, {
      ...selectedNode.value,
      events: data.value,
    })
  },
})
</script>

<style lang="scss" scoped>
.data-event-container {
  display: flex;
  gap: 16px;
  height: 520px;

  .data-event-sidebar {
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

  .data-event-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    overflow: hidden;

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

  .data-event-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    padding: 16px;
    background: var(--editor-panel);
    border: 1px solid var(--editor-border);
    border-radius: 6px;

    :deep(.el-form) {
      display: flex;
      flex: 1;
      flex-direction: column;
      min-height: 0;
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
      flex: 0 0 320px;
      height: 320px;
      margin-bottom: 0;
    }

    :deep(.el-form-item:last-child .el-form-item__label) {
      justify-content: flex-start;
      height: 22px;
      line-height: 22px;
    }

    :deep(.el-form-item:last-child .el-form-item__content) {
      display: flex;
      flex: 1 1 auto;
      flex-direction: column;
      align-items: stretch;
      min-height: 0;
      margin-left: 0 !important;
    }

    .event-code-editor {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      width: 100%;

      &__signature {
        flex: 0 0 auto;
        color: var(--editor-text-muted);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        line-height: 22px;
      }

      :deep(.event-code-editor__monaco) {
        flex: 1;
        min-height: 0;
        height: 0;
      }
    }
  }
}
</style>
