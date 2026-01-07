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
        <div class="editor-upload-btn-wrapper">
          <!-- 音频选择按钮 -->
          <button v-if="!selectedVoice" class="editor-upload-btn" @click="openVoiceDialog">
            <div class="editor-upload-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                class="icon-proenlarge editor-upload-icon"
                font-size="18"
              >
                <g fill="currentColor" clip-path="url(#voice-square_svg__a)">
                  <rect width="1.8" height="5" x="0.23" y="5.5" rx="0.9"></rect>
                  <path
                    d="M3.605 4.9a.9.9 0 1 1 1.8 0v6.2a.9.9 0 1 1-1.8 0zM7.105 1.4a.9.9 0 1 1 1.8 0v13.2a.9.9 0 1 1-1.8 0zM10.605 4.9a.9.9 0 0 1 1.8 0v6.2a.9.9 0 1 1-1.8 0z"
                  ></path>
                  <rect width="1.8" height="5" x="13.97" y="5.5" rx="0.9"></rect>
                </g>
                <defs>
                  <clipPath id="voice-square_svg__a">
                    <path fill="#fff" d="M0 0h16v16H0z"></path>
                  </clipPath>
                </defs>
              </svg>
              <div class="editor-upload-text-secondary">音频</div>
            </div>
          </button>
          <!-- 已选择音色显示 -->
          <div v-else class="editor-upload-voice-preview">
            <div class="editor-upload-voice-icon">
              <NuxtImg
                v-if="selectedVoice.image"
                :src="selectedVoice.image"
                :alt="selectedVoice.voice"
                class="editor-upload-voice-avatar"
                format="webp"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                ></path>
              </svg>
            </div>
            <div class="editor-upload-voice-name">{{ selectedVoice.voice }}</div>
            <button
              class="editor-upload-remove-btn editor-upload-remove-btn-voice"
              @click="onRemoveSelectedVoice"
              title="移除"
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
      <div class="editor-textarea-wrapper">
        <div class="editor-textarea-container">
          <div class="editor-textarea-row">
            <div class="editor-textarea-label">音频文字</div>
            <textarea
              v-model.trim="audio_text"
              placeholder="请输入音频文字"
              class="editor-textarea"
            ></textarea>
          </div>
          <div class="editor-textarea-row editor-textarea-row-mt">
            <div class="editor-textarea-label">描述词</div>
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
          <!--分辨率-->
          <a-dropdown
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
                ></path></svg
              ><span class="editor-action-text">分辨率 {{ resolution }}</span
              ><i
                class="liblibfont icon-border_down editor-action-icon-text"
                style="color: inherit; font-size: 12px"
              ></i>
            </div>
            <template #overlay>
              <a-menu @click="selectResolution">
                <a-menu-item key="360P">360P</a-menu-item>
                <a-menu-item key="480P">480P</a-menu-item>
                <a-menu-item key="720P">720P</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 音频上传 -->
          <div class="editor-action-audio-upload">
            <input
              ref="actionVoiceInput"
              type="file"
              accept="audio/mp3,.mp3"
              style="display: none"
              @change="onActionVoiceFile"
            />
            <!-- 上传按钮 -->
            <button v-if="!actionFile" class="editor-action-btn" @click="uploadActionVoice">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 16 16"
                class="editor-action-icon"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M8 1.333v9.334M8 1.333a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0v-4a2 2 0 0 1 2-2Z"
                ></path>
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12.667 6.667v.666a4.667 4.667 0 1 1-9.334 0v-.666M8 14.667v-4"
                ></path>
              </svg>
              <span class="editor-action-text">音频上传</span>
            </button>
            <!-- 已上传显示 -->
            <div v-else class="editor-action-audio-preview">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                class="editor-action-audio-icon"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                ></path>
              </svg>
              <span class="editor-action-audio-name">{{ actionVoiceName }}</span>
              <button class="editor-action-audio-remove" @click="onRemoveActionVoice" title="移除">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
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
  <!-- 音色选择弹框 -->
  <VoiceDialog ref="voiceDialogRef" @confirm="onVoiceSelected" />
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { watch, onMounted } from 'vue'
import { useGenerateApi } from '~/api/useGenerateApi'
import { useEditorStore } from '~/stores/useEditorStore'
import VoiceDialog from './components/DigitalGenerate/VoiceDialog.vue'

/* Emits */
const emits = defineEmits(['generateSuccess'])

/* Api */
const generateApi = useGenerateApi()

/* Store */
const editorStore = useEditorStore()

// loading
const loading = ref(false)
// 选中的音频音色
const voice = ref('Cherry')
// 选中的分辨率
const resolution = ref('480P')
// 角色文件输入框引用
const roleInput = ref<HTMLInputElement | null>(null)
/// 角色文件对象
const roleFile = ref<File | null>(null)
// 角色图片/视频预览 URL
const rolePreview = ref<string | null>(null)
// 音频文件输入框引用
const voiceInput = ref<HTMLInputElement | null>(null)
// 音频文件对象
const voiceAudio = ref<File | null>(null)
// 音频文件名
const voiceAudioName = ref<string>('')
// 音色选择弹框引用
const voiceDialogRef = ref<InstanceType<typeof VoiceDialog> | null>(null)
// 选中的音色
const selectedVoice = ref<{
  id: number
  voice: string
  image: string
  illustrationAudio: string
  profile: string
  age: number
  gender: number
} | null>(null)
// 操作按钮区域的音频文件输入框引用
const actionVoiceInput = ref<HTMLInputElement | null>(null)
// 操作按钮区域的音频文件对象
const actionFile = ref<File | null>(null)
// 操作按钮区域的音频文件名
const actionVoiceName = ref<string>('')
// 描述词
const prompt = ref('')
// 音频文字
const audio_text = ref('')
// 所需积分
const requiredPoints = ref(0)

// ==================== Store 同步 ====================
/**
 * 同步数据到 store
 */
const syncToStore = () => {
  // 清理旧文件
  if (editorStore.digital.roleFileId && !roleFile.value) {
    editorStore.removeFile(editorStore.digital.roleFileId)
  }
  if (editorStore.digital.actionFileId && !actionFile.value) {
    editorStore.removeFile(editorStore.digital.actionFileId)
  }
  if (editorStore.digital.voiceAudioFileId && !voiceAudio.value) {
    editorStore.removeFile(editorStore.digital.voiceAudioFileId)
  }

  // 存储新文件
  let roleFileId = editorStore.digital.roleFileId
  if (roleFile.value) {
    // 如果文件已变化，需要重新存储
    const existingFile = editorStore.getFile(roleFileId || '')
    if (!existingFile || existingFile !== roleFile.value) {
      if (roleFileId) editorStore.removeFile(roleFileId)
      roleFileId = editorStore.storeFile(roleFile.value)
    }
  } else {
    roleFileId = null
  }

  let actionFileId = editorStore.digital.actionFileId
  if (actionFile.value) {
    const existingFile = editorStore.getFile(actionFileId || '')
    if (!existingFile || existingFile !== actionFile.value) {
      if (actionFileId) editorStore.removeFile(actionFileId)
      actionFileId = editorStore.storeFile(actionFile.value)
    }
  } else {
    actionFileId = null
  }

  let voiceAudioFileId = editorStore.digital.voiceAudioFileId
  if (voiceAudio.value) {
    const existingFile = editorStore.getFile(voiceAudioFileId || '')
    if (!existingFile || existingFile !== voiceAudio.value) {
      if (voiceAudioFileId) editorStore.removeFile(voiceAudioFileId)
      voiceAudioFileId = editorStore.storeFile(voiceAudio.value)
    }
  } else {
    voiceAudioFileId = null
  }

  editorStore.updateDigitalData({
    roleFileId: roleFileId,
    rolePreview: rolePreview.value,
    actionFileId: actionFileId,
    actionVoiceName: actionVoiceName.value,
    voiceAudioFileId: voiceAudioFileId,
    voiceAudioName: voiceAudioName.value,
    selectedVoice: selectedVoice.value,
    prompt: prompt.value,
    audio_text: audio_text.value,
    resolution: resolution.value,
    voice: voice.value
  })
}

/**
 * 从 store 恢复数据
 */
const restoreFromStore = () => {
  const storeData = editorStore.digital

  // 恢复普通字段
  prompt.value = storeData.prompt || ''
  audio_text.value = storeData.audio_text || ''
  resolution.value = storeData.resolution || '480P'
  voice.value = storeData.voice || 'Cherry'
  selectedVoice.value = storeData.selectedVoice || null
  actionVoiceName.value = storeData.actionVoiceName || ''
  voiceAudioName.value = storeData.voiceAudioName || ''

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

  if (storeData.actionFileId) {
    const file = editorStore.getFile(storeData.actionFileId)
    if (file) {
      actionFile.value = file
    }
  }

  if (storeData.voiceAudioFileId) {
    const file = editorStore.getFile(storeData.voiceAudioFileId)
    if (file) {
      voiceAudio.value = file
    }
  }
}

// 是否正在从 store 恢复数据（避免循环更新）
const isRestoring = ref(false)

// 监听数据变化，自动同步到 store（防抖）
let syncTimer: ReturnType<typeof setTimeout> | null = null
const debouncedSync = () => {
  if (isRestoring.value) return // 正在恢复时不同步
  if (syncTimer) clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    syncToStore()
  }, 300)
}

watch([prompt, audio_text, resolution, voice, selectedVoice, actionVoiceName, voiceAudioName], debouncedSync)
watch([roleFile, actionFile, voiceAudio, rolePreview], debouncedSync, { deep: true })

// 监听数据变化，获取所需积分（防抖）
let pointsTimer: ReturnType<typeof setTimeout> | null = null
const debouncedFetchPoints = () => {
  if (isRestoring.value) return // 正在恢复时不获取积分
  if (pointsTimer) clearTimeout(pointsTimer)
  pointsTimer = setTimeout(() => {
    fetchRequiredPoints()
  }, 500) // 500ms 防抖，避免频繁请求
}

watch([prompt, audio_text, resolution, voice, selectedVoice], debouncedFetchPoints)
watch([roleFile, actionFile], debouncedFetchPoints, { deep: true })

// 组件挂载时从 store 恢复数据
onMounted(() => {
  isRestoring.value = true
  restoreFromStore()
  isRestoring.value = false
  // 恢复数据后获取积分
  fetchRequiredPoints()
})

// ==================== 分辨率相关 ====================
/**
 * 选择分辨率
 * @param info - 菜单项信息，包含选中的 key
 */
const selectResolution = (info: { key: string | number }) => {
  resolution.value = String(info.key)
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

// ==================== 音色选择相关 ====================
/**
 * 打开音色选择弹框
 */
const openVoiceDialog = () => {
  voiceDialogRef.value?.onShow(selectedVoice.value?.id)
}

/**
 * 处理音色选择
 * @param item - 选中的音色项
 */
const onVoiceSelected = (item: {
  id: number
  voice: string
  image: string
  illustrationAudio: string
  profile: string
  age: number
  gender: number
}) => {
  selectedVoice.value = item
  voice.value = item.voice
  console.log('选择的音色:', item)
}

/**
 * 移除选中的音色
 */
const onRemoveSelectedVoice = () => {
  selectedVoice.value = null
  voice.value = 'Cherry' // 重置为默认值
}

// ==================== 操作按钮区域音频文件上传相关 ====================
/**
 * 触发操作按钮区域音频文件选择对话框
 */
const uploadActionVoice = () => {
  actionVoiceInput.value?.click()
}

/**
 * 处理操作按钮区域音频文件选择
 * @param event - 文件输入变化事件
 */
const onActionVoiceFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // 验证文件格式，只接受mp3
    if (
      !file.name.toLowerCase().endsWith('.mp3') &&
      file.type !== 'audio/mpeg' &&
      file.type !== 'audio/mp3'
    ) {
      // 可以在这里显示错误提示
      console.warn('只支持mp3格式的音频文件')
      // 清空文件输入框
      if (actionVoiceInput.value) {
        actionVoiceInput.value.value = ''
      }
      return
    }
    actionFile.value = file
    actionVoiceName.value = file.name
    console.log('选择的音频文件:', file.name, file.type)
    // TODO: 处理音频文件上传
  }
}

/**
 * 移除操作按钮区域音频文件
 * 清空相关状态
 */
const onRemoveActionVoice = () => {
  actionFile.value = null
  actionVoiceName.value = ''
  // 清空文件输入框
  if (actionVoiceInput.value) {
    actionVoiceInput.value.value = ''
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

  actionFile.value = null
  actionVoiceName.value = ''
  if (actionVoiceInput.value) {
    actionVoiceInput.value.value = ''
  }

  voiceAudio.value = null
  voiceAudioName.value = ''
  if (voiceInput.value) {
    voiceInput.value.value = ''
  }

  // 填充普通字段
  if (params.prompt !== undefined) {
    prompt.value = params.prompt || ''
  }
  if (params.audio_text !== undefined) {
    audio_text.value = params.audio_text || ''
  }
  if (params.resolution !== undefined) {
    resolution.value = params.resolution || '480P'
  }
  if (params.voice !== undefined) {
    voice.value = params.voice || 'Cherry'
  }

  // 处理角色图片/视频文件（portrait_image）- URL 转 File
  if (params.portrait_image) {
    try {
      // 从URL提取文件名（去除查询参数）
      let fileName = 'portrait.jpg'
      try {
        const urlObj = new URL(params.portrait_image)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
        // 根据文件扩展名判断是图片还是视频
        if (!fileName.includes('.')) {
          // 尝试从 Content-Type 或 URL 路径判断
          if (params.portrait_image.includes('.mp4') || params.portrait_image.includes('.mov')) {
            fileName = 'portrait.mp4'
          }
        }
      } catch {
        // 如果不是完整URL，直接从路径中提取
        const urlParts = params.portrait_image.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName // 去除查询参数
      }

      const file = await urlToFile(params.portrait_image, fileName)
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

  // 处理操作按钮区域的音频文件（audio_file）- URL 转 File
  if (params.audio_file) {
    try {
      // 从URL提取文件名（去除查询参数）
      let fileName = 'audio.mp3'
      try {
        const urlObj = new URL(params.audio_file)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      } catch {
        // 如果不是完整URL，直接从路径中提取
        const urlParts = params.audio_file.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName // 去除查询参数
      }

      const file = await urlToFile(params.audio_file, fileName)
      if (file) {
        actionFile.value = file
        actionVoiceName.value = fileName
      }
    } catch (error) {
      console.error('加载音频文件失败:', error)
    }
  }
}

/**
 * 构建表单数据（用于生成和获取积分）
 */
const buildFormData = () => {
  const formData = new FormData()
  if (roleFile.value) {
    formData.append('portrait_image', roleFile.value)
  }
  if (actionFile.value) {
    formData.append('audio_file', actionFile.value)
  }
  formData.append('resolution', resolution.value)
  formData.append('prompt', prompt.value)
  formData.append('audio_text', audio_text.value)
  // 优先使用 selectedVoice 的 voice，否则使用 voice.value
  const finalVoice = selectedVoice.value?.voice || voice.value
  formData.append('voice', finalVoice)
  formData.append('function', 'digital_human')
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
  if ((!voice.value && !audio_text.value) || !actionFile.value) {
    return message.warn('请先选择语音或输入音频文字')
  }
  try {
    loading.value = true
    const formData = buildFormData()
    const response = await generateApi.createDigitalHuman(formData)
    if (response?.code === 1) {
      message.success('创建任务成功')
      emits('generateSuccess', {
        task_id: response?.data?.prompt_id,
        method_type: 'S2V',
        tool_name: '数字人',
        createtime: new Date().getTime()
      })
    }
    loading.value = false
  } catch (e) {
    console.log('生成失败:', e)
    loading.value = false
  }
}

/**
 * 获取当前表单数据（用于缓存）
 */
const getData = () => {
  return {
    roleFile: roleFile.value,
    rolePreview: rolePreview.value,
    actionFile: actionFile.value,
    actionVoiceName: actionVoiceName.value,
    voiceAudio: voiceAudio.value,
    voiceAudioName: voiceAudioName.value,
    selectedVoice: selectedVoice.value,
    prompt: prompt.value,
    audio_text: audio_text.value,
    resolution: resolution.value,
    voice: voice.value
  }
}

/**
 * 设置表单数据（用于恢复缓存）
 */
const setData = async (data: any) => {
  if (!data) return

  // 恢复普通字段
  if (data.prompt !== undefined) prompt.value = data.prompt
  if (data.audio_text !== undefined) audio_text.value = data.audio_text
  if (data.resolution !== undefined) resolution.value = data.resolution
  if (data.voice !== undefined) voice.value = data.voice
  if (data.selectedVoice !== undefined) selectedVoice.value = data.selectedVoice
  if (data.actionVoiceName !== undefined) actionVoiceName.value = data.actionVoiceName
  if (data.voiceAudioName !== undefined) voiceAudioName.value = data.voiceAudioName

  // 恢复文件（如果存在）
  if (data.roleFile) {
    roleFile.value = data.roleFile
    if (data.rolePreview) {
      rolePreview.value = data.rolePreview
    } else if (data.roleFile && (data.roleFile.type.startsWith('image/') || data.roleFile.type.startsWith('video/'))) {
      rolePreview.value = URL.createObjectURL(data.roleFile)
    }
  }

  if (data.actionFile) {
    actionFile.value = data.actionFile
  }

  if (data.voiceAudio) {
    voiceAudio.value = data.voiceAudio
  }
}

// 暴露方法供父组件调用
defineExpose({
  fillForm,
  getData,
  setData
})
</script>

<style lang="scss" scoped>
@use './styles.scss';

.editor-action-audio-upload {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.editor-action-audio-preview {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  height: 34px;
  max-width: 200px;

  @media (prefers-color-scheme: dark) {
    border-color: rgba(229, 231, 235, 0.1);
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 767px) {
    height: 36px;
    max-width: 150px;
  }
}

.editor-action-audio-icon {
  width: 14px;
  height: 14px;
  color: #722ed1;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
  }
}

.editor-action-audio-name {
  font-size: 14px;
  color: #475569;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;

  @media (prefers-color-scheme: dark) {
    color: #cbd5e1;
  }

  @media (max-width: 767px) {
    font-size: 12px;
  }
}

.editor-action-audio-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #ef4444;
  }

  @media (prefers-color-scheme: dark) {
    color: #64748b;

    &:hover {
      color: #f87171;
    }
  }
}

.editor-upload-voice-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
</style>
