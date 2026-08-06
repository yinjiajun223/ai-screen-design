export interface layout {
  x: number
  y: number
  width: number
  height: number
}

export interface MaterialSchema {
  id: string
  type: string
  locked?: boolean
  name: string
  layout: layout
  style?: Record<string, any> // 样式并不是所有节点都需要的 比如echarts
  props: Record<string, any>
}

interface SetterSchema {
  type: string
  label: string
  key: string
  [key: string]: any
}

export interface MaterialsDefinition {
  name: string
  icon: string
  group: string
  schema?: Omit<MaterialSchema, 'id'>
  setters?: SetterSchema[]
}
