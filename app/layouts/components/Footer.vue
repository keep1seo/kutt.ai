<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- 主要内容区域 -->
      <div class="footer-content">
        <!-- 品牌和描述 -->
        <div class="footer-brand">
          <NuxtLink :to="localePath('/')" class="brand-link">
            <span class="brand-text">{{ t('app.title') }}</span>
          </NuxtLink>
          <p class="brand-description">
            {{ t('app.footer.description') }}
          </p>
          <!-- 社交媒体 -->
          <div class="social-links">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              :aria-label="social.name"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <component :is="getIconComponent(social.icon)" />
            </a>
          </div>
        </div>

        <!-- 链接组 -->
        <div class="footer-links">
          <!-- 产品 -->
          <div class="link-group">
            <h3 class="link-group-title">{{ t('app.footer.product.title') }}</h3>
            <ul class="link-list">
              <li v-for="link in productLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" class="footer-link">
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 公司 -->
          <div class="link-group">
            <h3 class="link-group-title">{{ t('app.footer.company.title') }}</h3>
            <ul class="link-list">
              <li v-for="link in companyLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" class="footer-link">
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- 支持 -->
          <div class="link-group">
            <h3 class="link-group-title">{{ t('app.footer.support.title') }}</h3>
            <ul class="link-list">
              <li v-for="link in supportLinks" :key="link.path">
                <NuxtLink :to="localePath(link.path)" class="footer-link">
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部版权信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            {{ t('app.footer.copyright', { year: currentYear }) }}
          </p>
          <div class="footer-bottom-links">
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.path"
              :to="localePath(link.path)"
              class="footer-bottom-link"
            >
              {{ link.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAntDesignIcon } from '~/composables/useAntDesignIcon'

const { t, rt, locale, messages } = useI18n()
const localePath = useLocalePath()
const { getIconComponent } = useAntDesignIcon()

const currentYear = new Date().getFullYear()

// 社交媒体链接
const socialLinks = [
  { name: 'Twitter', icon: 'Share', url: 'https://twitter.com' },
  { name: 'Facebook', icon: 'Share', url: 'https://facebook.com' },
  { name: 'LinkedIn', icon: 'Share', url: 'https://linkedin.com' },
  { name: 'GitHub', icon: 'Share', url: 'https://github.com' }
]

// 产品链接
const productLinks = computed(() => {
  const currentMessages = messages.value[locale.value] as Record<string, any>
  const links = currentMessages?.app?.footer?.product?.links || []
  return links.map((item: any) => ({
    title: rt(item?.title) || '',
    path: rt(item?.path) || ''
  }))
})

// 公司链接
const companyLinks = computed(() => {
  const currentMessages = messages.value[locale.value] as Record<string, any>
  const links = currentMessages?.app?.footer?.company?.links || []
  return links.map((item: any) => ({
    title: rt(item?.title) || '',
    path: rt(item?.path) || ''
  }))
})

// 支持链接
const supportLinks = computed(() => {
  const currentMessages = messages.value[locale.value] as Record<string, any>
  const links = currentMessages?.app?.footer?.support?.links || []
  return links.map((item: any) => ({
    title: rt(item?.title) || '',
    path: rt(item?.path) || ''
  }))
})

// 法律链接
const legalLinks = computed(() => {
  const currentMessages = messages.value[locale.value] as Record<string, any>
  const links = currentMessages?.app?.footer?.legal?.links || []
  return links.map((item: any) => ({
    title: rt(item?.title) || '',
    path: rt(item?.path) || ''
  }))
})
</script>

<style scoped lang="scss">
.footer {
  background: #1f2937;
  color: #ffffff;
  padding: 4rem 0 0;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (min-width: 768px) {
    grid-template-columns: 1.5fr 2fr;
    gap: 4rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 2.8fr;
  }
}

/* 品牌区域 */
.footer-brand {
  .brand-link {
    display: inline-block;
    margin-bottom: 1rem;
    text-decoration: none;
  }

  .brand-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.025em;
    display: inline-block;
    transition: all 0.3s ease;
  }

  .brand-link:hover .brand-text {
    opacity: 0.8;
  }

  .brand-description {
    font-size: 0.875rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1.5rem;
    max-width: 300px;
  }

  .social-links {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      transform: translateY(-2px);
    }

    :deep(svg) {
      font-size: 1.125rem;
    }
  }
}

/* 链接组 */
.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.link-group {
  .link-group-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: rgba(255, 255, 255, 0.95);
  }

  .link-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-link {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      transform: translateX(4px);
    }
  }
}

/* 底部版权区域 */
.footer-bottom {
  padding: 2rem 0;
}

.footer-bottom-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
}

.footer-bottom-link {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
}
</style>
