<template>
  <div class="material-item">
    <div class="title">柱状图</div>
    <div class="icon"><Icon icon="noto-v1:bar-chart" /></div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'MaterialItem',
})
</script>

<style scoped lang="scss">
.material-item {
  display: flex;
  flex-direction: column;
  flex: 0 0 108px;
  gap: 8px;
  padding: 10px;
  background: var(--editor-control);
  border: 1px solid var(--editor-border);
  border-radius: 8px;
  cursor: pointer;
  transition:
    color 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease;

  .title {
    color: var(--editor-text);
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
  }

  .icon {
    display: grid;
    flex: 1;
    min-height: 0;
    place-items: center;
    background: var(--editor-canvas);
    border-radius: 6px;

    > svg {
      width: 24px;
      height: 24px;
    }
  }

  &:hover {
    background: var(--editor-control-hover);
    border-color: var(--editor-border-hover);
    box-shadow: 0 6px 16px rgb(0 0 0 / 20%);
  }
}
</style>
