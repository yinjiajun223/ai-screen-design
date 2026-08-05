import type { MaterialsDefinition } from '../../schema/materials'

const chartMaterials: MaterialsDefinition = {
  name: '柱状图',
  icon: 'noto-v1:bar-chart',
  group: 'charts',
  schema: {
    type: 'charts',
    name: '柱状图',
    layout: {
      x: 0,
      y: 0,
      width: 300,
      height: 200,
    },
    props: {
      option: {},
    },
  },
}

export const install = (register) => {
  register(chartMaterials)
}
