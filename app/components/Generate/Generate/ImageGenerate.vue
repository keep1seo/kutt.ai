<template>
  <div class="editor-input-area">
    <div class="editor-input-row">
      <div class="editor-input-controls">
        <div>
          <a-popover trigger="hover" placement="top" overlay-class-name="role-upload-popover">
            <template #content>
              <div class="role-upload-popover-content">
                <img
                  src="https://www.liblib.art/static/digital/digitalRoleTip.png"
                  alt="角色上传提示"
                  class="role-upload-tip-image"
                />
                <div class="role-upload-tip-title">支持真人&动漫图片上传</div>
                <div class="role-upload-tip-desc">支持图片/视频两种类型，清晰正脸效果更好</div>
              </div>
            </template>
            <div class="editor-upload-btn-wrapper">
              <input
                ref="roleInput"
                type="file"
                accept="image/*,video/*"
                style="display: none"
                @change="handleRoleFile"
              />
              <!-- 上传按钮 -->
              <button
                v-if="!rolePreview"
                class="editor-upload-btn editor-upload-btn-role"
                @click="uploadRole"
              >
                <div class="editor-upload-badge">角色</div>
                <div class="editor-upload-content">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    class="editor-upload-icon"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M8 8a3.333 3.333 0 1 0 0-6.667A3.333 3.333 0 0 0 8 8M13.727 14.667C13.727 12.087 11.16 10 8 10s-5.727 2.087-5.727 4.667"
                    ></path></svg
                  ><span class="editor-upload-text">角色</span>
                </div>
              </button>
              <!-- 图片预览 -->
              <div v-else class="editor-upload-preview">
                <img :src="rolePreview" alt="角色预览" class="editor-upload-preview-image" />
                <button class="editor-upload-remove-btn" @click="removeRole" title="移除">
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
          </a-popover>
        </div>
      </div>
      <div class="editor-textarea-wrapper">
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
          <!-- 模型选择 model: flux、qwen-edit -->
          <div class="editor-action-btn" @click="showModelModal = true">
            <img
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
          <!-- 模型选择弹框 -->
          <a-modal
            v-model:open="showModelModal"
            title="选择模型"
            :footer="null"
            width="420px"
            class="model-select-modal"
          >
            <div class="model-select-modal-content">
              <div
                v-for="(modelInfo, modelKey) in modelConfig"
                :key="modelKey"
                :class="['model-select-item', { active: model === modelKey }]"
                @click="selectModelFromModal(modelKey)"
              >
                <img :src="modelInfo.logo" :alt="modelInfo.name" class="model-select-logo" />
                <div class="model-select-content">
                  <div class="model-select-name">{{ modelInfo.name }}</div>
                  <div class="model-select-desc">{{ modelInfo.desc }}</div>
                </div>
                <div v-if="model === modelKey" class="model-select-check">
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
          <!-- 是否翻译：is_translate -->
          <div
            class="editor-action-btn editor-action-btn-toggle"
            :class="{ 'editor-action-btn-active': isTranslate }"
            @click="isTranslate = !isTranslate"
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
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <span class="editor-action-text">翻译</span>
            <svg
              v-if="isTranslate"
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
          <!-- 图片尺寸 -->
          <div class="editor-action-btn" @click="showImageSizeModal = true">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="editor-action-text">图片尺寸 {{ width }}×{{ height }}</span>
            <i
              class="liblibfont icon-border_down editor-action-icon-text"
              style="color: inherit; font-size: 12px"
            ></i>
          </div>
          <!-- 图片尺寸弹框 -->
          <a-modal
            v-model:open="showImageSizeModal"
            title="图片尺寸"
            :footer="null"
            width="420px"
            class="image-size-modal"
          >
            <div class="image-size-modal-content">
              <div class="aspect-ratio-buttons">
                <button
                  v-for="(size, ratio) in imageSize"
                  :key="ratio"
                  :class="['aspect-ratio-btn', { active: currentAspectRatio === ratio }]"
                  @click="selectAspectRatio(ratio)"
                >
                  <div class="aspect-ratio-icon" :class="getAspectRatioClass(ratio)">
                    <div class="ratio-box"></div>
                  </div>
                  <span class="aspect-ratio-text">{{ ratio }}</span>
                </button>
              </div>
              <div class="size-inputs">
                <div class="size-input-wrapper">
                  <label class="size-input-label">W</label>
                  <input
                    v-model.number="width"
                    type="number"
                    class="size-input"
                    min="256"
                    max="4096"
                    :disabled="isLocked"
                    @input="onWidthChange"
                  />
                </div>
                <button
                  :class="['lock-btn', { locked: isLocked }]"
                  @click="toggleLock"
                  title="锁定比例"
                >
                  <svg
                    v-if="isLocked"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 9.9 0"></path>
                  </svg>
                </button>
                <div class="size-input-wrapper">
                  <label class="size-input-label">H</label>
                  <input
                    v-model.number="height"
                    type="number"
                    class="size-input"
                    min="256"
                    max="4096"
                    :disabled="isLocked"
                    @input="onHeightChange"
                  />
                </div>
              </div>
            </div>
          </a-modal>
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
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { watch, onMounted, ref } from 'vue'
import { useGenerateApi } from '~/api/useGenerateApi'
import { useEditorStore } from '~/stores/useEditorStore'
import fluxLogo from '~/assets/images/flux.svg'
import qwenLogo from '~/assets/images/qwen.svg'

const imageSize = {
  '1:1': {
    width: 2048,
    height: 2048
  },
  '2:3': {
    width: 1644,
    height: 2496
  },
  '3:2': {
    width: 2496,
    height: 1644
  },
  '3:4': {
    width: 1728,
    height: 2304
  },
  '4:3': {
    width: 2304,
    height: 1728
  },
  '9:16': {
    width: 1440,
    height: 2560
  },
  '16:9': {
    width: 2560,
    height: 1440
  },
  '9:21': {
    width: 1296,
    height: 3024
  },
  '21:9': {
    width: 3024,
    height: 1296
  }
}

/* Emits */
const emits = defineEmits(['generateSuccess'])

/* Api */
const generateApi = useGenerateApi()

/* Store */
const editorStore = useEditorStore()

// loading
const loading = ref(false)
// 角色文件输入框引用
const roleInput = ref<HTMLInputElement | null>(null)
/// 角色文件对象
const roleFile = ref<File | null>(null)
// 角色图片/视频预览 URL
const rolePreview = ref<string | null>(null)
// 描述词
const prompt = ref('')
// 是否翻译
const isTranslate = ref(false)
// 生成图像的宽度
const width = ref(512)
// 生成图像的高度
const height = ref(512)
// 是否锁定比例
const isLocked = ref(true)
// 图片尺寸弹框显示状态
const showImageSizeModal = ref(false)
// 模型选择弹框显示状态
const showModelModal = ref(false)
// 选中的模型
const model = ref('flux')
// 所需积分
const requiredPoints = ref(0)

// ==================== Store 同步 ====================
// 是否正在从 store 恢复数据（避免循环更新）
const isRestoring = ref(false)

/**
 * 同步数据到 store
 */
const syncToStore = () => {
  if (isRestoring.value) return

  // 清理旧文件
  if (editorStore.image.roleFileId && !roleFile.value) {
    editorStore.removeFile(editorStore.image.roleFileId)
  }

  // 存储新文件
  let roleFileId = editorStore.image.roleFileId
  if (roleFile.value) {
    const existingFile = editorStore.getFile(roleFileId || '')
    if (!existingFile || existingFile !== roleFile.value) {
      if (roleFileId) editorStore.removeFile(roleFileId)
      roleFileId = editorStore.storeFile(roleFile.value)
    }
  } else {
    roleFileId = null
  }

  editorStore.updateImageData({
    roleFileId: roleFileId,
    rolePreview: rolePreview.value,
    prompt: prompt.value,
    isTranslate: isTranslate.value,
    width: width.value,
    height: height.value,
    model: model.value
  })
}

/**
 * 从 store 恢复数据
 */
const restoreFromStore = () => {
  const storeData = editorStore.image

  isRestoring.value = true

  // 恢复普通字段
  prompt.value = storeData.prompt || ''
  isTranslate.value = storeData.isTranslate || false
  width.value = storeData.width || 1024
  height.value = storeData.height || 1024
  model.value = storeData.model || 'flux'

  // 恢复文件
  if (storeData.roleFileId) {
    const file = editorStore.getFile(storeData.roleFileId)
    if (file) {
      roleFile.value = file
      if (storeData.rolePreview) {
        rolePreview.value = storeData.rolePreview
      } else if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        rolePreview.value = URL.createObjectURL(file)
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

watch([prompt, isTranslate, width, height, model], debouncedSync)
watch([roleFile, rolePreview], debouncedSync, { deep: true })

// 监听数据变化，获取所需积分（防抖）
let pointsTimer: ReturnType<typeof setTimeout> | null = null
const debouncedFetchPoints = () => {
  if (isRestoring.value) return // 正在恢复时不获取积分
  if (pointsTimer) clearTimeout(pointsTimer)
  pointsTimer = setTimeout(() => {
    fetchRequiredPoints()
  }, 500) // 500ms 防抖，避免频繁请求
}

watch([prompt, isTranslate, width, height, model], debouncedFetchPoints)
watch([roleFile], debouncedFetchPoints, { deep: true })

// 组件挂载时从 store 恢复数据
onMounted(() => {
  restoreFromStore()
  // 恢复数据后获取积分
  fetchRequiredPoints()
})

// 模型信息配置
const modelConfig = {
  flux: {
    name: 'Flux',
    logo: fluxLogo,
    desc: '高质量图像生成模型'
  },
  'qwen-edit': {
    name: 'Qwen-Edit',
    logo: qwenLogo,
    desc: '智能图像编辑模型'
  }
}

// 当前模型信息
const currentModelInfo = computed(() => {
  return modelConfig[model.value as keyof typeof modelConfig] || modelConfig.flux
})

// ==================== 选项相关 ====================
/**
 * 选择模型
 * @param info
 */
const selectModel = (info: { key: string | number }) => {
  model.value = String(info.key)
}

/**
 * 从弹框选择模型
 * @param modelKey
 */
const selectModelFromModal = (modelKey: string) => {
  model.value = modelKey
  showModelModal.value = false
}

/**
 * 计算当前宽高比
 */
const currentAspectRatio = computed(() => {
  const ratio = width.value / height.value
  for (const [key, size] of Object.entries(imageSize)) {
    const sizeRatio = size.width / size.height
    if (Math.abs(ratio - sizeRatio) < 0.01 && Math.abs(width.value - size.width) < 10) {
      return key
    }
  }
  return null
})

/**
 * 选择宽高比
 * @param ratio
 */
const selectAspectRatio = (ratio: string) => {
  const size = imageSize[ratio as keyof typeof imageSize]
  if (size) {
    width.value = size.width
    height.value = size.height
    lockedAspectRatio.value = size.width / size.height
  }
}

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
 * 切换锁定状态
 */
const toggleLock = () => {
  isLocked.value = !isLocked.value
  if (isLocked.value) {
    // 锁定当前比例
    lockedAspectRatio.value = width.value / height.value
  } else {
    // 解锁时清除保存的比例
    lockedAspectRatio.value = null
  }
}

// 保存当前宽高比（用于锁定）
const lockedAspectRatio = ref<number | null>(null)

/**
 * 宽度变化处理
 */
const onWidthChange = () => {
  if (isLocked.value) {
    if (currentAspectRatio.value) {
      const ratio = imageSize[currentAspectRatio.value as keyof typeof imageSize]
      if (ratio) {
        const aspectRatio = ratio.width / ratio.height
        height.value = Math.round(width.value / aspectRatio)
        lockedAspectRatio.value = aspectRatio
      }
    } else if (lockedAspectRatio.value) {
      height.value = Math.round(width.value / lockedAspectRatio.value)
    } else {
      // 首次锁定，保存当前比例
      lockedAspectRatio.value = width.value / height.value
    }
  }
}

/**
 * 高度变化处理
 */
const onHeightChange = () => {
  if (isLocked.value) {
    if (currentAspectRatio.value) {
      const ratio = imageSize[currentAspectRatio.value as keyof typeof imageSize]
      if (ratio) {
        const aspectRatio = ratio.width / ratio.height
        width.value = Math.round(height.value * aspectRatio)
        lockedAspectRatio.value = aspectRatio
      }
    } else if (lockedAspectRatio.value) {
      width.value = Math.round(height.value * lockedAspectRatio.value)
    } else {
      // 首次锁定，保存当前比例
      lockedAspectRatio.value = width.value / height.value
    }
  }
}

// ==================== 角色文件上传相关 ====================
/**
 * 触发角色文件选择对话框
 */
const uploadRole = () => {
  roleInput.value?.click()
}

/**
 * 处理角色文件选择
 * @param event - 文件输入变化事件
 */
const handleRoleFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    roleFile.value = file
    // 为图片或视频文件创建预览 URL
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      rolePreview.value = URL.createObjectURL(file)
    }
    console.log('选择的文件:', file.name, file.type)
    // TODO: 处理文件上传
  }
}

/**
 * 移除角色文件
 * 释放预览 URL 并清空相关状态
 */
const removeRole = () => {
  // 释放预览 URL，避免内存泄漏
  if (rolePreview.value) {
    URL.revokeObjectURL(rolePreview.value)
  }
  rolePreview.value = null
  roleFile.value = null
  // 清空文件输入框
  if (roleInput.value) {
    roleInput.value.value = ''
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
  if (rolePreview.value) {
    URL.revokeObjectURL(rolePreview.value)
    rolePreview.value = null
  }
  roleFile.value = null
  if (roleInput.value) {
    roleInput.value.value = ''
  }

  // 填充普通字段
  if (params.prompt !== undefined) {
    prompt.value = params.prompt || ''
  }
  if (params.is_translate !== undefined) {
    isTranslate.value = params.is_translate === true || params.is_translate === 'true'
  }
  if (params.width !== undefined) {
    width.value = Number(params.width) || 1024
  }
  if (params.height !== undefined) {
    height.value = Number(params.height) || 1024
  }
  if (params.model !== undefined) {
    model.value = params.model || 'flux'
  }

  // 处理角色图片/视频文件（img）- URL 转 File
  if (params.img) {
    try {
      // 从URL提取文件名（去除查询参数）
      let fileName = 'portrait.jpg'
      try {
        const urlObj = new URL(params.img)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
        // 根据文件扩展名判断是图片还是视频
        if (!fileName.includes('.')) {
          // 尝试从 URL 路径判断
          if (params.img.includes('.mp4') || params.img.includes('.mov')) {
            fileName = 'portrait.mp4'
          }
        }
      } catch {
        // 如果不是完整URL，直接从路径中提取
        const urlParts = params.img.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName // 去除查询参数
      }

      const file = await urlToFile(params.img, fileName)
      if (file) {
        roleFile.value = file
        // 创建预览URL（支持图片和视频）
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          rolePreview.value = URL.createObjectURL(file)
        }
      }
    } catch (error) {
      console.error('加载角色图片/视频失败:', error)
    }
  }
}

/**
 * 构建表单数据（用于生成和获取积分）
 */
const buildFormData = () => {
  const formData = new FormData()
  if (roleFile.value) {
    formData.append('img', roleFile.value)
  }
  formData.append('prompt', prompt.value)
  formData.append('is_translate', String(isTranslate.value ? 'true' : 'false'))
  formData.append('width', String(width.value))
  formData.append('height', String(height.value))
  formData.append('model', model.value)
  formData.append('function', 'generate_image')
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
  if (!roleFile.value) {
    return message.warn('请先上传图片')
  }
  if (!prompt.value) {
    return message.warn('请先输入描述词')
  }
  try {
    loading.value = true
    const formData = new FormData()
    formData.append('img', roleFile.value)
    formData.append('prompt', prompt.value)
    formData.append('is_translate', String(isTranslate.value ? 'true' : 'false'))
    formData.append('width', String(width.value))
    formData.append('height', String(height.value))
    formData.append('model', model.value)
    const response = await generateApi.createImageGenerate(formData)
    if (response?.code === 1) {
      message.success('创建任务成功')
      emits('generateSuccess', {
        task_id: response?.data,
        method_type: 'generate_image',
        tool_name: '图片生成',
        createtime: new Date().getTime(),
        request_params: {
          prompt: prompt.value,
          is_translate: isTranslate.value,
          width: width.value,
          height: height.value,
          model: model.value
        }
      })
    }
    loading.value = false
  } catch (e) {
    console.log('生成失败:', e)
    loading.value = false
  }
}

// 暴露方法供父组件调用
defineExpose({
  fillForm
})
</script>

<style lang="scss" scoped>
@use './styles.scss';

// 模型logo样式
.editor-model-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

// 模型下拉菜单样式
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

// 切换按钮样式
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

// 图片尺寸 Modal 样式
:deep(.image-size-modal) {
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

.image-size-modal-content {
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
    background: #722ed1;
    border-radius: 2px;
    transition: all 0.2s ease;

    @media (prefers-color-scheme: dark) {
      background: #b37feb;
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

  .aspect-ratio-btn.active & {
    color: #722ed1;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
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

  &:disabled {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.6;

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.05);
      color: #64748b;
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

// 模型选择 Modal 样式
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
