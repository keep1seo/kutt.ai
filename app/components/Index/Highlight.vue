<template>
  <div class="index-highlight">
    <div class="wrapper">
      <div class="index-highlight_header">
        <h2>
          <span>{{ t('page.index.highlight.main_title') }}</span>
          <span class="index-highlight_header-title">
            {{ t('page.index.highlight.subtitle') }}
          </span>
        </h2>
      </div>

      <article 
        class="easier-item" 
        v-for="(item, index) in tm('page.index.highlight.list')"
        :key="index"
        :style="{ animationDelay: `${index * 0.15}s` }"
      >
        <div class="easier-item_image">
          <div class="image-wrapper">
            <img :src="rt(item.image)" :alt="rt(item.title)" loading="lazy" />
            <div class="image-overlay"></div>
          </div>
        </div>
        <div class="easier-item_content">
          <h3>{{ rt(item.title) }}</h3>
          <p>{{ rt(item.desc) }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, tm } = useI18n()
</script>

<style lang="scss" scoped>
.index-highlight {
  width: 100%;
  padding: 80px 0;
  background: linear-gradient(180deg, #f8fafd 0%, #ffffff 100%);
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
      radial-gradient(circle at 20% 30%, rgba(114, 46, 209, 0.04) 0%, transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(179, 127, 235, 0.04) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  .wrapper {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 1;
    width: 100%;
  }

  &_header {
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

    &-title {
      margin-right: 8px;
      background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .easier-item {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 60px;
    opacity: 0;
    animation: fadeInUp 0.8s ease-out forwards;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(114, 46, 209, 0.02) 0%, rgba(179, 127, 235, 0.02) 100%);
      border-radius: 24px;
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 0;
    }

    &:hover::before {
      opacity: 1;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &_image,
    &_content {
      padding: 16px 0;
      margin: 0;
      position: relative;
      z-index: 1;
    }

    &_image {
      flex: 1;
      display: flex;
      width: 100%;
      align-items: flex-start;

      .image-wrapper {
        position: relative;
        width: 100%;
        max-width: 528px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 
          0 4px 20px rgba(114, 46, 209, 0.08),
          0 1px 3px rgba(0, 0, 0, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        background: #ffffff;
        border: 1px solid rgba(114, 46, 209, 0.1);

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(179, 127, 235, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
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
            transform: scale(1.05);
          }

          .image-overlay {
            opacity: 0;
          }
        }

        img {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 20px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(114, 46, 209, 0.08) 0%, rgba(179, 127, 235, 0.08) 100%);
          opacity: 0.3;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 2;
        }
      }
    }

    &_content {
      flex: 1;
      width: 100%;

      h3 {
        margin: 0 0 16px;
        font-size: 22px;
        line-height: 1.4;
        font-weight: 700;
        color: #0f172a;
        letter-spacing: -0.01em;
        transition: all 0.3s ease;
        position: relative;
        display: inline-block;

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

        @media (max-width: 768px) {
          font-size: 20px;
        }

        @media (max-width: 480px) {
          font-size: 18px;
        }
      }

      &:hover h3::after {
        width: 100%;
      }

      p {
        margin: 0 0 20px;
        font-size: 14px;
        line-height: 1.6;
        color: #64748b;
        font-weight: 400;
        transition: color 0.3s ease;

        @media (max-width: 768px) {
          font-size: 13px;
          line-height: 1.55;
        }
      }

      &:hover p {
        color: #475569;
      }
    }

    &_link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #722ed1;
      text-decoration: none;
      font-size: 16px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 10px;
      background: rgba(114, 46, 209, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
      }

      svg {
        transition: transform 0.3s ease;
      }

      &:hover {
        background: rgba(114, 46, 209, 0.12);
        color: #531dab;
        transform: translateX(4px);
        box-shadow: 0 4px 12px rgba(114, 46, 209, 0.2);

        &::before {
          left: 100%;
        }

        svg {
          transform: translateX(4px);
        }
      }

      &:active {
        transform: translateX(2px);
      }
    }
  }
}

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

@media only screen and (min-width: 768px) {
  .index-highlight {
    padding: 100px 0;

    .wrapper {
      padding: 0 40px;
    }

    &_header {
      margin-bottom: 60px;

      h2 {
        font-size: 36px;
      }
    }

    .easier-item {
      margin-bottom: 80px;

      &_content {
        h3 {
          font-size: 26px;
        }

        p {
          font-size: 15px;
        }
      }
    }
  }
}

@media only screen and (min-width: 992px) {
  .index-highlight {
    padding: 120px 0;

    &_header {
      margin-bottom: 80px;

      h2 {
        font-size: 40px;
      }
    }

    .easier-item {
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 100px;
      gap: 0;

      &_image,
      &_content {
        padding: 0;
      }

      &_image {
        .image-wrapper {
          max-width: 600px;
        }
      }

      &_content {
        padding-left: 50px;
        max-width: 500px;
      }

      &:nth-child(odd) {
        flex-direction: row-reverse;

        .easier-item_image {
          justify-content: flex-end;
        }

        .easier-item_content {
          padding-left: 0;
          padding-right: 50px;
        }
      }
    }
  }
}

@media only screen and (min-width: 1200px) {
  .index-highlight {
    .easier-item {
      &_image {
        .image-wrapper {
          max-width: 650px;
        }
      }

      &_content {
        max-width: 550px;
      }
    }
  }
}
</style>
