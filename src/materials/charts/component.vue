<template>
  <div class="chart-material w-full h-full" :style="schema.style" ref="chartRef"></div>
</template>

<script lang="ts" setup>
import type { MaterialSchema } from '@/schema/materials'
import { init, type EChartsType } from 'echarts'

defineOptions({
  name: 'ChartMaterial',
})

const chartRef = useTemplateRef<HTMLDivElement>('chartRef')
const props = defineProps<{ schema: MaterialSchema }>()
let chart: EChartsType

watch(
  () => props.schema.props.option,
  (option) => {
    chart.setOption(option)
  },
  { deep: true },
)

onMounted(() => {
  chart = init(chartRef.value!)
  chart.setOption(props.schema.props.option)

  const observer = new ResizeObserver(() => {
    chart.resize()
  })

  observer.observe(chartRef.value!)

  onBeforeUnmount(() => {
    observer.disconnect()
    chart.dispose()
  })
})
</script>
