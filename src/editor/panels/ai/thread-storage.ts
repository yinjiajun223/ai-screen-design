const THREAD_ID_KEY = 'ai_screen_design_thread_id'

export const getThreadId = () => {
  return localStorage.getItem(THREAD_ID_KEY)
}

export const setThreadId = (threadId: string) => {
  localStorage.setItem(THREAD_ID_KEY, threadId)
}

export const clearThreadId = () => {
  localStorage.removeItem(THREAD_ID_KEY)
}
