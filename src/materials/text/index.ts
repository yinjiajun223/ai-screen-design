import type { MaterialsDefinition } from '../../schema/materials'
import TextMetrial from './compoent.vue'

// 物料元数据
// text => TextMaterial
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
      color: '#fff',
    },
    props: {
      content: 'Hello World',
    },
  },
}

export const install = (register) => {
  register(textMaterials, TextMetrial)
}
