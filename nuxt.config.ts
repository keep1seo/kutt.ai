// https://nuxt.com/docs/api/configuration/nuxt-config
import { LOCAL_ARR } from './app/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/generate': { ssr: false },
    '/*/generate': { ssr: false },
    '/user': { ssr: false },
    '/*/user': { ssr: false }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/i18n',
    '@ant-design-vue/nuxt',
    '@pinia/nuxt',
    'nuxt-booster'
  ],
  app: {
    head: {
      script: []
    }
  },
  i18n: {
    locales: LOCAL_ARR,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    compilation: {
      strictMessage: false,
      escapeHtml: false
    }
  },
  runtimeConfig: {
    // 私有配置（仅在服务端可用）
    apiSecret: '',
    // 公共配置（客户端和服务端都可用）
    public: {
      apiBase: 'https://api.pixelfox.ai'
    }
  },
  image: {
    dir: 'assets/images',
    provider: 'ipx',
    screens: {
      default: 320,
      xs: 576,
      md: 996,
      xl: 1367,
      '4k': 1921
    },
    domains: ['api.pixelfox.ai'],
    alias: {
      pixelfox: 'https://api.pixelfox.ai'
    },
    quality: 80,
    format: ['webp'],
    ipx: {
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  },
  booster: {
    optimizeSSR: {
      cleanPreloads: true,
      cleanPrefetches: true,
      inlineStyles: true
    },
    performanceMetrics: {
      device: {
        hardwareConcurrency: { min: 2, max: 48 },
        deviceMemory: { min: 2 }
      },
      timing: {
        fcp: 800,
        dcl: 1200 // fallback if fcp is not available (safari)
      }
    },
    detection: {
      performance: true,
      browserSupport: true
    },

    targetFormats: ['webp'],
    // @ts-ignore
    componentAutoImport: true,
    // componentPrefix: undefined,
    //
    // /**
    //  * IntersectionObserver rootMargin for Compoennts and Assets
    //  */
    lazyOffset: {
      component: '0%',
      asset: '0%'
    }
  }
})
