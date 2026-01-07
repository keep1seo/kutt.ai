<template>
  <a-modal
    v-model:open="visible"
    :closable="false"
    :mask-closable="false"
    :width="isMobile ? '90%' : 1100"
    :footer="null"
    centered
  >
    <div class="dialog">
      <!--登录-->
      <template v-if="type === 1">
        <Login @close="visible = false" @register="type = 2" />
      </template>
      <!--注册-->
      <template v-else>
        <Register @close="visible = false" @login="type = 1" />
      </template>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import Login from './components/Login.vue'
import Register from './components/Register.vue'

/* Hook */
const appStore = useAppStore()

// state
const state = reactive({
  // 类型
  type: 1 // 1: 登录 2: 注册,
})

// toRefs
const { type } = toRefs(state)

// 登录弹窗是否可见
const visible = computed({
  get: () => appStore.loginVisible,
  set: (val: boolean) => appStore.setLoginVisible(val)
})

// 响应式
const isMobile = computed(() => {
  if (import.meta.client) {
    return window.innerWidth < 768
  }
  return false
})
</script>

<style lang="scss" scoped>
// 弹框容器样式覆盖
:deep(.ant-modal-content) {
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  background: #ffffff;
}

:deep(.ant-modal-body) {
  padding: 0;
}

.dialog {
  position: relative;
  width: 100%;
  min-height: 450px;
}
</style>
