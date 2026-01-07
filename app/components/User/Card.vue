<template>
  <a-card class="user-card" :bordered="false">
    <div class="info-user">
      <div class="info-user-avatar">
        <a-avatar :size="110" :src="data.avatar" class="avatar-wrapper">
          <template v-if="!data.avatar">
            <UserOutlined style="font-size: 48px" />
          </template>
        </a-avatar>
        <div class="info-user-avatar-icon">
          <CameraOutlined />
        </div>
      </div>
      <div class="info-user-name">{{ data.nickname || '未设置昵称' }}</div>
      <div class="info-user-bio">{{ data.bio || '这个人很懒，什么都没有留下' }}</div>
    </div>
    <div class="stats-section">
      <div class="stats-list">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <GiftOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value stat-value-number">{{ formatNumber(data.score || 0) }}</div>
            <div class="stat-label">{{ $t('pages.user.credit') }}</div>
          </div>
        </div>
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <DollarOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value stat-value-number">{{ formatNumber(data.money || 0) }}</div>
            <div class="stat-label">{{ $t('pages.user.balance') }}</div>
          </div>
        </div>
        <div class="stat-card stat-card-purple">
          <div class="stat-icon">
            <ClockCircleOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-value stat-value-long">{{ data.score_expire_time || 'None' }}</div>
            <div class="stat-label">{{ $t('pages.user.pointExpirationTime') }}</div>
          </div>
        </div>
      </div>
    </div>
    <a-divider class="divide" />
    <div class="action-section">
      <a-button
        type="primary"
        danger
        block
        :icon="h(DeleteOutlined)"
        @click="onDeleteUser"
        class="delete-btn"
      >
        {{ $t('pages.user.delete_user') }}
      </a-button>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { message, Modal } from 'ant-design-vue'
import { useUserApi } from '~/api/useUserApi.js'
import {
  GiftOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  DeleteOutlined,
  UserOutlined
} from '@ant-design/icons-vue'

/* Api */
const userApi = useUserApi()

/* Hook */
const data = useCookie('userInfo')
const appStore = useAppStore()
const localePath = useLocalePath()
const { t } = useI18n()

/**
 * 格式化数字
 * @param num
 */
const formatNumber = (num) => {
  if (typeof num !== 'number' && typeof num !== 'string') return '0'
  const number = typeof num === 'string' ? parseFloat(num) : num
  if (isNaN(number)) return '0'

  // 直接使用千分位分隔符显示原始数字
  return number.toLocaleString('zh-CN')
}

/**
 * 删除账号
 */
const onDeleteUser = () => {
  Modal.confirm({
    title: t('pages.user.warning'),
    content: t('pages.user.delete_user_confirm_text') || t('pages.user.delete_user_text'),
    okText: t('pages.user.confirm'),
    cancelText: t('pages.user.cancel'),
    okType: 'danger',
    onOk() {
      userApi
        .destoryUser()
        .then(() => {
          userApi.logout()
          appStore.setUserInfo({})
          message.success(t('pages.user.delete_user_success'))
          navigateTo(localePath('/'))
        })
        .catch((error) => {
          console.error('删除账号失败:', error)
          message.error(error?.msg || t('pages.user.delete_user_failed') || '删除账号失败')
        })
    }
  })
}
</script>

<style lang="scss" scoped>
.user-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8e8e8;

  :deep(.ant-card-body) {
    padding: 40px 32px;
  }
}

.info-user {
  text-align: center;
  padding-bottom: 32px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 32px;

  .info-user-avatar {
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-bottom: 24px;

    .avatar-wrapper {
      border: 3px solid #ffffff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &::before {
        content: '';
        position: absolute;
        inset: -3px;
        border-radius: 50%;
        padding: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }

    .info-user-avatar-icon {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
      transition: all 0.3s ease;
      z-index: 2;
    }

    &:hover {
      .avatar-wrapper {
        transform: scale(1.02);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);

        &::before {
          opacity: 1;
        }
      }

      .info-user-avatar-icon {
        background: linear-gradient(135deg, #7c8ef5 0%, #8a5fb8 100%);
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
      }
    }
  }

  .info-user-name {
    font-size: 20px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .info-user-bio {
    font-size: 14px;
    color: #8c8c8c;
    line-height: 1.6;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.stats-section {
  margin-bottom: 24px;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 72px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #1890ff;
    transform: scaleY(0);
    transition: transform 0.25s ease;
  }

  &:hover {
    border-color: #d9d9d9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);

    &::before {
      transform: scaleY(1);
    }

    .stat-icon {
      transform: scale(1.1);
    }
  }

  &.stat-card-blue::before {
    background: #1890ff;
  }

  &.stat-card-orange::before {
    background: #fa8c16;
  }

  &.stat-card-purple::before {
    background: #722ed1;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-right: 14px;
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }

  &.stat-card-blue .stat-icon {
    background: #e6f7ff;
    color: #1890ff;
  }

  &.stat-card-orange .stat-icon {
    background: #fff7e6;
    color: #fa8c16;
  }

  &.stat-card-purple .stat-icon {
    background: #f9f0ff;
    color: #722ed1;
  }

  .stat-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: visible;
    padding-right: 8px;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: 6px;
      color: #262626;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      word-break: break-word;
      word-wrap: break-word;
      letter-spacing: -0.01em;

      // 对于数字，允许换行但保持紧凑
      &.stat-value-number {
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
      }

      &.stat-value-long {
        font-size: 15px;
        line-height: 1.5;
        word-break: break-word;
      }
    }

    .stat-label {
      font-size: 13px;
      color: #8c8c8c;
      line-height: 1.4;
      margin-top: 2px;
    }
  }
}

.action-section {
  .delete-btn {
    height: 42px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.25s ease;
    border: 1px solid transparent;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 77, 79, 0.3);
    }
  }
}

.delete-modal-content {
  text-align: center;
  padding: 24px 0 8px;
}

@media screen and (max-width: 768px) {
  .user-card {
    :deep(.ant-card-body) {
      padding: 32px 24px;
    }
  }

  .info-user {
    padding-bottom: 24px;
    margin-bottom: 24px;

    .info-user-avatar {
      margin-bottom: 20px;

      .avatar-wrapper {
        width: 100px !important;
        height: 100px !important;
      }
    }

    .info-user-name {
      font-size: 18px;
    }
  }

  .stat-card {
    padding: 16px 18px;
    min-height: 68px;

    .stat-icon {
      width: 40px;
      height: 40px;
      font-size: 18px;
      margin-right: 10px;
    }

    .stat-content {
      .stat-value {
        font-size: 20px;

        &.stat-value-number {
          white-space: normal;
        }

        &.stat-value-long {
          font-size: 14px;
        }
      }

      .stat-label {
        font-size: 12px;
      }
    }
  }
}

.divide {
  margin: 24px 0;
}
</style>
