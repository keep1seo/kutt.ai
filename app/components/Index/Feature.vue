<template>
  <div class="index-feature">
    <div class="wrapper">
      <a-row :gutter="32">
        <a-col
          v-for="(item, index) in tm('page.index.feature.list')"
          :key="index"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <dl class="feature-item">
            <dt>
              <div class="icon-wrapper">
                <img :src="rt(item.image)" :alt="rt(item.title)" loading="lazy" />
              </div>
            </dt>
            <dd>
              <h3>{{ rt(item.title) }}</h3>
              <p>{{ rt(item.desc) }}</p>
            </dd>
          </dl>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, tm } = useI18n()
</script>

<style lang="scss" scoped>
.index-feature {
  width: 100%;
  padding: 70px 0;
  background: rgba(31, 41, 55, 1);
  color: rgba(216, 216, 219, 1);
  position: relative;
  overflow: hidden;

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
  }

  .wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    z-index: 1;

    :deep(.ant-row) {
      margin-bottom: 0;
    }

    :deep(.ant-col) {
      margin-bottom: 40px;

      @for $i from 1 through 4 {
        &:nth-child(#{$i}) .feature-item {
          animation-delay: #{$i * 0.1}s;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }

      // 只在每行显示多个的情况下，才移除倒数第二个的 margin-bottom
      @media (min-width: 768px) {
        &:nth-last-child(2) {
          margin-bottom: 0;
        }
      }
    }

    @media (max-width: 768px) {
      padding: 0 16px;
    }

    @media (max-width: 480px) {
      padding: 0 12px;
    }
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0;
    padding: 0;
    border-radius: 0;
    transition: all 0.3s ease;
    cursor: default;
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
    height: 100%;

    &:hover {
      dt {
        .icon-wrapper {
          background: linear-gradient(135deg, rgba(114, 46, 209, 0.15) 0%, rgba(179, 127, 235, 0.15) 100%);
          border-color: rgba(114, 46, 209, 0.3);
          transform: translateY(-4px);
          box-shadow: 
            0 12px 24px rgba(114, 46, 209, 0.2),
            0 4px 12px rgba(179, 127, 235, 0.15),
            0 0 0 1px rgba(114, 46, 209, 0.2);
        }

        img {
          transform: scale(1.1);
        }
      }

      dd h3 {
        color: #fff;
        text-shadow: 0 2px 8px rgba(114, 46, 209, 0.3);
      }

      dd p {
        color: rgba(255, 255, 255, 0.95);
      }
    }

    dt,
    dd {
      margin: 0;
    }

    dt {
      flex-shrink: 0;
      margin-right: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding-top: 2px;

      .icon-wrapper {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid rgba(114, 46, 209, 0.15);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(114, 46, 209, 0.2) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(114, 46, 209, 0.08) 0%, rgba(179, 127, 235, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        &:hover::before {
          width: 100px;
          height: 100px;
        }

        &:hover::after {
          opacity: 1;
        }
      }

      img {
        display: block;
        width: 36px;
        height: 36px;
        object-fit: contain;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        filter: brightness(1.15) drop-shadow(0 2px 4px rgba(114, 46, 209, 0.2));
        position: relative;
        z-index: 1;
      }
    }

    dd {
      flex: 1;
      min-width: 0;
      padding-top: 0;

      h3 {
        margin: 0 0 10px;
        font-size: 20px;
        font-weight: 600;
        line-height: 1.4;
        color: #fff;
        letter-spacing: -0.02em;
        transition: all 0.3s ease;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #722ed1 0%, #b37feb 100%);
          transition: width 0.4s ease;
        }
      }

      &:hover h3::after {
        width: 100%;
      }

      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: rgba(216, 216, 219, 0.85);
        letter-spacing: 0.01em;
        transition: color 0.3s ease;
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
    padding: 50px 0;

    :deep(.ant-col) {
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .feature-item {

      dt {
        margin-right: 18px;

        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
        }

        img {
          width: 32px;
          height: 32px;
        }
      }

      dd {
        padding-top: 0;

        h3 {
          font-size: 18px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        p {
          font-size: 13px;
          line-height: 1.6;
        }
      }
    }
  }

  @media (max-width: 480px) {
    padding: 40px 0;

    .feature-item {
      flex-direction: column;
      align-items: center;
      text-align: center;

      dt {
        margin-right: 0;
        margin-bottom: 16px;
        padding-top: 0;

        .icon-wrapper {
          width: 56px;
          height: 56px;
        }

        img {
          width: 32px;
          height: 32px;
        }
      }

      dd {
        padding-top: 0;

        h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }

        p {
          font-size: 13px;
          line-height: 1.6;
        }
      }
    }
  }
}
</style>
