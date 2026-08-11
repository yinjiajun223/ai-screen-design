import type { MaterialSchema } from '@/schema/materials'

interface CanvasSchema {
  width: number
  height: number
  backgroundColor: string
}

export interface PageSchema {
  canvas: CanvasSchema
  nodes: MaterialSchema[]
  dataSources: DataSourceSchema[]
}

/**
 * 数据源配置
 * type: static | api
 * static: 静态数据源，直接在配置中写死数据
 * api: 接口数据源，通过接口获取数据
 */
export interface DataSourceSchema {
  type: 'static' | 'api'
  id: string
  name: string
  data: any
  url?: string // api 请求的接口地址
  interval?: number // api 轮询的间隔时间，单位为毫秒
  params?: Record<string, any> // api 请求的参数
}
