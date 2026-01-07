// @ts-nocheck
import httpRequest from '~/composables/useApi'
import request from '~/composables/useRequest'

export const useUserApi = () => {
  const { locale } = useI18n()
  const userInfo = useCookie('userInfo')

  return {
    // 获取用户信息
    getUserInfo: (data?: any) => {
      return request.post('/api/user/index', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 登录接口
    login: (data: any) => {
      return request.post('/api/user/login', data, {
        headers: {
          Language: locale.value
        }
      })
    },
    // 谷歌登录
    googleLogin: (data: any) => {
      return request.post('/api/user/googlelogin', data, {
        headers: {
          Language: locale.value
        }
      })
    },
    // 退出登录
    logout: () => {
      return request.post(
        '/api/user/logout',
        {},
        {
          headers: {
            Language: locale.value,
            token: userInfo.value?.token || ''
          }
        }
      )
    },
    // 发送验证码
    sendCode: (data: any) => {
      return request.post('/api/ems/send', data, {
        headers: {
          Language: locale.value
        }
      })
    },
    // 注册
    register: (data: any) => {
      return request.post('/api/user/register', data, {
        headers: {
          Language: locale.value
        }
      })
    },
    // 设置用户信息
    setProfile: (data: any) => {
      return request.post('/api/user/profile', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取截图列表
    getUserScreenshotList: (data: any) => {
      return request.post('/api/user/get_user_screenshot_list', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取邀请奖励列表
    getUserInviteRewardList: (data: any) => {
      return request.post('/api/user/get_user_invite_reward_list', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取用户消费记录
    getConsumeLog: (data: any) => {
      return request.post('/api/user/get_user_consume_log', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取充值记录
    getRechargeLog: (data: any) => {
      return request.post('/api/user/get_user_recharge_log', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取用户订阅列表
    getUserSubscriptionList: (data: any) => {
      return request.post('/api/user/get_subscription_list', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 取消用户订阅
    cancelUserSubscription: (data: any) => {
      return request.post('/api/user/cancel_user_subscription', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 销毁用户
    destoryUser: (data?: any) => {
      return request.post('/api/user/destory', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 签到赠送积分
    signInGiftScore: (data?: any) => {
      return request.post('/api/user/sign_in_gift_score', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 获取用户邀请码和描述
    getInviteCodeAndDesc: (data?: any) => {
      return request.post('/api/user/get_invite_code_and_desc', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 修改密码
    updatePassword: (data: any) => {
      return request.post('/api/auth/password', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    }
  }
}
