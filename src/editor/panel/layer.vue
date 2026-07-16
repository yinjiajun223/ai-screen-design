<template>
  <div class="layer-panel">
    <div v-for="value in 80" :key="value" class="layer-item">
      <span>柱状图</span>
      <span><Icon icon="mdi:chart-bar" width="16" /></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'LayerPanel',
})
</script>

<style scoped lang="scss">
.layer-panel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  padding: 8px;
  overflow-y: auto;

  .layer-item {
    display: flex;
    flex: 0 0 32px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    color: var(--editor-text-muted);
    font-size: 12px;
    background: var(--editor-control);
    border: 1px solid var(--editor-border);
    border-radius: 6px;
    cursor: pointer;
    transition:
      color 150ms ease,
      background-color 150ms ease,
      border-color 150ms ease;

    &:hover {
      color: var(--editor-text);
      background: var(--editor-control-hover);
      border-color: var(--editor-border-hover);
    }
  }
}
</style>
