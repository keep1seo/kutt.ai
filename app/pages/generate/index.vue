<template>
  <!--内容区域-->
  <div class="generate-results">
    <!--骨架屏加载状态-->
    <template v-if="loading">
      <div v-for="n in 3" :key="`skeleton-${n}`" class="item">
        <div class="skeleton-item">
          <a-skeleton active :title="{ width: '60%' }" :paragraph="{ rows: 1 }" />
          <div class="skeleton-meta">
            <!-- <div class="skeleton-tag"></div> -->
            <!-- <div class="skeleton-detail"></div> -->
          </div>
          <div class="skeleton-video"></div>
          <div class="skeleton-label"></div>
          <div class="skeleton-actions">
            <div class="skeleton-button skeleton-button-primary"></div>
            <div class="skeleton-button"></div>
          </div>
        </div>
      </div>
    </template>
    <!--空状态-->
    <div v-else-if="!loading && taskList.length === 0" class="empty-state">
      <div class="empty-state-wrapper">
        <div class="empty-state-icon-wrapper">
          <div class="empty-state-icon-bg"></div>
          <FileTextOutlined class="empty-state-icon" />
        </div>
        <div class="empty-state-content">
          <div class="empty-state-title">暂无生成记录</div>
          <div class="empty-state-desc">开始创建您的第一个生成任务吧</div>
        </div>
      </div>
    </div>
    <!--每一项-->
    <div v-for="(item, index) in taskList" :key="index" class="item">
      <ClientOnly>
        <!--状态：SUCCEEDED，FAILED，RUNNING-->
        <div
          v-if="['RUNNING', 'PENDING'].includes(item?.status)"
          class="status-card status-running"
        >
          <div class="status-icon">
            <LoadingOutlined spin />
          </div>
          <div class="status-info">
            <div class="status-title">生成中...</div>
            <div class="status-desc">
              {{ item?.request_params?.prompt || '正在处理您的请求' }}
            </div>
          </div>
        </div>
        <div v-else-if="item?.status === 'FAILED'" class="status-card status-failed">
          <div class="status-icon">
            <CloseCircleOutlined />
          </div>
          <div class="status-info">
            <div class="status-title">生成失败</div>
            <div class="status-desc">
              {{ item?.request_params?.prompt || '请重试或联系客服' }}
            </div>
          </div>
          <a-button size="small" class="status-retry-btn">重试</a-button>
        </div>
        <div v-else>
          <!--数字人-->
          <template v-if="item.method_type === 'S2V'">
            <DigitalItem :item="item" @reGenerate="onReDigitalGenerate" @delete="onRefresh" />
          </template>
          <!--动作模仿-->
          <template v-if="item.method_type === 'Animate'">
            <ActionItem :item="item" @reGenerate="onReActionGenerate" />
          </template>
          <!--图片生成-->
          <template v-if="item.method_type === 'generate_image'">
            <GenerateImageItem :item="item" @reGenerate="onReImageGenerate" />
          </template>
          <!--视频生成-->
          <template v-if="item.method_type === 'generate_video'">
            <GenerateVideoItem :item="item" @reGenerate="onReVideoGenerate" />
          </template>
        </div>
      </ClientOnly>
    </div>
    <!--加载更多提示-->
    <div v-if="loadingMore" class="load-more">
      <a-spin size="small" />
      <span class="load-more-text">加载中...</span>
    </div>
    <!--没有更多数据提示-->
    <div v-else-if="!hasMore && taskList.length > 0" class="load-more">
      <span class="load-more-text">没有更多数据了</span>
    </div>
  </div>
  <!--编辑器-->
  <GenerateEditor
    ref="editorRef"
    :initial-active-key="activeKey"
    :initial-collapsed="isEditorCollapsed"
    @generate-success="onGenerateSuccess"
    @active-key-change="
      (key: string) => {
        activeKey = key as 'video' | 'image' | 'digital' | 'action'
      }
    "
  />
  <!--回到顶部按钮-->
  <transition name="fade">
    <button v-if="showBackToTop" class="back-to-top-btn" @click="scrollToTop" title="回到顶部">
      <VerticalAlignTopOutlined />
    </button>
  </transition>
</template>
<script setup lang="ts">
import {
  LoadingOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  VerticalAlignTopOutlined
} from '@ant-design/icons-vue'
import DigitalItem from '~/components/Generate/Item/DigitalItem.vue'
import ActionItem from '~/components/Generate/Item/ActionItem.vue'
import GenerateImageItem from '~/components/Generate/Item/GenerateImageItem.vue'
import GenerateVideoItem from '~/components/Generate/Item/GenerateVideoItem.vue'
import GenerateEditor from '~/components/Generate/Editor.vue'
import { useI18n } from 'vue-i18n'
import { useGenerateApi } from '~/api/useGenerateApi'

definePageMeta({
  hiddenFooter: true
})

const { t } = useI18n()
const generateApi = useGenerateApi()
const userInfo = useCookie('userInfo')

useSeoMeta({
  title: t('page.generate.title'),
  ogTitle: t('page.generate.title'),
  ogDescription: t('page.generate.description'),
  description: t('page.generate.description'),
  keywords: t('page.generate.keywords')
})

// state
const state = reactive({
  // 当前选择tab
  activeKey: 'digital' as 'video' | 'image' | 'digital' | 'action',
  // loading
  loading: false,
  // 加载更多
  loadingMore: false,
  // 当前页码
  page: 1,
  // 每页数量
  limit: 10,
  // 总数
  total: 0,
  // 任务列表
  taskList: [] as any[],
  // 编辑器是否收起
  isEditorCollapsed: true,
  // 是否还有更多数据
  hasMore: true,
  // 是否显示回到顶部按钮
  showBackToTop: false
})

// toRefs
const {
  activeKey,
  loading,
  loadingMore,
  page,
  limit,
  total,
  taskList,
  isEditorCollapsed,
  hasMore,
  showBackToTop
} = toRefs(state)

// 编辑器组件引用
const editorRef = ref<any>(null)
// 轮询定时器
let pollingTimer: ReturnType<typeof setInterval> | null = null

watch(
  () => userInfo.value,
  (newVal) => {
    if (newVal) {
      fetchList()
    }
  }
)

/**
 * 重新生成-数字人
 * @param item
 */
const onReDigitalGenerate = async (item: any) => {
  activeKey.value = 'digital'
  // 切换到数字人tab并填充表单数据
  if (editorRef.value?.switchTabAndFillForm && item?.request_params) {
    await editorRef.value.switchTabAndFillForm('digital', item.request_params)
  }
}

/**
 * 重新生成-动作模仿
 * @param item
 */
const onReActionGenerate = async (item: any) => {
  activeKey.value = 'action'
  // 切换到动作模仿tab并填充表单数据
  if (editorRef.value?.switchTabAndFillForm && item?.request_params) {
    await editorRef.value.switchTabAndFillForm('action', item.request_params)
  }
}

/**
 * 重新生成-图片生成
 * @param item
 */
const onReImageGenerate = async (item: any) => {
  activeKey.value = 'image'
  // 切换到图片生成tab并填充表单数据
  if (editorRef.value?.switchTabAndFillForm && item?.request_params) {
    await editorRef.value.switchTabAndFillForm('image', item.request_params)
  }
}

/**
 * 重新生成-视频生成
 * @param item
 */
const onReVideoGenerate = async (item: any) => {
  activeKey.value = 'video'
  // 切换到视频生成tab并填充表单数据
  if (editorRef.value?.switchTabAndFillForm && item?.request_params) {
    await editorRef.value.switchTabAndFillForm('video', item.request_params)
  }
}

/**
 * 创建任务成功
 * @param item
 */
const onGenerateSuccess = (item: any) => {
  taskList.value.unshift({
    id: new Date().getTime(),
    task_id: item.task_id,
    status: 'RUNNING',
    method_type: item.method_type,
    tool_name: item.tool_name,
    request_params: item.request_params
  })
  // 开始轮询
  startPolling()
  // 滚动到顶部
  nextTick(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

/**
 * 停止轮询
 */
const stopPolling = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer)
    pollingTimer = null
  }
}

/**
 * 开始轮询任务结果
 */
const startPolling = () => {
  // 如果已经有定时器在运行，先清除
  stopPolling()

  // 立即执行一次
  fetchTaskResult()

  // 每2秒轮询一次
  pollingTimer = setInterval(() => {
    fetchTaskResult()
  }, 2000)
}

/**
 * 获取任务结果
 */
const fetchTaskResult = async () => {
  // 获取正在运行的任务列表
  const runningTasks = taskList.value.filter((item) => ['RUNNING', 'PENDING'].includes(item.status))

  // 如果没有正在运行的任务，停止轮询
  if (runningTasks.length === 0) {
    stopPolling()
    return
  }

  try {
    // 轮询获取任务结果
    const response = await generateApi.taskResult({
      taskIds: runningTasks.map((item) => item.task_id)?.join(',')
    })

    // 更新任务列表中的任务状态
    if (response?.data) {
      const resultMap = new Map()
      // 如果返回的是对象，遍历其属性
      Object.keys(response.data).forEach((key) => {
        if (response.data[key]['status'] !== 'RUNNING') {
          resultMap.set(key, response.data[key])
        }
      })

      // 更新任务列表
      taskList.value.forEach((task) => {
        if (['RUNNING', 'PENDING'].includes(task.status) && resultMap.has(task.task_id)) {
          const result = resultMap.get(task.task_id)
          // 更新任务状态和结果
          task.status = result.status
          if (Array.isArray(result.result)) {
            task.result = result.result[0]
            if (result.request_params) {
              task.request_params = result.request_params
            }
          }
        }
      })
    }
  } catch (error) {
    console.error('获取任务结果失败:', error)
  }
}

/**
 * 刷新
 */
const onRefresh = () => {
  page.value = 1
  taskList.value = []
  fetchList()
}

/**
 * 获取任务列表
 * @param append - 是否追加数据，默认为 false（替换）
 */
const fetchList = async (append: boolean = false) => {
  try {
    if (append) {
      loadingMore.value = true
    } else {
      loading.value = true
      page.value = 1
      taskList.value = []
      hasMore.value = true
    }

    const response = await generateApi.taskList({
      page: page.value,
      limit: limit.value,
      name: 'generate_image,generate_video,S2V,Animate'
    })

    const newList = response?.data?.list || []
    total.value = response?.data?.total || 0

    if (append) {
      // 追加数据
      taskList.value = [...taskList.value, ...newList]
      loadingMore.value = false
    } else {
      // 替换数据
      taskList.value = newList
      loading.value = false
    }

    // 判断是否还有更多数据
    hasMore.value = taskList.value.length < total.value

    // 如果有正在运行的任务，开始轮询
    const hasRunningTasks = taskList.value.some((item: any) => item.status === 'RUNNING')
    if (hasRunningTasks) {
      startPolling()
    }
  } catch (e) {
    if (append) {
      loadingMore.value = false
    } else {
      loading.value = false
    }
  }
}

/**
 * 加载更多数据
 */
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) {
    return
  }

  page.value += 1
  await fetchList(true)
}

// 节流定时器
let scrollTimer: ReturnType<typeof setTimeout> | null = null

/**
 * 处理滚动事件（节流）
 */
const handleScroll = () => {
  if (scrollTimer) {
    return
  }

  scrollTimer = setTimeout(() => {
    // 获取滚动位置
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    // 控制回到顶部按钮的显示（滚动超过 300px 时显示）
    showBackToTop.value = scrollTop > 300

    // 当滚动到距离底部 200px 时触发加载
    if (scrollTop + windowHeight >= documentHeight - 200) {
      loadMore()
    }

    scrollTimer = null
  }, 200) // 200ms 节流
}

/**
 * 回到顶部
 */
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  fetchList()
  // 添加滚动监听
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时清理定时器和滚动监听
onBeforeUnmount(() => {
  stopPolling()
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
})
</script>
<style lang="scss" scoped>
// 生成结果区域样式
.generate-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 420px; // 底部 padding 确保不被编辑器遮挡（编辑器最大高度384px + 间距）
  background: transparent; // 透明背景
  min-height: 100vh; // 确保背景覆盖整个视口高度

  @media (prefers-color-scheme: dark) {
    background: transparent; // 深色模式也使用透明背景
  }

  @media (max-width: 767px) {
    padding: 24px 16px calc(70vh + 40px); // 移动端使用视口高度 + 额外间距
  }

  .item {
    margin-bottom: 48px;

    &:last-child {
      margin-bottom: 0; // 移除额外的 margin，因为父容器已经有 padding
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
  min-height: 60vh;

  @media (max-width: 767px) {
    padding: 80px 20px;
    min-height: 50vh;
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
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 767px) {
    margin-bottom: 32px;
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

  @media (max-width: 767px) {
    width: 70px;
    height: 70px;
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      rgba(179, 127, 235, 0.15) 0%,
      rgba(114, 46, 209, 0.15) 100%
    );
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
  font-size: 40px;
  color: #722ed1;
  z-index: 1;
  transition: transform 0.3s ease;

  @media (max-width: 767px) {
    font-size: 36px;
  }

  @media (prefers-color-scheme: dark) {
    color: #b37feb;
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

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }

  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.empty-state-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
  font-weight: 400;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }

  @media (max-width: 767px) {
    font-size: 14px;
  }
}

// 状态卡片样式
.status-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    background: #1b1b20;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}

.status-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-running {
  background: linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(179, 127, 235, 0.05) 100%);
  border-color: rgba(114, 46, 209, 0.2);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(114, 46, 209, 0.1) 0%, rgba(179, 127, 235, 0.1) 100%);
    border-color: rgba(179, 127, 235, 0.3);
  }

  .status-icon {
    color: #722ed1;

    @media (prefers-color-scheme: dark) {
      color: #b37feb;
    }
  }
}

.status-failed {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(248, 113, 113, 0.05) 100%);
  border-color: rgba(239, 68, 68, 0.2);

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%);
    border-color: rgba(248, 113, 113, 0.3);
  }

  .status-icon {
    color: #ef4444;

    @media (prefers-color-scheme: dark) {
      color: #f87171;
    }
  }
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 2px;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.status-desc {
  font-size: 13px;
  color: #64748b;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.status-retry-btn {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  color: #475569;

  &:hover {
    color: #722ed1;
    border-color: #722ed1;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.15);
    color: #cbd5e1;

    &:hover {
      color: #b37feb;
      border-color: #b37feb;
    }
  }
}

// 骨架屏样式
.skeleton-item {
  padding: 0;
  background: transparent;

  :deep(.ant-skeleton-content) {
    margin-bottom: 12px;
  }
}

.skeleton-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.skeleton-tag {
  width: 80px;
  height: 24px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.15) 37%,
      rgba(255, 255, 255, 0.06) 63%
    );
    background-size: 400% 100%;
  }
}

.skeleton-detail {
  width: 100px;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.15) 37%,
      rgba(255, 255, 255, 0.06) 63%
    );
    background-size: 400% 100%;
  }
}

.skeleton-video {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-top: 12px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.15) 37%,
      rgba(255, 255, 255, 0.06) 63%
    );
    background-size: 400% 100%;
  }

  @media (max-width: 767px) {
    height: 300px;
  }
}

.skeleton-label {
  width: 120px;
  height: 12px;
  margin: 12px 0 16px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.15) 37%,
      rgba(255, 255, 255, 0.06) 63%
    );
    background-size: 400% 100%;
  }
}

.skeleton-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.skeleton-button {
  width: 100px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.15) 37%,
    rgba(0, 0, 0, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.15) 37%,
      rgba(255, 255, 255, 0.06) 63%
    );
    background-size: 400% 100%;
  }

  &:last-child {
    width: 80px;
  }

  &-primary {
    background: linear-gradient(
      90deg,
      rgba(114, 46, 209, 0.2) 25%,
      rgba(114, 46, 209, 0.3) 37%,
      rgba(114, 46, 209, 0.2) 63%
    );
    background-size: 400% 100%;

    @media (prefers-color-scheme: dark) {
      background: linear-gradient(
        90deg,
        rgba(179, 127, 235, 0.2) 25%,
        rgba(179, 127, 235, 0.3) 37%,
        rgba(179, 127, 235, 0.2) 63%
      );
      background-size: 400% 100%;
    }
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

// 加载更多样式
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 20px;
  color: #64748b;
  font-size: 14px;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.load-more-text {
  color: #64748b;
  font-size: 14px;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

// 回到顶部按钮样式
.back-to-top-btn {
  position: fixed;
  right: 24px;
  bottom: 120px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(114, 46, 209, 0.3);
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(114, 46, 209, 0.4);
    background: linear-gradient(135deg, #8b3dd9 0%, #c495f0 100%);
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #b37feb 0%, #722ed1 100%);
    box-shadow: 0 4px 12px rgba(179, 127, 235, 0.4);

    &:hover {
      background: linear-gradient(135deg, #c495f0 0%, #8b3dd9 100%);
      box-shadow: 0 6px 16px rgba(179, 127, 235, 0.5);
    }
  }

  @media (max-width: 767px) {
    right: 16px;
    bottom: 100px;
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
