<template>
  <el-popover placement="bottom-end" :width="260" trigger="click" popper-class="theme-settings-popover">
    <template #reference>
      <button class="theme-settings__trigger" title="主题设置" type="button" aria-label="打开主题设置">
        <Icon icon="fluent:paint-brush-20-regular" />
      </button>
    </template>

    <div class="theme-settings">
      <header class="theme-settings__header">
        <div>
          <h3>界面主题</h3>
          <p>调整编辑器外观与强调色</p>
        </div>
        <button title="恢复默认主题" type="button" aria-label="恢复默认主题" @click="themeStore.resetTheme">
          <Icon icon="fluent:arrow-reset-20-regular" />
        </button>
      </header>

      <section class="theme-settings__section">
        <span class="theme-settings__label">外观</span>
        <div class="theme-settings__modes">
          <button
            v-for="option in themeModeOptions"
            :key="option.value"
            :class="{ active: mode === option.value }"
            :aria-pressed="mode === option.value"
            type="button"
            @click="themeStore.setMode(option.value)"
          >
            <Icon :icon="option.icon" />
            <span>{{ option.label }}</span>
          </button>
        </div>
      </section>

      <section class="theme-settings__section">
        <span class="theme-settings__label">强调色</span>
        <div class="theme-settings__accents">
          <button
            v-for="option in themeAccentOptions"
            :key="option.value"
            :class="{ active: accent === option.value }"
            :title="option.label"
            :aria-label="option.label"
            :aria-pressed="accent === option.value"
            type="button"
            @click="themeStore.setAccent(option.value)"
          >
            <span :style="{ backgroundColor: option.color }"></span>
          </button>
        </div>
      </section>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { themeAccentOptions, themeModeOptions, useThemeStore } from '@/stores/theme'

defineOptions({
  name: 'ThemeSettings',
})

const themeStore = useThemeStore()
const { mode, accent } = storeToRefs(themeStore)
</script>

<style lang="scss" scoped>
.theme-settings__trigger {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  padding: 0;
  color: var(--editor-accent);
  line-height: 1;
  background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-control));
  border: 1px solid color-mix(in srgb, var(--editor-accent) 28%, var(--editor-border));
  border-radius: 4px;
  cursor: pointer;
  transition: 150ms ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: var(--editor-text);
    background: var(--editor-control-hover);
    border-color: var(--editor-border-hover);
  }

  &:focus-visible {
    outline: 2px solid var(--editor-accent);
    outline-offset: 2px;
  }
}

.theme-settings {
  color: var(--editor-text);
}

.theme-settings__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--editor-border);

  h3,
  p {
    margin: 0;
  }

  h3 {
    font-size: 13px;
    font-weight: 600;
  }

  p {
    margin-top: 3px;
    color: var(--editor-text-muted);
    font-size: 11px;
  }

  button {
    display: grid;
    width: 26px;
    height: 26px;
    place-items: center;
    padding: 0;
    color: var(--editor-text-muted);
    background: transparent;
    border: 0;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      color: var(--editor-accent);
      background: var(--editor-control-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--editor-accent);
      outline-offset: 1px;
    }

    svg {
      width: 15px;
      height: 15px;
    }
  }
}

.theme-settings__section {
  margin-top: 14px;
}

.theme-settings__label {
  display: block;
  margin-bottom: 8px;
  color: var(--editor-text-muted);
  font-size: 11px;
  font-weight: 500;
}

.theme-settings__modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;

  button {
    display: flex;
    height: 58px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0;
    color: var(--editor-text-muted);
    font-size: 11px;
    background: var(--editor-control);
    border: 1px solid var(--editor-border);
    border-radius: 7px;
    cursor: pointer;
    transition: 150ms ease;

    &:hover {
      color: var(--editor-text);
      background: var(--editor-control-hover);
      border-color: var(--editor-border-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--editor-accent);
      outline-offset: 1px;
    }

    &.active {
      color: var(--editor-accent);
      background: color-mix(in srgb, var(--editor-accent) 10%, var(--editor-control));
      border-color: var(--editor-accent);
    }

    svg {
      width: 17px;
      height: 17px;
    }
  }
}

.theme-settings__accents {
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    padding: 0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 50%;
    cursor: pointer;

    &:hover,
    &.active {
      background: var(--editor-control);
      border-color: var(--editor-border-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--editor-accent);
      outline-offset: 1px;
    }

    &.active {
      box-shadow: inset 0 0 0 2px var(--editor-panel);
    }

    span {
      width: 22px;
      height: 22px;
      border: 2px solid color-mix(in srgb, var(--editor-text) 18%, transparent);
      border-radius: 50%;
    }
  }
}

:global(.theme-settings-popover.el-popper) {
  padding: 14px;
  background: var(--editor-panel);
  border-color: var(--editor-border);
  box-shadow: 0 18px 48px rgb(0 0 0 / 28%);
}

:global(.theme-settings-popover.el-popper .el-popper__arrow::before) {
  background: var(--editor-panel);
  border-color: var(--editor-border);
}
</style>
