```javascript
/**
 * useApi 使用示例
 * 
 * 这个文件展示了如何使用 useApi 进行 API 请求
 * 你可以删除这个文件，它仅作为参考
 */

// ========== 基础用法 ==========

// 1. GET 请求
export function exampleGet() {
  const { data, pending, error, refresh } = useApiGet('/api/users', {
    page: 1,
    limit: 10
  })

  // data 会自动提取响应中的 data 字段
  // 如果响应是 { code: 200, message: 'success', data: [...] }
  // 那么 data.value 就是 [...]
  
  return { data, pending, error, refresh }
}

// 2. POST 请求
export function examplePost() {
  const { data, pending, error } = useApiPost('/api/users', {
    name: 'John',
    email: 'john@example.com'
  })

  return { data, pending, error }
}

// 3. PUT 请求
export function examplePut() {
  const { data, pending, error } = useApiPut('/api/users/1', {
    name: 'John Updated',
    email: 'john.updated@example.com'
  })

  return { data, pending, error }
}

// 4. DELETE 请求
export function exampleDelete() {
  const { data, pending, error } = useApiDelete('/api/users/1')

  return { data, pending, error }
}

// 5. PATCH 请求
export function examplePatch() {
  const { data, pending, error } = useApiPatch('/api/users/1', {
    name: 'John Patched'
  })

  return { data, pending, error }
}

// ========== 高级用法 ==========

// 6. 使用完整选项
export function exampleWithOptions() {
  const { data, pending, error } = useApi('/api/users', {
    method: 'POST',
    data: { name: 'John' },
    headers: {
      'Authorization': 'Bearer token123'
    },
    loading: true,
    showError: true,
    // 自定义响应处理
    onResponse({ response }) {
      console.log('响应:', response._data)
    },
    // 自定义错误处理
    onResponseError({ response }) {
      console.error('错误:', response.status, response._data)
    }
  })

  return { data, pending, error }
}

// 7. 在组件中使用
export function exampleInComponent() {
  // 在 Vue 组件中
  const userId = ref(1)
  
  const { data: user, pending, error, refresh } = useApiGet(
    () => `/api/users/${userId.value}`,
    undefined,
    {
      // 当 userId 改变时自动重新请求
      watch: [userId]
    }
  )

  return { user, pending, error, refresh }
}

// 8. 条件请求
export function exampleConditional() {
  const shouldFetch = ref(false)
  
  const { data, pending, error } = useApiGet('/api/users', undefined, {
    // 只有当 shouldFetch 为 true 时才发起请求
    immediate: false
  })

  watch(shouldFetch, (value) => {
    if (value) {
      // 手动触发请求
      refresh()
    }
  })

  return { data, pending, error }
}

// 9. 使用响应式 URL
export function exampleReactiveUrl() {
  const endpoint = ref('/api/users')
  
  const { data, pending, error } = useApiGet(
    () => endpoint.value,
    { page: 1 }
  )

  // 当 endpoint 改变时，会自动重新请求
  return { data, pending, error }
}


```