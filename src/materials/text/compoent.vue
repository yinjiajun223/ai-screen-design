<template>
  <div :style="schema.style">{{ schema.props.content }}</div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TextMaterial',
})

defineProps(['schema'])
</script>
