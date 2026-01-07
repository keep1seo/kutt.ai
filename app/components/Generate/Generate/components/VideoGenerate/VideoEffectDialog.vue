<template>
  <a-modal
    v-model:open="open"
    title="选择视频特效"
    :footer="null"
    width="900px"
    class="video-effect-dialog"
    @cancel="onCancel"
  >
    <div class="video-effect-dialog-content">
      <!-- Tab 切换 -->
      <a-tabs
        v-model:activeKey="selectCategory"
        class="video-effect-tabs"
        @change="handleCategoryChange"
      >
        <a-tab-pane v-for="cat in category" :key="cat" :tab="cat" />
      </a-tabs>

      <!-- 列表内容 -->
      <div ref="listWrapperRef" class="video-effect-list-wrapper" @scroll="handleScroll">
        <a-spin :spinning="loading">
          <div v-if="list.length > 0" class="video-effect-list">
            <div
              v-for="item in list"
              :key="item.id"
              class="video-effect-item"
              @click="onSelect(item)"
              @mouseenter="playVideo($event)"
              @mouseleave="pauseVideo($event)"
            >
              <div class="video-effect-item-image">
                <video
                  :src="item.image"
                  :alt="item.name"
                  muted
                  loop
                  playsinline
                  autoplay
                  preload="auto"
                ></video>
              </div>
              <div class="video-effect-item-name">{{ item.name }}</div>
            </div>
          </div>
          <a-empty v-else-if="!loading" description="暂无数据" />
        </a-spin>
        <!-- 加载更多提示 -->
        <div v-if="hasMore && !loading" class="video-effect-load-more">
          <span>滚动到底部加载更多</span>
        </div>
        <div v-if="!hasMore && list.length > 0" class="video-effect-no-more">
          <span>没有更多了</span>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, computed } from 'vue'
import { useGenerateApi } from '~/api/useGenerateApi'

// 列表项类型
interface VideoEffectItem {
  id: string | number
  category: string
  name: string
  image: string
}

/* Emits */
const emits = defineEmits<{
  confirm: [item: VideoEffectItem]
}>()

/* Api */
const generateApi = useGenerateApi()

// state
const state = reactive({
  // open
  open: false,
  // loading
  loading: false,
  // 分类
  category: [
    '💋 性感',
    '⚡️ 超现实',
    '😄 整活脑洞',
    '💪 动作/健身',
    '🦸 变身',
    '🎥 运镜',
    '💃 热舞',
    '📷 社交/情感'
  ],
  // 当前选中的分类
  selectCategory: '💋 性感',
  // 页码
  page: 1,
  // 每页数量
  limit: 20,
  // 总数
  total: 0,
  // 列表
  list: [] as VideoEffectItem[]
})

// toRefs
const { open, loading, category, selectCategory, page, limit, total, list } = toRefs(state)

// 列表容器引用
const listWrapperRef = ref<HTMLDivElement | null>(null)

// 是否还有更多数据
const hasMore = computed(() => {
  return list.value.length < total.value
})

// 是否正在加载更多
const isLoadingMore = ref(false)

/**
 * 获取列表
 */
const fetchList = async (isLoadMore = false) => {
  try {
    if (isLoadMore) {
      isLoadingMore.value = true
    } else {
      loading.value = true
    }

    const response = await generateApi.videoEffectList({
      category: selectCategory.value,
      page: page.value,
      limit: limit.value
    })

    // 每个对象包含的字段：id、category、name、image
    const newList = response.data.list || []

    if (isLoadMore) {
      // 加载更多时追加数据
      list.value = [...list.value, ...newList]
    } else {
      // 首次加载或切换分类时替换数据
      list.value = newList
    }

    total.value = response.data.total || 0

    if (isLoadMore) {
      isLoadingMore.value = false
    } else {
      loading.value = false
    }
  } catch (e) {
    if (isLoadMore) {
      isLoadingMore.value = false
    } else {
      loading.value = false
    }
  }
}

/**
 * 分类切换
 */
const handleCategoryChange = () => {
  page.value = 1
  list.value = []
  if (listWrapperRef.value) {
    listWrapperRef.value.scrollTop = 0
  }
  fetchList()
}

/**
 * 滚动处理
 */
const handleScroll = (event: Event) => {
  const target = event.target as HTMLDivElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 距离底部 50px 时开始加载
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadMore()
  }
}

/**
 * 加载更多
 */
const loadMore = () => {
  if (!hasMore.value || loading.value || isLoadingMore.value) {
    return
  }

  page.value += 1
  fetchList(true)
}

/**
 * 选择特效
 */
const onSelect = (item: VideoEffectItem) => {
  emits('confirm', item)
  open.value = false
}

/**
 * 播放视频（鼠标悬停）
 */
const playVideo = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const video = target.querySelector('video') as HTMLVideoElement
  if (video) {
    video.play().catch(() => {
      // 忽略自动播放错误
    })
  }
}

/**
 * 暂停视频（鼠标离开）
 */
const pauseVideo = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const video = target.querySelector('video') as HTMLVideoElement
  if (video) {
    video.pause()
    video.currentTime = 0
  }
}

/**
 * 关闭弹框
 */
const onCancel = () => {
  open.value = false
}

/**
 * 显示
 */
const onShow = () => {
  page.value = 1
  fetchList()
  open.value = true
}

defineExpose({
  onShow
})
</script>

<style lang="scss" scoped>
.video-effect-dialog-content {
  padding: 0;
}

// Tab 样式
:deep(.video-effect-tabs) {
  .ant-tabs-nav {
    margin: 0;
    padding: 0 24px;
    border-bottom: 1px solid #e2e8f0;

    @media (prefers-color-scheme: dark) {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    &::before {
      display: none;
    }
  }

  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    transition: all 0.2s ease;

    @media (prefers-color-scheme: dark) {
      color: #94a3b8;
    }

    &:hover {
      color: #722ed1;

      @media (prefers-color-scheme: dark) {
        color: #b37feb;
      }
    }

    &.ant-tabs-tab-active {
      color: #722ed1;
      font-weight: 600;

      @media (prefers-color-scheme: dark) {
        color: #b37feb;
      }

      .ant-tabs-tab-btn {
        color: inherit;
      }
    }
  }

  .ant-tabs-ink-bar {
    background: #722ed1;

    @media (prefers-color-scheme: dark) {
      background: #b37feb;
    }
  }
}

.video-effect-list-wrapper {
  height: 500px;
  overflow-y: auto;
  padding: 24px;
  position: relative;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
  }

  :deep(.ant-spin-container) {
    min-height: 100%;
  }

  :deep(.ant-spin-spinning) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;

    @media (prefers-color-scheme: dark) {
      background: #1f1f24;
    }
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.2);
    }

    &:hover {
      background: #94a3b8;

      @media (prefers-color-scheme: dark) {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}

.video-effect-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.video-effect-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  transition: all 0.3s ease;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: #722ed1;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(114, 46, 209, 0.2);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 8px 16px rgba(179, 127, 235, 0.3);
    }
  }
}

.video-effect-item-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #000;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.video-effect-item-name {
  padding: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #1e293b;
  text-align: center;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.video-effect-load-more,
.video-effect-no-more {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }
}

// Modal 样式
:deep(.video-effect-dialog) {
  .ant-modal-header {
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 24px;

    @media (prefers-color-scheme: dark) {
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
  }

  .ant-modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;

    @media (prefers-color-scheme: dark) {
      color: #f1f5f9;
    }
  }

  .ant-modal-body {
    padding: 0;
  }
}
</style>
