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
  const _target = getValue(target, keys.join('.'))
  _target[lastKey] = value
}
