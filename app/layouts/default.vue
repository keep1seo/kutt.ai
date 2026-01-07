<template>
  <div class="layout">
    <Header />
    <main>
      <slot />
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

/* Hook */
const route = useRoute()

// 是否显示底部
const showFooter = computed(() => {
  return !route.meta.hiddenFooter
})
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;

  main {
    padding-top: 64px; // 为固定导航栏留出空间
    min-height: calc(100vh - 64px);
  }
}
</style>
