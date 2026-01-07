<template>
  <div class="home-price">
    <div class="home-price-wrap">
      <div class="home-price-header">
        <h2>{{ $t('pages.price.config.title') }}</h2>
        <p>{{ $t('pages.price.config.desc') }}</p>
      </div>

      <div class="home-price-tabs">
        <div class="home-price-tabs_wrap">
          <div
            class="home-price-tab"
            :class="{ active: state.tabIndex === 0 }"
            @click="state.tabIndex = 0"
          >
            {{ $t('pages.price.config.standard.title') }}
          </div>
          <div
            class="home-price-tab"
            :class="{ active: state.tabIndex === 1 }"
            @click="state.tabIndex = 1"
          >
            {{ $t('pages.price.config.custom.title') }}
          </div>
        </div>
      </div>

      <div class="home-price-content">
        <PriceStandard v-if="state.tabIndex === 0"></PriceStandard>
        <PriceCustom v-if="state.tabIndex === 1"></PriceCustom>
      </div>
    </div>

    <IndexFaq />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n'

  /* Hook */
  const { t } = useI18n()

  useSeoMeta({
    title: t('page.price.title'),
    ogTitle: t('page.price.title'),
    ogDescription: t('page.price.description'),
    description: t('page.price.description'),
    keywords: t('page.price.keywords')
  })
  
  const state = reactive({
    tabIndex: 0
  })
</script>

<style lang="scss" scoped>
.home-price {
  padding: 0;
  background-color: #ffffff;

  &-wrap {
    padding: 0 20px;
    padding-bottom: 100px;
    max-width: 1200px;
    margin: 0 auto;
  }

  &-header {
    margin-bottom: 48px;
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

    h2 {
      margin: 0 0 20px;
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
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

    p {
      margin: 0;
      font-size: 18px;
      line-height: 1.8;
      color: rgba(0, 0, 0, 0.65);
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 1;
      animation: fadeInUp 0.6s ease-out 0.2s both;

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

  &-tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;

    &_wrap {
      width: 100%;
      max-width: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      border-radius: 8px;
      background-color: rgba(242, 237, 255, 0.5);
    }
  }

  &-tab {
    flex: 1;
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;

    &.active {
      background-color: #ffffff;
      border-radius: 8px;
      font-weight: 700;
    }
  }
}
</style>
