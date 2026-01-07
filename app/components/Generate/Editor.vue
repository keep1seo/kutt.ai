<template>
  <!--编辑器-->
  <div
    class="editor-container"
    :class="{ 'editor-collapsed': isEditorCollapsed, 'editor-inline': inline }"
  >
    <!-- 收起状态：显示展开按钮（内联模式不显示） -->
    <button
      v-if="isEditorCollapsed && !inline"
      class="editor-collapsed-btn"
      @click="isEditorCollapsed = false"
    >
      <div class="editor-collapsed-btn-content">
        <div class="editor-collapsed-icon-wrapper">
          <UpOutlined class="editor-collapsed-icon" />
        </div>
        <span class="editor-collapsed-text">智能编辑器</span>
      </div>
      <div class="editor-collapsed-btn-shine"></div>
    </button>
    <!-- 展开状态：显示完整编辑器 -->
    <div v-else class="editor-wrapper">
      <div class="editor-header">
        <ClientOnly>
          <a-tabs
            v-model:activeKey="activeKey"
            class="editor-tabs"
            :tab-bar-style="{
              margin: 0,
              background: '#ffffff',
              padding: '0 12px',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px'
            }"
            :more-icon="null"
          >
            <a-tab-pane key="video">
              <template #tab>
                <span class="editor-tab-item">
                  <VideoCameraOutlined class="editor-tab-icon" />
                  <span>视频生成</span>
                </span>
              </template>
            </a-tab-pane>
            <a-tab-pane key="image">
              <template #tab>
                <span class="editor-tab-item">
                  <PictureOutlined class="editor-tab-icon" />
                  <span>图片生成</span>
                </span>
              </template>
            </a-tab-pane>
            <a-tab-pane key="digital">
              <template #tab>
                <span class="editor-tab-item">
                  <UserOutlined class="editor-tab-icon" />
                  <span>数字人</span>
                </span>
              </template>
            </a-tab-pane>
            <a-tab-pane key="action">
              <template #tab>
                <span class="editor-tab-item">
                  <ThunderboltOutlined class="editor-tab-icon" />
                  <span>动作模仿</span>
                </span>
              </template>
            </a-tab-pane>
          </a-tabs>
        </ClientOnly>
        <button
          v-if="!inline"
          class="editor-collapse-btn editor-collapse-btn-desktop"
          @click="isEditorCollapsed = true"
          title="收起编辑器"
        >
          <DownOutlined class="editor-collapse-icon" />
        </button>
      </div>
      <div class="editor-content">
        <div class="editor-content-inner" :class="{ 'loading-overlay': regenerateLoading }">
          <component
            :is="currentComponent"
            ref="generateComponentRef"
            @generateSuccess="onGenerateSuccess"
          />
          <div v-if="regenerateLoading" class="loading-mask">
            <LoadingOutlined spin class="loading-icon" />
            <div class="loading-text">正在加载表单数据...</div>
          </div>
        </div>
        <button
          v-if="!inline"
          class="editor-collapse-btn editor-collapse-btn-mobile"
          @click="isEditorCollapsed = true"
          title="收起编辑器"
        >
          <DownOutlined class="editor-collapse-icon" />
          <span class="editor-collapse-text">收起</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import {
  VideoCameraOutlined,
  PictureOutlined,
  UserOutlined,
  ThunderboltOutlined,
  LoadingOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons-vue'
import VideoGenerate from '~/components/Generate/Generate/VideoGenerate.vue'
import ImageGenerate from '~/components/Generate/Generate/ImageGenerate.vue'
import DigitalGenerate from '~/components/Generate/Generate/DigitalGenerate.vue'
import ActionGenerate from '~/components/Generate/Generate/ActionGenerate.vue'
import { useEditorStore } from '~/stores/useEditorStore'

interface Props {
  initialActiveKey?: 'video' | 'image' | 'digital' | 'action'
  initialCollapsed?: boolean
  inline?: boolean // 是否使用内联模式（非悬浮）
}

const props = withDefaults(defineProps<Props>(), {
  initialActiveKey: 'video',
  initialCollapsed: true,
  inline: false
})

const emit = defineEmits<{
  generateSuccess: [item: any]
  activeKeyChange: [key: string]
}>()

// 编辑器 store
const editorStore = useEditorStore()

// 初始化 activeKey（如果 store 中没有值，使用 props 的初始值）
if (!editorStore.activeKey) {
  editorStore.setActiveKey(props.initialActiveKey)
}

// state
const activeKey = computed({
  get: () => editorStore.activeKey,
  set: (value) => editorStore.setActiveKey(value)
})
const regenerateLoading = ref(false)
// 内联模式默认展开，否则使用传入的 initialCollapsed
const isEditorCollapsed = ref(props.inline ? false : props.initialCollapsed)

const componentMap = {
  video: VideoGenerate,
  image: ImageGenerate,
  digital: DigitalGenerate,
  action: ActionGenerate
}

const currentComponent = computed(() => {
  // @ts-ignore
  return componentMap[activeKey.value] || DigitalGenerate
})

// 生成组件引用
const generateComponentRef = ref<any>(null)

// 监听 activeKey 变化
watch(activeKey, (newKey) => {
  emit('activeKeyChange', newKey)
})

/**
 * 创建任务成功
 * @param item
 */
const onGenerateSuccess = (item: any) => {
  emit('generateSuccess', item)
}

/**
 * 填充表单数据（供父组件调用）
 */
const fillForm = async (params: any) => {
  if (generateComponentRef.value?.fillForm && params) {
    regenerateLoading.value = true
    try {
      await generateComponentRef.value.fillForm(params)
    } catch (error) {
      console.error('填充表单数据失败:', error)
    } finally {
      regenerateLoading.value = false
    }
  }
}

/**
 * 切换到指定tab并填充表单（供父组件调用）
 */
const switchTabAndFillForm = async (
  tabKey: 'video' | 'image' | 'digital' | 'action',
  params: any
) => {
  activeKey.value = tabKey
  await nextTick()
  await fillForm(params)
}

// 暴露方法给父组件
defineExpose({
  fillForm,
  switchTabAndFillForm,
  activeKey,
  generateComponentRef
})
</script>

<style lang="scss" scoped>
.editor-container {
  position: fixed;
  bottom: 24px;
  left: calc(50% + var(--mantine-navbar-width, 0px) / 2);
  transform: translateX(-50%);
  width: 100dvw;
  max-height: 384px;
  z-index: 100;
  transition:
    left 300ms ease,
    max-height 300ms ease;
  padding: 0 16px;

  @media (min-width: 768px) {
    width: 760px;
    padding: 0;
  }

  @media (max-width: 767px) {
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    max-height: 70vh;
    padding: 0;
    border-radius: 0;
  }

  &.editor-collapsed {
    max-height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 24px;

    @media (max-width: 767px) {
      bottom: 16px;
      padding-bottom: 16px;
    }
  }

  &.editor-inline {
    position: static !important;
    transform: none !important;
    width: 100% !important;
    max-width: 1200px !important;
    max-height: none !important;
    z-index: auto !important;
    left: auto !important;
    bottom: auto !important;
    right: auto !important;
    padding: 0 20px !important;
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 0 40px !important;
      margin-top: 20px;
      margin-bottom: 40px;
    }

    @media (max-width: 767px) {
      padding: 0 16px !important;
      margin-top: 8px;
      margin-bottom: 24px;
    }

    &.editor-collapsed {
      padding-bottom: 0 !important;
    }
  }
}

.editor-wrapper {
  width: 100%;
  margin: 0 auto;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  max-width: 800px;
  transition: max-width 300ms ease-in-out;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow:
    0 4px 20px rgba(114, 46, 209, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background: #1b1b20;
    border-color: rgba(229, 231, 235, 0.1);
  }

  @media (max-width: 767px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    box-shadow:
      0 -4px 20px rgba(114, 46, 209, 0.08),
      0 -1px 3px rgba(0, 0, 0, 0.05);
  }

  .editor-inline & {
    border-radius: 12px;

    @media (max-width: 767px) {
      border-radius: 12px;
      border-left: 1px solid #e5e7eb;
      border-right: 1px solid #e5e7eb;
      box-shadow:
        0 4px 20px rgba(114, 46, 209, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.05);
    }
  }
}

.editor-header {
  position: relative;
  display: flex;
  align-items: center;
}

.editor-collapse-btn {
  border: none;
  cursor: pointer;
  transition: all 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.editor-collapse-btn-desktop {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    background: rgba(114, 46, 209, 0.08);
    border-radius: 6px;
    z-index: 10;

    &:hover {
      background: rgba(114, 46, 209, 0.12);
      transform: translateY(-50%) scale(1.05);
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }

    @media (prefers-color-scheme: dark) {
      background: rgba(179, 127, 235, 0.1);

      &:hover {
        background: rgba(179, 127, 235, 0.15);
      }
    }

    @media (max-width: 767px) {
      display: none;
    }
  }

  &.editor-collapse-btn-mobile {
    display: none;
    width: 100%;
    padding: 12px 16px;
    background: rgba(114, 46, 209, 0.08);
    border-top: 1px solid #e5e7eb;
    border-radius: 0;

    &:hover {
      background: rgba(114, 46, 209, 0.12);
    }

    &:active {
      background: rgba(114, 46, 209, 0.15);
    }

    @media (prefers-color-scheme: dark) {
      background: rgba(179, 127, 235, 0.1);
      border-top-color: rgba(229, 231, 235, 0.1);

      &:hover {
        background: rgba(179, 127, 235, 0.15);
      }
    }

    @media (max-width: 767px) {
      display: flex;
    }
  }
}

.editor-collapse-icon {
  font-size: 14px;
  color: #722ed1;
  transition: color 200ms;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
  }
}

.editor-collapse-text {
  font-size: 14px;
  font-weight: 500;
  color: #722ed1;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
  }
}

.editor-collapsed-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 25%, #8b5cf6 50%, #a855f7 75%, #ec4899 100%);
  border: none;
  border-radius: 28px;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(59, 130, 246, 0.3),
    0 2px 8px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 300ms ease;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 8px 24px rgba(59, 130, 246, 0.4),
      0 4px 12px rgba(139, 92, 246, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.35);
    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 25%, #7c3aed 50%, #9333ea 75%, #db2777 100%);

    &::before {
      opacity: 1;
    }

    .editor-collapsed-icon-wrapper {
      transform: translateY(-2px);
    }

    .editor-collapsed-icon {
      animation: bounce 0.6s ease infinite;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 
      0 2px 8px rgba(59, 130, 246, 0.35),
      inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 767px) {
    border-radius: 24px;
  }
}

.editor-collapsed-btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  z-index: 2;

  @media (max-width: 767px) {
    padding: 12px 24px;
    gap: 8px;
  }
}

.editor-collapsed-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.editor-collapsed-icon {
  font-size: 16px;
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
  transition: transform 300ms ease;

  @media (max-width: 767px) {
    font-size: 14px;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.editor-collapsed-text {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  position: relative;

  @media (max-width: 767px) {
    font-size: 14px;
  }
}

.editor-collapsed-btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  z-index: 1;
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

.editor-tabs {
  width: 100%;

  @media (max-width: 767px) {
    width: 100%;

    :deep(.ant-tabs-nav) {
      margin: 0;
      background: #ffffff;
      padding: 12px 16px 0;
      border-radius: 0;
      overflow: hidden;

      @media (max-width: 767px) {
        padding: 10px 12px 0;
      }

      @media (prefers-color-scheme: dark) {
        background: #1b1b20;
      }
    }

    :deep(.ant-tabs-nav-wrap) {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
      scroll-behavior: smooth;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar-track {
        display: none;
      }

      &::-webkit-scrollbar-thumb {
        display: none;
      }
    }

    :deep(.ant-tabs-nav-list) {
      display: flex;
      flex-wrap: nowrap;
      transition: transform 0.3s ease;
      gap: 8px;
    }

    :deep(.ant-tabs-tab) {
      padding: 10px 16px;
      margin: 0 6px 0 0;
      min-width: 90px;
      width: auto;
      flex-shrink: 0;
      height: 48px;
      border-bottom: 2px solid transparent;
      transition: all 200ms;
      border-radius: 8px 8px 0 0;
      white-space: nowrap;

      @media (max-width: 767px) {
        padding: 8px 12px;
        min-width: 70px;
        height: 40px;
        margin: 0 4px 0 0;
      }

      &.ant-tabs-tab-active {
        border-bottom-color: #722ed1;
        background: rgba(114, 46, 209, 0.08);

        @media (prefers-color-scheme: dark) {
          border-bottom-color: #b37feb;
          background: rgba(179, 127, 235, 0.1);
        }
      }

      &:active {
        background: rgba(114, 46, 209, 0.12);

        @media (prefers-color-scheme: dark) {
          background: rgba(179, 127, 235, 0.15);
        }
      }
    }

    :deep(.ant-tabs-ink-bar) {
      display: none;
    }
  }

  :deep(.ant-tabs-nav) {
    margin: 0;
    background: #ffffff;
    border-top-left-radius: 12px;

    @media (prefers-color-scheme: dark) {
      background: #1b1b20;
    }
  }

  :deep(.ant-tabs-tab) {
    color: #64748b;
    font-weight: 500;
    transition: all 200ms;
    border-bottom: 2px solid transparent;
    padding-bottom: 12px;

    &:hover {
      color: #722ed1;
    }

    &.ant-tabs-tab-active {
      border-bottom-color: #722ed1;

      .ant-tabs-tab-btn {
        color: #722ed1;
      }
    }

    @media (prefers-color-scheme: dark) {
      color: #a0a0ab;

      &:hover {
        color: #b37feb;
      }

      &.ant-tabs-tab-active {
        border-bottom-color: #b37feb;

        .ant-tabs-tab-btn {
          color: #b37feb;
        }
      }
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-content-holder) {
    display: none;
  }
}

.editor-tab-item {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 14px;

  @media (max-width: 767px) {
    gap: 0;
    font-size: 13px;
  }
}

.editor-tab-icon {
  font-size: 16px;
  width: 16px;
  height: 16px;

  @media (max-width: 767px) {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }
}

.editor-content {
  display: flex;
  flex-direction: column;
  transition: opacity 300ms ease-in-out;
}

.editor-content-inner {
  display: flex;
  flex-direction: column;
  transition: opacity 300ms ease-in-out;
  width: 100%;
  margin: 0 auto;
  z-index: 50;
  position: relative;

  &.loading-overlay {
    pointer-events: none;
  }
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  border-radius: 12px;
  backdrop-filter: blur(2px);

  @media (prefers-color-scheme: dark) {
    background: rgba(27, 27, 32, 0.95);
  }

  @media (max-width: 767px) {
    border-radius: 0;
  }
}

.loading-icon {
  font-size: 32px;
  color: #722ed1;
  margin-bottom: 12px;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
  }
}

.loading-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}
</style>
