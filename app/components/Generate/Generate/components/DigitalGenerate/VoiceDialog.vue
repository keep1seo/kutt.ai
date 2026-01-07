<template>
  <a-modal
    v-model:open="open"
    title="选择音色"
    :footer="null"
    width="900px"
    class="voice-dialog"
    @cancel="onCancel"
  >
    <div class="voice-dialog-content">
      <!-- 筛选器 -->
      <div class="voice-filters">
        <div class="filter-item">
          <span class="filter-label">性别：</span>
          <div class="filter-buttons">
            <button
              v-for="(option, index) in genderOptions"
              :key="`gender-${index}`"
              class="filter-button"
              :class="{ active: filterGender === option.value }"
              @click="filterGender = option.value; onFilterChange()"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <div class="filter-item">
          <span class="filter-label">年龄：</span>
          <div class="filter-buttons">
            <button
              v-for="(option, index) in ageOptions"
              :key="`age-${index}`"
              class="filter-button"
              :class="{ active: filterAge === option.value }"
              @click="filterAge = option.value; onFilterChange()"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
      <!-- 列表内容 -->
      <div class="voice-list-wrapper">
        <a-spin :spinning="loading">
          <div v-if="filteredList.length > 0" class="voice-list">
            <div
              v-for="item in filteredList"
              :key="item.id"
              class="voice-item"
              :class="{
                active: selectedId === item.id,
                playing: isPlaying(item.id)
              }"
              @click="onSelect(item)"
              @mouseenter="playAudio($event, item)"
              @mouseleave="pauseAudio($event)"
            >
              <div class="voice-item-media">
                <!-- 音频预览（隐藏，仅用于播放） -->
                <audio
                  v-if="item.illustrationAudio"
                  :src="item.illustrationAudio"
                  class="voice-preview-audio"
                  preload="none"
                ></audio>
                <!-- 图片显示 -->
                <NuxtImg
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.voice"
                  class="voice-preview-image"
                  format="webp"
                />
                <!-- 默认占位 -->
                <div v-else class="voice-placeholder">
                  <span>{{ item.voice?.[0] || '?' }}</span>
                </div>
                <!-- 播放图标遮罩 -->
                <div
                  v-if="item.illustrationAudio"
                  class="voice-play-overlay"
                  @click.stop="togglePlayAudio($event, item)"
                >
                  <div class="play-icon" :class="{ playing: isPlaying(item.id) }">
                    <PlayCircleOutlined v-if="!isPlaying(item.id)" />
                    <PauseCircleOutlined v-else />
                  </div>
                </div>
              </div>
              <div class="voice-item-info">
                <div class="voice-name">{{ item.voice }}</div>
                <div class="voice-profile">{{ item.profile }}</div>
                <div class="voice-meta">
                  <span v-if="item.gender" class="voice-gender">
                    {{ item.gender === 1 ? '男' : item.gender === 2 ? '女' : '未知' }}
                  </span>
                  <span v-if="item.age" class="voice-age">
                    {{ item.age === 1 ? '儿童' : item.age === 2 ? '青年' : item.age === 3 ? '中年' : item.age === 4 ? '老人' : '未知' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <a-empty v-else-if="!loading" description="暂无音色数据" />
        </a-spin>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, computed } from 'vue'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue'
import { useGenerateApi } from '~/api/useGenerateApi'

// 音色项类型
interface VoiceItem {
  id: number
  voice: string
  image: string
  illustrationAudio: string
  profile: string
  age: number
  gender: number
}

/* Emits */
const emits = defineEmits<{
  confirm: [item: VoiceItem]
}>()

/* Api */
const generateApi = useGenerateApi()

// state
const state = reactive({
  // open
  open: false,
  // loading
  loading: false,
  // 列表
  list: [] as VoiceItem[],
  // 当前选中的音色ID
  selectedId: null as number | null
})

// toRefs
const { open, loading, list, selectedId } = toRefs(state)

// 筛选条件
const filterGender = ref<number | null>(null)
const filterAge = ref<number | null>(null)

// 性别选项
const genderOptions = [
  { label: '全部', value: null },
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

// 年龄选项
const ageOptions = [
  { label: '全部', value: null },
  { label: '儿童', value: 1 },
  { label: '青年', value: 2 },
  { label: '中年', value: 3 },
  { label: '老人', value: 4 }
]

// 当前播放的音频元素
const currentPlayingAudio = ref<HTMLAudioElement | null>(null)
// 当前播放的音色ID
const playingVoiceId = ref<number | null>(null)

/**
 * 获取音色列表
 */
const fetchList = async () => {
  try {
    loading.value = true
    const response = await generateApi.voiceList()
    list.value = response.data || []
    loading.value = false
  } catch (e) {
    loading.value = false
    list.value = []
  }
}

/**
 * 过滤后的列表
 */
const filteredList = computed(() => {
  let result = list.value

  // 按性别筛选
  if (filterGender.value !== null) {
    result = result.filter((item) => item.gender === filterGender.value)
  }

  // 按年龄筛选
  if (filterAge.value !== null) {
    result = result.filter((item) => item.age === filterAge.value)
  }

  return result
})

/**
 * 筛选条件变化（不需要重新请求，前端过滤即可）
 */
const onFilterChange = () => {
  // 前端过滤，不需要额外操作
}

/**
 * 检查音色是否正在播放
 */
const isPlaying = (voiceId: number) => {
  return playingVoiceId.value === voiceId
}

/**
 * 切换播放/暂停音频（点击播放按钮）
 */
const togglePlayAudio = (event: MouseEvent, item: VoiceItem) => {
  event.stopPropagation()

  const target = (event.currentTarget as HTMLElement).closest('.voice-item') as HTMLElement
  const audio = target?.querySelector('.voice-preview-audio') as HTMLAudioElement

  if (!audio || !item.illustrationAudio) return

  // 如果当前正在播放这个音频，则暂停
  if (playingVoiceId.value === item.id && currentPlayingAudio.value === audio) {
    audio.pause()
    audio.currentTime = 0
    currentPlayingAudio.value = null
    playingVoiceId.value = null
    return
  }

  // 如果当前有正在播放的音频，先暂停
  if (currentPlayingAudio.value && currentPlayingAudio.value !== audio) {
    currentPlayingAudio.value.pause()
    currentPlayingAudio.value.currentTime = 0
    playingVoiceId.value = null
  }

  // 播放新音频
  currentPlayingAudio.value = audio
  playingVoiceId.value = item.id
  audio.play().catch(() => {
    // 忽略自动播放错误
    currentPlayingAudio.value = null
    playingVoiceId.value = null
  })

  // 监听音频播放结束
  audio.onended = () => {
    if (currentPlayingAudio.value === audio) {
      currentPlayingAudio.value = null
      playingVoiceId.value = null
    }
  }
}

/**
 * 播放音频预览（鼠标悬停）
 */
const playAudio = (event: MouseEvent, item: VoiceItem) => {
  // 如果已经通过按钮播放，则不处理悬停播放
  if (playingVoiceId.value === item.id) return

  const target = event.currentTarget as HTMLElement
  const audio = target.querySelector('.voice-preview-audio') as HTMLAudioElement

  // 如果当前有正在播放的音频，先暂停
  if (currentPlayingAudio.value && currentPlayingAudio.value !== audio) {
    currentPlayingAudio.value.pause()
    currentPlayingAudio.value.currentTime = 0
    playingVoiceId.value = null
  }

  if (audio && item.illustrationAudio) {
    currentPlayingAudio.value = audio
    audio.play().catch(() => {
      // 忽略自动播放错误
    })
  }
}

/**
 * 暂停音频（鼠标离开）
 */
const pauseAudio = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement
  const audio = target.querySelector('.voice-preview-audio') as HTMLAudioElement

  // 如果通过按钮播放的，不暂停
  if (playingVoiceId.value && audio && currentPlayingAudio.value === audio) {
    return
  }

  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }

  if (currentPlayingAudio.value === audio && !playingVoiceId.value) {
    currentPlayingAudio.value = null
  }
}

/**
 * 选择音色
 */
const onSelect = (item: VoiceItem) => {
  selectedId.value = item.id
  emits('confirm', item)
  open.value = false
}

/**
 * 关闭弹框
 */
const onCancel = () => {
  // 暂停所有音频
  if (currentPlayingAudio.value) {
    currentPlayingAudio.value.pause()
    currentPlayingAudio.value.currentTime = 0
    currentPlayingAudio.value = null
  }
  playingVoiceId.value = null
  // 重置筛选条件
  filterGender.value = null
  filterAge.value = null
  open.value = false
}

/**
 * 显示弹框
 */
const onShow = (currentVoiceId?: number) => {
  selectedId.value = currentVoiceId || null
  fetchList()
  open.value = true
}

// 暴露方法供父组件调用
defineExpose({
  onShow
})
</script>

<style lang="scss" scoped>
.voice-dialog-content {
  padding: 0;
}

.voice-filters {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  margin-bottom: 0;

  @media (prefers-color-scheme: dark) {
    background: #1f1f24;
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
    padding-bottom: 20px;
  }

  .filter-item {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      width: 100%;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .filter-label {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      white-space: nowrap;

      @media (prefers-color-scheme: dark) {
        color: #f1f5f9;
      }
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-button {
      padding: 6px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      background: #ffffff;
      color: #64748b;
      font-size: 14px;
      font-weight: 400;
      cursor: pointer;
      transition: all 0.3s ease;
      outline: none;

      @media (prefers-color-scheme: dark) {
        border-color: rgba(255, 255, 255, 0.1);
        color: #94a3b8;
        background: rgba(255, 255, 255, 0.02);
      }

      &:hover {
        border-color: #722ed1;
        color: #722ed1;

        @media (prefers-color-scheme: dark) {
          border-color: #b37feb;
          color: #b37feb;
        }
      }

      &.active {
        border-color: #722ed1;
        background: #722ed1;
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(114, 46, 209, 0.2);

        @media (prefers-color-scheme: dark) {
          border-color: #b37feb;
          background: #b37feb;
          box-shadow: 0 2px 4px rgba(179, 127, 235, 0.3);
        }

        &:hover {
          border-color: #722ed1;
          background: #722ed1;
          color: #ffffff;

          @media (prefers-color-scheme: dark) {
            border-color: #b37feb;
            background: #b37feb;
          }
        }
      }
    }
  }
}

.voice-list-wrapper {
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

.voice-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}

.voice-item {
  cursor: pointer;
  border-radius: 12px;
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

    .voice-play-overlay {
      opacity: 1;
    }
  }

  &.active {
    border-color: #722ed1;
    box-shadow: 0 0 0 3px rgba(114, 46, 209, 0.1);

    @media (prefers-color-scheme: dark) {
      border-color: #b37feb;
      box-shadow: 0 0 0 3px rgba(179, 127, 235, 0.2);
    }
  }

  // 播放时保持遮罩可见
  &:has(.voice-play-overlay:hover),
  &.playing {
    .voice-play-overlay {
      opacity: 1;
      background: rgba(0, 0, 0, 0.5);
    }
  }
}

.voice-item-media {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;

  @media (prefers-color-scheme: dark) {
    background: #2a2a2a;
  }

  .voice-preview-audio {
    display: none; // 隐藏音频元素
  }

  .voice-preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .voice-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
    color: #ffffff;
    font-size: 48px;
    font-weight: 600;
  }

  .voice-play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition:
      opacity 0.3s ease,
      background 0.3s ease;
    z-index: 1;
    cursor: pointer;

    .play-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #722ed1 0%, #b37feb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow:
        0 4px 20px rgba(114, 46, 209, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition:
          width 0.3s ease,
          height 0.3s ease;
      }

      :deep(svg) {
        width: 32px;
        height: 32px;
        position: relative;
        z-index: 1;
        transition: transform 0.2s ease;
        fill: currentColor;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow:
          0 6px 24px rgba(114, 46, 209, 0.5),
          0 4px 12px rgba(0, 0, 0, 0.3);

        &::before {
          width: 100%;
          height: 100%;
        }

        :deep(svg) {
          transform: scale(1.1);
        }
      }

      &:active {
        transform: scale(1.05);
      }

      &.playing {
        background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
        box-shadow:
          0 4px 20px rgba(82, 196, 26, 0.4),
          0 2px 8px rgba(0, 0, 0, 0.2);
        animation: pulseGlow 2s ease-in-out infinite;

        &:hover {
          box-shadow:
            0 6px 24px rgba(82, 196, 26, 0.5),
            0 4px 12px rgba(0, 0, 0, 0.3);
          animation: none;
        }
      }
    }
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow:
      0 4px 20px rgba(82, 196, 26, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow:
      0 6px 28px rgba(82, 196, 26, 0.6),
      0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

.voice-item-info {
  padding: 12px;
}

.voice-name {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;
  }
}

.voice-profile {
  font-size: 12px;
  color: #64748b;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.4;
  min-height: 32px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    color: #94a3b8;
  }
}

.voice-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;

  @media (prefers-color-scheme: dark) {
    color: #64748b;
  }

  .voice-gender,
  .voice-age {
    padding: 2px 8px;
    background: #f1f5f9;
    border-radius: 12px;

    @media (prefers-color-scheme: dark) {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

// Modal 样式
:deep(.voice-dialog) {
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
