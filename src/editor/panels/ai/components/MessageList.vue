<template>
  <div class="message-container">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-box"
      :class="`message-box--${message.type}`"
    >
      <el-avatar class="message-avatar" :size="28">
        {{ message.type === 'human' ? '我' : 'AI' }}
      </el-avatar>

      <div class="message-main">
        <span class="message-author">{{ message.type === 'human' ? '你' : 'AI 助手' }}</span>
        <div class="message-content">{{ message.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Message {
  id: string
  type: 'human' | 'ai'
  text: string
}

defineOptions({
  name: 'MessageList',
})

defineProps<{
  messages: Message[]
}>()
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
}
</style>
