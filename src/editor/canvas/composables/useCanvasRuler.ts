import { useEditorStore } from '@/stores/editor'
import { useThemeStore } from '@/stores/theme'
import { debounce } from '@/utils'
import { storeToRefs } from 'pinia'
import type { PaletteType } from 'vue3-sketch-ruler'

export const useCanvasRuler = ({ moveableRef, canvasRootRef }) => {
  const editorStore = useEditorStore()
  const { canvas } = storeToRefs(editorStore)
  const { resolvedMode, accent } = storeToRefs(useThemeStore())

  const scale = ref(1)
  const rectWidth = ref(1000)
  const rectHeight = ref(800)
  const createPalette = () => {
    const rootStyle = getComputedStyle(document.documentElement)
    const themeColor = (name: string) => rootStyle.getPropertyValue(name).trim()

    return {
      bgColor: themeColor('--editor-panel'),
      longfgColor: themeColor('--editor-border'),
      fontColor: themeColor('--editor-text-muted'),
      fontShadowColor: themeColor('--editor-accent'),
      shadowColor: themeColor('--editor-control-hover'),
      lineColor: themeColor('--editor-accent'),
      lineType: 'solid',
      lockLineColor: themeColor('--editor-border-hover'),
      borderColor: themeColor('--editor-border'),
      hoverBg: themeColor('--editor-control-hover'),
      hoverColor: themeColor('--editor-text'),
    } satisfies PaletteType
  }
  const palette = shallowRef(createPalette())

  watch([resolvedMode, accent], () => {
    palette.value = createPalette()
  })
  const canvasWidth = computed(() => canvas.value.width)
  const canvasHeight = computed(() => canvas.value.height)
  const canvasStyle = computed(() => ({
    width: canvasWidth.value + 'px',
    height: canvasHeight.value + 'px',
    background: canvas.value.backgroundColor,
  }))
  const lines = ref({
    h: [],
    v: [],
  })

  onMounted(() => {
    const { width, height } = canvasRootRef.value.getBoundingClientRect()
    rectWidth.value = width
    rectHeight.value = height

    // 监听dom尺寸变化
    const ob = new ResizeObserver((entries) => {
      const entrie = entries[0]
      const rect = entrie.contentRect
      onRootResize(rect)
    })

    ob.observe(canvasRootRef.value)

    // TIPS: 生命周期里是可以套生命周期的
    onBeforeUnmount(() => {
      ob.disconnect()
    })
  })

  const onRootResize = debounce((rect) => {
    rectWidth.value = rect.width
    rectHeight.value = rect.height
  }, 300)

  const onZoomChange = () => {
    moveableRef.value.updateRect()
  }

  return {
    scale,
    rectWidth,
    rectHeight,
    canvasWidth,
    canvasHeight,
    canvasStyle,
    palette,
    lines,
    onZoomChange,
  }
}
