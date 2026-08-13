import type { PageSchema } from '@/schema/page'

/**
 * @description: 发布操作
 * @function: publish
 * @param {PageSchema} page 页面数据
 * @return {void}
 */
const SCREEN_PUBLISH = 'screen_publish'

/**
 * 存储结构
 * {
 * '123': JSON.stringify(page),
 * '456': JSON.stringify(page)
 * }
 *
 */

export const publish = (page: PageSchema) => {
  let value: string | Record<string, PageSchema> = localStorage.getItem(SCREEN_PUBLISH)
  if (value) {
    // 如果存在数据，则将其解析为对象
    value = JSON.parse(value)
  } else {
    value = {}
  }

  // 如果页面没有 id，则生成一个随机 id 如果 id 存在 则使用现有的 id 相当于编辑
  const id = page.id || crypto.randomUUID()
  value[id] = page
  page.id = id

  localStorage.setItem(SCREEN_PUBLISH, JSON.stringify(value))
  return id
}

export const getPublishPage = (id: string): PageSchema => {
  const value = localStorage.getItem(SCREEN_PUBLISH)
  const map = JSON.parse(value)
  const page = map[id]
  if (!page) {
    throw new Error('未找到发布数据')
  }

  return page
}
