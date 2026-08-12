// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (fn: Function, delay: number) => {
  let timer: number | null = null
  return function (this: any, ...args: any[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * const obj = { props: { content: 'Hello World' }, style: { color: '#fff' } }
 * getValue(obj, 'props.content') => 'Hello World'
 * getValue(obj, 'style.color') => '#fff'
 * getValue(obj, 'style.fontSize') => undefined
 */
export const getValue = (target: Record<string, any>, key: string) => {
  const keys = key.split('.')
  while (keys.length) {
    const key = keys.shift()
    target = target[key as string]
  }
  return target
}

/**
 * setValue(obj, 'props.content', 'Hello World')
 * setValue(obj, 'style.color', '#fff')
 * setValue(obj, 'style.fontSize', '16px')
 */
export const setValue = (target: Record<string, any>, key: string, value: any) => {
  const keys = key.split('.')
  const lastKey = keys.pop()
  if (keys.length) {
    target = getValue(target, keys.join('.'))
  }
  target[lastKey as string] = value
}

export const deepClone = <T>(value: T): T => {
  // 拦截基础类型
  if (value === null || typeof value !== 'object') return value

  return JSON.parse(JSON.stringify(value))
}
