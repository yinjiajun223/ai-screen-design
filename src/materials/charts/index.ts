import chartMaterial from './component.vue'
import type { MaterialsDefinition } from '@/schema/materials'

type MaterialModule = Record<string, MaterialsDefinition>

// 自动加载当前目录下所有图表物料定义，排除本入口文件。
const materialModules = import.meta.glob<MaterialModule>(['./*.ts', '!./index.ts'], { eager: true })
const chartMaterials = Object.values(materialModules).flatMap((module) => Object.values(module))

export const install = (register) => {
  chartMaterials.forEach((material) => {
    // 遍历所有图表物料 全部注册
    register(material, chartMaterial)
  })
}
