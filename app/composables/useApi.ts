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
  request<T = any>(url: string, method: Methods, data: any, options?: any) {
    return new Promise((resolve, reject) => {
      let baseURL = 'https://api.effects.video'
      // let needUrl = ['get_text_channel_data', 'get_param_config_list', 'get_param_config_detail']
      // if (needUrl.filter((item) => url.includes(item))) {
      //   baseURL = 'http://127.0.0.1:1024'
      //   if (!import.meta.server) {
      //     baseURL = 'https://api.pixelfox.ai'
      //   }
      // }
      //
      // needUrl = ['get_article_list', 'get_article_detail']
      // if (needUrl.filter((item) => url.includes(item))) {
      //   baseURL = 'http://127.0.0.1:1024'
      //   if (!import.meta.server) {
      //     if (options && options?.headers?.defaultLocale === 'zh') {
      //       baseURL = 'https://pixelfoxai.com'
      //     } else {
      //       baseURL = 'https://api.pixelfox.ai'
      //     }
      //   }
      // }
      // if (url.indexOf('/ai/video') > -1) {
      //   baseURL = 'https://api.effects.video'
      // }

      const newOptions: any = {
        baseURL: baseURL,
        method: method,
        ...options
        // headers: {}
      }

      if (method === 'GET' || method === 'DELETE') {
        newOptions.params = data
      }
      if (method === 'POST' || method === 'PUT') {
        newOptions.body = data
      }
      useFetch(url, newOptions)
        .then((res: any) => {
          // 获取响应数据
          const responseData = res.data?.value || res._data

          // 获取 HTTP 状态码（从 error 中获取，因为 res.status 是请求生命周期状态如 'idle'/'pending'/'success'/'error'）
          const httpStatusCode = res.error?.value?.statusCode || res.error?.value?.status
          if (httpStatusCode === 401) {
            // 401 未授权，弹出登录弹框（仅在客户端）
            if (import.meta.client) {
              const appStore = getAppStore()
              if (appStore) {
                appStore.setLoginVisible(true)
              }
            }
            const errorMsg = responseData?.msg || '登录已过期，请重新登录'
            reject(new Error(errorMsg))
            return
          }

          // 优先检查响应体中的 code（如果存在）
          if (responseData && responseData.code !== undefined) {
            // 检查响应体中的 code 是否为 401
            if (responseData.code === 401) {
              // 401 未授权，弹出登录弹框（仅在客户端）
              if (import.meta.client) {
                const appStore = getAppStore()
                if (appStore) {
                  appStore.setLoginVisible(true)
                }
              }
              const errorMsg = responseData.msg || '登录已过期，请重新登录'
              reject(new Error(errorMsg))
              return
            }
            if (responseData.code === 1) {
              // code = 1 时，代表请求正常，不弹出提示，直接 resolve 响应体
              resolve(responseData)
              return
            } else {
              // code 不为 1 时，弹出提示并 reject
              const errorMsg = responseData.msg || `请求失败，错误码: ${responseData.code}`
              if (import.meta.client) {
                message.error(errorMsg)
              }
              reject(new Error(errorMsg))
              return
            }
          }

          // 如果响应体中没有 code 字段，再检查其他错误情况
          // 检查是否有错误
          if (res.error?.value) {
            // 检查错误状态码是否为 401
            const errorStatus = res.error.value?.status || res.error.value?.statusCode
            if (errorStatus === 401) {
              // 401 未授权，弹出登录弹框（仅在客户端）
              if (import.meta.client) {
                const appStore = getAppStore()
                if (appStore) {
                  appStore.setLoginVisible(true)
                }
              }
              const errorMsg =
                responseData?.msg || res.error.value?.data?.msg || '登录已过期，请重新登录'
              reject(new Error(errorMsg))
              return
            }

            // 检查响应体中的 code 是否为 401
            const errorCode = responseData?.code || res.error.value?.data?.code
            if (errorCode === 401) {
              // 401 未授权，弹出登录弹框（仅在客户端）
              if (import.meta.client) {
                const appStore = getAppStore()
                if (appStore) {
                  appStore.setLoginVisible(true)
                }
              }
              const errorMsg =
                responseData?.msg || res.error.value?.data?.msg || '登录已过期，请重新登录'
              reject(new Error(errorMsg))
              return
            }

            // 优先使用响应体中的 msg
            const errorMsg =
              responseData?.msg ||
              res.error.value?.data?.msg ||
              res.error.value?.message ||
              '请求失败，请稍后重试'
            if (import.meta.client) {
              message.error(errorMsg)
            }
            reject(res.error.value)
            return
          }
          // 如果没有 code 字段且没有其他错误，直接 resolve 响应数据
          resolve(responseData?.data || responseData)
        })
        .catch((error) => {
          // 检查错误状态码是否为 401
          const errorStatus = error?.status || error?.statusCode || error?.response?.status
          if (errorStatus === 401) {
            // 401 未授权，弹出登录弹框（仅在客户端）
            if (import.meta.client) {
              const appStore = getAppStore()
              if (appStore) {
                appStore.setLoginVisible(true)
              }
            }
            const errorMsg =
              error?.data?.msg || error?.response?.data?.msg || '登录已过期，请重新登录'
            reject(new Error(errorMsg))
            return
          }

          // 检查响应体中的 code 是否为 401
          const errorCode = error?.data?.code || error?.response?.data?.code
          if (errorCode === 401) {
            // 401 未授权，弹出登录弹框（仅在客户端）
            if (import.meta.client) {
              const appStore = getAppStore()
              if (appStore) {
                appStore.setLoginVisible(true)
              }
            }
            const errorMsg =
              error?.data?.msg || error?.response?.data?.msg || '登录已过期，请重新登录'
            reject(new Error(errorMsg))
            return
          }

          // 优先使用响应体中的 msg
          const errorMsg =
            error?.data?.msg ||
            error?.response?.data?.msg ||
            error?.message ||
            error?.statusMessage ||
            '请求失败，请稍后重试'
          if (import.meta.client) {
            message.error(errorMsg)
          }
          reject(error)
        })
    })
  }

  // 封装常用方法

  get<T = any>(url: string, params?: any, options?: any) {
    return this.request(url, 'GET', params, options)
  }

  post<T = any>(url: string, data: any, options?: any) {
    return this.request(url, 'POST', data, options)
  }

  Put<T = any>(url: string, data: any, options?: any) {
    return this.request(url, 'PUT', data, options)
  }

  Delete<T = any>(url: string, params: any, options?: any) {
    return this.request(url, 'DELETE', params, options)
  }
}

const httpRequest = new HttpRequest()

export default httpRequest
