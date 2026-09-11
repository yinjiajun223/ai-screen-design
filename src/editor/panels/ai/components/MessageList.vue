<template>
  <div class="message-container">
    <div
      v-for="(message, index) in visibleMessages"
      :key="message.id ?? index"
      class="message-box"
      :class="`message-box--${message.type}`"
    >
      <el-avatar class="message-avatar" :size="28">
        {{ message.type === 'human' ? '我' : 'AI' }}
      </el-avatar>

      <div class="message-main">
        <span class="message-author">{{ message.type === 'human' ? '你' : 'AI 助手' }}</span>
        <div class="message-content">
          <span v-if="loading && message.type === 'ai' && !message.text" class="message-loading" aria-label="正在生成回复">
            <i></i>
            <i></i>
            <i></i>
          </span>
          <template v-else>
            <MarkdownRender
              v-if="message.text"
              :render-code-blocks-as-pre="false"
              :code-block-props="codeBlockProps"
              :content="message.text"
              mode="chat"
              html-policy="escape"
              :final="true"
            />
            <span v-else class="typing">...</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UseStreamResult } from '@langchain/vue'
import MarkdownRender from 'markstream-vue'
import 'markstream-vue/index.css'

type StreamMessages = UseStreamResult['messages']['value']

const codeBlockProps = {
  showCopyButton: true,
  monacoOptions: {
    MAX_HEIGHT: 280,
    fontSize: 12,
    lineHeight: 18,
  },
}

defineOptions({
  name: 'MessageList',
})

const props = defineProps<{
  messages: StreamMessages
  loading: boolean
}>()

const visibleMessages = computed(() => {
  const lastIndex = props.messages.length - 1

  return props.messages.filter((message, index) => {
    // 最后一条消息如果是 AI 消息且正在加载，则显示 loading 状态
    return message.text || (index === lastIndex && props.loading)
  })
})
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 18px;
  padding: 18px 14px 24px;
}

.message-box {
  display: flex;
  align-items: flex-start;
  gap: 9px;

  &--human {
    flex-direction: row-reverse;

    .message-main {
      align-items: flex-end;
    }

    .message-avatar {
      color: var(--editor-accent-contrast);
      background: var(--editor-accent);
    }

    .message-content {
      color: var(--editor-accent-contrast);
      background: var(--editor-accent);
      border-color: var(--editor-accent);
      border-radius: 12px 3px 12px 12px;

      &::selection {
        color: var(--editor-panel);
        background: color-mix(in srgb, var(--editor-text) 82%, transparent);
      }
    }
  }

  &--ai {
    .message-avatar {
      color: var(--editor-accent);
      background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-control));
      border: 1px solid color-mix(in srgb, var(--editor-accent) 30%, var(--editor-border));
    }

    .message-content {
      color: var(--editor-text);
      background: var(--editor-control);
      border-radius: 3px 12px 12px;
    }
  }
}

.message-avatar {
  flex: none;
  font-size: 11px;
  font-weight: 600;
}

.message-main {
  display: flex;
  min-width: 0;
  max-width: calc(100% - 37px);
  flex-direction: column;
  gap: 5px;
}

.message-author {
  padding: 0 2px;
  color: var(--editor-text-muted);
  font-size: 11px;
  line-height: 1;
}

.message-content {
  padding: 9px 11px;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  user-select: text;
  white-space: pre-wrap;
  border: 1px solid var(--editor-border);

  &::selection {
    color: var(--editor-text);
    background: color-mix(in srgb, var(--editor-accent) 45%, transparent);
  }

  :deep(.markstream-vue) {
    min-width: 0;
    max-width: 100%;
    --ms-text-body: 13px;
    --ms-leading-body: 1.65;
    --ms-text-h1: 18px;
    --ms-text-h2: 16px;
    --ms-text-h3: 14px;
    --ms-text-h4: 13px;
    --ms-text-h5: 13px;
    --ms-text-h6: 13px;
    --ms-text-label: 11px;
    --ms-flow-paragraph-y: 0.65em;
    --ms-flow-list-y: 0.6em;
    --ms-flow-table-y: 0.8em;
    --ms-flow-codeblock-y: 0.8em;
    --ms-flow-blockquote-y: 0.8em;
    --ms-flow-heading-1-mb: 0.55em;
    --ms-flow-heading-2-mt: 1.1em;
    --ms-flow-heading-2-mb: 0.5em;
    --ms-flow-heading-3-mt: 0.9em;
    --ms-flow-heading-3-mb: 0.4em;
  }
}

.message-loading {
  display: inline-flex;
  height: 20px;
  align-items: center;
  gap: 4px;

  i {
    width: 5px;
    height: 5px;
    background: var(--editor-text-muted);
    border-radius: 50%;
    animation: message-loading 1.2s ease-in-out infinite;

    &:nth-child(2) {
      animation-delay: 150ms;
    }

    &:nth-child(3) {
      animation-delay: 300ms;
    }
  }
}

@keyframes message-loading {
  0%,
  60%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }

  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .message-loading i {
    animation: none;
  }
}
</style>
