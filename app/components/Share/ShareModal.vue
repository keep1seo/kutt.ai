<template>
  <a-modal
    v-model:open="visible"
    :title="null"
    :width="580"
    :footer="null"
    :z-index="999"
    class="share-modal"
    @cancel="handleCancel"
  >
    <div class="share-modal-body">
      <div class="how-it-works-header">
        <a-button type="link" @click="showHowItWorks = true" class="how-it-works-btn">
          {{ t('pages.share.how_do_work') }}
        </a-button>
      </div>
      <div class="gift-icon-wrapper">
        <div class="gift-icon">
          <GiftOutlined class="gift-icon-svg" />
        </div>
        <div class="gift-shine"></div>
      </div>

      <div class="rewards-list">
        <div class="reward-card">
          <div class="reward-header">
            <div class="reward-icon-wrapper">
              <CheckCircleOutlined class="reward-icon" />
            </div>
            <div class="reward-info">
              <div class="reward-title">{{ t('pages.share.eveyone_sign_in_send_points') }}</div>
              <div class="reward-points">+5 {{ t('pages.share.score') }}</div>
            </div>
          </div>
          <a-button type="primary" size="small" class="reward-action-btn" :loading="signInLoading" @click="handleSignIn">
            {{ t('pages.share.sign_in') }}
          </a-button>
        </div>

        <div class="reward-card">
          <div class="reward-header">
            <div class="reward-icon-wrapper">
              <CheckCircleOutlined class="reward-icon" />
            </div>
            <div class="reward-info">
              <div class="reward-title">{{ t('pages.share.on_social_share') }}</div>
              <div class="reward-points">+10 {{ t('pages.share.score') }}</div>
            </div>
          </div>
        </div>

        <div class="reward-card">
          <div class="reward-header">
            <div class="reward-icon-wrapper">
              <CheckCircleOutlined class="reward-icon" />
            </div>
            <div class="reward-info">
              <div class="reward-title">{{ t('pages.share.invite_friend_register') }}</div>
              <div class="reward-points">+10 {{ t('pages.share.score') }}</div>
              <div class="reward-desc">{{ t('pages.share.text_image_video_generation') }}</div>
            </div>
          </div>
        </div>

        <div class="reward-card">
          <div class="reward-header">
            <div class="reward-icon-wrapper">
              <CheckCircleOutlined class="reward-icon" />
            </div>
            <div class="reward-info">
              <div class="reward-title">{{ t('pages.share.invite_friend_subscription') }}</div>
              <div class="reward-points">{{ t('pages.share.earn_30_commission') }}</div>
            </div>
          </div>
          <a-button type="link" size="small" class="reward-link-btn" @click="handleInviteNow">
            {{ t('pages.share.invite_now') }}
          </a-button>
        </div>
      </div>

      <div class="invite-section">
        <template v-if="isLoggedIn">
          <div class="invite-input-wrapper">
            <a-input v-model:value="inviteLink" disabled class="invite-input">
              <template #addonAfter>
                <a-button type="primary" class="copy-btn" @click="handleCopyLink">
                  {{ t('pages.share.copy') }}
                </a-button>
              </template>
            </a-input>
          </div>
        </template>
        <template v-else>
          <a-button type="primary" block size="large" class="register-btn" @click="handleRegister">
            {{ t('pages.share.register_get_free_score') }}
          </a-button>
        </template>
      </div>

      <div class="social-share-section">
        <div class="social-share-label">{{ t('pages.share.on_social_share') }}</div>
        <div class="share-social-icons">
          <a
            :href="shareLinks.twitter"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon twitter"
            @click="handleSocialShare('twitter')"
          >
            <svg
              class="social-icon-svg"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
              />
            </svg>
          </a>
          <a
            :href="shareLinks.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon facebook"
            @click="handleSocialShare('facebook')"
          >
            <svg
              class="social-icon-svg"
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
              />
            </svg>
          </a>
          <a
            :href="shareLinks.linkedIn"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon linkedin"
            @click="handleSocialShare('linkedIn')"
          >
            <svg
              class="social-icon-svg"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
              />
            </svg>
          </a>
          <a
            :href="shareLinks.whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            class="social-icon whatsapp"
            @click="handleSocialShare('whatsapp')"
          >
            <svg
              class="social-icon-svg"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="share-modal-footer">
        <a-button type="link" @click="handleViewRewards">
          {{ t('pages.share.view_more_rewards') }}
        </a-button>
        <a-button type="link" @click="handleCheckRewards">
          {{ t('pages.share.check_more_rewards') }}
        </a-button>
      </div>
    </template>
  </a-modal>

  <!-- 如何工作弹框 -->
  <a-modal
    v-model:open="showHowItWorks"
    :title="t('pages.share.faq_h_t_o')"
    :width="580"
    :footer="null"
    :z-index="1000"
  >
    <div class="faq-content">
      <div class="faq-item">
        <div class="faq-question">
          <strong>{{ t('pages.share.can_get_rewards_q') }}</strong>
        </div>
        <div class="faq-answer">
          {{ t('pages.share.can_get_rewards_a') }}
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-question">
          <strong>{{ t('pages.share.can_get_rewards_q1') }}</strong>
        </div>
        <div class="faq-answer">
          {{ t('pages.share.can_get_rewards_a1') }}
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-question">
          <strong>{{ t('pages.share.can_get_rewards_q2') }}</strong>
        </div>
        <div class="faq-answer">
          {{ t('pages.share.can_get_rewards_a2') }}
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-question">
          <strong>{{ t('pages.share.can_get_rewards_q3') }}</strong>
        </div>
        <div class="faq-answer">
          {{ t('pages.share.can_get_rewards_a3') }}
        </div>
      </div>
      <div class="faq-item">
        <div class="faq-question">
          <strong>{{ t('pages.share.can_get_rewards_q4') }}</strong>
        </div>
        <div class="faq-answer">
          {{ t('pages.share.can_get_rewards_a4') }}
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { GiftOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { useCookie } from '#app'
import { useUserApi } from '~/api/useUserApi'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const localePath = useLocalePath()
const userInfo = useCookie('userInfo')
const userApi = useUserApi()
const appStore = useAppStore()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const showHowItWorks = ref(false)
const inviteLink = ref('')
const shareLinks = ref({
  twitter: '',
  facebook: '',
  linkedIn: '',
  whatsapp: ''
})
const signInLoading = ref(false)

const isLoggedIn = computed(() => !!userInfo.value?.token)

/** 生成分享链接 */
const generateShareLinks = () => {
  if (!inviteLink.value || !import.meta.client) return

  const baseUrl = inviteLink.value
  const text = props.description || ''
  const title = props.title || ''

  shareLinks.value = {
    twitter: `https://twitter.com/share?url=${encodeURIComponent(baseUrl)}${text ? '&text=' + encodeURIComponent(text) : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseUrl)}`,
    linkedIn: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(baseUrl)}${text ? '&summary=' + encodeURIComponent(text) : ''}${title ? '&title=' + encodeURIComponent(title) : ''}`,
    whatsapp: `https://web.whatsapp.com/send?url=${encodeURIComponent(baseUrl)}${text ? '&text=' + encodeURIComponent(text + ' ') : ''}`
  }
}

/** 生成邀请链接 */
const generateInviteLink = async () => {
  if (import.meta.client && isLoggedIn.value) {
    try {
      const res = await userApi.getInviteCodeAndDesc({})
      if (res && res.data) {
        const inviteCode = res.data.code || ''
        const inviteDesc = res.data.desc || ''
        if (inviteCode) {
          const url = window.location.href.split('?')[0]
          inviteLink.value = url + '?inviteCode=' + inviteCode
          generateShareLinks()
        }
      }
    } catch (error) {
      console.error('获取邀请码失败:', error)
      // 如果 API 失败，尝试从 userInfo 中获取
      const inviteCode = userInfo.value?.inviteCode || ''
      if (inviteCode) {
        const url = window.location.href.split('?')[0]
        inviteLink.value = url + '?inviteCode=' + inviteCode
        generateShareLinks()
      }
    }
  }
}

/** 复制邀请链接 */
const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(inviteLink.value)
    message.success(t('pages.share.copy_success') || '复制成功')
  } catch (err) {
    message.error(t('pages.share.copy_error') || '复制失败')
  }
}

/** 签到 */
const handleSignIn = async () => {
  if (signInLoading.value) return
  
  signInLoading.value = true
  try {
    const res = await userApi.signInGiftScore()
    if (res) {
      message.success(t('pages.share.sign_in_success') || '签到成功')
      // 更新用户信息
      const userInfoRes = await userApi.getUserInfo()
      if (userInfoRes && userInfoRes.data) {
        userInfo.value = userInfoRes.data
        appStore.setUserInfo(userInfoRes.data)
      }
    }
  } catch (error) {
    const errorMessage = error?.message || t('pages.share.sign_in_failed') || '签到失败'
    message.error(errorMessage)
  } finally {
    signInLoading.value = false
  }
}

/** 立即邀请 */
const handleInviteNow = () => {
  navigateTo(localePath('/user?active=invite-reward-log'))
  visible.value = false
}

/** 注册 */
const handleRegister = () => {
  if (import.meta.client) {
    const appStore = useAppStore()
    appStore.setLoginVisible(true)
  }
  visible.value = false
}

/** 社交媒体分享 */
const handleSocialShare = (type) => {
  // TODO: 可以在这里添加截图提交逻辑
  console.log('分享到:', type)
}

/** 查看更多奖励 */
const handleViewRewards = () => {
  navigateTo(localePath('/user?active=invite-reward-log'))
  visible.value = false
}

/** 查看更多奖励 */
const handleCheckRewards = () => {
  navigateTo(localePath('/user?active=screenshot-log'))
  visible.value = false
}

/** 关闭弹框 */
const handleCancel = () => {
  visible.value = false
}

watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      generateInviteLink()
    }
  }
)

watch(
  () => isLoggedIn.value,
  () => {
    if (visible.value) {
      generateInviteLink()
    }
  }
)

onMounted(() => {
  if (visible.value) {
    generateInviteLink()
  }
})
</script>

<style lang="scss" scoped>
.share-modal {
  :deep(.ant-modal-header) {
    border-bottom: none;
    padding: 24px 24px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px 8px 0 0;
    margin: -24px -24px 0;

    .ant-modal-title {
      color: #ffffff;
      font-weight: 600;
    }
  }

  .how-it-works-btn {
    padding: 0;
    height: auto;
    color: #667eea;
    font-weight: 500;
    font-size: 14px;

    &:hover {
      color: #764ba2;
    }
  }

  :deep(.ant-modal-close) {
    color: #ffffff;
    top: 24px;
    right: 24px;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  :deep(.ant-modal-body) {
    padding: 32px 24px 24px;
    background: linear-gradient(to bottom, #f8f9ff, #ffffff);
  }

  :deep(.ant-modal-footer) {
    border-top: 1px solid #f0f0f0;
    padding: 16px 24px;
    background: #fafafa;
  }
}

.share-modal-body {
  .how-it-works-header {
    text-align: left;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  .gift-icon-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    height: 120px;

    .gift-icon {
      position: relative;
      z-index: 2;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
      border-radius: 50%;
      box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
      animation: float 3s ease-in-out infinite;

      .gift-icon-svg {
        font-size: 56px;
        color: #ffffff;
      }
    }

    .gift-shine {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 107, 107, 0.2) 0%, transparent 70%);
      animation: pulse 2s ease-in-out infinite;
    }
  }

  .rewards-list {
    margin-bottom: 24px;

    .reward-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 12px;
      background: #ffffff;
      border: 1px solid #e8e8f0;
      border-radius: 12px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: #667eea;
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
      }

      .reward-header {
        display: flex;
        align-items: center;
        flex: 1;
        gap: 12px;

        .reward-icon-wrapper {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #01ceb2 0%, #00d4aa 100%);
          border-radius: 10px;
          flex-shrink: 0;

          .reward-icon {
            font-size: 20px;
            color: #ffffff;
          }
        }

        .reward-info {
          flex: 1;
          min-width: 0;

          .reward-title {
            font-size: 14px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 4px;
            line-height: 1.4;
          }

          .reward-points {
            font-size: 13px;
            color: #667eea;
            font-weight: 600;
          }

          .reward-desc {
            font-size: 12px;
            color: #8c8c8c;
            margin-top: 2px;
          }
        }
      }

      .reward-action-btn {
        height: 32px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
      }

      .reward-link-btn {
        padding: 0 8px;
        height: 32px;
        color: #667eea;
        font-weight: 500;

        &:hover {
          color: #764ba2;
        }
      }
    }
  }

  .invite-section {
    margin-bottom: 24px;

    .invite-input-wrapper {
      :deep(.ant-input-group-wrapper) {
        .ant-input-group {
          .ant-input {
            border-radius: 8px 0 0 8px;
            border-color: #d9d9d9;
            height: 44px;

            &:focus,
            &:hover {
              border-color: #667eea;
            }
          }

          .ant-input-group-addon {
            padding: 0;
            border: none;
            background: transparent;

            .copy-btn {
              height: 44px;
              border-radius: 0 8px 8px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              font-weight: 500;
              padding: 0 24px;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

              &:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
            }
          }
        }
      }
    }

    .register-btn {
      height: 48px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
  }

  .social-share-section {
    .social-share-label {
      text-align: center;
      font-size: 13px;
      color: #8c8c8c;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .share-social-icons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;

      .social-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover::before {
          opacity: 1;
        }

        .social-icon-svg {
          width: 24px;
          height: 24px;
          fill: #8c8c8c;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        &.twitter {
          background: #f5f5f5;

          &:hover {
            background: #1da1f2;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 16px rgba(29, 161, 242, 0.3);

            .social-icon-svg {
              fill: #ffffff;
            }
          }
        }

        &.facebook {
          background: #f5f5f5;

          &:hover {
            background: #1877f2;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 16px rgba(24, 119, 242, 0.3);

            .social-icon-svg {
              fill: #ffffff;
            }
          }
        }

        &.linkedin {
          background: #f5f5f5;

          &:hover {
            background: #0077b5;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 16px rgba(0, 119, 181, 0.3);

            .social-icon-svg {
              fill: #ffffff;
            }
          }
        }

        &.whatsapp {
          background: #f5f5f5;

          &:hover {
            background: #25d366;
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 8px 16px rgba(37, 211, 102, 0.3);

            .social-icon-svg {
              fill: #ffffff;
            }
          }
        }
      }
    }
  }
}

.share-modal-footer {
  display: flex;
  justify-content: center;
  gap: 24px;

  :deep(.ant-btn-link) {
    color: #667eea;
    font-weight: 500;
    padding: 0 12px;

    &:hover {
      color: #764ba2;
    }
  }
}

.faq-content {
  .faq-item {
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .faq-question {
      margin-bottom: 12px;
      font-size: 15px;
      color: #262626;
      font-weight: 600;
      line-height: 1.5;
    }

    .faq-answer {
      font-size: 14px;
      color: #595959;
      line-height: 1.7;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@media screen and (max-width: 768px) {
  .share-modal {
    :deep(.ant-modal-body) {
      padding: 24px 16px 20px;
    }

    :deep(.ant-modal-header) {
      padding: 20px 16px 0;
      margin: -24px -24px 0 -24px;
    }
  }

  .share-modal-body {
    .gift-icon-wrapper {
      height: 100px;
      margin-bottom: 24px;

      .gift-icon {
        width: 80px;
        height: 80px;

        .gift-icon-svg {
          font-size: 48px;
        }
      }
    }

    .rewards-list {
      .reward-card {
        padding: 12px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .reward-header {
          width: 100%;
        }

        .reward-action-btn,
        .reward-link-btn {
          align-self: flex-end;
        }
      }
    }

    .invite-section {
      .register-btn {
        height: 44px;
        font-size: 14px;
      }
    }

    .social-share-section {
      .share-social-icons {
        gap: 12px;

        .social-icon {
          width: 44px;
          height: 44px;

          .social-icon-svg {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
  }
}
</style>

