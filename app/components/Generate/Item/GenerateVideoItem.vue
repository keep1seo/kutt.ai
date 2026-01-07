<template>
  <div class="generate-result-item">
    <p class="generate-result-prompt">{{ item?.request_params?.prompt || item?.tool_name }}</p>
    <div class="generate-result-video">
      <VideoPlayer :url="item.result" :poster="item?.request_params?.portrait_image" />
    </div>
    <div class="generate-result-meta">
      <span class="generate-result-tag">{{ item?.tool_name }}</span>
      <!--模型-->
      <span v-if="item?.request_params?.model" class="generate-result-param-tag">
        <AppstoreOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.model }}
      </span>
      <!--编辑图-->
      <span v-if="item?.request_params?.image" class="generate-result-image-tag">
        <a-image
          :src="item?.request_params?.image"
          alt="编辑图"
          :preview="{
            src: item?.request_params?.image
          }"
          :width="48"
          :height="24"
        />
      </span>
      <!--视频时长-->
      <span v-if="item?.request_params?.duration" class="generate-result-param-tag">
        <ClockCircleOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.duration }}s
      </span>
      <!--视频比例-->
      <span v-if="item?.request_params?.ratio" class="generate-result-param-tag">
        <TabletOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.ratio }}
      </span>
      <!--分辨率-->
      <span v-if="item?.request_params?.resolution" class="generate-result-param-tag">
        <DesktopOutlined class="generate-result-param-icon" />
        {{ item?.request_params?.resolution }}
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
      <a-button class="generate-action-btn" @click.stop="showDownloadModal = true">
        <template #icon><DownloadOutlined /></template>
        下载
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
    <!--下载弹框-->
    <a-modal
      v-model:open="showDownloadModal"
      title="选择下载方式"
      :footer="null"
      :width="400"
      class="download-modal"
    >
      <div class="download-modal-content">
        <div class="download-option" @click="onDownload(true)">
          <div class="download-option-icon">💧</div>
          <div class="download-option-info">
            <div class="download-option-title">有水印</div>
            <div class="download-option-desc">下载带水印的视频文件</div>
          </div>
        </div>
        <div class="download-option" @click="onDownload(false)">
          <div class="download-option-icon">✨</div>
          <div class="download-option-info">
            <div class="download-option-title">无水印</div>
            <div class="download-option-desc">下载无水印的高清视频文件</div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  DownloadOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
  TabletOutlined,
  DesktopOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { formatTimestamp } from '~/utils/tool'
import { createVNode } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { useGenerateApi } from '~/api/useGenerateApi'

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

// 下载弹框显示状态
const showDownloadModal = ref(false)

/**
 * 重新生成
 */
const onReGenerate = () => {
  emits('reGenerate', { ...props.item })
}

/**
 * 下载视频
 * @param withWatermark - 是否带水印
 */
const onDownload = (withWatermark: boolean) => {
  if (!props.item?.result) {
    return
  }

  const videoUrl = props.item.result
  const link = document.createElement('a')
  link.href = videoUrl
  link.download = `video_${withWatermark ? 'watermark' : 'no_watermark'}_${Date.now()}.mp4`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // 关闭弹框
  showDownloadModal.value = false
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
}

.generate-result-image-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  width: 48px;
  height: 24px;
  background: rgba(241, 245, 249, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 4px;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 30, 36, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 767px) {
    width: 36px;
    height: 20px;
    padding: 2px;
  }

  &:hover {
    border-color: rgba(114, 46, 209, 0.3);
    transform: scale(1.05);

    @media (prefers-color-scheme: dark) {
      border-color: rgba(179, 127, 235, 0.3);
    }
  }

  :deep(.ant-image) {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.ant-image-img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 2px;
    display: block;
  }

  :deep(.ant-image-mask) {
    border-radius: 2px;
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

// 下载 Modal 样式
:deep(.download-modal) {
  .ant-modal-header {
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    padding: 20px 24px;

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

  .ant-modal-close {
    color: #64748b;

    &:hover {
      color: #334155;
    }

    @media (prefers-color-scheme: dark) {
      color: #94a3b8;

      &:hover {
        color: #cbd5e1;
      }
    }
  }
}

.download-modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.download-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.2s ease;
  background: #ffffff;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: rgba(114, 46, 209, 0.3);
    background: rgba(114, 46, 209, 0.04);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(114, 46, 209, 0.1);

    @media (prefers-color-scheme: dark) {
      border-color: rgba(179, 127, 235, 0.3);
      background: rgba(179, 127, 235, 0.08);
      box-shadow: 0 4px 12px rgba(179, 127, 235, 0.15);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.download-option-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.download-option-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.download-option-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.download-option-desc {
  font-size: 13px;
  color: #64748b;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
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

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
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
