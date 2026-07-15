<template>
  <div class="material-item">
    <div class="title">柱状图</div>
    <div class="material-icon"></div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'MaterialItem',
})
</script>

<style scoped lang="scss">
.material-item {
  border: 1px solid var(--editor-border);
  margin: 10px;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background: bg-mix(70%);
  }
}
</style>
