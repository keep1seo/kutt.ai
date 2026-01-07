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
          <input
            ref="videoInput"
            type="file"
            accept="video/*"
            style="display: none"
            @change="handleVideoFile"
          />
          <!-- 上传按钮 -->
          <button v-if="!videoFile" class="editor-upload-btn" @click="uploadVideo">
            <div class="editor-upload-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                class="editor-upload-icon"
              >
                <path
                  fill="currentColor"
                  d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"
                />
              </svg>
              <div class="editor-upload-text-secondary">视频</div>
            </div>
          </button>
          <!-- 视频文件已上传显示 -->
          <div v-else class="editor-upload-video-preview">
            <div class="editor-upload-video-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"
                />
              </svg>
            </div>
            <div class="editor-upload-video-name">{{ videoName }}</div>
            <button
              class="editor-upload-remove-btn editor-upload-remove-btn-video"
              @click="removeVideo"
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
            <textarea
              v-model.trim="content"
              disabled
              placeholder=""
              class="editor-textarea"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="editor-actions">
      <div class="editor-actions-left">
        <div class="editor-actions-buttons">
          <!--类型-->
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
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="editor-action-icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span class="editor-action-text">{{ typeName }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="editor-action-icon-text"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <template #overlay>
              <a-menu @click="selectType">
                <a-menu-item key="1">动作模仿</a-menu-item>
                <a-menu-item key="2">视频换人</a-menu-item>
                <a-menu-item key="3">视频换脸</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
          <!--第几个人体-->
          <div v-if="[2, 3].includes(Number(type))" class="editor-action-btn">
            <span class="editor-action-text">第</span>
            <a-input-number
              v-model:value="nth"
              :min="1"
              :controls="false"
              class="editor-nth-input"
              size="small"
            />
            <span class="editor-action-text">个{{ Number(type) == 2 ? '人体' : '人脸' }}</span>
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
</template>

<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue'
import { useGenerateApi } from '~/api/useGenerateApi'
import { useEditorStore } from '~/stores/useEditorStore'
import { message } from 'ant-design-vue'

/* Emits */
const emits = defineEmits(['generateSuccess'])

/* Api */
const generateApi = useGenerateApi()

/* Store */
const editorStore = useEditorStore()

// loading
const loading = ref(false)
// 第几
const nth = ref(1)
// 选中的类型
const type = ref('1')
// 选中的分辨率
const resolution = ref('480P')
// 角色文件输入框引用
const roleInput = ref<HTMLInputElement | null>(null)
/// 角色文件对象
const roleFile = ref<File | null>(null)
// 角色图片/视频预览 URL
const rolePreview = ref<string | null>(null)
// 视频文件输入框引用
const videoInput = ref<HTMLInputElement | null>(null)
// 视频文件对象
const videoFile = ref<File | null>(null)
// 视频文件名
const videoName = ref<string>('')
// 说话内容
const content = ref('')
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
  if (editorStore.action.roleFileId && !roleFile.value) {
    editorStore.removeFile(editorStore.action.roleFileId)
  }
  if (editorStore.action.videoFileId && !videoFile.value) {
    editorStore.removeFile(editorStore.action.videoFileId)
  }

  // 存储新文件
  let roleFileId = editorStore.action.roleFileId
  if (roleFile.value) {
    const existingFile = editorStore.getFile(roleFileId || '')
    if (!existingFile || existingFile !== roleFile.value) {
      if (roleFileId) editorStore.removeFile(roleFileId)
      roleFileId = editorStore.storeFile(roleFile.value)
    }
  } else {
    roleFileId = null
  }

  let videoFileId = editorStore.action.videoFileId
  if (videoFile.value) {
    const existingFile = editorStore.getFile(videoFileId || '')
    if (!existingFile || existingFile !== videoFile.value) {
      if (videoFileId) editorStore.removeFile(videoFileId)
      videoFileId = editorStore.storeFile(videoFile.value)
    }
  } else {
    videoFileId = null
  }

  editorStore.updateActionData({
    roleFileId: roleFileId,
    rolePreview: rolePreview.value,
    videoFileId: videoFileId,
    videoName: videoName.value,
    type: type.value,
    resolution: resolution.value,
    nth: nth.value
  })
}

/**
 * 从 store 恢复数据
 */
const restoreFromStore = () => {
  const storeData = editorStore.action

  isRestoring.value = true

  // 恢复普通字段
  type.value = storeData.type || '1'
  resolution.value = storeData.resolution || '480P'
  nth.value = storeData.nth || 1
  videoName.value = storeData.videoName || ''

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

  if (storeData.videoFileId) {
    const file = editorStore.getFile(storeData.videoFileId)
    if (file) {
      videoFile.value = file
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

watch([type, resolution, nth, videoName], debouncedSync)
watch([roleFile, videoFile, rolePreview], debouncedSync, { deep: true })

// 监听数据变化，获取所需积分（防抖）
let pointsTimer: ReturnType<typeof setTimeout> | null = null
const debouncedFetchPoints = () => {
  if (isRestoring.value) return // 正在恢复时不获取积分
  if (pointsTimer) clearTimeout(pointsTimer)
  pointsTimer = setTimeout(() => {
    fetchRequiredPoints()
  }, 500) // 500ms 防抖，避免频繁请求
}

watch([type, resolution, nth], debouncedFetchPoints)
watch([roleFile, videoFile], debouncedFetchPoints, { deep: true })

// 组件挂载时从 store 恢复数据
onMounted(() => {
  restoreFromStore()
  // 恢复数据后获取积分
  fetchRequiredPoints()
})

// 类型名称
const typeName = computed(() => {
  switch (type.value) {
    case '1':
      return '动作模仿'
    case '2':
      return '视频换人'
    case '3':
      return '视频换脸'
    default:
      return ''
  }
})

// ==================== 类型相关 ====================
/**
 * 选中类型
 * @param info
 */
const selectType = (info: { key: string | number }) => {
  type.value = String(info.key)
}

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

// ==================== 视频文件上传相关 ====================
/**
 * 触发视频文件选择对话框
 */
const uploadVideo = () => {
  videoInput.value?.click()
}

/**
 * 处理视频文件选择
 * @param event - 文件输入变化事件
 */
const handleVideoFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    videoFile.value = file
    videoName.value = file.name
    console.log('选择的视频文件:', file.name, file.type)
    // TODO: 处理视频文件上传
  }
}

/**
 * 移除视频文件
 * 清空相关状态
 */
const removeVideo = () => {
  videoFile.value = null
  videoName.value = ''
  // 清空文件输入框
  if (videoInput.value) {
    videoInput.value.value = ''
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

  videoFile.value = null
  videoName.value = ''
  if (videoInput.value) {
    videoInput.value.value = ''
  }

  // 填充普通字段
  if (params.type !== undefined) {
    type.value = String(params.type) || '1'
  }
  if (params.resolution !== undefined) {
    resolution.value = params.resolution || '480P'
  }
  if (params.nth_body !== undefined) {
    nth.value = Number(params.nth_body) || 1
  }
  if (params.nth_face !== undefined) {
    nth.value = Number(params.nth_face) || 1
  }

  // 处理角色图片文件 - 支持多种字段名（portrait_image、body_image、face_image）
  const roleImageUrl = params.portrait_image || params.body_image || params.face_image
  if (roleImageUrl) {
    try {
      // 从URL提取文件名（去除查询参数）
      let fileName = 'portrait.jpg'
      try {
        const urlObj = new URL(roleImageUrl)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
        // 根据文件扩展名判断是图片还是视频
        if (!fileName.includes('.')) {
          // 尝试从 URL 路径判断
          if (roleImageUrl.includes('.mp4') || roleImageUrl.includes('.mov')) {
            fileName = 'portrait.mp4'
          }
        }
      } catch {
        // 如果不是完整URL，直接从路径中提取
        const urlParts = roleImageUrl.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName // 去除查询参数
      }

      const file = await urlToFile(roleImageUrl, fileName)
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

  // 处理视频文件（video）- URL 转 File
  if (params.video) {
    try {
      // 从URL提取文件名（去除查询参数）
      let fileName = 'video.mp4'
      try {
        const urlObj = new URL(params.video)
        const pathParts = urlObj.pathname.split('/')
        fileName = pathParts[pathParts.length - 1] || fileName
      } catch {
        // 如果不是完整URL，直接从路径中提取
        const urlParts = params.video.split('/')
        const lastPart = urlParts[urlParts.length - 1] || ''
        fileName = lastPart.split('?')[0] || fileName // 去除查询参数
      }

      const file = await urlToFile(params.video, fileName)
      if (file) {
        videoFile.value = file
        videoName.value = fileName
      }
    } catch (error) {
      console.error('加载视频文件失败:', error)
    }
  }
}

/**
 * 构建表单数据（用于生成和获取积分）
 */
const buildFormData = () => {
  const formData = new FormData()
  // 动作模仿
  if (Number(type.value) === 1) {
    if (roleFile.value) {
      formData.append('portrait_image', roleFile.value)
    }
    if (videoFile.value) {
      formData.append('video', videoFile.value)
    }
    formData.append('resolution', resolution.value)
    formData.append('function', 'action_imitation')
  }
  // 视频换人
  else if (Number(type.value) === 2) {
    if (roleFile.value) {
      formData.append('body_image', roleFile.value)
    }
    if (videoFile.value) {
      formData.append('video', videoFile.value)
    }
    formData.append('resolution', resolution.value)
    formData.append('nth_body', String(nth.value))
    formData.append('function', 'body_swap_video')
  }
  // 视频换脸
  else if (Number(type.value) === 3) {
    if (roleFile.value) {
      formData.append('face_image', roleFile.value)
    }
    if (videoFile.value) {
      formData.append('video', videoFile.value)
    }
    formData.append('resolution', resolution.value)
    formData.append('nth_face', String(nth.value))
    formData.append('function', 'face_swap_video')
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
  if (!roleFile.value) {
    return message.warn('请先上传图片')
  }
  if (!videoFile.value) {
    return message.warn('请先上传视频文件')
  }
  try {
    loading.value = true
    const formData = new FormData()
    let response: any = null
    let tool_name = ''
    // 动作模仿
    if (Number(type.value) === 1) {
      tool_name = '动作模仿'
      if (roleFile.value) {
        formData.append('portrait_image', roleFile.value)
      }
      if (videoFile.value) {
        formData.append('video', videoFile.value)
      }
      formData.append('resolution', resolution.value)
      response = await generateApi.createActionCopy(formData)
    }
    // 视频换人
    else if (Number(type.value) === 2) {
      tool_name = '视频换人'
      if (roleFile.value) {
        formData.append('body_image', roleFile.value)
      }
      if (videoFile.value) {
        formData.append('video', videoFile.value)
      }
      formData.append('resolution', resolution.value)
      formData.append('nth_body', String(nth.value))
      response = await generateApi.createVideoReplace(formData)
    }
    // 视频换脸
    else if (Number(type.value) === 3) {
      tool_name = '视频换脸'
      if (roleFile.value) {
        formData.append('face_image', roleFile.value)
      }
      if (videoFile.value) {
        formData.append('video', videoFile.value)
      }
      formData.append('resolution', resolution.value)
      formData.append('nth_face', String(nth.value))
      response = await generateApi.createVideoReplaceFace(formData)
    }
    if (response?.code === 1) {
      message.success('创建任务成功')
      emits('generateSuccess', {
        task_id: response?.data?.prompt_id,
        method_type: 'Animate',
        tool_name: tool_name,
        createtime: new Date().getTime(),
        request_params: {
          resolution: resolution.value
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
</style>
