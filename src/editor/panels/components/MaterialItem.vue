<template>
  <div class="material-item" draggable="true" @dragstart="onStart">
    <div class="title">{{ material.name }}</div>
    <div class="icon" :style="{ color: material.iconColor }"><Icon :icon="material.icon" /></div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'MaterialItem',
})

const props = defineProps(['material'])

const onStart = (e: DragEvent) => {
  e.dataTransfer.setData('schema', JSON.stringify(props.material.schema))
}
</script>

<style scoped lang="scss">
.material-item {
  display: flex;
  flex-direction: column;
  flex: 0 0 108px;
  gap: 8px;
  padding: 10px;
  background: var(--editor-control);
  border: 1px solid var(--editor-border);
  border-radius: 8px;
  cursor: grab;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;

  .title {
    color: var(--editor-text);
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    transition: color 150ms ease;
  }

  .icon {
    display: grid;
    flex: 1;
    min-height: 0;
    place-items: center;
    color: var(--editor-text-muted);
    background: var(--editor-canvas);
    border-radius: 6px;
    transition:
      color 150ms ease,
      background-color 150ms ease;

    > svg {
      width: 48px;
      height: 48px;
    }
  }

  &:hover {
    background: color-mix(in srgb, var(--editor-accent) 8%, var(--editor-control-hover));
    border-color: var(--editor-border-hover);
    box-shadow: 0 8px 20px rgb(0 0 0 / 24%);
    transform: translateY(-2px);

    .title,
    .icon {
      color: var(--editor-accent);
    }

    .icon {
      background: color-mix(in srgb, var(--editor-accent) 6%, var(--editor-canvas));
    }
  }

  &:active {
    cursor: grabbing;
    background: color-mix(in srgb, var(--editor-accent) 12%, var(--editor-control));
    border-color: var(--editor-accent);
    box-shadow: 0 3px 10px rgb(0 0 0 / 20%);
    transform: translateY(0) scale(0.98);
  }
}
</style>
