<template>
  <a-modal
    v-model:open="open"
    title="视频尺寸"
    :footer="null"
    width="420px"
    class="video-size-modal"
    @cancel="onCancel"
  >
    <div class="video-size-modal-content">
      <div class="aspect-ratio-buttons">
        <button
          v-for="ratioOption in ratioOptions"
          :key="ratioOption"
          :class="['aspect-ratio-btn', { active: currentRatio === ratioOption }]"
          @click="onSelect(ratioOption)"
        >
          <div class="aspect-ratio-icon" :class="getAspectRatioClass(ratioOption)">
            <div class="ratio-box"></div>
          </div>
          <span class="aspect-ratio-text">{{ ratioOption }}</span>
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Props
const props = defineProps<{
  ratioOptions: any
  currentRatio: string
}>()

// Emits
const emits = defineEmits<{
  confirm: [ratio: string]
}>()

// 弹框显示状态
const open = ref(false)

/**
 * 获取宽高比图标类名
 * @param ratio
 */
const getAspectRatioClass = (ratio: string) => {
  const parts = ratio.split(':').map(Number)
  const w = parts[0] || 1
  const h = parts[1] || 1
  if (w === h) return 'square'
  if (w > h) return 'landscape'
  return 'portrait'
}

/**
 * 选择视频尺寸比例
 */
const onSelect = (ratioOption: string) => {
  emits('confirm', ratioOption)
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
:deep(.video-size-modal) {
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

.video-size-modal-content {
  padding: 0;
}

.aspect-ratio-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.aspect-ratio-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: #722ed1;
    background: rgba(114, 46, 209, 0.05);

    @media (prefers-color-scheme: dark) {
      background: rgba(179, 127, 235, 0.1);
      border-color: #b37feb;
    }
  }

  &.active {
    border-color: #722ed1;
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(114, 46, 209, 0.1);

    @media (prefers-color-scheme: dark) {
      background: #1f1f24;
      border-color: #b37feb;
      box-shadow: 0 0 0 2px rgba(179, 127, 235, 0.2);
    }
  }
}

.aspect-ratio-icon {
  width: 32px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  .ratio-box {
    border: 1.5px dashed #722ed1;
    border-radius: 2px;
    transition: all 0.2s ease;

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
    }
  }

  &.square .ratio-box {
    width: 20px;
    height: 20px;
  }

  &.landscape .ratio-box {
    width: 24px;
    height: 16px;
  }

  &.portrait .ratio-box {
    width: 16px;
    height: 24px;
  }
}

.aspect-ratio-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}
</style>
