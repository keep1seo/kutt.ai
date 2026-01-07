<template>
  <!--进度条-->
  <NuxtLoadingIndicator color="#FFFFFF" />
  <ClientOnly>
    <!--登录弹框-->
    <LoginDialog />
  </ClientOnly>
  <!--界面-->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
/* Hook */
const route = useRoute()
// 邀请码
const inviteCode = useCookie('invite_code')
// 竞价标识
const gclid = useCookie('gclid')

/**
 * 禁用右键
 * @param e
 */
const preventContextMenu = (e: MouseEvent) => {
  e.preventDefault()
}

onMounted(() => {
  window.addEventListener('contextmenu', preventContextMenu)
  // 获取邀请码
  if (route.query.inviteCode) {
    // @ts-ignore
    inviteCode.value = route.query.inviteCode
  }
  // 获取竞价标识
  if (route.query.gclid) {
    // @ts-ignore
    gclid.value = route.query.gclid
  }
  const { proxy } = useScriptGoogleAnalytics({
    id: 'G-G8RYS0V8HZ'
  })
  // 在 ga 加载前排队事件
  proxy.gtag('config', 'AW-17027779787')
})

onUnmounted(() => {
  window.removeEventListener('contextmenu', preventContextMenu)
})
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* Element Plus 风格滚动条样式 - WebKit 浏览器 (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.5);
}

::-webkit-scrollbar-thumb:active {
  background: rgba(144, 147, 153, 0.6);
}

::-webkit-scrollbar-corner {
  background: transparent;
}

/* 深色模式滚动条样式 */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  ::-webkit-scrollbar-thumb:active {
    background: rgba(255, 255, 255, 0.4);
  }
}

/* Firefox 滚动条样式 */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(144, 147, 153, 0.3) transparent;
}

@media (prefers-color-scheme: dark) {
  * {
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}
</style>
