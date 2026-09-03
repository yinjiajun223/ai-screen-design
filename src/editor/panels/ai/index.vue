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
    </header>

    <MessageList class="ai-panel__messages" :messages="messages" />

    <footer class="ai-composer">
      <el-input v-model="message" type="textarea" :rows="3" resize="none" placeholder="输入你的设计需求…" />
      <el-button class="ai-composer__send" type="primary">
        <span>发送</span>
        <Icon icon="fluent:send-20-filled" />
      </el-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import MessageList from './components/MessageList.vue'

interface Message {
  id: string
  type: 'human' | 'ai'
  text: string
}

defineOptions({
  name: 'AiPanel',
})

const message = ref('')
const messages = ref<Message[]>([
  { type: 'human', text: '你好', id: crypto.randomUUID() },
  { type: 'ai', text: '你好，我是AI助手，请问有什么可以帮您的吗？', id: crypto.randomUUID() },
])
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
