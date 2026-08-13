<template>
  <div v-loading="loading" class="chart-material w-full h-full" :style="schema.style" ref="chartRef"></div>
</template>

<script lang="ts" setup>
import { useDataSource } from '@/composables/useDataSource'
import type { MaterialSchema } from '@/schema/materials'
import { init, type EChartsType } from 'echarts'

defineOptions({
  name: 'ChartMaterial',
})

/**
 * 物料状态来源
 * 编辑时状态 => 编辑器在用的时候
 * 运行时的状态 => 渲染器在用的时候
 */

let chart: EChartsType
const chartRef = useTemplateRef<HTMLDivElement>('chartRef')
const props = defineProps<{ schema: MaterialSchema }>()

const dataId = computed(() => props.schema.dataId)
const { data, loading, refresh } = useDataSource(dataId)
const option = computed(() => {
  const _option = props.schema.props.option
  return {
    ..._option,
    dataset: {
      ..._option.dataset,
      // 重写source，优先使用数据源中的数据，如果没有则使用组件自带的source
      source: data.value ?? _option.dataset.source,
    },
  }
})

onMounted(() => {
  chart = init(chartRef.value!)
  chart.setOption(option.value)

  const observer = new ResizeObserver(() => {
    chart.resize()
  })

  observer.observe(chartRef.value!)

  onBeforeUnmount(() => {
    observer.disconnect()
    chart.dispose()
  })
})

defineExpose({
  refresh,
})

watch(
  option,
  (option) => {
    chart.setOption(option)
  },
  { deep: true },
)
</script>
