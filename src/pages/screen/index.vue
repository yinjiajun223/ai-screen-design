<template>
  <ScreenRender :page="page" />
</template>

<script lang="ts" setup>
import ScreenRender from '@/components/ScreenRender/index.vue'
import { getPublishPage } from '@/utils/publish'

defineOptions({
  name: 'ScreenPage',
})

const route = useRoute()
const id = route.query.id as string

/**
 * 点击预览 从 localStorage 中获取数据，传给 ScreenRender 组件进行渲染
 */
const page = getPublishPage(id)
</script>
