<template>
  <div class="video-player-wrapper">
    <div class="ai-badge">
      <div class="ai-badge-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>
      <span class="ai-badge-text">AI生成</span>
    </div>
    <div ref="playerRef" class="video-player"></div>
  </div>
</template>

<script lang="ts" setup>
import DPlayer from 'dplayer'

interface Props {
  url: string
  poster?: string
  width?: string
  height?: string
  autoplay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  poster: '',
  width: '100%',
  height: 'auto',
  autoplay: false
})

const playerRef = ref<HTMLDivElement>()
let dp: DPlayer | null = null

onMounted(() => {
  if (playerRef.value) {
    dp = new DPlayer({
      container: playerRef.value,
      autoplay: props.autoplay,
      theme: '#722ed1', // 主题色
      loop: false,
      screenshot: false,
      hotkey: true,
      preload: 'metadata',
      volume: 0.7,
      video: {
        url: props.url,
        pic: props.poster
      }
    })
  }
})

onBeforeUnmount(() => {
  dp?.destroy()
})
</script>

<style lang="scss" scoped>
.video-player-wrapper {
  width: v-bind('props.width');
  max-width: 480px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #000;
  position: relative;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

// AI生成标识
.ai-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px) saturate(180%);
  -webkit-backdrop-filter: blur(8px) saturate(180%);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  animation: badgeFadeIn 0.4s ease-out;
  transition: all 0.2s ease;

  @media (max-width: 767px) {
    top: 8px;
    right: 8px;
    padding: 3px 8px;
    gap: 4px;
  }
}

.ai-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b37feb;
  
  svg {
    width: 12px;
    height: 12px;
    filter: drop-shadow(0 0 4px rgba(179, 127, 235, 0.4));

    @media (max-width: 767px) {
      width: 10px;
      height: 10px;
    }
  }
}

.ai-badge-text {
  font-size: 11px;
  font-weight: 500;
  color: #ffffff;
  letter-spacing: 0.3px;
  white-space: nowrap;
  opacity: 0.95;

  @media (max-width: 767px) {
    font-size: 10px;
  }
}

@keyframes badgeFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.video-player {
  width: 100%;
  height: v-bind('props.height');
  aspect-ratio: 16 / 9;

  :deep(.dplayer-video-wrap) {
    background: #000;
  }

  :deep(.dplayer-controller) {
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  :deep(.dplayer-bar-wrap) {
    .dplayer-played {
      background: #722ed1;
    }
    .dplayer-thumb {
      background: #722ed1;
    }
  }

  :deep(.dplayer-volume-bar-inner) {
    background: #722ed1;
  }

  :deep(.dplayer-menu) {
    border-radius: 8px;
    overflow: hidden;
  }
}

// 当鼠标悬停在播放器容器上时显示控制器
.video-player-wrapper:hover {
  .video-player :deep(.dplayer-controller) {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

// 暂停时显示控制器（方便用户操作）
.video-player :deep(.dplayer-paused .dplayer-controller),
// 控制器本身被悬停时保持显示
.video-player :deep(.dplayer-controller:hover) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
</style>
