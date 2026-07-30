import type { MaterialsDefinition } from './types'

const materials: MaterialsDefinition[] = []

const groups = [
  { name: '图表', icon: 'mdi:chart-bar', key: 'charts' },
  { name: '信息', icon: 'material-symbols:info-outline', key: 'info' },
]

export const register = (material: MaterialsDefinition) => materials.push(material)
export const getMerialsByGroup = (group: string) => materials.filter((material) => material.group === group)
export const getGroups = () => groups

// 注册所有的物料
const materialsModule = import.meta.glob('./*.ts', { eager: true })
Object.values(materialsModule).forEach((module) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //  @ts-expect-error
  if (module.install) module.install(register)
})
