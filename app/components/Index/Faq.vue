<template>
  <div class="index-faq">
    <div class="wrapper">
      <div class="index-faq_header">
        <h2>{{ t('page.index.faq.title') }}</h2>
      </div>
      <div class="index-faq_list">
        <a-collapse v-model:activeKey="active" accordion>
          <a-collapse-panel
            v-for="(item, i) in tm('page.index.faq.list')"
            :key="i"
            class="faq-item"
          >
            <template #header>
              <div class="index-faq_title">
                <span class="faq-number">{{ i < 9 ? '0' + (i + 1) : i + 1 }}</span>
                <span class="faq-text">{{ rt(item.title) }}</span>
              </div>
            </template>
            <div class="index-faq_content">
              {{ rt(item.content) }}
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, rt, tm } = useI18n()

const active = ref<string[]>(['0'])
</script>

<style lang="scss" scoped>
.index-faq {
  width: 100%;
  padding: 80px 0;
  background: linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
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
      radial-gradient(circle at 20% 30%, rgba(13, 255, 255, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(160, 0, 191, 0.04) 0%, transparent 40%);
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
  }

  &_header {
    padding-bottom: 60px;
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
      background: linear-gradient(90deg, transparent, rgba(13, 255, 255, 0.4), rgba(160, 0, 191, 0.4), transparent);
      border-radius: 2px;
      opacity: 0.6;
    }

    h2 {
      margin: 0;
      font-size: 30px;
      line-height: 1.4;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;

      @media (max-width: 768px) {
        font-size: 24px;
      }

      @media (max-width: 480px) {
        font-size: 20px;
      }
    }
  }

  &_list {
    max-width: 900px;
    margin: 0 auto;
  }

  &_title {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.5;
    transition: all 0.3s ease;

    .faq-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      background: linear-gradient(135deg, rgba(13, 255, 255, 0.1) 0%, rgba(160, 0, 191, 0.1) 100%);
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #0051ef;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .faq-text {
      flex: 1;
      word-break: break-word;
      text-align: left;
    }

    @media (max-width: 768px) {
      font-size: 15px;
      gap: 14px;

      .faq-number {
        min-width: 32px;
        height: 32px;
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      font-size: 14px;
      gap: 12px;

      .faq-number {
        min-width: 28px;
        height: 28px;
        font-size: 12px;
      }
    }
  }

  &_content {
    font-size: 14px;
    line-height: 1.7;
    color: #64748b;
    font-weight: 400;
    padding-left: 52px;
    text-align: left;
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 13px;
      padding-left: 46px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      padding-left: 40px;
      line-height: 1.6;
    }
  }
}

// Ant Design Vue Collapse 样式覆盖
.index-faq {
  :deep(.ant-collapse) {
    border: none;
    background: transparent;
  }

  :deep(.faq-item) {
    margin-bottom: 16px;
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: rgba(13, 255, 255, 0.2);
      box-shadow: 
        0 4px 16px rgba(13, 255, 255, 0.1),
        0 2px 8px rgba(160, 0, 191, 0.08),
        0 1px 4px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);
    }

    &.ant-collapse-item-active {
      border-color: rgba(13, 255, 255, 0.3);
      box-shadow: 
        0 8px 24px rgba(13, 255, 255, 0.15),
        0 4px 12px rgba(160, 0, 191, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.08);
    }
  }

  :deep(.ant-collapse-header) {
    padding: 16px 20px;
    background-color: transparent;
    height: auto !important;
    line-height: 1;
    border-bottom: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
      .index-faq_title {
        .faq-number {
          background: linear-gradient(135deg, rgba(13, 255, 255, 0.2) 0%, rgba(160, 0, 191, 0.2) 100%);
          transform: scale(1.05);
        }
      }
    }

    @media (max-width: 768px) {
      padding: 14px 18px;
    }

    @media (max-width: 480px) {
      padding: 12px 16px;
    }
  }

  :deep(.ant-collapse-content) {
    background-color: transparent;
    border-top: none;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0 20px 20px;
    background: linear-gradient(180deg, rgba(248, 250, 253, 0.3) 0%, transparent 100%);
    text-align: left;

    @media (max-width: 480px) {
      padding: 0 16px 16px;
    }
  }

  :deep(.ant-collapse-arrow) {
    color: #64748b;
    font-size: 16px;
    transition: all 0.3s ease;
    margin-left: 10px;
    display: flex;
    align-items: center;
    height: 36px;

    @media (max-width: 768px) {
      height: 32px;
      font-size: 15px;
    }

    @media (max-width: 480px) {
      height: 28px;
      font-size: 14px;
    }
  }

  :deep(.ant-collapse-item-active .ant-collapse-arrow) {
    color: #0051ef;
    transform: rotate(90deg);
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
  .index-faq {
    padding: 60px 0;

    .wrapper {
      padding: 0 16px;
    }

    &_header {
      padding-bottom: 40px;
    }
  }
}

@media (max-width: 480px) {
  .index-faq {
    padding: 50px 0;

    .wrapper {
      padding: 0 12px;
    }

    &_header {
      padding-bottom: 32px;
    }
  }
}

@media only screen and (min-width: 992px) {
  .index-faq {
    padding: 100px 0;

    .wrapper {
      padding: 0 40px;
    }

    &_header {
      padding-bottom: 80px;

      h2 {
        font-size: 36px;
      }
    }
  }
}

@media only screen and (min-width: 1200px) {
  .index-faq {
    padding: 120px 0;

    &_header {
      h2 {
        font-size: 40px;
      }
    }
  }
}
</style>
