<template>
  <div class="index-toolset">
    <div class="wrapper">
      <div class="index-toolset_header">
        <h2>
          <span class="index-toolset_header-title">
            {{ t('page.index.toolset.main_title') }}
          </span>
          <span>{{ t('page.index.toolset.subtitle') }}</span>
        </h2>
        <p>{{ t('page.index.toolset.desc') }}</p>
      </div>

      <div class="index-toolset_list">
        <a-row :gutter="24">
          <a-col
            v-for="(item, index) in tm('page.index.toolset.list')"
            :key="index"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="8"
            :xl="8"
          >
            <NuxtLink
              :to="rt(item.link)"
              class="index-toolset_item"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="index-toolset_item-img">
                <div class="image-wrapper">
                  <img :src="rt(item.img)" :alt="rt(item.title)" loading="lazy" />
                  <div class="image-overlay"></div>
                </div>
              </div>
              <div class="index-toolset_item-content">
                <div class="index-toolset_item-title">
                  <h3>{{ rt(item.title) }}</h3>
                  <p
                    style="
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      line-clamp: 3;
                      -webkit-box-orient: vertical;
                      overflow: hidden;
                    "
                  >
                    {{ rt(item.desc) }}
                  </p>
                </div>

                <div class="index-toolset_item-icon">
                  <i :class="`iconfont ${rt(item.svg)}`"></i>
                </div>
              </div>
            </NuxtLink>
          </a-col>
        </a-row>
      </div>

      <div class="index-toolset_actions">
        <NuxtLink to="/tools">
          <a-button class="index-toolset_actions-button" shape="round">
            {{ t('page.index.toolset.button') }}
          </a-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, tm } = useI18n()
</script>

<style lang="scss" scoped>
.index-toolset {
  width: 100%;
  padding: 80px 0;
  padding-bottom: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafd 100%);
  position: relative;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(180deg, #1b1b20 0%, #1f1f24 100%);
  }

  // 背景装饰效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background:
      radial-gradient(circle at 10% 20%, rgba(114, 46, 209, 0.06) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(179, 127, 235, 0.06) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;

    @media (prefers-color-scheme: dark) {
      background:
        radial-gradient(circle at 10% 20%, rgba(114, 46, 209, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(179, 127, 235, 0.08) 0%, transparent 40%);
    }
  }

  .wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  &_header {
    padding-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(114, 46, 209, 0.5),
        rgba(179, 127, 235, 0.5),
        transparent
      );
      border-radius: 2px;
      opacity: 0.6;
    }

    &-title {
      margin-right: 8px;
      background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      display: inline-block;
    }

    h2 {
      margin: 0;
      font-size: 30px;
      line-height: 1.4;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
      position: relative;

      @media (prefers-color-scheme: dark) {
        color: #f1f5f9;
      }

      @media (max-width: 768px) {
        font-size: 24px;
      }

      @media (max-width: 480px) {
        font-size: 20px;
      }
    }

    p {
      margin: 28px 0 0;
      font-size: 15px;
      line-height: 1.6;
      max-width: 760px;
      color: #64748b;
      font-weight: 400;
      position: relative;

      @media (prefers-color-scheme: dark) {
        color: #94a3b8;
      }

      @media (max-width: 768px) {
        font-size: 14px;
        margin-top: 20px;
      }
    }
  }

  &_list {
    margin-bottom: 60px;

    :deep(.ant-row) {
      margin-left: -12px;
      margin-right: -12px;
    }

    :deep(.ant-col) {
      padding-left: 12px;
      padding-right: 12px;
      margin-bottom: 32px;
    }
  }

  &_item {
    display: block;
    height: 100%;
    padding: 0;
    border-radius: 24px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    color: #000;
    text-decoration: none;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
    position: relative;

    @media (prefers-color-scheme: dark) {
      background: #1f1f24;
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.3),
        0 1px 3px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(114, 46, 209, 0.05) 0%,
        rgba(179, 127, 235, 0.05) 100%
      );
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: 2;
    }

    &:hover {
      transform: translateY(-8px);
      border-color: rgba(114, 46, 209, 0.2);
      box-shadow:
        0 16px 40px rgba(114, 46, 209, 0.15),
        0 8px 20px rgba(179, 127, 235, 0.12),
        0 4px 12px rgba(0, 0, 0, 0.08);

      @media (prefers-color-scheme: dark) {
        border-color: rgba(179, 127, 235, 0.25);
        box-shadow:
          0 16px 40px rgba(114, 46, 209, 0.2),
          0 8px 20px rgba(179, 127, 235, 0.15),
          0 4px 12px rgba(0, 0, 0, 0.4);
      }

      &::before {
        opacity: 1;
      }

      &::after {
        opacity: 1;
      }

      .index-toolset_item-img {
        .image-wrapper {
          img {
            transform: scale(1.08);
            filter: brightness(1.05) saturate(1.1);
          }

          .image-overlay {
            opacity: 0;
          }
        }
      }

      .index-toolset_item-icon {
        transform: scale(1.1) rotate(5deg);
        background: linear-gradient(
          135deg,
          rgba(114, 46, 209, 0.15) 0%,
          rgba(179, 127, 235, 0.15) 100%
        );
        box-shadow:
          0 4px 12px rgba(114, 46, 209, 0.25),
          0 2px 6px rgba(179, 127, 235, 0.2);
      }

      .index-toolset_item-title {
        h3 {
          background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: translateX(2px);
        }

        p {
          color: #475569;
        }
      }
    }

    &-img {
      width: 100%;
      height: 240px;
      overflow: hidden;
      border-radius: 24px 24px 0 0;
      position: relative;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);

      @media (prefers-color-scheme: dark) {
        background: linear-gradient(135deg, #1e1e24 0%, #25252b 100%);
      }

      .image-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(1) saturate(1);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(114, 46, 209, 0.08) 0%,
            rgba(83, 29, 171, 0.05) 50%,
            rgba(179, 127, 235, 0.08) 100%
          );
          opacity: 0.3;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
      }
    }

    &-content {
      display: flex;
      align-items: center;
      padding: 24px 20px;
      position: relative;
      z-index: 2;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, #ffffff 100%);

      @media (prefers-color-scheme: dark) {
        background: linear-gradient(180deg, rgba(31, 31, 36, 0.5) 0%, #1f1f24 100%);
      }
    }

    &-title {
      flex: 1;
      min-width: 0;

      h3 {
        margin: 0 0 8px;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.4;
        color: #0f172a;
        transition: all 0.3s ease;
        letter-spacing: -0.01em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;

        @media (prefers-color-scheme: dark) {
          color: #f1f5f9;
        }

        @media (max-width: 768px) {
          font-size: 16px;
        }
      }

      p {
        margin: 0;
        font-size: 13px;
        line-height: 1.6;
        color: #64748b;
        font-weight: 400;

        @media (prefers-color-scheme: dark) {
          color: #94a3b8;
        }
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        transition: color 0.3s ease;

        @media (max-width: 768px) {
          font-size: 12px;
        }
      }
    }

    &-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 16px;
      width: 64px;
      height: 64px;
      min-width: 64px;
      border-radius: 16px;
      background: linear-gradient(
        135deg,
        rgba(226, 234, 244, 0.9) 0%,
        rgba(236, 226, 244, 0.9) 100%
      );
      border: 1px solid rgba(255, 255, 255, 0.8);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);

      @media (prefers-color-scheme: dark) {
        background: linear-gradient(
          135deg,
          rgba(114, 46, 209, 0.15) 0%,
          rgba(179, 127, 235, 0.15) 100%
        );
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow:
          0 2px 8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition:
          width 0.4s ease,
          height 0.4s ease;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          135deg,
          rgba(114, 46, 209, 0.1) 0%,
          rgba(179, 127, 235, 0.1) 100%
        );
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      &:hover::before {
        width: 120px;
        height: 120px;
      }

      i {
        font-size: 24px;
        color: #722ed1;
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;

        @media (prefers-color-scheme: dark) {
          color: #b37feb;
        }
      }
    }

    &:hover &-icon {
      &::after {
        opacity: 1;
      }

      i {
        color: #531dab;
        transform: scale(1.05);

        @media (prefers-color-scheme: dark) {
          color: #9d6dd9;
        }
      }
    }
  }

  &_actions {
    padding: 40px 0 0;
    text-align: center;

    &-button {
      padding: 0 48px;
      height: 56px;
      font-size: 16px;
      border-radius: 28px;
      font-weight: 600;
      letter-spacing: 0.01em;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      background: linear-gradient(135deg, #722ed1 0%, #531dab 30%, #8b5cf6 60%, #b37feb 100%);
      color: #ffffff;
      box-shadow: 
        0 4px 16px rgba(114, 46, 209, 0.3),
        0 2px 8px rgba(114, 46, 209, 0.2);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 
          0 8px 24px rgba(114, 46, 209, 0.4),
          0 4px 12px rgba(179, 127, 235, 0.3);
        background: linear-gradient(135deg, #531dab 0%, #3d1680 30%, #7c3aed 60%, #9d6dd9 100%);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(114, 46, 209, 0.2);
      }

      @media (max-width: 768px) {
        padding: 0 36px;
        height: 52px;
        font-size: 14px;
      }
    }
  }
}

// 动画定义
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式优化
@media (max-width: 768px) {
  .index-toolset {
    padding: 60px 0;

    .wrapper {
      padding: 0 16px;
    }

    &_header {
      padding-bottom: 40px;
    }

    &_list {
      margin-bottom: 40px;

      :deep(.ant-col) {
        margin-bottom: 20px;
      }
    }

    &_item {
      &-img {
        height: 200px;
      }

      &-content {
        padding: 16px;
      }

      &-icon {
        width: 56px;
        height: 56px;
        min-width: 56px;
        margin-left: 12px;
        border-radius: 14px;

        i {
          font-size: 18px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .index-toolset {
    padding: 50px 0;

    .wrapper {
      padding: 0 12px;
    }

    &_item {
      border-radius: 20px;

      &-img {
        height: 180px;
        border-radius: 20px 20px 0 0;
      }

      &-icon {
        width: 48px;
        height: 48px;
        min-width: 48px;
        border-radius: 12px;

        i {
          font-size: 16px;
        }
      }
    }
  }
}

@media only screen and (min-width: 992px) {
  .index-toolset {
    padding: 100px 0;

    .wrapper {
      padding: 0 40px;
    }

    &_header {
      padding-bottom: 80px;

      h2 {
        font-size: 40px;
      }

      p {
        font-size: 16px;
      }
    }

    &_item {
      &-img {
        height: 280px;
      }

      &-title {
        h3 {
          font-size: 20px;
        }

        p {
          font-size: 14px;
        }
      }
    }
  }
}

@media only screen and (min-width: 1200px) {
  .index-toolset {
    padding: 120px 0;
    padding-bottom: 0;

    &_header {
      h2 {
        font-size: 44px;
      }
    }
  }
}
</style>
