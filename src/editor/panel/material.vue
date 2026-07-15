<template>
  <div class="material-panel flex">
    <div class="nav w-50">
      <div class="active">
        <span><Icon icon="mdi:chart-bar" width="16" /></span>
        <span>图表</span>
      </div>
      <div class="active">
        <span><Icon icon="mdi:form" width="16" /></span>
        <span>表单</span>
      </div>
    </div>
    <div class="flex-1">
      <MaterialItem />
      <MaterialItem />
      <MaterialItem />
      <MaterialItem />
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
  .nav {
    border-right: 1px solid var(--editor-border);
    div {
      height: 50px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;

      &.active {
        background: bg-mix(70%);
      }
    }
  }
}
</style>
