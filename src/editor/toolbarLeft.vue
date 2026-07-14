<template>
  <div class="flex gap-20">
    <span><Icon icon="fluent:panel-left-20-filled" /> </span>
    <span><Icon icon="fluent:panel-right-20-filled" /> </span>
    <span><Icon icon="fluent:layer-20-regular" /> </span>
    <span><Icon icon="material-symbols-light:undo" /> </span>
    <span><Icon icon="material-symbols-light:redo-rounded" /> </span>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'ToolbarLeft',
})
</script>

<style></style>
