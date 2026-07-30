<template>
  <div class="material-panel flex">
    <div class="nav w-50">
      <div :class="{ active: activeGroup === item.key }" v-for="item in groups" :key="item.name" @click="activeGroup = item.key">
        <span><Icon :icon="item.icon" width="16" /></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="material-list flex-1">
      <MaterialItem v-for="material in currentMaterials" :key="material.name" :material="material" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getGroups, getMerialsByGroup } from '@/materials'
import MaterialItem from './components/material-item.vue'

defineOptions({
  name: 'MaterialPanel',
})
const activeGroup = ref('info')

const groups = getGroups()
const currentMaterials = computed(() => getMerialsByGroup(activeGroup.value))
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
