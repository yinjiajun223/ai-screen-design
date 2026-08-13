<template>
  <div :style="textStyle">{{ schema.props.content }}</div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'TextMaterial',
})

const props = defineProps(['schema'])

const textStyle = computed(() => {
  return {
    color: props.schema.style.color,
    fontSize: props.schema.style.fontSize + 'px',
  }
})
</script>
