import type { MaterialsDefinition } from '../../schema/materials'
import TextMetrial from './compoent.vue'

// 物料元数据
// text => TextMaterial
const textMaterials: MaterialsDefinition = {
  name: '文本',
  group: 'info',
  icon: 'solar:text-bold',
  setters: [
    { type: 'input', label: '文本内容', key: 'props.content' },
    { type: 'color', label: '颜色', key: 'style.color' },
  ],
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
