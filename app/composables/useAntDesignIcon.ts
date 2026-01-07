import type { Component } from 'vue'
import * as AntDesignIcons from '@ant-design/icons-vue'

// 图标映射：将字符串图标名称映射到 Ant Design Vue 图标组件
const iconMap = new Map<string, Component>()
for (const [key, component] of Object.entries(AntDesignIcons)) {
  iconMap.set(key, component as Component)
}

/**
 * 获取 Ant Design Vue 图标组件
 * @param iconName 图标名称，支持 PascalCase（如 UserOutlined）或 kebab-case（如 user-outlined）
 * @returns 图标组件，如果未找到则返回 null
 */
export const useAntDesignIcon = () => {
  const getIconComponent = (iconName: string): Component | null => {
    if (!iconName) return null

    // 先尝试直接匹配（如果已经是 PascalCase）
    if (iconMap.has(iconName)) {
      return iconMap.get(iconName) || null
    }

    // 将 kebab-case 转换为 PascalCase（如 user-outlined -> UserOutlined）
    const pascalCaseName = iconName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')

    // 尝试添加 Outlined 后缀（Ant Design 图标通常有 Outlined, Filled, TwoTone 后缀）
    const variants = ['Outlined', 'Filled', 'TwoTone']
    for (const variant of variants) {
      const fullName = pascalCaseName + variant
      if (iconMap.has(fullName)) {
        return iconMap.get(fullName) || null
      }
    }

    // 如果直接匹配失败，尝试直接匹配 PascalCase
    return iconMap.get(pascalCaseName) || null
  }

  return {
    getIconComponent
  }
}

