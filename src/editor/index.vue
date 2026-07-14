<template>
  <div class="editor h-screen bg-[#1b2436]">
    <header class="h-56 border-b border-(--editor-border)">
      <ToolbarLeft class="w-300" />
      <div class="flex-1">title</div>
      <div class="w-300">右</div>
    </header>
    <main class="h-[calc(100vh-56px)] flex">
      <!--  物料区 -->
      <aside class="w-260 border-r border-(--editor-border)">物料</aside>
      <!--  图层   -->
      <aside class="w-156 border-r border-(--editor-border)">图层</aside>
      <!--  画布   -->
      <div class="canvas flex-1">画布</div>
      <!--  属性   -->
      <aside class="w-260 border-l border-(--editor-border)">属性</aside>
    </main>
  </div>
</template>

<script lang="ts" setup>
import ToolbarLeft from './toolbarLeft.vue'
defineOptions({
  name: 'ScreenEditor',
})
</script>

<style scoped lang="scss"></style>
