<template>
  <a-input
    v-if="props.type === 'text'"
    v-model:value="internalValue"
    type="text"
    :placeholder="props.placeholder"
  />

  <a-select
    v-if="props.type === 'select'"
    v-model:value="internalValue"
    :placeholder="props.placeholder"
  >
    <a-select-option
      v-for="(item, index) in props.options"
      :key="index"
      :label="item.label"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>

  <a-select
    v-if="props.type === 'tags'"
    v-model:value="tagValue"
    :placeholder="props.placeholder"
    mode="multiple"
    :max-tag-count="3"
  >
    <a-select-option
      v-for="(item, index) in props.options"
      :key="index"
      :label="item.label"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script setup>
// 声明事件
const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  // 接收 value
  value: {
    type: [String, Number, Array],
    default: ''
  },
  // input: 文本内容
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
})

// Internal state for two-way binding
const internalValue = ref(undefined)
const tagValue = ref([])

// Watch for changes in value prop
watch(
  () => props.value,
  (newValue) => {
    // 对于 select 类型，空值应该是 undefined 而不是 null，这样 placeholder 才会显示
    if (props.type === 'select') {
      internalValue.value =
        newValue === null || newValue === '' || newValue === undefined ? undefined : newValue
    } else if (props.type === 'tags') {
      tagValue.value = newValue || []
    } else {
      internalValue.value = newValue
    }
  },
  { immediate: true }
)

// Watch internalValue changes and emit to parent
watch(internalValue, (newValue) => {
  if (props.type !== 'tags') {
    emit('update:value', newValue)
    emit('change', newValue)
  }
})

// Watch tagValue changes and emit to parent
watch(tagValue, (newValue) => {
  if (props.type === 'tags') {
    emit('update:value', newValue)
    emit('change', newValue)
  }
})
</script>

<style lang="scss" scoped></style>
