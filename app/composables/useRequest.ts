import { message } from 'ant-design-vue'

type Methods = 'GET' | 'POST' | 'DELETE' | 'PUT'

// 获取 appStore 实例（延迟初始化，避免 SSR 问题）
const getAppStore = () => {
  if (import.meta.client) {
    return useAppStore()
  }
  return null
}

export interface IResultData<T> {
  code: number
  data: T
  msg: string
}

class HttpRequest {
  async request<T = any>(url: string, method: Methods, data: any, options?: any): Promise<T> {
    const baseURL = 'https://api.effects.video'

    const fetchOptions: any = {
      baseURL,
      method,
      ...options
    }

    if (method === 'GET' || method === 'DELETE') {
      fetchOptions.params = data
    }
    if (method === 'POST' || method === 'PUT') {
      fetchOptions.body = data
    }

    try {
      const responseData = await $fetch<any>(url, fetchOptions)

      // 检查响应体中的 code
      if (responseData && responseData.code !== undefined) {
        // 检查是否为 401
        if (responseData.code === 401) {
          if (import.meta.client) {
            const appStore = getAppStore()
            if (appStore) {
              appStore.setLoginVisible(true)
            }
          }
          throw new Error(responseData.msg || '登录已过期，请重新登录')
        }

        if (responseData.code === 1) {
          // code = 1 时，代表请求正常
          return responseData
        } else {
          // code 不为 1 时，弹出提示
          const errorMsg = responseData.msg || `请求失败，错误码: ${responseData.code}`
          if (import.meta.client) {
            message.error(errorMsg)
          }
          throw new Error(errorMsg)
        }
      }

      // 如果没有 code 字段，直接返回响应数据
      return responseData?.data || responseData
    } catch (error: any) {
      // 获取错误状态码和响应数据
      const errorStatus = error?.status || error?.statusCode || error?.response?.status
      const errorData = error?.data || error?.response?._data

      // 检查是否为 401
      if (errorStatus === 401 || errorData?.code === 401) {
        if (import.meta.client) {
          const appStore = getAppStore()
          if (appStore) {
            appStore.setLoginVisible(true)
          }
        }
        throw new Error(errorData?.msg || '登录已过期，请重新登录')
      }

      // 优先使用响应体中的 msg
      // const errorMsg =
      //   errorData?.msg || error?.message || error?.statusMessage || '请求失败，请稍后重试'
      // if (import.meta.client) {
      //   message.error(errorMsg)
      // }
      throw error
    }
  }

  get<T = any>(url: string, params?: any, options?: any) {
    return this.request<T>(url, 'GET', params, options)
  }

  post<T = any>(url: string, data: any, options?: any) {
    return this.request<T>(url, 'POST', data, options)
  }

  put<T = any>(url: string, data: any, options?: any) {
    return this.request<T>(url, 'PUT', data, options)
  }

  delete<T = any>(url: string, params: any, options?: any) {
    return this.request<T>(url, 'DELETE', params, options)
  }
}

const request = new HttpRequest()

export default request
