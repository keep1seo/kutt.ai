<template>
  <div class="index-ability">
    <div class="wrapper">
      <div class="index-ability_header">
        <h2>
          <span class="index-ability_header-title">
            {{ t('page.index.ability.main_title') }}
          </span>
          <span>{{ t('page.index.ability.subtitle') }}</span>
        </h2>
        <p>{{ t('page.index.ability.desc') }}</p>
      </div>
      <ul class="index-ability_list">
        <li v-for="(item, i) in tm('page.index.ability.list')" :key="i">
          <div class="index-ability_list-icon">
            <NuxtImg
              :src="rt(item.icon)"
              :alt="rt(item.title)"
              class="home-helping-list_img"
            />
          </div>
          <div class="index-ability_list-content">
            <strong>{{ rt(item.title) }}</strong>
            <span>{{ rt(item.desc) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t, rt, tm } = useI18n()

</script>

<style lang="scss" scoped>
.index-ability {
  width: 100%;
  padding: 48px 20px;
  background: rgba(31, 41, 55, 1);
  color: rgba(255, 255, 255, 0.7);
  position: relative;

  .wrapper {
    max-width: 1280px;
    margin: 0 auto;
  }

  &_header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 1;
    margin-bottom: 32px;

    &-title {
      background: linear-gradient(139deg, #0dffff -2.74%, #7fabff 39.11%, #ed7cff 98.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    h2 {
      margin: 0;
      font-size: 24px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 1);
    }

    p {
      margin: 20px 0 0;
      font-size: 13px;
      line-height: 1.6;
      max-width: 800px;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &_list {
    padding: 24px 0 0;
    margin: 0;
    display: flex;
    align-items: flex-start;
    justify-content: start;
    flex-direction: column;
    list-style: none;
    gap: 12px;
    position: relative;
    z-index: 1;

    li {
      padding: 16px;
      display: flex;
      align-items: center;
      width: 100%;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      transition: all 0.3s ease;
      animation: fadeInUp 0.6s ease-out both;

      &:nth-child(1) {
        animation-delay: 0.3s;
      }
      &:nth-child(2) {
        animation-delay: 0.4s;
      }
      &:nth-child(3) {
        animation-delay: 0.5s;
      }

      &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.12);

        .index-ability_list-icon {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }

    &-icon {
      background: rgba(255, 255, 255, 0.1);
      width: 56px;
      height: 56px;
      min-width: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;

      img {
        height: 32px;
        width: auto;
        transition: transform 0.3s ease;
      }
    }

    &-content {
      margin-left: 12px;
      font-size: 13px;
      line-height: 1.5;
      flex: 1;

      strong {
        display: block;
        margin-bottom: 4px;
        color: rgba(255, 255, 255, 1);
        font-size: 18px;
        line-height: 1.3;
        font-weight: 600;
      }

      span {
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        font-weight: 400;
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

@media only screen and (min-width: 768px) {
  .index-ability {
    padding: 80px 40px;
  }

  .index-ability_header {
    margin-bottom: 50px;

    h2 {
      font-size: 40px;
    }

    p {
      font-size: 16px;
      margin-top: 28px;
    }
  }

  .index-ability_list {
    gap: 20px;

    li {
      padding: 24px;
    }

    &-icon {
      width: 72px;
      height: 72px;
      min-width: 72px;
      border-radius: 18px;

      img {
        height: 40px;
      }
    }

    &-content {
      margin-left: 20px;

      strong {
        font-size: 20px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}

@media only screen and (min-width: 992px) {
  .index-ability {
    padding: 80px 60px;
  }

  .index-ability_header {
    margin-bottom: 60px;

    h2 {
      font-size: 44px;
    }

    p {
      font-size: 16px;
      max-width: 900px;
    }
  }

  .index-ability_list {
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: 16px;
    padding-top: 40px;

    li {
      flex: 0 1 auto;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 32px 24px;
      max-width: 280px;
    }

    &-icon {
      margin-bottom: 16px;
      width: 72px;
      height: 72px;
      min-width: 72px;

      img {
        height: 40px;
      }
    }

    &-content {
      margin-left: 0;
      text-align: center;

      strong {
        font-size: 24px;
        margin-bottom: 8px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}

@media only screen and (min-width: 1200px) {
  .index-ability {
    padding: 100px 80px;
  }

  .index-ability_list {
    gap: 20px;

    li {
      padding: 32px 24px;
      max-width: 300px;
    }

    &-icon {
      width: 72px;
      height: 72px;
      min-width: 72px;
      margin-bottom: 16px;

      img {
        height: 40px;
      }
    }

    &-content {
      strong {
        font-size: 24px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}
</style>
