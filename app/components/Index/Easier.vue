<template>
  <div class="index-easier">
    <div class="easier-title-wrapper">
      <h2 class="easier-title">{{ t('page.index.easier.title') }}</h2>
    </div>
    <div class="scroll-wrapper">
      <div class="scroll">
        <div v-for="(item, index) in doubledList" :key="index" class="logo-item">
          <div class="logo-wrapper">
            <NuxtImg
              :src="item.img"
              :alt="item.title"
              class="logo-image"
              loading="lazy"
              format="webp"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, locale, messages } = useI18n()

// 菜单列表
const list = computed(() => {
  const currentMessages = messages.value[locale.value]
  const data = currentMessages?.page?.index?.easier?.list

  if (!Array.isArray(data)) {
    return []
  }

  return data.map((item: any) => {
    return {
      title: rt(item.title) || '',
      img: rt(item.img) || ''
    }
  })
})

// 显示列表
const doubledList = computed(() => [...list.value, ...list.value, ...list.value])
</script>

<style lang="scss" scoped>
.index-easier {
  width: 100%;
  padding: 80px 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    padding: 60px 0;
  }

  @media (max-width: 480px) {
    padding: 40px 0;
  }

  .easier-title-wrapper {
    // max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;

    @media (max-width: 768px) {
      padding: 0 16px;
    }

    @media (max-width: 480px) {
      padding: 0 12px;
    }
  }

  .easier-title {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.3;
    text-align: center;
    margin: 0 0 60px 0;
    color: #0f172a;
    letter-spacing: -0.02em;
    animation: fadeInUp 0.8s ease-out;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #0f172a, transparent);
      border-radius: 2px;
      opacity: 0.3;
    }

    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 48px;

      &::after {
        width: 60px;
        height: 2px;
        bottom: -10px;
      }
    }

    @media (max-width: 480px) {
      font-size: 1.125rem;
      margin-bottom: 32px;

      &::after {
        width: 50px;
        bottom: -8px;
      }
    }
  }

  .scroll-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 120px;
      z-index: 10;
      pointer-events: none;
    }

    &::before {
      left: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }

    &::after {
      right: 0;
      background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }

    @media (max-width: 768px) {
      &::before,
      &::after {
        width: 80px;
      }
    }

    @media (max-width: 480px) {
      &::before,
      &::after {
        width: 60px;
      }
    }
  }

  .scroll {
    display: flex;
    align-items: center;
    width: fit-content;
    animation: scroll 30s linear infinite;

    .logo-item {
      display: inline-block;
      vertical-align: middle;
      margin: 0;
      padding: 0 30px;
      flex-shrink: 0;

      @media (max-width: 768px) {
        padding: 0 20px;
      }

      @media (max-width: 480px) {
        padding: 0 15px;
      }

      .logo-wrapper {
        width: 160px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        @media (max-width: 768px) {
          width: 140px;
          height: 70px;
          padding: 15px;
        }

        @media (max-width: 480px) {
          width: 120px;
          height: 60px;
          padding: 12px;
        }

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s ease;
        }

        &:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 0, 0, 0.08);

          &::before {
            left: 100%;
          }

          .logo-image {
            transform: scale(1.08);
          }
        }

        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: grayscale(0.2) opacity(0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover .logo-image {
          filter: grayscale(0) opacity(1);
        }
      }
    }
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

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>