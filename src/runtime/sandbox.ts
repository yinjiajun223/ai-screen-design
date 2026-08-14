/**
 * 在沙箱中运行代码
 * @param scope
 */

const globayKey = new Set(['console', 'Promise'])

export const runSandBox = (code: string, scope: Record<string, any>) => {
  /**
   * 全局白名单 表示沙箱环境中可以访问的全局变量
   */

  const sandbox = new Proxy(scope, {
    has(_, _key) {
      return true
    },
    get(target, key) {
      if (key === Symbol.unscopables) return

      if (Object.hasOwn(target, key)) {
        // 访问沙箱对象中的属性
        return target[key as string]
      }

      if (globayKey.has(key as string)) {
        // 当前属性不属于沙箱自身，但已被全局白名单允许，因此从真实的全局对象中取值。
        // 例如：console 会得到全局 console 对象，Promise 会得到全局 Promise 构造函数。
        const value = globalThis[key]

        // 某些全局方法依赖调用时的 this 指向。若直接返回函数，沙箱中的调用会与
        // globalThis 脱离，浏览器可能抛出 Illegal invocation。这里将函数绑定回
        // globalThis，以保留原始调用上下文；对象、字符串等非函数值则直接返回。
        return typeof value === 'function' ? value.bind(globalThis) : value
      }
    },
  })

  const fn = new Function(
    'sandbox',
    `
      const asyncFn = async () => {
        with (sandbox) {
          ${code}
        }
      }

      asyncFn()
    `,
  )

  fn(sandbox)
}
