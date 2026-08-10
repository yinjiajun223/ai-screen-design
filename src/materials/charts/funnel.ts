import type { MaterialsDefinition } from '@/schema/materials'

export const funnelMaterial: MaterialsDefinition = {
  name: '漏斗图',
  group: 'charts',
  icon: 'tabler:chart-funnel-filled',
  iconColor: '#f59e0b',
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
      label: '主色',
      key: 'props.option.color.0',
    },
    {
      type: 'input',
      label: '名称字段',
      key: 'props.option.series.0.encode.itemName',
    },
    {
      type: 'input',
      label: '数值字段',
      key: 'props.option.series.0.encode.value',
    },
  ],
  schema: {
    type: 'funnel-chart',
    name: '漏斗图',
    layout: {
      x: 0,
      y: 0,
      width: 400,
      height: 260,
    },
    props: {
      option: {
        color: ['#22d3ee', '#38bdf8', '#818cf8', '#a78bfa', '#f472b6'],
        title: {
          text: '转化漏斗',
          top: 8,
          left: 'center',
          textStyle: {
            color: '#ffffff',
            fontSize: 16,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
        },
        dataset: {
          source: [
            { stage: '曝光', value: 1000 },
            { stage: '点击', value: 680 },
            { stage: '咨询', value: 420 },
            { stage: '下单', value: 260 },
            { stage: '成交', value: 180 },
          ],
        },
        series: [
          {
            name: '转化',
            type: 'funnel',
            top: 48,
            bottom: 16,
            left: '12%',
            width: '76%',
            min: 0,
            max: 1000,
            minSize: '20%',
            maxSize: '100%',
            sort: 'descending',
            gap: 3,
            label: {
              color: '#ffffff',
            },
            labelLine: {
              lineStyle: {
                color: '#94a3b8',
              },
            },
            encode: {
              itemName: 'stage',
              value: 'value',
            },
          },
        ],
      },
    },
  },
}
