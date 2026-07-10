<script setup lang="ts">
import { Icon } from '@iconify/vue'
const a = ref(1)
</script>

<template>
  <div class="content"></div>
  <el-button type="success">{{ a }}</el-button>
  <Icon icon="mdi-light:home" />
  <Icon icon="logos:adobe-incopy" />
  <div class="text-[#008c8c] h-80 text-[60px]">Large Text</div>
</template>

<style scoped lang="scss">
.content {
  width: 200px;
  height: 200px;
  background-color: #008c8c;
  &::after {
    content: 'after';
    display: block;
    width: 100px;
    height: 100px;
    background-color: #ff0000;
  }
}
</style>
