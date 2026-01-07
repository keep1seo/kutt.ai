<template>
  <div class="editor-input-area">
    <div class="editor-input-row">
      <!--上传相关的-->
      <div class="editor-input-controls">
        <!-- 首帧上传 -->
        <div>
          <div class="editor-upload-btn-wrapper">
            <input
              ref="firstFrameInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleFirstFrameFile"
            />
            <!-- 上传按钮 -->
            <button
              v-if="!firstFramePreview"
              class="editor-upload-btn editor-upload-btn-role"
              @click="uploadFirstFrame"
            >
              <div class="editor-upload-badge">首帧</div>
              <div class="editor-upload-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="editor-upload-icon"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="editor-upload-text">首帧</span>
              </div>
            </button>
            <!-- 图片预览 -->
            <div v-else class="editor-upload-preview">
              <img :src="firstFramePreview" alt="首帧预览" class="editor-upload-preview-image" />
              <button class="editor-upload-remove-btn" @click="removeFirstFrame" title="移除">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 6L6 18M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- 尾帧上传 -->
        <div v-if="['seedance1.0pro', 'seedance1.5pro'].includes(model)">
          <div class="editor-upload-btn-wrapper">
            <input
              ref="lastFrameInput"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleLastFrameFile"
            />
            <!-- 上传按钮 -->
            <button
              v-if="!lastFramePreview"
              class="editor-upload-btn editor-upload-btn-role"
              @click="uploadLastFrame"
            >
              <div class="editor-upload-badge">尾帧</div>
              <div class="editor-upload-content">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="editor-upload-icon"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span class="editor-upload-text">尾帧</span>
              </div>
            </button>
            <!-- 图片预览 -->
            <div v-else class="editor-upload-preview">
              <img :src="lastFramePreview" alt="尾帧预览" class="editor-upload-preview-image" />
              <button class="editor-upload-remove-btn" @click="removeLastFrame" title="移除">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 6L6 18M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- 视频特效 -->
        <div v-if="model === 'kutt'" class="video-effect-wrapper" @click="onShowVideoEffect">
          <div class="video-effect-container">
            <video
              ref="effectVideoRef"
              class="video-effect-preview"
              :src="effectVideoSrc"
              muted
              loop
              playsinline
              autoplay
              @mouseenter="playEffectVideo"
              @mouseleave="pauseEffectVideo"
            ></video>
            <div class="video-effect-overlay">
              <div class="video-effect-icon">
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <div class="video-effect-label">{{ effectId ? '已选' : '添加特效' }}</div>
            </div>
            <!-- 移除按钮 -->
            <button
              v-if="effectId"
              class="video-effect-remove-btn"
              @click.stop="removeEffect"
              title="移除特效"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 6L6 18M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!--模式词-->
      <div v-if="!(model === 'kutt' && effectId)" class="editor-textarea-wrapper">
        <div class="editor-textarea-container">
          <div class="editor-textarea-row">
            <textarea
              v-model.trim="prompt"
              placeholder="请输入描述词"
              class="editor-textarea"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="editor-actions">
      <div class="editor-actions-left">
        <div class="editor-actions-buttons">
          <!-- 模型选择 model: wan2.6、seedance1.0pro、seedance1.5pro、kutt -->
          <div class="editor-action-btn" @click="modelSelectDialogRef?.onShow()">
            <img
              v-if="currentModelInfo.logo"
              :src="currentModelInfo.logo"
              :alt="currentModelInfo.name"
              class="editor-model-logo"
            />
            <span class="editor-action-text">{{ currentModelInfo.name }}</span>
            <i
              class="liblibfont icon-border_down editor-action-icon-text"
              style="color: inherit; font-size: 12px"
            ></i>
          </div>
          <!-- 是否固定摄像头：camera_fixed -->
          <div
            v-if="['seedance1.0pro', 'seedance1.5pro'].includes(model)"
            class="editor-action-btn editor-action-btn-toggle"
            :class="{ 'editor-action-btn-active': cameraFixed }"
            @click="cameraFixed = !cameraFixed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="editor-action-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="editor-action-text">固定摄像头</span>
            <svg
              v-if="cameraFixed"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="editor-action-check-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <!-- 开启prompt：prompt_extend -->
          <div
            v-if="model === 'wan2.6'"
            class="editor-action-btn editor-action-btn-toggle"
            :class="{ 'editor-action-btn-active': promptExtend }"
            @click="promptExtend = !promptExtend"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="editor-action-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span class="editor-action-text">开启prompt</span>
            <svg
              v-if="promptExtend"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="editor-action-check-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <!-- 视频尺寸 -->
          <div v-if="showVideoSize" class="editor-action-btn" @click="videoSizeDialogRef?.onShow()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="editor-action-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="editor-action-text">视频尺寸 {{ ratio }}</span>
            <i
              class="liblibfont icon-border_down editor-action-icon-text"
              style="color: inherit; font-size: 12px"
            ></i>
          </div>
          <!-- 分辨率 -->
          <a-dropdown
            v-if="showResolution"
            :trigger="['click']"
            placement="topLeft"
            overlay-class-name="resolution-dropdown"
          >
            <div class="editor-action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                class="icon-border_down editor-action-icon"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M6 14.666h4c3.333 0 4.667-1.333 4.667-4.666V6c0-3.334-1.334-4.667-4.667-4.667H6C2.667 1.333 1.333 2.666 1.333 6v4c0 3.333 1.334 4.666 4.667 4.666"
                ></path>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 6.667V4H9.333M4 9.333V12h2.667"
                ></path>
              </svg>
              <span class="editor-action-text">分辨率 {{ resolution }}</span>
              <i
                class="liblibfont icon-border_down editor-action-icon-text"
                style="color: inherit; font-size: 12px"
              ></i>
            </div>
            <template #overlay>
              <a-menu @click="selectResolution">
                <a-menu-item v-for="item in resolutionList" :key="item">{{ item }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 视频时长 -->
          <a-dropdown
            v-if="showDuration"
            :trigger="['click']"
            placement="topLeft"
            overlay-class-name="duration-dropdown"
          >
            <div class="editor-action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="editor-action-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span class="editor-action-text">视频时长 {{ duration }}s</span>
              <i
                class="liblibfont icon-border_down editor-action-icon-text"
                style="color: inherit; font-size: 12px"
              ></i>
            </div>
            <template #overlay>
              <a-menu @click="selectDuration">
                <a-menu-item v-for="item in durationList" :key="item">{{ item }}秒</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <div class="editor-actions-right">
        <div class="editor-generate-btn-wrapper">
          <a-button class="editor-generate-btn" :loading="loading" @click.stop="onGenerate">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              class="editor-generate-send-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            <span class="editor-generate-points">{{ requiredPoints || 0 }}</span>
          </a-button>
          <span class="editor-generate-badge">积分3折</span>
        </div>
      </div>
    </div>
  </div>
  <!-- 视频特效弹框 -->
  <VideoEffectDialog ref="videoEffectDialogRef" @confirm="onSelectEffect" />
  <!-- 模型选择弹框 -->
  <ModelSelectDialog
    ref="modelSelectDialogRef"
    :model-config="modelConfig"
    :current-model="model"
    @confirm="onSelectModel"
  />
  <!-- 视频尺寸弹框 -->
  <VideoSizeDialog
    ref="videoSizeDialogRef"
    :ratio-options="videoRateList"
    :current-ratio="ratio"
    @confirm="onSelectRatio"
  />
</template>

<script setup lang="ts">
import { nextTick, watch, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useGenerateApi } from '~/api/useGenerateApi'
import { useEditorStore } from '~/stores/useEditorStore'
import VideoEffectDialog from './components/VideoGenerate/VideoEffectDialog.vue'
import ModelSelectDialog from './components/VideoGenerate/ModelSelectDialog.vue'
import VideoSizeDialog from './components/VideoGenerate/VideoSizeDialog.vue'

/* Emits */
const emits = defineEmits(['generateSuccess'])

/* Api */
const generateApi = useGenerateApi()

/* Store */
const editorStore = useEditorStore()

/* Ref */
const videoEffectDialogRef = ref<InstanceType<typeof VideoEffectDialog>>()
const modelSelectDialogRef = ref<InstanceType<typeof ModelSelectDialog>>()
const videoSizeDialogRef = ref<InstanceType<typeof VideoSizeDialog>>()

// loading
const loading = ref(false)
// 首帧文件输入框引用
const firstFrameInput = ref<HTMLInputElement | null>(null)
// 首帧文件对象
const firstFrameFile = ref<File | null>(null)
// 首帧图片预览 URL
const firstFramePreview = ref<string | null>(null)
// 尾帧文件输入框引用
const lastFrameInput = ref<HTMLInputElement | null>(null)
// 尾帧文件对象
const lastFrameFile = ref<File | null>(null)
// 尾帧图片预览 URL
const lastFramePreview = ref<string | null>(null)
// 原图文件输入框引用
const originalImageInput = ref<HTMLInputElement | null>(null)
// 原图文件对象
const originalImageFile = ref<File | null>(null)
// 原图图片预览 URL
const originalImagePreview = ref<string | null>(null)
// 描述词
const prompt = ref('')
// 是否固定摄像头
const cameraFixed = ref(false)
// 开启prompt
const promptExtend = ref(false)
// 视频尺寸比例
const ratio = ref('1:1')
// 选中的分辨率
const resolution = ref('720P')
// 选中的视频时长
const duration = ref(5)
// 特效视频路径
const effectVideoSrc = ref('/video/effect.mp4')
// 特效Id
const effectId = ref('')
// 特效视频引用
const effectVideoRef = ref<HTMLVideoElement | null>(null)
// 选中的模型
const model = ref('kutt')
// 选中的类型
const type = ref('1')
// 所需积分
const requiredPoints = ref(0)

// 模型信息配置
const modelConfig = {
  'wan2.6': {
    name: 'Wan 2.6',
    logo: null as string | null,
    desc: 'Wan 2.6 视频生成模型'
  },
  'seedance1.0pro': {
    name: 'Seedance 1.0 Pro',
    logo: null as string | null,
    desc: 'Seedance 1.0 Pro 视频生成模型'
  },
  'seedance1.5pro': {
    name: 'Seedance 1.5 Pro',
    logo: null as string | null,
    desc: 'Seedance 1.5 Pro 视频生成模型'
  },
  kutt: {
    name: 'Kutt',
    logo: null as string | null,
    desc: 'Kutt 视频生成模型'
  }
}

// 当前模型信息
const currentModelInfo = computed(() => {
  return modelConfig[model.value as keyof typeof modelConfig] || modelConfig['kutt']
})

// 显示视频尺寸选项
const showVideoSize = computed(() => {
  if (model.value === 'wan2.6' && firstFrameFile.value) {
    return false
  }
  if (model.value === 'kutt' && effectId.value) {
    return false
  }
  return true
})

// 显示分辨率选项
const showResolution = computed(() => {
  if (model.value === 'kutt' && effectId.value) {
    return false
  }
  return true
})

// 显示视频时长
const showDuration = computed(() => {
  if (model.value === 'kutt' && effectId.value) {
    return false
  }
  return true
})

// 分辨率下拉框
const resolutionList = computed(() => {
  // wan2.6
  if (model.value === 'wan2.6') {
    return ['720P', '1080P']
  }
  // seedance1.0pro
  if (model.value === 'seedance1.0pro') {
    return ['480P', '720P']
  }
  // seedance1.5pro
  if (model.value === 'seedance1.5pro') {
    return ['480P', '720P', '1080P']
  }
  // kutt
  if (model.value === 'kutt') {
    return ['480P', '720P']
  }
})

// 时长下拉框
const durationList = computed(() => {
  // wan2.6
  if (model.value === 'wan2.6') {
    return [5, 10, 15]
  }
  // seedance1.0pro
  if (model.value === 'seedance1.0pro') {
    return [5, 10, 12]
  }
  // seedance1.5pro
  if (model.value === 'seedance1.5pro') {
    return [5, 10, 12]
  }
  // kutt
  if (model.value === 'kutt') {
    return [5]
  }
})

// 视频尺寸下拉框
const videoRateList = computed(() => {
  // wan2.6
  if (model.value === 'wan2.6') {
    if (firstFrameFile.value) {
      return []
    } else {
      return ['1:1', '3:4', '4:3', '9:16', '16:9']
    }
  }
  // seedance1.0pro
  if (model.value === 'seedance1.0pro') {
    if (!firstFrameFile.value && !lastFrameFile.value) {
      return ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9']
    } else {
      return ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9', 'adaptive']
    }
  }
  // seedance1.5pro
  if (model.value === 'seedance1.5pro') {
    if (!firstFrameFile.value && !lastFrameFile.value) {
      return ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9']
    } else {
      return ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9', 'adaptive']
    }
  }
  // kutt
  if (model.value === 'kutt') {
    if (firstFrameFile.value) {
      return ['1:1', '3:4', '4:3', '9:16', '16:9', 'adaptive']
    } else {
      return ['1:1', '3:4', '4:3', '9:16', '16:9']
    }
  }
  return []
})

// ==================== Store 同步 ====================
// 是否正在从 store 恢复数据（避免循环更新）
const isRestoring = ref(false)

/**
 * 同步数据到 store
 */
const syncToStore = () => {
  if (isRestoring.value) return

  // 清理旧文件
  if (editorStore.video.firstFrameFileId && !firstFrameFile.value) {
    editorStore.removeFile(editorStore.video.firstFrameFileId)
  }
  if (editorStore.video.lastFrameFileId && !lastFrameFile.value) {
    editorStore.removeFile(editorStore.video.lastFrameFileId)
  }
  if (editorStore.video.originalImageFileId && !originalImageFile.value) {
    editorStore.removeFile(editorStore.video.originalImageFileId)
  }

  // 存储新文件
  let firstFrameFileId = editorStore.video.firstFrameFileId
  if (firstFrameFile.value) {
    const existingFile = editorStore.getFile(firstFrameFileId || '')
    if (!existingFile || existingFile !== firstFrameFile.value) {
      if (firstFrameFileId) editorStore.removeFile(firstFrameFileId)
      firstFrameFileId = editorStore.storeFile(firstFrameFile.value)
    }
  } else {
    firstFrameFileId = null
  }

  let lastFrameFileId = editorStore.video.lastFrameFileId
  if (lastFrameFile.value) {
    const existingFile = editorStore.getFile(lastFrameFileId || '')
    if (!existingFile || existingFile !== lastFrameFile.value) {
      if (lastFrameFileId) editorStore.removeFile(lastFrameFileId)
      lastFrameFileId = editorStore.storeFile(lastFrameFile.value)
    }
  } else {
    lastFrameFileId = null
  }

  let originalImageFileId = editorStore.video.originalImageFileId
  if (originalImageFile.value) {
    const existingFile = editorStore.getFile(originalImageFileId || '')
    if (!existingFile || existingFile !== originalImageFile.value) {
      if (originalImageFileId) editorStore.removeFile(originalImageFileId)
      originalImageFileId = editorStore.storeFile(originalImageFile.value)
    }
  } else {
    originalImageFileId = null
  }

  editorStore.updateVideoData({
    firstFrameFileId: firstFrameFileId,
    firstFramePreview: firstFramePreview.value,
    lastFrameFileId: lastFrameFileId,
    lastFramePreview: lastFramePreview.value,
    originalImageFileId: originalImageFileId,
    originalImagePreview: originalImagePreview.value,
    prompt: prompt.value,
    cameraFixed: cameraFixed.value,
    promptExtend: promptExtend.value,
    ratio: ratio.value,
    resolution: resolution.value,
    duration: duration.value,
    type: type.value,
    model: model.value,
    effectId: effectId.value,
    effectVideoSrc: effectVideoSrc.value
  })
}

/**
 * 从 store 恢复数据
 */
const restoreFromStore = () => {
  const storeData = editorStore.video

  isRestoring.value = true

  // 恢复普通字段
  prompt.value = storeData.prompt || ''
  cameraFixed.value = storeData.cameraFixed || false
  promptExtend.value = storeData.promptExtend || false
  ratio.value = storeData.ratio || '1:1'
  resolution.value = storeData.resolution || '720P'
  duration.value = storeData.duration || 5
  type.value = storeData.type || '1'
  model.value = storeData.model || 'kutt'
  effectId.value = storeData.effectId || ''
  effectVideoSrc.value = storeData.effectVideoSrc || '/video/effect.mp4'

  // 恢复文件
  if (storeData.firstFrameFileId) {
    const file = editorStore.getFile(storeData.firstFrameFileId)
    if (file) {
      firstFrameFile.value = file
      if (storeData.firstFramePreview) {
        firstFramePreview.value = storeData.firstFramePreview
      } else if (file.type.startsWith('image/')) {
        firstFramePreview.value = URL.createObjectURL(file)
      }
    }
  }

  if (storeData.lastFrameFileId) {
    const file = editorStore.getFile(storeData.lastFrameFileId)
    if (file) {
      lastFrameFile.value = file
      if (storeData.lastFramePreview) {
        lastFramePreview.value = storeData.lastFramePreview
      } else if (file.type.startsWith('image/')) {
        lastFramePreview.value = URL.createObjectURL(file)
      }
    }
  }

  if (storeData.originalImageFileId) {
    const file = editorStore.getFile(storeData.originalImageFileId)
    if (file) {
      originalImageFile.value = file
      if (storeData.originalImagePreview) {
        originalImagePreview.value = storeData.originalImagePreview
      } else if (file.type.startsWith('image/')) {
        originalImagePreview.value = URL.createObjectURL(file)
      }
    }
  }

  isRestoring.value = false
}

// 监听数据变化，自动同步到 store（防抖）
let syncTimer: ReturnType<typeof setTimeout> | null = null
const debouncedSync = () => {
  if (isRestoring.value) return
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    syncToStore()
  }, 300)
}

watch([prompt, cameraFixed, promptExtend, ratio, resolution, duration, type, model, effectId, effectVideoSrc], debouncedSync)
watch([firstFrameFile, lastFrameFile, originalImageFile, firstFramePreview, lastFramePreview, originalImagePreview], debouncedSync, { deep: true })

// 监听数据变化，获取所需积分（防抖）
let pointsTimer: ReturnType<typeof setTimeout> | null = null
const debouncedFetchPoints = () => {
  if (isRestoring.value) return // 正在恢复时不获取积分
  if (pointsTimer) clearTimeout(pointsTimer)
  pointsTimer = setTimeout(() => {
    fetchRequiredPoints()
  }, 500) // 500ms 防抖，避免频繁请求
}

watch([prompt, cameraFixed, promptExtend, ratio, resolution, duration, model, effectId], debouncedFetchPoints)
watch([firstFrameFile, lastFrameFile], debouncedFetchPoints, { deep: true })

// 组件挂载时从 store 恢复数据
onMounted(() => {
  restoreFromStore()
  // 恢复数据后获取积分
  fetchRequiredPoints()
})

// ==================== 选项相关 ====================
/**
 * 选择模型
 * @param modelKey
 */
const onSelectModel = (modelKey: string) => {
  // 清除首帧文件
  if (firstFramePreview.value) {
    URL.revokeObjectURL(firstFramePreview.value)
  }
  firstFramePreview.value = null
  firstFrameFile.value = null
  if (firstFrameInput.value) {
    firstFrameInput.value.value = ''
  }

  // 清除尾帧文件
  if (lastFramePreview.value) {
    URL.revokeObjectURL(lastFramePreview.value)
  }
  lastFramePreview.value = null
  lastFrameFile.value = null
  if (lastFrameInput.value) {
    lastFrameInput.value.value = ''
  }

  // 重置参数为默认值
  prompt.value = ''
  cameraFixed.value = false
  promptExtend.value = false
  ratio.value = '1:1'
  effectId.value = ''
  effectVideoSrc.value = '/video/effect.mp4'
  resolution.value = '720P'
  duration.value = 5

  // 切换模型
  model.value = modelKey
}

/**
 * 选择视频尺寸比例
 * @param ratioOption
 */
const onSelectRatio = (ratioOption: string) => {
  ratio.value = ratioOption
}

// ==================== 分辨率相关 ====================
/**
 * 选择分辨率
 * @param info - 菜单项信息，包含选中的 key
 */
const selectResolution = (info: { key: string | number }) => {
  resolution.value = String(info.key)
}

// ==================== 时长相关 ====================
/**
 * 选择视频时长
 * @param info - 菜单项信息，包含选中的 key
 */
const selectDuration = (info: { key: string | number }) => {
  duration.value = Number(info.key)
}

// ==================== 视频特效相关 ====================
/**
 * 播放特效视频（鼠标悬停）
 */
const playEffectVideo = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement
  if (video) {
    video.play().catch(() => {
      // 忽略自动播放错误
    })
  }
}

/**
 * 暂停特效视频（鼠标离开）
 */
const pauseEffectVideo = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement
  if (video) {
    video.pause()
    video.currentTime = 0
  }
}

// ==================== 首帧/尾帧文件上传相关 ====================
/**
 * 触发首帧文件选择对话框
 */
const uploadFirstFrame = () => {
  firstFrameInput.value?.click()
}

/**
 * 处理首帧文件选择
 * @param event - 文件输入变化事件
 */
const handleFirstFrameFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    firstFrameFile.value = file
    // 为图片文件创建预览 URL
    if (file.type.startsWith('image/')) {
      firstFramePreview.value = URL.createObjectURL(file)
    }
    console.log('选择的首帧文件:', file.name, file.type)
  }
}

/**
 * 移除首帧文件
 */
const removeFirstFrame = () => {
  if (firstFramePreview.value) {
    URL.revokeObjectURL(firstFramePreview.value)
  }
  firstFramePreview.value = null
  firstFrameFile.value = null
  if (firstFrameInput.value) {
    firstFrameInput.value.value = ''
  }
}

/**
 * 触发尾帧文件选择对话框
 */
const uploadLastFrame = () => {
  lastFrameInput.value?.click()
}

/**
 * 处理尾帧文件选择
 * @param event - 文件输入变化事件
 */
const handleLastFrameFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    lastFrameFile.value = file
    // 为图片文件创建预览 URL
    if (file.type.startsWith('image/')) {
      lastFramePreview.value = URL.createObjectURL(file)
    }
    console.log('选择的尾帧文件:', file.name, file.type)
  }
}

/**
 * 移除尾帧文件
 */
const removeLastFrame = () => {
  if (lastFramePreview.value) {
    URL.revokeObjectURL(lastFramePreview.value)
  }
  lastFramePreview.value = null
  lastFrameFile.value = null
  if (lastFrameInput.value) {
    lastFrameInput.value.value = ''
  }
}

/**
 * 从URL获取文件并转换为File对象
 * @param url - 文件URL
 * @param fileName - 文件名
 * @returns Promise<File | null>
 */
const urlToFile = async (url: string, fileName: string): Promise<File | null> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('获取文件失败:', response.statusText)
      return null
    }
    const blob = await response.blob()
    return new File([blob], fileName, { type: blob.type })
  } catch (error) {
    console.error('转换文件失败:', error)
    return null
  }
}

/**
 * 填充表单数据（用于重新生成）
 * @param params - 请求参数对象（包含提交给接口的所有参数）
 */
const fillForm = async (params: any) => {
  if (!params) return

  // 先清空所有文件，确保替换生效
  if (firstFramePreview.value) {
    URL.revokeObjectURL(firstFramePreview.value)
    firstFramePreview.value = null
  }
  firstFrameFile.value = null
  if (firstFrameInput.value) {
    firstFrameInput.value.value = ''
  }
  if (lastFramePreview.value) {
    URL.revokeObjectURL(lastFramePreview.value)
    lastFramePreview.value = null
  }
  lastFrameFile.value = null
  if (lastFrameInput.value) {
    lastFrameInput.value.value = ''
  }
  if (originalImagePreview.value) {
    URL.revokeObjectURL(originalImagePreview.value)
    originalImagePreview.value = null
  }
  originalImageFile.value = null
  if (originalImageInput.value) {
    originalImageInput.value.value = ''
  }

  // 填充普通字段
  if (params.prompt !== undefined) {
    prompt.value = params.prompt || ''
  }
  if (params.camera_fixed !== undefined) {
    cameraFixed.value = params.camera_fixed === true || params.camera_fixed === 'true'
  }
  if (params.prompt_extend !== undefined) {
    promptExtend.value = params.prompt_extend === true || params.prompt_extend === 'true'
  }
  if (params.ratio !== undefined) {
    ratio.value = params.ratio || '1:1'
  }
  if (params.resolution !== undefined) {
    resolution.value = params.resolution || '480P'
  }
  if (params.duration !== undefined) {
    // 如果 duration 是字符串（如 "5秒"），提取数字；如果是数字，直接使用
    const durationValue = params.duration
    if (typeof durationValue === 'string') {
      const numMatch = durationValue.match(/\d+/)
      duration.value = numMatch ? Number(numMatch[0]) : 5
    } else {
      duration.value = Number(durationValue) || 5
    }
  }
  if (params.type !== undefined) {
    type.value = params.type || '特效视频'
  }
  if (params.model !== undefined) {
    model.value = params.model || 'kutt'
  }
  if (params.effects_id !== undefined) {
    effectId.value = params.effects_id || null
  }

  // 处理首帧图片文件 - 支持多种字段名（image、first_frame_img、first_frame）
  const firstFrameUrl = params.image || params.first_frame_img || params.first_frame
  if (firstFrameUrl) {
    try {
      let fileName = 'first_frame.jpg'
      try {
        const urlObj = new URL(firstFrameUrl)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      } catch {
        const urlParts = firstFrameUrl.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName
      }

      const file = await urlToFile(firstFrameUrl, fileName)
      if (file) {
        firstFrameFile.value = file
        // 创建预览URL（支持图片）
        if (file.type.startsWith('image/')) {
          firstFramePreview.value = URL.createObjectURL(file)
        }
      }
    } catch (error) {
      console.error('加载首帧图片失败:', error)
    }
  }

  // 处理尾帧图片文件（last_frame_img、last_frame）
  const lastFrameUrl = params.last_frame_img || params.last_frame
  if (lastFrameUrl) {
    try {
      let fileName = 'last_frame.jpg'
      try {
        const urlObj = new URL(lastFrameUrl)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      } catch {
        const urlParts = lastFrameUrl.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName
      }

      const file = await urlToFile(lastFrameUrl, fileName)
      if (file) {
        lastFrameFile.value = file
        // 创建预览URL（支持图片）
        if (file.type.startsWith('image/')) {
          lastFramePreview.value = URL.createObjectURL(file)
        }
      }
    } catch (error) {
      console.error('加载尾帧图片失败:', error)
    }
  }

  // 处理原图图片文件（original_image）
  if (params.original_image) {
    try {
      let fileName = 'original_image.jpg'
      try {
        const urlObj = new URL(params.original_image)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      } catch {
        const urlParts = params.original_image.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName
      }

      const file = await urlToFile(params.original_image, fileName)
      if (file) {
        originalImageFile.value = file
        // 创建预览URL（支持图片）
        if (file.type.startsWith('image/')) {
          originalImagePreview.value = URL.createObjectURL(file)
        }
      }
    } catch (error) {
      console.error('加载原图图片失败:', error)
    }
  }
}

/**
 * 选择视频特效
 */
const onShowVideoEffect = () => {
  videoEffectDialogRef.value?.onShow()
}

/**
 * 确定视频特效
 * @param item
 */
const onSelectEffect = (item: any) => {
  effectId.value = item.id
  effectVideoSrc.value = item.image
}

/**
 * 移除视频特效
 */
const removeEffect = () => {
  effectId.value = ''
  effectVideoSrc.value = '/video/effect.mp4'
}

/**
 * 构建表单数据（用于生成和获取积分）
 */
const buildFormData = () => {
  const formData = new FormData()
  // kutt模型
  if (model.value === 'kutt') {
    // 特性视频
    if (effectId.value) {
      if (firstFrameFile.value) {
        formData.append('image', firstFrameFile.value)
      }
      formData.append('effects_id', effectId.value)
      formData.append('resolution', resolution.value)
      formData.append('function', 'special_effects')
    }
    // 默认视频
    else {
      formData.append('model', model.value)
      if (prompt.value) {
        formData.append('prompt', prompt.value)
      }
      formData.append('resolution', resolution.value)
      formData.append('ratio', String(ratio.value))
      formData.append('duration', String(duration.value))
      if (firstFrameFile.value) {
        formData.append('first_frame_img', firstFrameFile.value)
      }
      formData.append('function', 'generate_video')
    }
  }
  // 其他视频
  else {
    if (firstFrameFile.value) {
      formData.append('first_frame_img', firstFrameFile.value)
    }
    if (lastFrameFile.value) {
      formData.append('last_frame_img', lastFrameFile.value)
    }
    if (prompt.value) {
      formData.append('prompt', prompt.value)
    }
    formData.append('model', model.value)
    formData.append('camera_fixed', String(cameraFixed.value ? 'true' : 'false'))
    formData.append('prompt_extend', String(promptExtend.value ? 'true' : 'false'))
    formData.append('ratio', ratio.value)
    formData.append('resolution', resolution.value)
    formData.append('duration', String(duration.value))
    formData.append('function', 'generate_video')
  }
  return formData
}

/**
 * 获取所需积分
 */
const fetchRequiredPoints = async () => {
  try {
    const formData = buildFormData()
    const response = await generateApi.getFunctionStore(formData)
    if (response?.code === 1 && response?.data !== undefined) {
      requiredPoints.value = response.data.score
    }
  } catch (e) {
    console.log('获取积分失败:', e)
  }
}

/**
 * 生成
 */
const onGenerate = async () => {
  try {
    loading.value = true
    let response: any = null
    const formData = new FormData()
    // kutt模型
    if (model.value === 'kutt') {
      // 特性视频
      if (effectId.value) {
        if (!firstFrameFile.value) {
          return message.warn('请先上传首帧图片')
        }
        formData.append('effects_id', effectId.value)
        formData.append('resolution', resolution.value)
        formData.append('image', firstFrameFile.value)
        response = await generateApi.createVideoEffect(formData)
      }
      // 默认视频
      else {
        formData.append('model', model.value)
        formData.append('prompt', prompt.value)
        formData.append('resolution', resolution.value)
        formData.append('ratio', String(ratio.value))
        formData.append('duration', String(duration.value))
        if (firstFrameFile.value) {
          formData.append('first_frame_img', firstFrameFile.value)
        }
        response = await generateApi.createVideoGenerate(formData)
      }
    }
    // 其他视频
    else {
      if (!firstFrameFile.value && !prompt.value) {
        return message.warn('请先上传首帧图片或输入描述词')
      }
      if (firstFrameFile.value) {
        formData.append('first_frame_img', firstFrameFile.value)
      }
      if (lastFrameFile.value) {
        formData.append('last_frame_img', lastFrameFile.value)
      }
      if (prompt.value) {
        formData.append('prompt', prompt.value)
      }
      formData.append('model', model.value)
      formData.append('camera_fixed', String(cameraFixed.value ? 'true' : 'false'))
      formData.append('prompt_extend', String(promptExtend.value ? 'true' : 'false'))
      formData.append('ratio', ratio.value)
      formData.append('resolution', resolution.value)
      formData.append('duration', String(duration.value))
      response = await generateApi.createVideoGenerate(formData)
    }
    if (response?.code === 1) {
      message.success('创建任务成功')
      emits('generateSuccess', {
        task_id: response?.data?.prompt_id || response?.data,
        method_type: 'generate_video',
        tool_name: '视频生成',
        createtime: new Date().getTime(),
        request_params: {
          model: model.value,
          prompt: prompt.value,
          resolution: resolution.value,
          ratio: ratio.value,
          duration: String(duration.value),
          camera_fixed: String(cameraFixed.value ? 'true' : 'false'),
          prompt_extend: String(promptExtend.value ? 'true' : 'false'),
          first_frame_img: firstFramePreview.value || '',
          last_frame_img: lastFramePreview.value || ''
        }
      })
    }
    loading.value = false
  } catch (e) {
    console.log('生成失败:', e)
    loading.value = false
  }
}

// 组件挂载后自动播放视频
onMounted(() => {
  if (effectVideoRef.value) {
    effectVideoRef.value.play().catch(() => {
      // 忽略自动播放错误（某些浏览器需要用户交互）
    })
  }
})

// 暴露方法供父组件调用
defineExpose({
  fillForm
})
</script>

<style lang="scss" scoped>
@use './styles.scss';

.editor-model-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

:deep(.model-dropdown) {
  .ant-dropdown-menu {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow:
      0 4px 20px rgba(114, 46, 209, 0.08),
      0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 6px;
    min-width: 240px;

    @media (prefers-color-scheme: dark) {
      background: #1b1b20;
      border-color: rgba(229, 231, 235, 0.1);
    }
  }

  .ant-dropdown-menu-item {
    padding: 0;
    border-radius: 6px;
    transition: all 200ms;

    &:hover {
      background: rgba(114, 46, 209, 0.06);

      @media (prefers-color-scheme: dark) {
        background: rgba(179, 127, 235, 0.1);
      }
    }

    @media (prefers-color-scheme: dark) {
      &:hover {
        background: rgba(179, 127, 235, 0.1);
      }
    }
  }

  .ant-dropdown-menu-item-selected {
    background: rgba(114, 46, 209, 0.08);

    @media (prefers-color-scheme: dark) {
      background: rgba(179, 127, 235, 0.15);
    }
  }
}

.model-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  width: 100%;
}

.model-menu-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 6px;
  background: rgba(114, 46, 209, 0.05);
  padding: 6px;

  @media (prefers-color-scheme: dark) {
    background: rgba(179, 127, 235, 0.1);
  }
}

.model-menu-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-menu-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.model-menu-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

:deep(.model-menu .ant-dropdown-menu-item-selected) {
  .model-menu-name {
    color: #722ed1;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
  }

  .model-menu-desc {
    color: #722ed1;
    opacity: 0.8;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
  }
}

.editor-action-btn-toggle {
  position: relative;
  user-select: none;

  &.editor-action-btn-active {
    background: linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(179, 127, 235, 0.1) 100%);
    border-color: #722ed1;
    color: #722ed1;
    font-weight: 600;

    @media (prefers-color-scheme: dark) {
      background: linear-gradient(
        135deg,
        rgba(114, 46, 209, 0.15) 0%,
        rgba(179, 127, 235, 0.15) 100%
      );
      border-color: #b37feb;
      color: #b37feb;
    }

    .editor-action-icon {
      color: #722ed1;

      @media (prefers-color-scheme: dark) {
        color: #b37feb;
      }
    }
  }

  .editor-action-check-icon {
    margin-left: 4px;
    color: #722ed1;
    stroke-width: 3;
    animation: checkIn 0.2s ease;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

@keyframes checkIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.size-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-input-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.size-input-label {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  min-width: 20px;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.size-input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
  }

  &:focus {
    outline: none;
    border-color: #722ed1;
    box-shadow: 0 0 0 2px rgba(114, 46, 209, 0.1);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 0 0 2px rgba(179, 127, 235, 0.2);
    }
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
}

.lock-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
    color: #94a3b8;
  }

  &:hover {
    border-color: #722ed1;
    color: #722ed1;
    background: rgba(114, 46, 209, 0.05);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      color: #b37feb;
      background: rgba(179, 127, 235, 0.1);
    }
  }

  &.locked {
    border-color: #722ed1;
    background: rgba(114, 46, 209, 0.1);
    color: #722ed1;

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      background: rgba(179, 127, 235, 0.15);
      color: #b37feb;
    }
  }
}

.video-effect-wrapper {
  flex-shrink: 0;
  width: 100px;
  height: 82px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  margin-right: 8px;

  @media (max-width: 767px) {
    width: 90px;
    height: 75px;
    margin-left: 8px;
  }
}

.video-effect-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #000;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: #722ed1;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(114, 46, 209, 0.2);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 4px 12px rgba(179, 127, 235, 0.3);
    }

    .video-effect-overlay {
      opacity: 1;
    }
  }
}

.video-effect-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  background: #000;
}

.video-effect-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 12px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  gap: 6px;
}

.video-effect-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  }

  .video-effect-container:hover & {
    transform: scale(1.1);
  }
}

.video-effect-label {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.video-effect-remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms;
  color: #ffffff;
  padding: 0;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 12px;
    height: 12px;
  }
}

:deep(.video-effect-modal) {
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

.video-effect-modal-content {
  padding: 0;
}

.video-effect-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.video-effect-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #000;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: #722ed1;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(114, 46, 209, 0.2);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 8px 16px rgba(179, 127, 235, 0.3);
    }
  }

  &.active {
    border-color: #722ed1;
    box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.2);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 0 0 3px rgba(179, 127, 235, 0.3);
    }
  }
}

.video-effect-item-preview {
  width: 100%;
  height: 120px;
  object-fit: contain;
  display: block;
  background: #000;
}

.video-effect-item-label {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  text-align: center;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    color: #f1f5f9;
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .video-effect-item.active & {
    color: #722ed1;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
  }
}
</style>
