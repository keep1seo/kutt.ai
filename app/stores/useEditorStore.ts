import { defineStore } from 'pinia'

// 全局文件存储 Map（用于存储 File 对象，因为 Pinia 不能直接存储 File）
const fileStorage = new Map<string, File>()

/**
 * 编辑器数据 Store
 * 用于在多个编辑器实例之间共享数据
 */
export const useEditorStore = defineStore('editorStore', {
  state: () => ({
    // 当前激活的 tab
    activeKey: 'video' as 'video' | 'image' | 'digital' | 'action',
    
    // 视频生成数据
    video: {
      firstFrameFileId: null as string | null,
      firstFramePreview: null as string | null,
      lastFrameFileId: null as string | null,
      lastFramePreview: null as string | null,
      originalImageFileId: null as string | null,
      originalImagePreview: null as string | null,
      prompt: '',
      cameraFixed: false,
      promptExtend: false,
      ratio: '1:1',
      resolution: '480P',
      duration: 5,
      type: '特效视频',
      model: 'kutt',
      effectId: '',
      effectVideoSrc: '/video/effect.mp4'
    },
    
    // 图片生成数据
    image: {
      roleFileId: null as string | null,
      rolePreview: null as string | null,
      prompt: '',
      isTranslate: false,
      width: 1024,
      height: 1024,
      model: 'flux'
    },
    
    // 数字人数据
    digital: {
      roleFileId: null as string | null,
      rolePreview: null as string | null,
      actionFileId: null as string | null,
      actionVoiceName: '',
      voiceAudioFileId: null as string | null,
      voiceAudioName: '',
      selectedVoice: null as any,
      prompt: '',
      audio_text: '',
      resolution: '480P',
      voice: 'Cherry'
    },
    
    // 动作模仿数据
    action: {
      roleFileId: null as string | null,
      rolePreview: null as string | null,
      videoFileId: null as string | null,
      videoName: '',
      type: '1',
      resolution: '480P',
      nth: 1
    }
  }),
  
  actions: {
    /**
     * 设置当前激活的 tab
     */
    setActiveKey(key: 'video' | 'image' | 'digital' | 'action') {
      this.activeKey = key
    },
    
    /**
     * 存储文件并返回文件 ID
     */
    storeFile(file: File | null): string | null {
      if (!file) return null
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      fileStorage.set(fileId, file)
      return fileId
    },
    
    /**
     * 获取文件对象
     */
    getFile(fileId: string | null): File | null {
      if (!fileId) return null
      return fileStorage.get(fileId) || null
    },
    
    /**
     * 删除文件
     */
    removeFile(fileId: string | null) {
      if (fileId) {
        fileStorage.delete(fileId)
      }
    },
    
    /**
     * 更新视频生成数据
     */
    updateVideoData(data: Partial<typeof this.video>) {
      Object.assign(this.video, data)
    },
    
    /**
     * 更新图片生成数据
     */
    updateImageData(data: Partial<typeof this.image>) {
      Object.assign(this.image, data)
    },
    
    /**
     * 更新数字人数据
     */
    updateDigitalData(data: Partial<typeof this.digital>) {
      Object.assign(this.digital, data)
    },
    
    /**
     * 更新动作模仿数据
     */
    updateActionData(data: Partial<typeof this.action>) {
      Object.assign(this.action, data)
    },
    
    /**
     * 清空指定类型的数据
     */
    clearData(type: 'video' | 'image' | 'digital' | 'action') {
      if (type === 'video') {
        if (this.video.firstFrameFileId) this.removeFile(this.video.firstFrameFileId)
        if (this.video.lastFrameFileId) this.removeFile(this.video.lastFrameFileId)
        if (this.video.originalImageFileId) this.removeFile(this.video.originalImageFileId)
        this.video = {
          firstFrameFileId: null,
          firstFramePreview: null,
          lastFrameFileId: null,
          lastFramePreview: null,
          originalImageFileId: null,
          originalImagePreview: null,
          prompt: '',
          cameraFixed: false,
          promptExtend: false,
          ratio: '1:1',
          resolution: '480P',
          duration: 5,
          type: '特效视频',
          model: 'kutt',
          effectId: '',
          effectVideoSrc: '/video/effect.mp4'
        }
      } else if (type === 'image') {
        if (this.image.roleFileId) this.removeFile(this.image.roleFileId)
        this.image = {
          roleFileId: null,
          rolePreview: null,
          prompt: '',
          isTranslate: false,
          width: 1024,
          height: 1024,
          model: 'flux'
        }
      } else if (type === 'digital') {
        if (this.digital.roleFileId) this.removeFile(this.digital.roleFileId)
        if (this.digital.actionFileId) this.removeFile(this.digital.actionFileId)
        if (this.digital.voiceAudioFileId) this.removeFile(this.digital.voiceAudioFileId)
        this.digital = {
          roleFileId: null,
          rolePreview: null,
          actionFileId: null,
          actionVoiceName: '',
          voiceAudioFileId: null,
          voiceAudioName: '',
          selectedVoice: null,
          prompt: '',
          audio_text: '',
          resolution: '480P',
          voice: 'Cherry'
        }
      } else if (type === 'action') {
        if (this.action.roleFileId) this.removeFile(this.action.roleFileId)
        if (this.action.videoFileId) this.removeFile(this.action.videoFileId)
        this.action = {
          roleFileId: null,
          rolePreview: null,
          videoFileId: null,
          videoName: '',
          type: '1',
          resolution: '480P',
          nth: 1
        }
      }
    }
  }
})

