<template>
  <div class="material-panel flex">
    <div class="nav w-50">
      <div class="active">
        <span><Icon icon="mdi:chart-bar" width="16" /></span>
        <span>图表</span>
      </div>
      <div>
        <span><Icon icon="mdi:form" width="16" /></span>
        <span>表单</span>
      </div>
    </div>
    <div class="material-list flex-1">
      <MaterialItem v-for="index in 29" :key="index" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import MaterialItem from './components/material-item.vue'

defineOptions({
  name: 'MaterialPanel',
})
</script>

<style scoped lang="scss">
.material-panel {
  min-width: 0;
  min-height: 0;

  .nav {
    flex-shrink: 0;
    padding: 8px 0;
    border-right: 1px solid var(--editor-border);

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 52px;
      gap: 4px;
      color: var(--editor-text-muted);
      font-size: 12px;
      border-left: 2px solid transparent;
      transition:
        color 150ms ease,
        background-color 150ms ease,
        border-color 150ms ease;

      &:hover {
        color: var(--editor-text);
        background: var(--editor-control);
      }

      &.active {
        color: var(--editor-accent);
        background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-panel));
        border-left-color: var(--editor-accent);
      }
    }
  }

  .material-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    min-height: 0;
    padding: 8px;
    overflow-y: auto;
  }
}
</style>
