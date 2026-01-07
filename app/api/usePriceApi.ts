// @ts-nocheck
import httpRequest from '~/composables/useApi'
import request from '~/composables/useRequest'

export const usePriceApi = () => {
  const { locale } = useI18n()
  const userInfo = useCookie('userInfo')

  return {
    // 获取价格列表
    getPriceList: (data?: any) => {
      return request.post('/api/user/get_price_list', data || {}, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 发起用户充值积分
    initiateUserRechargeScore: (data: any) => {
      return request.post('/api/user/initiate_user_recharge_score', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    },
    // 价格咨询提交
    addPriceConsult: (data: any) => {
      return request.post('/api/user/add_price_consult', data, {
        headers: {
          Language: locale.value,
          token: userInfo.value?.token || ''
        }
      })
    }
  }
}
