<template>
  <div class="index-header">
    <div class="header-content">
      <h1 class="header-title">
        <span class="title-text">{{ t('page.index.header.title') }}</span>
      </h1>
      <h2 class="header-subtitle">
        {{ t('page.index.header.subtitle') }}
      </h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
</script>

<style lang="scss" scoped>
.index-header {
  width: 100%;
  padding: 0;
  margin: 0 auto;
  max-width: 1280px;
  position: relative;

  .header-content {
    text-align: center;
    padding: 100px 20px 40px;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
      padding: 80px 16px 30px;
    }

    @media (max-width: 480px) {
      padding: 60px 12px 24px;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(114, 46, 209, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      z-index: 0;
    }
  }

  .header-title {
    margin: 0 0 20px 0;
    position: relative;
    display: inline-block;
    z-index: 1;

    @media (max-width: 768px) {
      margin-bottom: 20px;
    }

    .title-text {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      display: block;
      background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 1;
      letter-spacing: -0.5px;
      animation: fadeInUp 0.6s ease-out;

      @media (max-width: 768px) {
        font-size: 36px;
      }

      @media (max-width: 480px) {
        font-size: 28px;
      }
    }
  }

  .header-subtitle {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.8;
    margin: 0 auto;
    max-width: 700px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.6s ease-out 0.2s both;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    @media (max-width: 768px) {
      font-size: 16px;
      padding: 0 10px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
      padding: 0 12px;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
