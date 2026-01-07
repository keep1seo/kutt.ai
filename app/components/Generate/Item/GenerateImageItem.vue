<template>
  <div class="generate-result-item">
    <p class="generate-result-prompt">{{ item?.request_params?.prompt || item?.tool_name }}</p>
    <div class="generate-result-image">
      <div class="ai-badge">
        <div class="ai-badge-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <span class="ai-badge-text">AI生成</span>
      </div>
      <!-- 加载占位符 -->
      <div v-if="imageLoading" class="image-loading-placeholder">
        <div class="loading-spinner">
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
            class="spinner-icon"
          >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>
        </div>
        <div class="loading-text">图片加载中...</div>
      </div>
      <!-- 隐藏的图片用于监听加载状态 -->
      <img
        v-if="item.result"
        :src="item.result"
        style="display: none"
        @load="onImageLoad"
        @error="onImageError"
      />
      <a-image
        v-show="!imageLoading"
        :src="item.result"
        :alt="item?.request_params?.prompt || '生成的图片'"
        :preview="{
          src: item.result
        }"
      />
    </div>
    <div class="generate-result-meta">
      <span class="generate-result-tag">{{ item?.tool_name }}</span>
      <!--模型-->
      <span v-if="item?.request_params?.model" class="generate-result-param-tag">
        <img
          v-if="modelLogo"
          :src="modelLogo"
          :alt="item?.request_params?.model || '模型'"
          class="generate-result-param-icon model-logo-icon"
        />
        <AppstoreOutlined v-else class="generate-result-param-icon" />
        {{ item?.request_params?.model }}
      </span>
      <!--宽度-->
      <span v-if="item?.request_params?.width" class="generate-result-param-tag">
        <ExpandOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.width }}
      </span>
      <!--高度-->
      <span v-if="item?.request_params?.height" class="generate-result-param-tag">
        <ArrowsAltOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.height }}
      </span>
      <a-popover trigger="click" placement="bottomLeft" overlay-class-name="detail-popover">
        <template #content>
          <div class="detail-popover-content">
            <div class="detail-popover-item">
              <span class="detail-popover-label">任务ID</span>
              <span class="detail-popover-value">{{ item?.task_id || '--' }}</span>
            </div>
            <div class="detail-popover-item">
              <span class="detail-popover-label">创建时间</span>
              <span class="detail-popover-value">{{ formatTimestamp(item?.createtime) }}</span>
            </div>
          </div>
        </template>
        <span class="generate-result-detail">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          详情信息
        </span>
      </a-popover>
    </div>
    <div class="generate-result-label">以上内容由AI生成</div>
    <!--操作按钮-->
    <div class="generate-result-actions">
      <a-button type="primary" class="generate-action-btn" @click.stop="onReGenerate">
        <template #icon><ReloadOutlined /></template>
        重新生成
      </a-button>
      <a-dropdown :trigger="['click']">
        <a-button class="generate-action-btn icon-only">
          <template #icon><EllipsisOutlined /></template>
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item key="delete" @click="onDelete">
              <template #icon><DeleteOutlined /></template>
              删除该批次结果
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  EllipsisOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  ExpandOutlined,
  ArrowsAltOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { formatTimestamp } from '~/utils/tool'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { useGenerateApi } from '~/api/useGenerateApi'
import fluxLogo from '~/assets/images/flux.svg'
import qwenLogo from '~/assets/images/qwen.svg'

/* Props */
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

/* Emits */
const emits = defineEmits(['reGenerate', 'delete'])

/* Api */
const generateApi = useGenerateApi()

/* 模型配置 */
const modelConfig: Record<string, any> = {
  flux: {
    name: 'Flux',
    logo: fluxLogo
  },
  'qwen-edit': {
    name: 'Qwen-Edit',
    logo: qwenLogo
  }
}

/* 当前模型 Logo */
const modelLogo = computed(() => {
  const model = props.item?.request_params?.model
  if (!model) return null
  return modelConfig[model]?.logo || null
})

/* 图片加载状态 */
const imageLoading = ref(true)

/**
 * 图片加载完成
 */
const onImageLoad = () => {
  imageLoading.value = false
}

/**
 * 图片加载错误
 */
const onImageError = () => {
  imageLoading.value = false
}

/**
 * 监听图片URL变化，重置加载状态
 */
watch(
  () => props.item?.result,
  () => {
    if (props.item?.result) {
      imageLoading.value = true
    }
  },
  { immediate: true }
)

/**
 * 重新生成
 */
const onReGenerate = () => {
  emits('reGenerate', { ...props.item })
}

/**
 * 删除该批次结果
 */
const onDelete = () => {
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定删除该批次结果吗？',
    onOk() {
      generateApi.taskDelete({ task_ids: props.item.id }).then((res) => {
        message.success('删除成功')
        emits('delete', { ...props.item })
      })
    },
    onCancel() {}
  })
}
</script>

<style lang="scss" scoped>
// 生成结果区域样式
.generate-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 420px; // 底部 padding 确保不被编辑器遮挡（编辑器最大高度384px + 间距）

  @media (max-width: 767px) {
    padding: 24px 16px calc(70vh + 40px); // 移动端使用视口高度 + 额外间距
  }
}

.generate-result-item {
  //margin-bottom: 48px;

  @media (max-width: 767px) {
    margin-bottom: 32px;
  }

  //&:last-child {
  //  margin-bottom: 0; // 移除额外的 margin，因为父容器已经有 padding
  //}
}

.generate-result-prompt {
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  margin: 0 0 12px 0;
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }

  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.generate-result-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 12px;

  @media (max-width: 767px) {
    gap: 6px;
  }
}

.generate-result-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #722ed1;
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(179, 127, 235, 0.1) 100%);
  border: 1px solid rgba(114, 46, 209, 0.2);
  border-radius: 6px;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
    background: linear-gradient(
      135deg,
      rgba(179, 127, 235, 0.15) 0%,
      rgba(114, 46, 209, 0.15) 100%
    );
    border-color: rgba(179, 127, 235, 0.25);
  }
}

.generate-result-detail {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #722ed1;
  }

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;

    &:hover {
      color: #b37feb;
    }
  }
}

// 详情 Popover 样式
:deep(.detail-popover) {
  .ant-popover-inner {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (prefers-color-scheme: dark) {
      background: #1f1f24;
    }
  }
}

.detail-popover-content {
  min-width: 200px;
  padding: 8px 0;
}

.detail-popover-item {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 6px 12px;
}

.detail-popover-label {
  font-size: 13px;
  color: #64748b;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.detail-popover-value {
  font-size: 13px;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.model-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.generate-result-param-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 500;
  color: #475569;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 4px;
  white-space: nowrap;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
    background: rgba(30, 30, 36, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 767px) {
    font-size: 10px;
    padding: 2px 6px;
    gap: 3px;
  }
}

.generate-result-param-icon {
  font-size: 11px;
  color: inherit;
  opacity: 0.7;
  flex-shrink: 0;

  @media (max-width: 767px) {
    font-size: 10px;
  }

  &.model-logo-icon {
    width: 12px;
    height: 12px;
    opacity: 1;
    object-fit: contain;

    @media (max-width: 767px) {
      width: 10px;
      height: 10px;
    }
  }
}

.generate-result-image {
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (prefers-color-scheme: dark) {
    background: #000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 767px) {
    max-width: 100%;
  }

  :deep(.ant-image) {
    width: 100%;
    display: block;
  }

  :deep(.ant-image-img) {
    width: 100%;
    max-width: 360px;
    max-height: 280px;
    height: auto;
    display: block;
    object-fit: contain;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s ease;

    @media (max-width: 767px) {
      max-width: 100%;
      max-height: 240px;
    }

    &:hover {
      transform: scale(1.02);
    }
  }
}

// 图片加载占位符
.image-loading-placeholder {
  width: 100%;
  max-width: 360px;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  @media (max-width: 767px) {
    max-width: 100%;
    height: 240px;
  }
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  color: #b37feb;
}

.spinner-icon {
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

// AI生成标识
.ai-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  animation: badgeFadeIn 0.4s ease-out;
  transition: all 0.2s ease;

  @media (max-width: 767px) {
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    gap: 4px;
  }
}

.ai-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b37feb;

  svg {
    width: 12px;
    height: 12px;
    filter: drop-shadow(0 0 4px rgba(179, 127, 235, 0.4));

    @media (max-width: 767px) {
      width: 10px;
      height: 10px;
    }
  }
}

.ai-badge-text {
  font-size: 11px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.3px;
  white-space: nowrap;
  opacity: 0.95;

  @media (max-width: 767px) {
    font-size: 10px;
  }
}

@keyframes badgeFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.generate-result-images {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #f1f5f9;
  padding: 1px;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: #f1f5f9;
    padding: 1px;

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  img {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    background: #f8fafc;

    @media (prefers-color-scheme: dark) {
      background: #1e1e24;
    }

    @media (max-width: 767px) {
      border-radius: 0;
    }

    &:hover {
      transform: scale(1.05);
      z-index: 1;
      position: relative;
    }
  }
}

.generate-result-label {
  font-size: 11px;
  color: #94a3b8;
  text-align: left;
  margin: 12px 0 16px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }

  @media (max-width: 767px) {
    font-size: 10px;
    margin: 8px 0 12px;
  }
}

.generate-result-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  margin-top: 16px;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    margin-top: 12px;
  }
}

.generate-action-btn {
  border-radius: 10px;
  font-weight: 500;
  font-size: 13px;
  height: 36px;
  padding: 0 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  &:not(.ant-btn-primary) {
    background: rgba(0, 0, 0, 0.04);
    color: #475569;

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
    }

    &:hover {
      background: rgba(114, 46, 209, 0.1);
      color: #722ed1;
      transform: translateY(-1px);

      @media (prefers-color-scheme: dark) {
        background: rgba(179, 127, 235, 0.15);
        color: #b37feb;
      }
    }
  }

  &.ant-btn-primary {
    background: #722ed1;
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(114, 46, 209, 0.25);

    &:hover {
      background: #531dab;
      box-shadow: 0 4px 16px rgba(114, 46, 209, 0.35);
      transform: translateY(-2px);
    }

    @media (prefers-color-scheme: dark) {
      background: #b37feb;

      &:hover {
        background: #9d6dd9;
      }
    }
  }

  // 只有图标时调整 padding
  &:has(.anticon:only-child),
  &.icon-only {
    padding: 0 12px !important;
    width: 36px !important;
    min-width: 36px !important;
    max-width: 36px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  // 确保所有状态下都保持尺寸
  &.icon-only,
  &.icon-only:focus,
  &.icon-only:active,
  &.icon-only:focus-visible,
  &.icon-only:hover {
    width: 36px !important;
    min-width: 36px !important;
    max-width: 36px !important;
    padding: 0 12px !important;
  }
}
</style>
