import type { DataSourceSchema } from '@/schema/page'
import { getValue } from '@/utils'
import axios from 'axios'

export const useDataSource = (dataId: Ref<string>) => {
  const dataSources = inject('dataSources') as Ref<DataSourceSchema[]>
  const loading = ref(false) // 数据源加载状态
  const error = ref(null) // 数据源加载错误信息
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

  const loadData = async (params?: Record<string, any>) => {
    // 取消上一次的定时器，避免重复请求
    clearTimeout(timer)

    if (!source.value) {
      // 数据源被删除或节点未绑定数据源时，清空旧缓存，交由物料回退到默认数据。
      data.value = undefined
      return
    }

    const url = source.value.url

    if (source.value.type === 'api' && url) {
      try {
        loading.value = true
        // 等一个 promise，获取数据源数据
        data.value = await fetchData(source.value, params)
      } catch (e) {
        error.value = e
      } finally {
        loading.value = false
        if (source.value.interval) {
          timer = setTimeout(() => {
            loadData()
          }, source.value.interval)
        }
      }
    } else {
      // 静态数据源不需要加载数据
      data.value = source.value.data
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
    loading,
    error,
    refresh: loadData,
  }
}

/**
 *
 * 相同的 config 做请求复用
 * '{"url":"/api/data","method":"get","params":{"date":"2026-01-01"}}' : Promise
 */
const requestMap = {}

export const fetchData = async (source: DataSourceSchema, data?: Record<string, any>) => {
  // 获取 url 中的参数 date
  const search = new URLSearchParams(location.search)

  // 将 url 中的参数和 source.value.params 合并，优先使用 url 中的参数
  const params = Object.fromEntries(search.entries())

  // data = 手动传递的参数 优先级最高
  const queryParams = { ...source.params, ...params, ...data }
  const paramsKey = source.method === 'get' ? 'params' : 'data'

  const config = {
    url: source.url,
    method: source.method || 'get',
    // url 优先级 > source.value.params
    [paramsKey]: queryParams,
  }
  const key = JSON.stringify(config)

  // 有缓存不请求了
  if (requestMap[key]) return requestMap[key]

  const promise = axios
    .request(config)
    .then((res) => {
      return getValue(res.data, source.responsePath)
    })
    .finally(() => {
      // 请求完成后删除缓存，避免数据源数据过期
      delete requestMap[key]
    })

  // { list: [] }
  // source.responsePath = 'list'
  requestMap[key] = promise
  return promise
}
