import type { MaterialsDefinition } from '@/schema/materials'
import { commonEventOptions } from '@/materials/eventOptions'

export const barHorizontalMaterial: MaterialsDefinition = {
  name: '条形图',
  group: 'charts',
  icon: 'ph:chart-bar-horizontal-duotone',
  iconColor: '#22d3ee',
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
      label: '条颜色',
      key: 'props.option.series.0.itemStyle.color',
    },
    {
      type: 'input',
      label: '名称字段',
      key: 'props.option.series.0.encode.y',
    },
    {
      type: 'input',
      label: '数值字段',
      key: 'props.option.series.0.encode.x',
    },
  ],
  schema: {
    type: 'bar-horizontal-chart',
    name: '条形图',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
    },
    props: {
      option: {
        title: {
          text: '渠道排名',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        dataset: {
          source: [
            { channel: '搜索引擎', value: 920 },
            { channel: '直接访问', value: 760 },
            { channel: '内容推荐', value: 540 },
            { channel: '社交媒体', value: 380 },
            { channel: '邮件营销', value: 210 },
          ],
        },
        grid: {
          top: 54,
          right: 28,
          bottom: 20,
          left: 84,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1' },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.18)' } },
        },
        yAxis: {
          type: 'category',
          inverse: true,
          axisLine: { lineStyle: { color: '#64748b' } },
          axisLabel: { color: '#cbd5e1' },
        },
        series: [
          {
            name: '访问量',
            type: 'bar',
            barWidth: 14,
            encode: {
              x: 'value',
              y: 'channel',
            },
            itemStyle: {
              color: '#a78bfa',
              borderRadius: [0, 7, 7, 0],
            },
          },
        ],
      },
    },
  },
}
