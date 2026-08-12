import type { DataSourceSchema } from '@/schema/page'
import { getValue } from '@/utils'
import axios from 'axios'

export const useDataSource = (dataId: Ref<string>) => {
  const dataSources = inject('dataSources') as Ref<DataSourceSchema[]>
  let timer
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

  const data = ref()

  const loadData = async () => {
    if (!source.value) {
      // 数据源被删除或节点未绑定数据源时，清空旧缓存，交由物料回退到默认数据。
      data.value = undefined
      return
    }

    const url = source.value.url

    if (source.value.type === 'api' && url) {
      try {
        data.value = await fetchData(source.value)
      } finally {
        if (source.value.interval) {
          timer = setTimeout(() => {
            loadData()
          }, source.value.interval)
        }
      }
    } else {
      // 静态数据源不需要加载数据
      data.value = source.value.data
      console.log('data.value', data.value)
    }
  }

  // 监听数据源变化，重新加载数据
  watch(source, () => loadData(), { immediate: true })

  onBeforeUnmount(() => {
    // 组件销毁前 清除定时器，避免内存泄漏
    clearTimeout(timer)
  })

  return {
    data,
  }
}

export const fetchData = async (source: DataSourceSchema) => {
  // 获取 url 中的参数 date
  const search = new URLSearchParams(location.search)

  // 将 url 中的参数和 source.value.params 合并，优先使用 url 中的参数
  const params = Object.fromEntries(search.entries())

  const queryParams = { ...source.params, ...params }
  const paramsKey = source.method === 'get' ? 'params' : 'data'
  const res = await axios.request({
    url: source.url,
    method: source.method || 'get',
    // url 优先级 > source.value.params
    [paramsKey]: queryParams,
  })

  // { list: [] }
  // source.responsePath = 'list'
  return getValue(res.data, source.responsePath)
}
