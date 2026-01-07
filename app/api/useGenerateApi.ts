// @ts-nocheck
import request from '~/composables/useRequest'

export const useGenerateApi = () => {
  const { locale } = useI18n()
  const userInfo = useCookie('userInfo')

  return {
    // 音色列表
    voiceList: (data?: any) => {
      return request.post('/api/ai/video/base/get_voice_list', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 任务列表
    taskList: (data?: any) => {
      return request.post('/api/ai/video/base/getTaskList', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取任务结果
    taskResult: (data?: any) => {
      return request.post('/api/ai/video/base/getTaskResult', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 删除任务
    taskDelete: (data?: any) => {
      return request.post('/api/user/del_user_task', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取功能所需积分
    getFunctionStore: (data?: any) => {
      return request.post('/api/calculate_fun_score', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建数字人任务
    createDigitalHuman: (data?: any) => {
      return request.post('/api/ai/video/digital_human/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建动作模仿任务
    createActionCopy: (data?: any) => {
      return request.post('/api/ai/video/action_imitation/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建视频换人任务
    createVideoReplace: (data?: any) => {
      return request.post('/api/ai/video/body_swap_video/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建视频换脸任务
    createVideoReplaceFace: (data?: any) => {
      return request.post('/api/ai/video/face_swap_video/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建图片生成任务
    createImageGenerate: (data?: any) => {
      return request.post('/api/ai/img/generate_image/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 视频特效列表
    videoEffectList: (data?: any) => {
      return request.post('/api/ai/video/special_effects/get_special_effects_list', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建特效视频任务
    createVideoEffect: (data?: any) => {
      return request.post('/api/ai/video/special_effects/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 创建视频生成任务
    createVideoGenerate: (data?: any) => {
      return request.post('/api/ai/video/generate_video/createtask', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    }
  }
}
