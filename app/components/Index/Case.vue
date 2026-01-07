<template>
  <div class="index-case">
    <div class="tab-wrapper">
      <div class="custom-tabs">
        <div class="tabs-nav" ref="tabsNavRef">
          <div class="tabs-nav-list">
            <div
              v-for="tab in cateOneList"
              :key="tab.value"
              class="tabs-tab"
              :class="{ 'tabs-tab-active': activeCateOne === tab.value }"
              @click="handleTabClick(tab.value)"
            >
              {{ rt(tab.label) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 二级分类，只有特效视频才显示 -->
    <div v-if="activeCateOne === 'special_effects'" class="cate-two-wrapper">
      <div class="cate-two-tags">
        <div
          v-for="(tag, index) in cateTwoList"
          :key="index"
          class="cate-two-tag"
          :class="{ active: activeCateTwo === tag }"
          @click="handleCateTwoClick(tag)"
        >
          {{ tag }}
        </div>
      </div>
    </div>
    <!-- Loading 骨架屏 -->
    <div v-if="loading && cardList.length === 0" class="card-container">
      <div v-for="n in 12" :key="`skeleton-${n}`" class="card-item skeleton-card">
        <div class="card-image-wrapper skeleton-image">
          <div class="skeleton-placeholder"></div>
        </div>
      </div>
    </div>
    <!-- 空状态 -->
    <div v-else-if="!loading && cardList.length === 0" class="empty-state">
      <div class="empty-state-wrapper">
        <div class="empty-state-icon-wrapper">
          <div class="empty-state-icon-bg"></div>
          <component :is="InboxOutlined" class="empty-state-icon" />
        </div>
        <div class="empty-state-content">
          <div class="empty-state-title">暂无数据</div>
          <div class="empty-state-desc">当前分类下还没有内容，请稍后再试</div>
        </div>
      </div>
    </div>
    <!-- 卡片列表 -->
    <div v-else ref="masonryContainer" class="card-container masonry-container">
      <div
        v-for="(card, index) in cardList"
        :key="index"
        ref="cardItems"
        class="card-item"
        :style="cardStyles[index]"
        @click="handleCardClick(card)"
      >
        <div
          class="card-image-wrapper"
          :class="{ 'skeleton-image': !imageLoadedMap[index] }"
          @mouseenter="handleVideoEnter($event)"
          @mouseleave="handleVideoLeave($event)"
        >
          <!-- 骨架屏 -->
          <div v-if="!imageLoadedMap[index]" class="skeleton-placeholder"></div>
          <!-- 实际内容（始终渲染，但未加载完成时隐藏） -->
          <video
            v-if="isVideo(card?.result)"
            :src="card?.result"
            class="card-image card-video"
            :class="{ 'image-hidden': !imageLoadedMap[index] }"
            :loading="index < 6 ? 'eager' : 'lazy'"
            autoplay
            muted
            loop
            playsinline
            preload="auto"
            @loadedmetadata="handleVideoLoaded($event, index)"
            @error="handleImageError(index)"
          />
          <NuxtImg
            v-else
            :src="card?.result || 'demo.webp'"
            :alt="card?.result"
            class="card-image"
            :class="{ 'image-hidden': !imageLoadedMap[index] }"
            :loading="index < 6 ? 'eager' : 'lazy'"
            :fetchpriority="index < 6 ? 'high' : 'auto'"
            format="webp"
            @load="handleImageLoad(index)"
            @error="handleImageError(index)"
          />
          <div v-if="card.badge && imageLoadedMap[index]" class="card-badge">{{ card.badge }}</div>
          <div v-if="card.tags && card.tags.length && imageLoadedMap[index]" class="card-tags">
            <span v-for="(tag, tagIndex) in card.tags" :key="tagIndex" class="card-tag">
              {{ tag }}
            </span>
          </div>
          <!-- 复用按钮 -->
          <div v-if="imageLoadedMap[index]" class="card-reuse-btn" @click.stop="handleReuse(card)">
            <component :is="CopyOutlined" class="reuse-icon" />
            <span class="reuse-text">一键复用</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && hasMore && cardList.length > 0" class="load-more-wrapper">
      <button class="load-more-btn" @click="loadMore">
        <span class="load-more-text">加载更多</span>
        <component :is="ArrowDownOutlined" class="load-more-icon" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ArrowDownOutlined, InboxOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { useSquareApi } from '~/api/useSquareApi'

interface CardItem {
  title?: string
  description?: string
  image?: string
  result?: string
  badge?: string
  tags?: string[]
  meta?: {
    views?: number
    likes?: number
  }
  link?: string
}

const { t, rt } = useI18n()
const squareApi = useSquareApi()

// refs
const masonryContainer = ref<HTMLElement | null>(null)
const cardItems = ref<(HTMLElement | null)[]>([])
const tabsNavRef = ref<HTMLElement | null>(null)

// state
const state = reactive({
  // 卡片列表
  cardList: [] as CardItem[],
  // 页码
  page: 1,
  // 每页显示数量
  limit: 10,
  // 总数
  total: 0,
  // loading
  loading: false,
  // 每个卡片的加载状态（key: index, value: boolean）
  imageLoadedMap: {} as Record<number, boolean>,
  // 一级分类列表
  cateOneList: [
    {
      label: '视频特效',
      value: 'special_effects'
    },
    {
      label: '视频生成',
      value: 'video_generate'
    },
    {
      label: '图片生成',
      value: 'image_generate'
    },
    {
      label: '数字人',
      value: 'S2V'
    },
    {
      label: '动作模仿',
      value: 'animate'
    },
    {
      label: '角色替换',
      value: 'body_swap'
    },
    {
      label: '脸部替换',
      value: 'face_swap'
    }
  ],
  // 二级分类列表
  cateTwoList: [
    '💋 性感',
    '⚡️ 超现实',
    '😄 整活脑洞',
    '💪 动作/健身',
    '🦸 变身',
    '🎥 运镜',
    '💃 热舞',
    '📷 社交/情感'
  ],
  // 选中一级分类
  activeCateOne: 'image_generate',
  // 选中二级分类
  activeCateTwo: '',
  // 卡片样式
  cardStyles: [] as Array<{ top: string; left: string; width: string }>,
  // 列数
  columnCount: 6,
  // 列间距
  columnGap: 10
})

// toRefs
const {
  cardList,
  page,
  limit,
  total,
  loading,
  imageLoadedMap,
  cateOneList,
  cateTwoList,
  activeCateOne,
  activeCateTwo,
  cardStyles,
  columnCount,
  columnGap
} = toRefs(state)

/**
 * 计算是否还有更多数据
 */
const hasMore = computed(() => {
  return cardList.value.length < total.value
})

/**
 * 获取列表
 */
const fetchList = async (append = false) => {
  try {
    loading.value = true
    const response = (await squareApi.list({
      page: page.value,
      limit: limit.value,
      category_one: activeCateOne.value,
      category_two: activeCateTwo.value
    })) as any

    if (append) {
      // 追加模式：将新数据追加到现有列表
      const newList = (response?.data?.list || []) as CardItem[]
      cardList.value.push(...newList)
    } else {
      // 替换模式：替换整个列表
      cardList.value = (response?.data?.list || []) as CardItem[]
    }
    console.log('cardList', cardList.value)

    total.value = response?.data?.total || 0
    loading.value = false

    // 数据加载完成后，立即使用占位高度布局，避免抖动
    await nextTick()
    // 立即布局（使用图片的固定宽高比和视频的占位高度）
    layoutMasonry()
    // 检查缓存的图片（如果图片已经缓存，load 事件可能不会触发）
    if (import.meta.client) {
      setTimeout(() => {
        checkCachedImages()
        // 延迟一下再次布局，使用视频的实际高度
        setTimeout(() => {
          layoutMasonry()
        }, 200)
      }, 100)
    }
  } catch (e) {
    loading.value = false
  }
}

// 加载更多数据
const loadMore = async () => {
  // 确保只在客户端执行
  if (import.meta.server) {
    return
  }

  // 检查是否还有更多数据
  if (!hasMore.value) {
    return
  }

  // 页码加1
  page.value++

  // 调用接口获取下一页数据（追加模式）
  await fetchList(true)
}

const handleCardClick = (card: any) => {
  if (card.link) {
    navigateTo(card.link)
  }
}

/**
 * 处理复用按钮点击
 */
const handleReuse = (card: any) => {
  // TODO: 实现复用逻辑
  // 可以跳转到生成页面并填充相关参数
  console.log('复用卡片:', card)
  
  // 示例：如果有 link，可以跳转到生成页面
  if (card.link) {
    navigateTo(card.link)
  }
}


/**
 * Tab 点击处理
 */
const handleTabClick = (key: string) => {
  activeCateOne.value = key
  // 如果是特效视频，重置二级分类
  if (key !== 'special_effects') {
    activeCateTwo.value = ''
  }
  // 重置页码
  page.value = 1
  // 重新获取数据
  fetchList()
  // 滚动到激活的 tab（移动端）
  scrollToActiveTab()
}

/**
 * 滚动到激活的 tab（移动端）
 */
const scrollToActiveTab = () => {
  if (!tabsNavRef.value) return
  
  nextTick(() => {
    const activeTab = tabsNavRef.value?.querySelector('.tabs-tab-active') as HTMLElement
    if (activeTab) {
      const navList = tabsNavRef.value?.querySelector('.tabs-nav-list') as HTMLElement
      if (navList) {
        const scrollLeft = activeTab.offsetLeft - (navList.offsetWidth / 2) + (activeTab.offsetWidth / 2)
        navList.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        })
      }
    }
  })
}

/**
 * 二级分类点击
 */
const handleCateTwoClick = (tag: string) => {
  // 如果点击的是已选中的分类，则取消选择
  if (activeCateTwo.value === tag) {
    activeCateTwo.value = ''
  } else {
    activeCateTwo.value = tag
  }
  // 重置页码
  page.value = 1
  // 重新获取数据
  fetchList()
}

/**
 * 判断是否为视频文件
 */
const isVideo = (url?: string): boolean => {
  if (!url) return false
  return url.toLowerCase().includes('mp4')
}



// 鼠标进入时继续播放视频（如果已暂停）
const handleVideoEnter = (event: MouseEvent) => {
  const wrapper = event.currentTarget as HTMLElement
  const video = wrapper.querySelector('video') as HTMLVideoElement
  if (video && video.paused) {
    video.play().catch(() => {
      // 忽略播放错误
    })
  }
}

// 鼠标离开时继续播放（保持自动播放）
const handleVideoLeave = (event: MouseEvent) => {
  // 保持自动播放，不做任何操作
}

/**
 * 计算列数和间距
 */
const calculateColumnCount = () => {
  if (import.meta.server || !masonryContainer.value) {
    return 6
  }

  const containerWidth = masonryContainer.value.offsetWidth

  if (containerWidth >= 1400) {
    columnCount.value = 6
    columnGap.value = 10
  } else if (containerWidth >= 1200) {
    columnCount.value = 5
    columnGap.value = 10
  } else if (containerWidth >= 768) {
    columnCount.value = 4
    columnGap.value = 10
  } else if (containerWidth >= 480) {
    columnCount.value = 2
    columnGap.value = 12
  } else {
    columnCount.value = 2
    columnGap.value = 8
  }

  return columnCount.value
}

/**
 * 瀑布流布局
 */
const layoutMasonry = () => {
  if (import.meta.server || !masonryContainer.value || cardItems.value.length === 0) {
    return
  }

  const cols = calculateColumnCount()
  const gap = columnGap.value
  const containerWidth = masonryContainer.value.offsetWidth
  const cardWidth = (containerWidth - (cols - 1) * gap) / cols

  // 初始化列高度数组
  const columnHeights = new Array(cols).fill(0)
  const styles: Array<{ top: string; left: string; width: string }> = []

  cardItems.value.forEach((item, index) => {
    if (!item) {
      styles.push({ top: '0', left: '0', width: `${cardWidth}px` })
      return
    }

    // 找到最短的列
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights))

    // 计算位置
    const left = shortestColumnIndex * (cardWidth + gap)
    const top = columnHeights[shortestColumnIndex]

    // 判断是否为图片（非视频）
    const card = cardList.value[index]
    const isImage = card && !isVideo(card.result)
    
    // 计算卡片高度
    let cardHeight: number
    if (isImage) {
      // 图片使用固定宽高比（2:3），竖版，高度更高
      cardHeight = cardWidth * (3 / 2)
    } else {
      // 视频使用实际高度，如果还没加载完成则使用占位高度
      cardHeight = item.offsetHeight || cardWidth * (9 / 16)
    }

    // 更新列高度
    columnHeights[shortestColumnIndex] += cardHeight + gap

    styles.push({
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`
    })
  })

  cardStyles.value = styles

  // 设置容器高度，确保不小于最小高度
  const maxHeight = Math.max(...columnHeights)
  if (masonryContainer.value) {
    // 根据屏幕宽度确定最小高度
    const containerWidth = masonryContainer.value.offsetWidth
    let minHeight = 600
    if (containerWidth <= 480) {
      minHeight = 400
    } else if (containerWidth <= 768) {
      minHeight = 500
    }
    
    masonryContainer.value.style.height = `${Math.max(maxHeight, minHeight)}px`
  }
}

/**
 * 图片加载完成处理
 */
const handleImageLoad = (index: number) => {
  // 标记该图片已加载完成
  imageLoadedMap.value[index] = true
  // 图片使用固定宽高比，不需要重新计算布局
}

/**
 * 图片加载错误处理
 */
const handleImageError = (index: number) => {
  // 即使加载失败，也标记为已加载，避免一直显示骨架屏
  imageLoadedMap.value[index] = true
}

/**
 * 视频加载完成处理
 */
const handleVideoLoaded = (event: Event, index: number) => {
  const video = event.target as HTMLVideoElement
  if (video) {
    video.play().catch(() => {
      // 忽略播放错误（可能是浏览器自动播放策略限制）
    })
    // 标记该视频已加载完成
    imageLoadedMap.value[index] = true
    // 延迟一下确保 DOM 更新后重新布局（视频需要动态高度）
    nextTick(() => {
      layoutMasonry()
    })
  }
}

// 监听窗口大小变化
onMounted(() => {
  if (import.meta.client) {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
      resizeTimer = setTimeout(() => {
        layoutMasonry()
      }, 300)
    }
    window.addEventListener('resize', handleResize)

    // 组件卸载时移除监听
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
    })
  }
})

/**
 * 检查缓存的图片（如果图片已经缓存，load 事件可能不会触发）
 */
const checkCachedImages = () => {
  if (import.meta.server) return
  
  nextTick(() => {
    cardList.value.forEach((card, index) => {
      if (!imageLoadedMap.value[index] && card?.result) {
        // 查找对应的图片元素
        const imgElements = document.querySelectorAll('.card-image:not(.card-video)')
        const videoElements = document.querySelectorAll('.card-video')
        
        if (isVideo(card.result)) {
          const video = videoElements[index] as HTMLVideoElement
          if (video && video.readyState >= 2) {
            imageLoadedMap.value[index] = true
          }
        } else {
          const img = imgElements[index] as HTMLImageElement
          if (img && (img.complete || img.naturalHeight !== 0)) {
            imageLoadedMap.value[index] = true
          }
        }
      }
    })
    // 如果有缓存的视频，重新布局（视频需要动态高度）
    const hasLoadedVideo = cardList.value.some((card, index) => 
      imageLoadedMap.value[index] && isVideo(card?.result)
    )
    if (hasLoadedVideo) {
      nextTick(() => {
        layoutMasonry()
      })
    }
  })
}

// 监听卡片列表变化，重新布局
watch(
  () => cardList.value.length,
  () => {
    if (import.meta.client) {
      // 确保所有卡片都有加载状态（如果还没有初始化）
      cardList.value.forEach((_, index) => {
        if (imageLoadedMap.value[index] === undefined) {
          imageLoadedMap.value[index] = false
        }
      })
      
      nextTick(() => {
        // 立即布局（使用图片的固定宽高比和视频的占位高度），避免抖动
        layoutMasonry()
        // 检查缓存的图片（如果图片已经缓存，load 事件可能不会触发）
        setTimeout(() => {
          checkCachedImages()
          // 延迟一下再次布局，使用视频的实际高度
          setTimeout(() => {
            layoutMasonry()
          }, 200)
        }, 100)
      })
    }
  }
)

fetchList()
</script>

<style lang="scss" scoped>
.index-case {
  max-width: 1280px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    padding: 0 12px;
  }

  .tab-wrapper {
    display: flex;
    justify-content: center;
    margin: 0 auto 56px;
    width: 100%;

    @media (max-width: 768px) {
      margin-bottom: 48px;
    }

    @media (max-width: 480px) {
      margin-bottom: 40px;
    }
  }

  .cate-two-wrapper {
    width: 100%;
    margin-bottom: 32px;
    display: flex;
    justify-content: center;

    @media (max-width: 768px) {
      margin-bottom: 24px;
    }

    @media (max-width: 480px) {
      margin-bottom: 20px;
    }

    .cate-two-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      max-width: 100%;
      padding: 0 20px;

      @media (max-width: 768px) {
        gap: 10px;
        padding: 0 16px;
      }

      @media (max-width: 480px) {
        gap: 8px;
        padding: 0 12px;
      }

      .cate-two-tag {
        padding: 8px 20px;
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 500;
        color: #6b7280;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        white-space: nowrap;
        user-select: none;

        @media (max-width: 768px) {
          padding: 6px 16px;
          font-size: 13px;
        }

        @media (max-width: 480px) {
          padding: 6px 14px;
          font-size: 12px;
        }

        &:hover {
          border-color: #722ed1;
          color: #722ed1;
          background: #f8f4ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(114, 46, 209, 0.15);
        }

        &.active {
          background: linear-gradient(135deg, #722ed1 0%, #531dab 50%, #b37feb 100%);
          border-color: #722ed1;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(114, 46, 209, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(114, 46, 209, 0.4);
          }
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }

  .card-container {
    position: relative;
    margin-top: 40px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-height: 600px; // 默认最小高度，避免加载时塌陷

    @media (max-width: 768px) {
      padding: 0 16px;
      box-sizing: border-box;
      min-height: 500px;
    }

    @media (max-width: 480px) {
      padding: 0;
      box-sizing: border-box;
      min-height: 400px;
    }

    &.masonry-container {
      min-height: 600px; // 瀑布流容器最小高度

      @media (max-width: 768px) {
        min-height: 500px;
      }

      @media (max-width: 480px) {
        min-height: 400px;
      }
    }

    .card-item {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      will-change: transform;

      @media (max-width: 768px) {
        border-radius: 8px;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }

      .card-image-wrapper {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        background: #f5f5f5;
        display: block;
        // 图片使用固定宽高比（2:3），避免布局抖动
        aspect-ratio: 2 / 3;

        .card-image {
          width: 100%;
          height: 100%;
          display: block;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform-origin: center center;
          object-fit: cover;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .card-video {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: linear-gradient(
            90deg,
            #1a1a1a 25%,
            #2a2a2a 50%,
            #1a1a1a 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        // 视频容器不使用固定宽高比，使用动态高度
        &:has(.card-video) {
          aspect-ratio: unset;
          height: auto;
        }

        .card-image-placeholder {
          width: 100%;
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;

          .placeholder-icon {
            font-size: 48px;
            opacity: 0.6;
          }
        }

        // 占位符动画
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #ef4444;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 2;
        }

        .card-tags {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 12px;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            transparent 100%
          );
          z-index: 1;

          .card-tag {
            padding: 4px 10px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 6px;
            font-size: 12px;
            color: #ffffff;
            font-weight: 500;
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
        }

        &:hover .card-image {
          transform: scale(1.12);
        }

        .card-reuse-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 24px;
          font-size: 14px;
          font-weight: 500;
          color: #722ed1;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          box-shadow: 0 4px 16px rgba(114, 46, 209, 0.2);
          user-select: none;

          @media (max-width: 768px) {
            padding: 8px 16px;
            font-size: 13px;
            gap: 5px;
          }

          .reuse-icon {
            font-size: 16px;
            transition: transform 0.3s ease;

            @media (max-width: 768px) {
              font-size: 14px;
            }
          }

          .reuse-text {
            white-space: nowrap;
          }

          &:hover {
            background: rgba(255, 255, 255, 1);
            color: #531dab;
            box-shadow: 0 6px 20px rgba(114, 46, 209, 0.3);
            transform: translate(-50%, -50%) scale(1.05);

            .reuse-icon {
              transform: rotate(15deg);
            }
          }

          &:active {
            transform: translate(-50%, -50%) scale(0.98);
          }
        }
      }

      &:hover .card-reuse-btn {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .load-more-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    padding: 16px 0;
    padding-bottom: 40px;
    text-align: center;

    @media (max-width: 768px) {
      margin-top: 24px;
      padding: 12px 0;
    }

    .load-more-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 32px;
      background: #ffffff;
      color: #1f2937;
      border: 2px solid #e5e7eb;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;

      @media (max-width: 768px) {
        padding: 10px 24px;
        font-size: 14px;
        gap: 6px;
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s ease;
      }

      &:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        background: #f8fafc;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        transform: translateY(-1px);

        &::before {
          left: 100%;
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);
      }

      .load-more-text {
        letter-spacing: 0.3px;
        position: relative;
        z-index: 1;
      }

      .load-more-icon {
        font-size: 16px;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 1;

        @media (max-width: 768px) {
          font-size: 14px;
        }
      }

      &:hover .load-more-icon {
        transform: translateY(3px) rotate(180deg);
      }
    }
  }
}

  .custom-tabs {
    width: 100%;
    max-width: 100%;

    .tabs-nav {
      margin: 0;
      border-bottom: none;
    }

    .tabs-nav-list {
      display: flex;
      justify-content: center;
      gap: 32px;
      width: 100%;

      @media (max-width: 768px) {
        gap: 24px;
        justify-content: flex-start;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
        scroll-behavior: smooth;

        &::-webkit-scrollbar {
          display: none;
        }
      }

      @media (max-width: 480px) {
        gap: 20px;
      }
    }

    .tabs-tab {
      padding: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: #94a3b8;
      border: none;
      height: auto;
      line-height: 1.5;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;

      @media (max-width: 768px) {
        font-size: 15px;
        padding-bottom: 12px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
        padding-bottom: 10px;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        border-radius: 2px;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }

      &:hover {
        color: #475569;
      }

      &.tabs-tab-active {
        color: #1e293b;
        font-weight: 600;

        &::after {
          width: 100%;
        }
      }

      &:active {
        transform: scale(0.96);
      }
    }
  }

// 空状态样式
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  min-height: 400px;

  @media (max-width: 768px) {
    padding: 80px 20px;
    min-height: 300px;
  }
}

.empty-state-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  animation: fadeInUp 0.6s ease-out;
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

.empty-state-icon-wrapper {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
}

.empty-state-icon-bg {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(179, 127, 235, 0.1) 100%);
  animation: pulse 2s ease-in-out infinite;
  z-index: 0;

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.empty-state-icon {
  position: relative;
  font-size: 48px;
  color: #722ed1;
  z-index: 1;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    font-size: 40px;
  }
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.02em;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 18px;
  }
}

.empty-state-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

// 骨架屏样式
// 隐藏的图片样式
.image-hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
  overflow: hidden;
}

.skeleton-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: default;

  @media (max-width: 768px) {
    border-radius: 8px;
  }
}

.skeleton-image {
  position: relative;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background: #f5f5f5;
  display: block;
  aspect-ratio: 1;
}

.skeleton-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
