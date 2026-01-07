<template>
  <div class="index-remove">
    <div class="wrapper">
      <div class="remove-header">
        <h2>
          {{ t('page.index.remove.title') }}
        </h2>
        <p>{{ t('page.index.remove.desc') }}</p>
      </div>
      <a-row :gutter="40">
        <a-col
          v-for="(item, i) in tm('page.index.remove.list')"
          :key="i"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="remove-item">
            <img :src="rt(item.image)" alt="" loading="lazy" />
            <h3>
              <i>{{ i + 1 }}</i> {{ rt(item.title) }}
            </h3>
            <p>{{ rt(item.desc) }}</p>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, tm } = useI18n()
</script>

<style lang="scss" scoped>
.index-remove {
  padding: 80px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafd 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background: 
      radial-gradient(circle at 10% 20%, rgba(114, 46, 209, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(179, 127, 235, 0.04) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    padding: 60px 0;
  }

  @media (max-width: 480px) {
    padding: 40px 0;
  }

  .wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      padding: 0 16px;
    }

    @media (max-width: 480px) {
      padding: 0 12px;
    }
  }

  .remove-header {
    text-align: center;
    margin-bottom: 50px;
    animation: fadeInUp 0.8s ease-out;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, transparent, rgba(114, 46, 209, 0.4), rgba(179, 127, 235, 0.4), transparent);
      border-radius: 2px;
      opacity: 0.6;
    }

    @media (max-width: 768px) {
      margin-bottom: 40px;
    }

    @media (max-width: 480px) {
      margin-bottom: 32px;
    }

    h2 {
      margin: 0 0 20px;
      font-size: 30px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
      line-height: 1.4;
      position: relative;
      display: inline-block;

      @media (max-width: 768px) {
        font-size: 24px;
        margin-bottom: 16px;
      }

      @media (max-width: 480px) {
        font-size: 20px;
        margin-bottom: 12px;
      }
    }

    p {
      font-size: 14px;
      max-width: 760px;
      margin: 0 auto;
      color: #64748b;
      line-height: 1.6;
      letter-spacing: 0.01em;
      animation: fadeInUp 0.8s ease-out 0.2s both;

      @media (max-width: 768px) {
        font-size: 13px;
        padding: 0 16px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
        padding: 0 12px;
      }
    }
  }

  .remove-item {
    margin-top: 0;
    display: flex;
    flex-direction: column;
    animation: fadeInUp 0.8s ease-out both;
    background: #ffffff;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(114, 46, 209, 0.1);
    box-shadow: 
      0 2px 8px rgba(114, 46, 209, 0.06),
      0 1px 3px rgba(0, 0, 0, 0.04),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    height: 100%;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(114, 46, 209, 0.02) 0%, rgba(179, 127, 235, 0.02) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
    }

    &:nth-child(1) {
      animation-delay: 0.1s;
    }

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }

    @media (max-width: 768px) {
      padding: 18px;
      border-radius: 16px;
    }

    @media (max-width: 480px) {
      padding: 16px;
      border-radius: 12px;
    }

    &:hover {
      transform: translateY(-8px);
      border-color: rgba(114, 46, 209, 0.2);
      box-shadow: 
        0 16px 40px rgba(114, 46, 209, 0.15),
        0 8px 20px rgba(179, 127, 235, 0.12),
        0 4px 12px rgba(0, 0, 0, 0.08);

      &::before {
        opacity: 1;
      }

      img {
        transform: scale(1.03);
      }

      h3 i {
        transform: scale(1.1) rotate(5deg);
        background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
        color: #ffffff;
        box-shadow: 0 4px 16px rgba(114, 46, 209, 0.4);
        border-color: rgba(114, 46, 209, 0.3);
      }

      h3 {
        color: #722ed1;
      }

      p {
        color: #475569;
      }
    }

    img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 12px;
      box-shadow: 
        0 2px 8px rgba(114, 46, 209, 0.08),
        0 1px 3px rgba(0, 0, 0, 0.04);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      object-fit: cover;
      aspect-ratio: 16 / 10;
      margin-bottom: 16px;
      border: 1px solid rgba(114, 46, 209, 0.08);

      @media (max-width: 768px) {
        border-radius: 10px;
        margin-bottom: 14px;
      }

      @media (max-width: 480px) {
        border-radius: 8px;
        margin-bottom: 12px;
      }
    }

    h3 {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin: 0 0 10px;
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.4;
      height: auto;
      overflow: visible;
      transition: color 0.3s ease;

      @media (max-width: 768px) {
        font-size: 15px;
        margin-bottom: 8px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
        margin-bottom: 8px;
      }

      i {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-style: normal;
        width: 32px;
        height: 32px;
        line-height: 1;
        text-align: center;
        border-radius: 8px;
        color: #722ed1;
        background: linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(179, 127, 235, 0.1) 100%);
        font-weight: 700;
        font-size: 14px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
        border: 1px solid rgba(114, 46, 209, 0.2);
        box-shadow: 0 2px 4px rgba(114, 46, 209, 0.1);

        @media (max-width: 768px) {
          width: 28px;
          height: 28px;
          font-size: 13px;
          margin-right: 8px;
          border-radius: 7px;
        }

        @media (max-width: 480px) {
          width: 26px;
          height: 26px;
          font-size: 12px;
          margin-right: 8px;
          border-radius: 6px;
        }
      }
    }

    p {
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
      color: #64748b;
      letter-spacing: 0.01em;
      transition: color 0.3s ease;

      @media (max-width: 768px) {
        font-size: 12px;
        line-height: 1.6;
      }

      @media (max-width: 480px) {
        font-size: 11px;
        line-height: 1.55;
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
</style>

