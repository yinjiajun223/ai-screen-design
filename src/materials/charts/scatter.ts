import type { MaterialsDefinition } from '@/schema/materials'
import { commonEventOptions } from '@/materials/eventOptions'

export const scatterMaterial: MaterialsDefinition = {
  name: '散点图',
  group: 'charts',
  icon: 'fluent-color:data-scatter-24',
  eventOptions: commonEventOptions,
  setters: [
    {
      type: 'input',
      label: '标题',
      key: 'props.option.title.text',
    },
    {
      type: 'color',
      label: '标题色',
      key: 'props.option.title.textStyle.color',
    },
    {
      type: 'color',
      label: '点颜色',
      key: 'props.option.series.0.itemStyle.color',
    },
    {
      type: 'input',
      label: 'X字段',
      key: 'props.option.series.0.encode.x',
    },
    {
      type: 'input',
      label: 'Y字段',
      key: 'props.option.series.0.encode.y',
    },
  ],
  schema: {
    type: 'scatter-chart',
    name: '散点图',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
    },
    props: {
      option: {
        title: {
          text: '用户活跃度分布',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'item',
        },
        dataset: {
          source: [
            { visits: 12, duration: 28 },
            { visits: 18, duration: 42 },
            { visits: 26, duration: 36 },
            { visits: 34, duration: 64 },
            { visits: 42, duration: 58 },
            { visits: 48, duration: 82 },
            { visits: 56, duration: 74 },
            { visits: 63, duration: 96 },
          ],
        },
        grid: {
          top: 54,
          right: 24,
          bottom: 52,
          left: 48,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          name: '访问次数',
          nameLocation: 'middle',
          nameGap: 32,
          nameTextStyle: { color: '#94a3b8' },
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: {
            color: '#cbd5e1',
            interval: 0,
          },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.18)' } },
        },
        yAxis: {
          type: 'value',
          name: '停留时长',
          nameTextStyle: { color: '#94a3b8' },
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1' },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.18)' } },
        },
        series: [
          {
            name: '用户',
            type: 'scatter',
            symbolSize: 12,
            encode: {
              x: 'visits',
              y: 'duration',
            },
            itemStyle: {
              color: '#22d3ee',
            },
          },
        ],
      },
    },
  },
}
