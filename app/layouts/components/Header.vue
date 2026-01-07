<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo -->
      <div class="header-brand">
        <NuxtLink :to="localePath('/')" class="brand-link">
          <span class="brand-text">{{ t('app.title') }}</span>
        </NuxtLink>
      </div>
      <!-- 导航栏 -->
      <nav class="header-nav desktop-nav">
        <ul class="nav-list">
          <li
            v-for="menu in menus"
            :key="menu.path"
            class="nav-item"
            :class="{ 'has-dropdown': hasChildren(menu) }"
            @mouseenter.stop="onMenuEnter(menu.path, $event)"
            @mouseleave.stop="hasChildren(menu) ? onMenuLeave($event) : null"
          >
            <NuxtLink
              v-if="!hasChildren(menu)"
              :to="localePath(menu.path)"
              class="nav-link"
              :class="{ active: isActiveMenu(menu.path, false) }"
            >
              <component v-if="menu.icon" :is="getIconComponent(menu.icon)" class="nav-icon" />
              {{ menu.title }}
              <ClientOnly>
                <span
                  v-if="menu.path.includes('generate') && taskRunTotal"
                  class="nav-task-badge"
                  >{{ taskRunTotal }}</span
                >
              </ClientOnly>
              <component :is="DownOutlined" class="dropdown-arrow placeholder-arrow" />
            </NuxtLink>
            <div
              v-else
              class="nav-link menu-trigger"
              :class="{ active: isActiveMenu(menu.path, true) }"
            >
              <component v-if="menu.icon" :is="getIconComponent(menu.icon)" class="nav-icon" />
              {{ menu.title }}
              <component :is="DownOutlined" class="dropdown-arrow" />
            </div>
            <!-- Mega Menu Dropdown -->
            <div
              v-if="hasChildren(menu)"
              class="mega-menu"
              :class="{ active: activeDropdown === menu.path }"
              @mouseenter.stop="onDropdownEnter(menu.path)"
              @mouseleave.stop="onDropdownLeave($event)"
            >
              <div class="mega-menu-content">
                <div class="mega-menu-section">
                  <div class="menu-grid">
                    <div
                      v-for="child in menu.children"
                      :key="child.path"
                      class="menu-grid-item"
                      @click="navigateTo(child.path)"
                    >
                      <component
                        v-if="child.icon"
                        :is="getIconComponent(child.icon)"
                        class="item-icon"
                      />
                      <div class="item-content">
                        <div class="item-title">{{ child.title }}</div>
                        <div v-if="child.desc" class="item-desc">{{ child.desc }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <!--右侧区域-->
      <div class="header-actions">
        <!--多语言-->
        <div class="language-switcher">
          <a-popover
            placement="bottomRight"
            :overlay-style="{ width: '180px' }"
            trigger="click"
            overlay-class-name="language-popover"
          >
            <template #content>
              <div class="language-popover-content">
                <div
                  v-for="loc in availableLocales"
                  :key="loc"
                  class="language-option"
                  :class="{ active: currentLocale === loc }"
                  @click="onLanguageSelect(loc as string)"
                >
                  <span class="language-option-code">{{ getLocaleCode(loc as string) }}</span>
                  <span class="language-option-name">{{ getLocaleName(loc as string) }}</span>
                </div>
              </div>
            </template>
            <button class="language-button">
              <span class="language-button-text">{{ getLocaleCode(currentLocale as string) }}</span>
            </button>
          </a-popover>
        </div>
        <!--登录/用户菜单-->
        <a-popover
          v-if="isLoggedIn"
          v-model:open="userPopoverVisible"
          placement="bottomRight"
          :overlay-style="{ width: '380px' }"
          trigger="click"
          overlay-class-name="user-menu-popover"
        >
          <template #content>
            <div class="user-popup">
              <div class="user-info">
                <a-avatar :size="40" :src="loginUser?.avatar" class="user-avatar">
                  <template v-if="!loginUser?.avatar">
                    <component :is="getIconComponent('User')" />
                  </template>
                </a-avatar>
                <div class="user-info-text">
                  <div class="user-name">
                    {{
                      loginUser?.nickname || loginUser?.username || t('app.header.administrators')
                    }}
                  </div>
                  <div class="user-email">{{ loginUser?.email || '' }}</div>
                </div>
              </div>
              <div class="credit-info">
                <div class="credit-box" @click="onBuyCredit">
                  <div class="credit-content">
                    <div class="credit-left">
                      <GiftOutlined class="credit-icon" />
                      <span class="credit-value">{{ formatNumber(loginUser?.score || 0) }}</span>
                    </div>
                    <RightOutlined class="credit-arrow" />
                  </div>
                </div>
              </div>
              <div class="menu-info">
                <div class="menu-item" @click="onUserCenter">
                  <component :is="getIconComponent('User')" class="menu-item-icon" />
                  <span class="menu-item-text">{{ t('app.header.profile') }}</span>
                </div>
                <div class="menu-item" @click="onGetFreePoints">
                  <component :is="getIconComponent('Gift')" class="menu-item-icon" />
                  <span class="menu-item-text">{{ t('app.header.get_points_for_free') }}</span>
                </div>
                <div class="menu-item" @click="onChangePassword">
                  <LockOutlined class="menu-item-icon" />
                  <span class="menu-item-text">{{ t('app.header.change_pass') }}</span>
                </div>
                <div class="menu-item logout-item" @click="onLogout">
                  <component :is="LogoutOutlined" class="menu-item-icon" />
                  <span class="menu-item-text">{{ t('app.header.logout') }}</span>
                </div>
              </div>
            </div>
          </template>
          <div class="user-avatar-button" @click.stop>
            <component :is="getIconComponent('User')" class="user-avatar-icon" />
          </div>
        </a-popover>
        <div v-else class="login-button" @click.stop="onLogin">
          <component :is="getIconComponent('User')" class="login-icon" />
          <span class="login-text">{{ t('app.header.login') }}</span>
        </div>
        <!--移动端菜单按钮-->
        <button
          class="mobile-menu-toggle"
          @click="onToggleMobileMenu"
          :aria-label="t('app.header.menu')"
        >
          <component :is="!isMobileMenuOpen ? MenuOutlined : CloseOutlined" class="menu-icon" />
        </button>
      </div>
    </div>
    <!--分享弹框-->
    <ShareModal
      v-model="shareModalVisible"
      :title="t('app.title')"
      :description="t('app.footer.description')"
    />
    <!--修改密码弹框-->
    <PasswordModal v-model="passwordModalVisible" />
    <!--移动端菜单-->
    <div v-show="isMobileMenuOpen" class="mobile-menu">
      <div class="menu">
        <div
          v-for="(menu, index) in menus"
          :key="menu.path"
          class="menu-item"
          @click.stop="onExpand(index, menu)"
        >
          <div :class="[isExpanded(index) ? 'parent-active' : 'parent']">
            <div class="title">
              <component v-if="menu.icon" :is="getIconComponent(menu.icon)" class="menu-icon" />
              <div v-if="hasChildren(menu)" class="icon-label">{{ menu.title }}</div>
              <NuxtLink
                v-else
                class="icon-label"
                :to="localePath(menu.path)"
                @click="onCloseMobileMenu"
                >{{ menu.title }}</NuxtLink
              >
            </div>
            <div v-if="hasChildren(menu)" class="expand-icon">
              <component v-show="isExpanded(index)" :is="UpOutlined" />
              <component v-show="!isExpanded(index)" :is="DownOutlined" />
            </div>
          </div>
          <div
            v-show="hasChildren(menu) && isExpanded(index)"
            class="children"
            :class="{ open: hasChildren(menu) && isExpanded(index) }"
          >
            <div
              v-for="child in menu.children"
              :key="child.path"
              class="children-item"
              @click.stop="navigateTo(child.path)"
            >
              <div class="children-item-content">
                <div class="children-item-header">
                  <component
                    v-if="child.icon"
                    :is="getIconComponent(child.icon)"
                    class="menu-icon"
                  />
                  <NuxtLink class="icon-label" :to="localePath(child.path)">{{
                    child.title
                  }}</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  DownOutlined,
  UpOutlined,
  MenuOutlined,
  CloseOutlined,
  LogoutOutlined,
  GiftOutlined,
  LockOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { useAntDesignIcon } from '~/composables/useAntDesignIcon'
import ShareModal from '~/components/Share/ShareModal.vue'
import PasswordModal from '~/components/Password/Modal.vue'
import { useUserApi } from '~/api/useUserApi'

type MenuItem = {
  title: string
  path: string
  icon?: string
  desc?: string
  children?: MenuItem[]
}

const route = useRoute()
const router = useRouter()
const userInfo = useCookie('userInfo')
const localePath = useLocalePath()
const { getIconComponent } = useAntDesignIcon()
const appStore = useAppStore()
const { t, rt, locale, setLocale, availableLocales, messages } = useI18n()

const isMobileMenuOpen = ref(false)
const activeDropdown = ref<string | null>(null)
const expandKeys = ref<number[]>([])
const shareModalVisible = ref(false)
const passwordModalVisible = ref(false)
const userPopoverVisible = ref(false)
const taskRunTotal = ref(0)
let closeTimer: ReturnType<typeof setTimeout> | null = null
let taskPollTimer: ReturnType<typeof setInterval> | null = null

/* Api */
const userApi = useUserApi()

// 登录用户信息
const loginUser = computed(() => {
  return userInfo.value || appStore.userInfo || {}
})

// 格式化数字
const formatNumber = (num) => {
  if (typeof num !== 'number' && typeof num !== 'string') return '0'
  const number = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(number)) return '0'
  return number.toLocaleString('zh-CN')
}

// 语言切换 - 使用 computed 确保 SSR 和客户端一致
const currentLocale = computed(() => locale.value)
const languagePopoverVisible = ref(false)

// 菜单
const menus = computed<MenuItem[]>(() => {
  // 直接访问 messages 获取菜单数据
  const currentMessages = messages.value[locale.value] as Record<string, any>
  const menuData = currentMessages?.app?.header?.menus

  if (!Array.isArray(menuData)) {
    return []
  }

  // 使用 rt() 处理菜单数据，支持对象类型的翻译值
  return menuData.map((item: any) => ({
    title: rt(item?.title) || '',
    path: rt(item?.path) || '',
    icon: rt(item?.icon) || '',
    children: item.children?.map((child: any) => ({
      title: rt(child?.title) || '',
      path: rt(child?.path) || '',
      icon: rt(child?.icon) || '',
      desc: rt(child?.desc) || ''
    }))
  }))
})

// 监听路由变化，关闭移动端菜单
watch(
  () => route.path,
  () => {
    onCloseMobileMenu()
  }
)

// 监听菜单打开状态，重置展开项
watch(isMobileMenuOpen, (newVal) => {
  if (!newVal) {
    expandKeys.value = []
  }
})

// 获取语言显示名称
const getLocaleName = (loc: string) => {
  const localeMap: Record<string, string> = {
    en: 'English',
    zh: '简体中文'
  }
  return localeMap[loc] || loc
}

// 获取语言代码（简短形式）
const getLocaleCode = (loc: string) => {
  const codeMap: Record<string, string> = {
    en: 'EN',
    zh: 'CN'
  }
  return codeMap[loc] || loc.toUpperCase()
}

/**
 * 选择语言
 * @param newLocale
 */
const onLanguageSelect = (newLocale: string) => {
  setLocale(newLocale as 'en' | 'zh')
  languagePopoverVisible.value = false
}

/**
 * 辅助函数：检查菜单是否有子菜单
 * @param menu
 */
const hasChildren = (menu: MenuItem): boolean => {
  return !!(menu.children && menu.children.length > 0)
}

/**
 * 辅助函数：检查菜单是否展开
 * @param index
 */
const isExpanded = (index: number): boolean => {
  return expandKeys.value.includes(index)
}

/**
 * 切换移动菜单
 */
const onToggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

/**
 * 关闭移动菜单
 */
const onCloseMobileMenu = () => {
  isMobileMenuOpen.value = false
  expandKeys.value = []
}

/**
 * 展开/收起菜单
 * @param key 菜单索引
 * @param menu 菜单项
 */
const onExpand = (key: number, menu: MenuItem) => {
  if (!hasChildren(menu)) {
    expandKeys.value = []
    isMobileMenuOpen.value = false
    return
  }
  const index = expandKeys.value.indexOf(key)
  if (index > -1) {
    expandKeys.value.splice(index, 1)
  } else {
    expandKeys.value.push(key)
  }
}

/**
 * 规范化路径，移除语言前缀
 * @param path
 */
const normalizePath = (path: string): string => {
  if (!path) return '/'

  // 已知的语言代码列表
  const localeCodes = ['en', 'zh', 'zh_CN', 'zh-CN']

  // 按长度从长到短排序，先匹配长的（如 /zh_CN 在 /zh 之前）
  const sortedCodes = [...localeCodes].sort((a, b) => b.length - a.length)

  // 移除开头的语言代码前缀
  for (const locCode of sortedCodes) {
    const localePrefix = `/${locCode}`
    if (path.startsWith(localePrefix)) {
      const remaining = path.slice(localePrefix.length)
      return remaining || '/'
    }
  }

  return path
}

/**
 * 检查菜单是否激活 - 使用 computed 确保 SSR 和客户端一致
 * @param menuPath
 * @param isParent
 */
const isActiveMenu = computed(() => {
  const currentPath = route.path
  return (menuPath: string, isParent: boolean = false) => {
    const normalizedCurrentPath = normalizePath(currentPath)
    const normalizedMenuPath = normalizePath(menuPath)

    if (isParent) {
      const menu = menus.value.find((m) => m.path === menuPath)
      if (menu?.children) {
        return menu.children.some((child) => {
          const normalizedChildPath = normalizePath(child.path)
          return (
            normalizedCurrentPath === normalizedChildPath ||
            normalizedCurrentPath.startsWith(normalizedChildPath + '/')
          )
        })
      }
    }

    return (
      normalizedCurrentPath === normalizedMenuPath ||
      normalizedCurrentPath.startsWith(normalizedMenuPath + '/')
    )
  }
})

/**
 * 处理鼠标进入菜单项
 * @param menuPath
 * @param event
 */
const onMenuEnter = (menuPath: string, event?: Event) => {
  // 清除关闭定时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  // 查找当前菜单
  const menu = menus.value.find((m) => m.path === menuPath)
  if (menu && hasChildren(menu)) {
    // 如果有子菜单，立即显示下拉菜单
    activeDropdown.value = menuPath
  } else {
    // 如果没有子菜单，立即关闭之前打开的子菜单
    activeDropdown.value = null
  }
}

/**
 * 处理鼠标离开菜单项
 * @param event
 */
const onMenuLeave = (event?: Event) => {
  // 检查鼠标是否移动到子菜单
  const relatedTarget = (event as MouseEvent)?.relatedTarget as HTMLElement
  if (relatedTarget) {
    // 如果鼠标移动到子菜单区域，不关闭
    const megaMenu = relatedTarget.closest('.mega-menu')
    if (megaMenu) {
      return
    }
  }
  // 延迟关闭，给用户时间移动到子菜单
  closeTimer = setTimeout(() => {
    activeDropdown.value = null
    closeTimer = null
  }, 200) // 增加到 200ms 延迟
}

/**
 * 处理鼠标进入子菜单
 * @param menuPath
 */
const onDropdownEnter = (menuPath: string) => {
  // 清除关闭定时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  // 确保子菜单显示
  activeDropdown.value = menuPath
}

/**
 * 处理鼠标离开子菜单
 * @param event
 */
const onDropdownLeave = (event?: Event) => {
  // 检查鼠标是否移动到父菜单
  const relatedTarget = (event as MouseEvent)?.relatedTarget as HTMLElement
  if (relatedTarget) {
    // 如果鼠标移动到父菜单区域，不关闭
    const navItem = relatedTarget.closest('.nav-item')
    if (navItem) {
      return
    }
  }
  // 延迟关闭
  closeTimer = setTimeout(() => {
    activeDropdown.value = null
    closeTimer = null
  }, 200)
}

/**
 * 导航到指定路径
 * @param path
 */
const navigateTo = (path: string) => {
  router.push(localePath(path))
  activeDropdown.value = null
  // 清除定时器
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  // 移动端导航后关闭菜单
  if (isMobileMenuOpen.value) {
    onCloseMobileMenu()
  }
}

/**
 * 检查是否已登录
 */
const isLoggedIn = computed(() => {
  const cookieUserInfo = userInfo.value
  const storeUserInfo = appStore.userInfo
  return (
    !!(cookieUserInfo && Object.keys(cookieUserInfo).length > 0) ||
    !!(storeUserInfo && Object.keys(storeUserInfo).length > 0)
  )
})

/**
 * 获取任务运行总数
 */
const fetchTaskRunTotal = async () => {
  // 只在客户端执行
  if (!import.meta.client) {
    return
  }
  if (!isLoggedIn.value) {
    return
  }
  try {
    const response: any = await userApi.getUserInfo()
    if (response?.code === 1 && response?.data?.task_run_total !== undefined) {
      taskRunTotal.value = response.data.task_run_total || 0
    }
  } catch (e) {
    // 登录过期或未登录时停止轮询
    stopTaskPolling()
    taskRunTotal.value = 0
  }
}

/**
 * 开始轮询任务数
 */
const startTaskPolling = () => {
  // 只在客户端执行
  if (!import.meta.client) {
    return
  }
  // 先清除已存在的定时器
  stopTaskPolling()
  // 如果未登录，不开始轮询
  if (!isLoggedIn.value) {
    return
  }
  // 立即执行一次
  fetchTaskRunTotal()
  // 每5秒轮询一次
  taskPollTimer = setInterval(() => {
    fetchTaskRunTotal()
  }, 5000)
}

/**
 * 停止轮询任务数
 */
const stopTaskPolling = () => {
  if (taskPollTimer) {
    clearInterval(taskPollTimer)
    taskPollTimer = null
  }
}

/**
 * 获取免费积分
 */
const onGetFreePoints = () => {
  userPopoverVisible.value = false
  shareModalVisible.value = true
}

/**
 * 个人中心
 */
const onUserCenter = () => {
  userPopoverVisible.value = false
  navigateTo(localePath('/user'))
}

/**
 * 修改密码
 */
const onChangePassword = () => {
  userPopoverVisible.value = false
  passwordModalVisible.value = true
}

/**
 * 购买积分
 */
const onBuyCredit = () => {
  userPopoverVisible.value = false
  navigateTo(localePath('/price'))
}

/**
 * 退出登录
 */
const onLogout = () => {
  userPopoverVisible.value = false
  // 停止轮询
  stopTaskPolling()
  taskRunTotal.value = 0
  // 清除 cookie 中的用户信息
  userInfo.value = null
  // 清除 store 中的用户信息
  appStore.setUserInfo({})
  // 可以在这里添加其他清理逻辑，比如清除 token 等
  // 刷新页面或跳转到首页
  router.push(localePath('/'))
}

/**
 * 登录
 */
const onLogin = () => {
  appStore.setLoginVisible(true)
}

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (!import.meta.client) return
  if (newVal) {
    setTimeout(() => {
      // 登录成功，开始轮询
      startTaskPolling()
    }, 1000)
  } else {
    // 未登录或登录过期，停止轮询
    stopTaskPolling()
    taskRunTotal.value = 0
  }
})

// 组件挂载时，如果已登录则开始轮询
onMounted(() => {
  if (isLoggedIn.value) {
    startTaskPolling()
  }
})

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  stopTaskPolling()
})
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 200;
  background-color: #ffffff;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  will-change: transform;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

/* Brand */
.header-brand {
  flex-shrink: 0;

  .brand-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .brand-link:hover {
    opacity: 0.8;
  }

  .brand-text {
    font-size: 1.125rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1e293b 0%, #3b82f6 50%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.025em;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
  }

  .brand-link:hover .brand-text {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
  flex: 1;
  justify-content: center;
  /* 确保下拉菜单可以显示 */
  overflow: visible;
  position: relative;
  height: 100%;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.875rem;
  /* 确保下拉菜单可以超出容器显示 */
  overflow: visible;
  height: 100%;
  align-items: center;

  .nav-item {
    margin: 0;
    position: relative;
    /* 确保下拉菜单不会影响布局 */
    overflow: visible;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .nav-item.has-dropdown {
    position: relative;
    overflow: visible;
  }
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9375rem;
  padding: 0.5rem 0 0.5rem 0.5rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  height: 100%;

  &:hover {
    color: #1f2937;
    background: #f3f4f6;
  }
}

.nav-icon {
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-link.active {
  color: #667eea;
  position: relative;
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
}

.nav-task-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 10px;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.35);
  margin-left: 4px;
}

.dropdown-arrow {
  font-size: 0.6rem;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  margin-left: 0.25rem;
  flex-shrink: 0;
}

.dropdown-arrow.placeholder-arrow {
  visibility: hidden;
}

.nav-item.has-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* Menu Trigger */
.menu-trigger {
  cursor: pointer;
  user-select: none;
  color: #4b5563;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  height: 100%;
}

.menu-trigger:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.menu-trigger.active {
  color: #667eea;
  position: relative;
  font-weight: 600;
}

.menu-trigger.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
}

/* Mega Menu */
.mega-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%) translateY(-10px);
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: visible;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10000;
  min-width: 800px;
  max-width: 1000px;
  pointer-events: none;
  /* 确保下拉菜单不会影响父元素布局 */
  white-space: nowrap;
  /* 添加一个伪元素来填充间隙，确保鼠标移动时不会触发隐藏 */
  padding-top: 0.5rem;
  margin-top: -0.5rem;
}

.mega-menu::before {
  content: '';
  position: absolute;
  top: -0.5rem;
  left: 0;
  right: 0;
  height: 0.5rem;
  background: transparent;
  pointer-events: auto;
}

.mega-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.mega-menu-content {
  padding: 10px 24px 24px;
}

.mega-menu-section {
  width: 100%;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

@media (max-width: 1200px) {
  .mega-menu {
    min-width: 650px;
    max-width: 750px;
  }

  .menu-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.menu-grid-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  min-width: 0; /* 允许 flex 子元素收缩 */
  width: 100%; /* 确保宽度一致 */
  gap: 12px;
}

.item-icon {
  font-size: 22px;
  color: #667eea;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 0;
  height: 20px; /* 与标题行高对齐 */
  transition: all 0.3s ease;
}

.menu-grid-item:hover {
  background: rgba(102, 126, 234, 0.06);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);

  .item-icon {
    color: #764ba2;
    transform: scale(1.1);
  }
}

.item-content {
  flex: 1;
  box-sizing: border-box;
  padding: 0;
  min-width: 0; /* 允许文本溢出 */
  overflow: hidden; /* 隐藏溢出内容 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px; /* 与图标高度对齐 */
}

.item-desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.4;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 最多显示2行 */
  line-clamp: 1; /* 标准属性 */
  -webkit-box-orient: vertical;
  white-space: normal;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* Login Button */
.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login-button:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.login-icon {
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
}

.login-text {
  display: none;
}

@media (min-width: 768px) {
  .login-text {
    display: inline;
  }
}

/* 已登录状态 - 用户头像按钮 */
.user-avatar-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.user-avatar-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
  border-radius: 50%;
}

.user-avatar-button:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);
  transform: translateY(-1px);
}

.user-avatar-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.user-avatar-button:hover::before {
  opacity: 0.08;
}

.user-avatar-icon {
  font-size: 1rem;
  color: #6b7280;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-button:hover .user-avatar-icon {
  color: #667eea;
}

/* 用户菜单 Popover 样式 */
:deep(.user-menu-popover) {
  padding: 0 !important;
  border-radius: 16px !important;
  box-shadow:
    0 12px 32px rgba(102, 126, 234, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(102, 126, 234, 0.1) !important;
  overflow: hidden !important;
  backdrop-filter: blur(10px);
  background: #ffffff;
  max-width: 380px !important;
  box-sizing: border-box !important;
}

.user-popup {
  box-sizing: border-box;
  padding: 16px;
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  overflow: hidden;

  * {
    box-sizing: border-box;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%
    );
    border-radius: 12px;
    margin-bottom: 12px;
    border: 1px solid rgba(102, 126, 234, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.08) 0%,
        rgba(118, 75, 162, 0.08) 100%
      );
      border-color: rgba(102, 126, 234, 0.2);
    }

    .user-avatar {
      flex-shrink: 0;
      position: relative;

      :deep(.ant-avatar) {
        border: 2px solid rgba(102, 126, 234, 0.2);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
        transition: all 0.3s ease;
      }
    }

    .user-info-text {
      flex: 1;
      min-width: 0;

      .user-name {
        font-size: 16px;
        font-weight: 600;
        color: #262626;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .user-email {
        font-size: 13px;
        color: #8c8c8c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.4;
      }
    }
  }

  .credit-info {
    margin-bottom: 12px;

    .credit-box {
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);

        .credit-arrow {
          transform: translateX(4px);
        }
      }

      .credit-content {
        background: #ffffff;
        border-radius: 10px;
        padding: 12px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .credit-left {
          display: flex;
          align-items: center;
          gap: 10px;

          .credit-icon {
            font-size: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            transition: all 0.3s ease;
          }

          .credit-value {
            font-size: 18px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 0.5px;
          }
        }

        .credit-arrow {
          font-size: 14px;
          color: #8c8c8c;
          transition: all 0.3s ease;
        }
      }
    }
  }

  .menu-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      color: #262626;
      font-size: 14px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transform: scaleY(0);
        transition: transform 0.25s ease;
      }

      .menu-item-icon {
        font-size: 18px;
        color: #8c8c8c;
        transition: all 0.25s ease;
        flex-shrink: 0;
        width: 20px;
        text-align: center;
      }

      .menu-item-text {
        flex: 1;
        font-weight: 500;
        transition: all 0.25s ease;
      }

      &:hover {
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.08) 0%,
          rgba(118, 75, 162, 0.08) 100%
        );
        color: #667eea;
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);

        &::before {
          transform: scaleY(1);
        }

        .menu-item-icon {
          color: #667eea;
          transform: scale(1.1);
        }

        .menu-item-text {
          font-weight: 600;
        }
      }

      &.logout-item {
        margin-top: 6px;
        padding-top: 12px;
        border-top: 1px solid #f0f0f0;

        &::before {
          background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
        }

        &:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 77, 79, 0.08) 0%,
            rgba(255, 120, 117, 0.08) 100%
          );
          color: #ff4d4f;
          box-shadow: 0 2px 8px rgba(255, 77, 79, 0.1);

          .menu-item-icon {
            color: #ff4d4f;
          }
        }
      }
    }
  }
}

/* Language Switcher */
.language-switcher {
  display: flex;
  align-items: center;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 30%, #a855f7 60%, #b37feb 100%);
  border: none;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  box-shadow:
    0 2px 8px rgba(124, 58, 237, 0.3),
    0 1px 4px rgba(139, 92, 246, 0.25);
}

.language-button:hover {
  background: linear-gradient(135deg, #8b5cf6 0%, #9333ea 30%, #a855f7 60%, #c084fc 100%);
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(124, 58, 237, 0.4),
    0 2px 8px rgba(168, 85, 247, 0.3);
}

.language-button:active {
  transform: translateY(0);
}

.language-button-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.language-button-arrow {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.language-button:hover .language-button-arrow {
  transform: rotate(180deg);
}

/* Popover 样式 */
:deep(.language-popover) {
  padding: 6px !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.nav-icon,
.login-icon,
.menu-icon {
  display: inline-flex;
  align-items: center;
  font-size: inherit;
}

.language-popover-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333333;
  font-size: 0.875rem;
}

.language-option:hover {
  background: rgba(114, 46, 209, 0.08);
  color: #722ed1;
}

.language-option.active {
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.12) 0%, rgba(179, 127, 235, 0.12) 100%);
  color: #722ed1;
  font-weight: 600;
  border: 1px solid rgba(114, 46, 209, 0.25);
}

.language-option-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 2px 6px;
  background: rgba(114, 46, 209, 0.12);
  color: #722ed1;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.language-option.active .language-option-code {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
  color: #ffffff;
}

.language-option-name {
  flex: 1;
  font-weight: 500;
}

/* Mobile Menu Toggle */
.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.menu-icon {
  font-size: 20px;
  color: #4b5563;
  transition: all 0.3s ease;
}

/* Mobile Navigation */
.mobile-menu {
  position: fixed;
  left: 0;
  right: 0;
  top: 56px;
  width: 100%;
  height: calc(100vh - 56px);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(32px);
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 9998;

  .menu {
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
    overflow-y: auto;
    padding: 0 0 60px;

    &-item {
      .parent {
        font-weight: 600;
        font-size: 16px;
        color: #384150;
        padding: 16px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        .title {
          display: flex;
          align-items: center;
          cursor: pointer;

          &:hover {
            color: #3b82f6;
          }

          .menu-icon {
            font-size: 16px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            color: inherit;
          }
        }
      }

      .parent-active {
        @extend .parent;
        background: rgb(248, 250, 252);
      }

      .children {
        background: rgb(248, 250, 252);
        padding: 0 24px 12px;
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.25s ease-in-out;
        overflow: hidden;
        visibility: hidden;
        opacity: 0;
        height: 0;

        &-item {
          color: #384150;
          font-size: 14px;
          cursor: pointer;

          &:hover {
            color: #3b82f6;
          }

          &:not(:first-child) {
            margin-top: 16px;
          }

          &-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0; /* 允许文本溢出 */
            flex: 1;
            overflow: hidden;
          }

          &-header {
            display: flex;
            align-items: center;
            min-width: 0; /* 允许文本溢出 */
            flex: 1;
          }

          &-desc {
            font-size: 12px;
            color: #666666;
            line-height: 1.4;
            margin-left: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1; /* 最多显示2行 */
            line-clamp: 1; /* 标准属性 */
            -webkit-box-orient: vertical;
            white-space: normal;
          }

          .menu-icon {
            font-size: 14px;
            margin-right: 8px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            color: inherit;
          }
        }
      }
    }
  }
}

.open {
  grid-template-rows: 1fr !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
}

.icon-label {
  text-decoration: none !important;
  color: inherit !important;
  outline: none !important;
  &:hover,
  &:active,
  &:visited {
    text-decoration: none !important;
    color: inherit !important;
  }
  flex: 1;
  min-width: 0; /* 允许文本溢出 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

/* Tablet and Desktop Styles */
@media (min-width: 768px) {
  .header-container {
    padding: 0 2rem;
  }

  .header-brand .brand-text {
    font-size: 1.25rem;
  }

  .language-switcher {
    display: block;
  }
}

@media (min-width: 996px) {
  .desktop-nav {
    display: flex;
  }

  .mobile-menu-toggle {
    display: none;
  }

  .mobile-nav {
    display: none;
  }

  .mobile-menu {
    display: none;
  }

  .header-container {
    padding: 0 3rem;
  }
}

/* Large Desktop */
@media (min-width: 1367px) {
  /* Styles can be added here if needed */
}

/* 4K Screens */
@media (min-width: 1921px) {
  .header-container {
    max-width: 1600px;
  }
}
</style>
