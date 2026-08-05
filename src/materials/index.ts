import type { Component } from 'vue'
import type { MaterialsDefinition } from '../schema/materials'

const materials: MaterialsDefinition[] = []

const groups = [
  { name: '图表', icon: 'mdi:chart-bar', key: 'charts' },
  { name: '信息', icon: 'material-symbols:info-outline', key: 'info' },
]
const componentMap = new Map()
const settersMap = new Map()

export const register = (material: MaterialsDefinition, component: Component) => {
  materials.push(material)
  componentMap.set(material.schema.type, component)

  if (material.setters) {
    settersMap.set(material.schema.type, material.setters)
  }
}
export const getMerialsByGroup = (group: string) => materials.filter((material) => material.group === group)
export const getGroups = () => groups
export const getMaterialComponent = (type: string) => componentMap.get(type)
export const getMaterialSetters = (type: string) => settersMap.get(type)
export const createNode = (node) => ({ ...node, id: crypto.randomUUID() })

// 注册所有的物料
const materialsModule = import.meta.glob('./*/index.ts', { eager: true })
Object.values(materialsModule).forEach((module) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //  @ts-expect-error
  if (module.install) module.install(register)
})
