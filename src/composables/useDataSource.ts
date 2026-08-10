import type { DataSourceSchema } from '@/schema/page'

export const useDataSource = (dataId: Ref<string>) => {
  const dataSources = inject('dataSources') as Ref<DataSourceSchema[]>

  /**
   * source: 当前组件绑定的数据源对象
   * id: 数据源id
   * name: 数据源名称
   * type: 数据源类型
   * data: 数据源数据
   */
  const source = computed(() => {
    const dataSource = dataSources.value.find((ds) => ds.id === dataId.value)

    return dataSource
  })

  /**
   * 保存的用于组件消费的数据源
   */
  const data = computed(() => source.value?.data)

  return {
    data,
  }
}
