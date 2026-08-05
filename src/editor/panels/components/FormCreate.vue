<template>
  <el-form class="p-20" size="small" label-width="60px">
    <el-row>
      <el-col v-for="setter in setters" :key="setter.key" :span="setter.span || 24">
        <el-form-item :label="setter.label">
          <!-- 组件 v-model 等价于 :model-value 绑定和 @update:model-value 监听；读取时调用 computed getter，更新时调用 setter -->
          <component
            :is="componentMap[setter.type]"
            :modelValue="getValue(formData, setter.key)"
            @update:modelValue="setValue(formData, setter.key, $event)"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { getValue, setValue } from '@/utils'
import { ElColorPicker, ElInput, ElInputNumber } from 'element-plus'
defineOptions({
  name: 'FormCreate',
})

defineProps(['setters', 'formData'])

const componentMap = {
  input: ElInput,
  number: (props, { slots }) => h(ElInputNumber, { precision: 0, ...props, slots }),
  color: ElColorPicker,
}
</script>
