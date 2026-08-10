<template>
  <div class="editor-contaienr" ref="editorRef"></div>
</template>

<script lang="ts" setup>
import { editor } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker.js?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker.js?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'

defineOptions({
  name: 'MonacoEditor',
})

// installHook.js:1 You must define a function MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker
window.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') return new JsonWorker()
    if (label === 'typescript' || label === 'javascript') return new TsWorker()

    return new EditorWorker()
  },
}
const props = defineProps<{ lang?: string }>()
const modeValue = defineModel<string>()
const editorRef = useTemplateRef<HTMLDivElement>('editorRef')

onMounted(() => {
  const instance = editor.create(editorRef.value, {
    value: modeValue.value,
    theme: 'vs-dark',
    tabSize: 2,
    fontSize: 14,
    language: props.lang || 'json',
    automaticLayout: true, // 自适应父节点的宽高
  })

  instance.onDidChangeModelContent(() => {
    modeValue.value = instance.getValue()
  })

  onBeforeUnmount(() => {
    instance.dispose()
  })
})
</script>

<style lang="scss" scoped>
.editor-contaienr {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>
