import type { MaterialsDefinition } from './types'

// 物料元数据
const textMaterials: MaterialsDefinition = {
  name: '文本',
  icon: 'solar:text-bold',
  group: 'info',
  schema: {
    type: 'text',
    name: '文本',
    layout: {
      x: 0,
      y: 0,
      width: 300,
      height: 50,
    },
    style: {
      color: '#000000',
    },
    props: {
      content: 'Hello World',
    },
  },
}

export const install = (register) => {
  register(textMaterials)
}
