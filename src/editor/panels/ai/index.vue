<template>
  <div class="ai-panel">
    <header class="ai-panel__header">
      <div class="ai-panel__mark">
        <Icon icon="fluent:sparkle-20-filled" />
      </div>
      <div>
        <h2>AI 助手</h2>
        <p>描述你想创建或调整的画面</p>
      </div>
      <button class="ai-panel__delete" type="button" @click="onDelete">删除</button>
    </header>

    <div ref="messagesContainer" class="ai-panel__messages" @scroll.passive="onMessagesScroll">
      <MessageList :messages="messages" :loading="isLoading" />
    </div>

    <footer class="ai-composer">
      <el-input
        v-model="message"
        type="textarea"
        :rows="3"
        resize="none"
        placeholder="输入你的设计需求…"
        @keydown.enter="onKeydown"
      />
      <el-button v-if="!isLoading" class="ai-composer__send" type="primary" @click="onSubmit()">
        <span>发送</span>
        <Icon icon="fluent:send-20-filled" />
      </el-button>

      <el-button v-else class="ai-composer__send" type="danger" @click="onStop()">
        <span>停止</span>
        <Icon icon="fluent:stop-20-filled" />
      </el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useStream } from '@langchain/vue'
import MessageList from './components/MessageList.vue'
import { clearThreadId, getThreadId, setThreadId } from './thread-storage'

defineOptions({
  name: 'AiPanel',
})

const message = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const shouldAutoScroll = ref(true)
const activeThreadId = ref(getThreadId())
let messagesResizeObserver: ResizeObserver | undefined

const BOTTOM_THRESHOLD = 4

const { messages, submit, stop, isLoading, client } = useStream({
  apiUrl: 'http://localhost:2024',
  assistantId: 'screen_design_agent',
  // transport: 'websocket', // 默认 SSE
  threadId: activeThreadId,
  onThreadId: (threadId) => {
    setThreadId(threadId)
  },
})

const onSubmit = async () => {
  if (isLoading.value || !message.value.trim()) return

  scrollToBottom()

  submit({
    messages: [{ type: 'human', content: message.value }],
  })

  message.value = ''
}

const onStop = async () => {
  await stop()
}

const onDelete = async () => {
  const id = getThreadId()
  await client.threads.delete(id)
  clearThreadId()
  location.reload()
}

const onKeydown = (event: KeyboardEvent) => {
  // 这里主要解决在输入法状态下按下回车键时触发提交的问题
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return

  event.preventDefault()
  onSubmit()
}

const scrollToBottom = () => {
  if (!shouldAutoScroll.value || !messagesContainer.value) return

  messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
}

const onMessagesScroll = () => {
  if (!messagesContainer.value) return

  const { scrollHeight, scrollTop, clientHeight } = messagesContainer.value
  shouldAutoScroll.value = scrollHeight - scrollTop - clientHeight <= BOTTOM_THRESHOLD
}

onMounted(() => {
  if (!messagesContainer.value) return

  messagesResizeObserver = new ResizeObserver(scrollToBottom)
  messagesResizeObserver.observe(messagesContainer.value)

  if (messagesContainer.value.firstElementChild) {
    messagesResizeObserver.observe(messagesContainer.value.firstElementChild)
  }

  scrollToBottom()
})

onBeforeUnmount(() => {
  messagesResizeObserver?.disconnect()
})

watch(messages, async (value) => {
  console.log('value', value)
})
</script>

<style lang="scss" scoped>
.ai-panel {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  background: var(--editor-panel);
}

.ai-panel__header {
  display: flex;
  min-height: 64px;
  flex: none;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border-bottom: 1px solid var(--editor-border);

  h2,
  p {
    margin: 0;
  }

  h2 {
    color: var(--editor-text);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    margin-top: 2px;
    color: var(--editor-text-muted);
    font-size: 11px;
    line-height: 1.4;
  }
}

.ai-panel__mark {
  display: grid;
  width: 30px;
  height: 30px;
  flex: none;
  place-items: center;
  color: var(--editor-accent);
  background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-control));
  border: 1px solid color-mix(in srgb, var(--editor-accent) 28%, var(--editor-border));
  border-radius: 9px;

  svg {
    width: 16px;
    height: 16px;
  }
}

.ai-panel__delete {
  display: inline-flex;
  height: 28px;
  flex: none;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  padding: 0 10px;
  color: var(--el-color-danger);
  font-size: 12px;
  background: color-mix(in srgb, var(--el-color-danger) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-color-danger) 30%, transparent);
  border-radius: 6px;
  cursor: pointer;
  transition:
    color 150ms ease,
    background 150ms ease,
    border-color 150ms ease;

  &:not(:disabled):hover {
    color: var(--el-color-white, #fff);
    background: var(--el-color-danger);
    border-color: var(--el-color-danger);
  }

  &:not(:disabled):active {
    opacity: 0.85;
  }

  &:focus-visible {
    outline: 2px solid var(--el-color-danger);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
}

.ai-panel__messages {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.ai-composer {
  display: flex;
  flex: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 14px 14px;
  background: color-mix(in srgb, var(--editor-panel) 88%, var(--editor-control));
  border-top: 1px solid var(--editor-border);

  :deep(.el-textarea__inner) {
    min-height: 76px !important;
    padding: 10px 11px;
    color: var(--editor-text);
    font-size: 13px;
    line-height: 1.55;
    background: var(--editor-control);
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px var(--editor-border);
    transition:
      box-shadow 150ms ease,
      background 150ms ease;

    &::placeholder {
      color: color-mix(in srgb, var(--editor-text-muted) 72%, transparent);
    }

    &:hover {
      background: var(--editor-control-hover);
    }

    &:focus {
      background: var(--editor-control);
      box-shadow: inset 0 0 0 1px var(--editor-accent);
    }
  }
}

.ai-composer__send {
  min-width: 78px;
  height: 32px;
  gap: 6px;
  margin: 0;
  border-radius: 7px;

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
