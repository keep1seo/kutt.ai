// @ts-nocheck
import httpRequest from '~/composables/useApi'

export const useSquareApi = () => {
  const { locale } = useI18n()

  return {
    // 列表
    list: (data?: any) => {
      // 使用动态key，包含分类参数，确保不同分类的请求不会被缓存
      const key = `squareList-${data?.category_one || ''}-${data?.category_two || ''}-${data?.page || 1}`
      return httpRequest.post('/api/ai/video/base/getSquareList', data || {}, {
        headers: {
          Language: locale.value
        },
        key: key
      })
    }
  }
}
