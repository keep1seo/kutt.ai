<template>
  <a-modal
    v-model:open="open"
    title="选择模型"
    :footer="null"
    width="420px"
    class="model-select-modal"
    @cancel="onCancel"
  >
    <div class="model-select-modal-content">
      <div
        v-for="(modelInfo, modelKey) in modelConfig"
        :key="modelKey"
        :class="['model-select-item', { active: currentModel === modelKey }]"
        @click="onSelect(modelKey)"
      >
        <div
          v-if="!modelInfo.logo"
          :class="[
            'model-select-icon-placeholder',
            `model-icon-${String(modelKey).replace(/\./g, '-')}`
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7"></polygon>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </div>
        <img v-else :src="modelInfo.logo" :alt="modelInfo.name" class="model-select-logo" />
        <div class="model-select-content">
          <div class="model-select-name">{{ modelInfo.name }}</div>
          <div class="model-select-desc">{{ modelInfo.desc }}</div>
        </div>
        <div v-if="currentModel === modelKey" class="model-select-check">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// 模型信息类型
interface ModelInfo {
  name: string
  logo: string | null
  desc: string
}

// Props
const props = defineProps<{
  modelConfig: Record<string, ModelInfo>
  currentModel: string
}>()

// Emits
const emits = defineEmits<{
  confirm: [modelKey: string]
}>()

// 弹框显示状态
const open = ref(false)

/**
 * 选择模型
 */
const onSelect = (modelKey: string) => {
  emits('confirm', modelKey)
  open.value = false
}

/**
 * 关闭弹框
 */
const onCancel = () => {
  open.value = false
}

/**
 * 显示弹框
 */
const onShow = () => {
  open.value = true
}

// 暴露方法供父组件调用
defineExpose({
  onShow
})
</script>

<style lang="scss" scoped>
:deep(.model-select-modal) {
  .ant-modal-header {
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 24px;

    @media (prefers-color-scheme: dark) {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }

  .ant-modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;

    @media (prefers-color-scheme: dark) {
      color: #f1f5f9;
    }
  }

  .ant-modal-body {
    padding: 24px;
  }
}

.model-select-modal-content {
  padding: 0;
}

.model-select-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  position: relative;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: #722ed1;
    background: rgba(114, 46, 209, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(114, 46, 209, 0.15);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      background: rgba(179, 127, 235, 0.1);
      box-shadow: 0 4px 12px rgba(179, 127, 235, 0.2);
    }
  }

  &.active {
    border-color: #722ed1;
    background: rgba(114, 46, 209, 0.1);
    box-shadow: 0 0 0 2px rgba(114, 46, 209, 0.15);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      background: rgba(179, 127, 235, 0.15);
      box-shadow: 0 0 0 2px rgba(179, 127, 235, 0.25);
    }
  }
}

.model-select-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba(114, 46, 209, 0.05);
  padding: 8px;

  @media (prefers-color-scheme: dark) {
    background: rgba(179, 127, 235, 0.1);
  }
}

.model-select-icon-placeholder {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }

  &.model-icon-wan2-6 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.model-icon-seedance1-0pro {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &.model-icon-seedance1-5pro {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &.model-icon-kutt {
    background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
    color: #333;

    @media (prefers-color-scheme: dark) {
      color: #fff;
    }
  }

  .model-select-item:hover & {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .model-select-item.active & {
    box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.3);

    @media (prefers-color-scheme: dark) {
      box-shadow: 0 0 0 3px rgba(179, 127, 235, 0.4);
    }
  }
}

.model-select-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-select-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.model-select-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.model-select-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #722ed1;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
  }

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>

