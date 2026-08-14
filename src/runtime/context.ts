import type { MaterialSchema } from '@/schema/materials'
import type { PageSchema } from '@/schema/page'
import { setValue } from '@/utils'

interface RuntimeContext {
  getNode(id: string): MaterialSchema | undefined // 获取节点信息
  setAttribute(id: string, key: string, value: any): void // 修改节点属性
  setProp(id: string, key: string, value: any): void // 修改节点props
  setStyle(id: string, key: string, value: any): void // 修改节点style
  registerNodeInstance(instances: Record<string, any>): void // 注册节点实例
  // trigger('123','refresh') => 触发123这个组件ref实例的refresh方法
  trigger(id: string, eventName: string, ...args: any[]): any // 触发节点事件
  refreshNodesByDataId(dataId: string, ...args: any[]): void // 通过dataId刷新所有组件中的数据
  dispatch(id: string, eventName: string, ...args: any[]): void // 派发事件
}

export const createRuntimeContext = (page: Ref<PageSchema>): RuntimeContext => {
  let _instanceMap = {}

  const getNode: RuntimeContext['getNode'] = (id) => {
    return page.value.nodes.find((node) => node.id === id)
  }

  const setAttribute: RuntimeContext['setAttribute'] = (id, key, value) => {
    const node = page.value.nodes.find((node) => node.id === id)

    if (!node) return console.warn(`节点不存在，id: ${id}`)

    setValue(node, key, value)
  }

  const setProp: RuntimeContext['setProp'] = (id, key, value) => {
    setAttribute(id, `props.${key}`, value)
  }

  const setStyle: RuntimeContext['setStyle'] = (id, key, value) => {
    setAttribute(id, `style.${key}`, value)
  }

  const registerNodeInstance: RuntimeContext['registerNodeInstance'] = (instances): void => {
    _instanceMap = instances
  }

  const trigger: RuntimeContext['trigger'] = (id, eventName, ...args) => {
    const instance = _instanceMap[id]
    if (!instance) return console.warn(`节点实例不存在，id: ${id}`)
    if (typeof instance[eventName] !== 'function') return console.warn(`节点实例不存在方法，id: ${id}, eventName: ${eventName}`)

    // 触发节点实例的方法，并传递参数 tip: 方法可能有返回值 同样返回
    return instance[eventName](...args)
  }

  const refreshNodesByDataId: RuntimeContext['refreshNodesByDataId'] = (dataId, ...args) => {
    const nodes = page.value.nodes.filter((node) => node.dataId === dataId)
    nodes.forEach((node) => {
      trigger(node.id, 'refresh', ...args)
    })
  }

  const dispatch: RuntimeContext['dispatch'] = (id, eventName, payload?: any) => {
    const node = getNode(id)
    if (!node) return console.warn(`节点不存在，id: ${id}`)

    const event = node.events?.find((event) => event.name === eventName)
    if (!event) return console.warn(`节点事件不存在，id: ${id}, eventName: ${eventName}`)
    // 如果事件有处理函数，则直接调用处理函数
    if (event.handler) {
      return event.handler(payload)
    }
  }

  return { getNode, setAttribute, setProp, setStyle, registerNodeInstance, trigger, refreshNodesByDataId, dispatch }
}
