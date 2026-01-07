<template>
  <div class="login-dialog">
    <!-- 关闭按钮 -->
    <button class="close-btn" @click="onClose">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <!-- 左侧品牌展示区 -->
    <div class="login-dialog__brand">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-text">{{ t('dialog.login.title') }}</div>
          <div class="logo-subtitle">{{ t('dialog.login.subtitle') }}</div>
        </div>
        <div class="brand-tags">
          <div
            v-for="(tag, index) in tm('dialog.login.tags')"
            :key="tag"
            class="tag-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <span class="tag-icon">✨</span>
            <span class="tag-text">{{ rt(tag) }}</span>
          </div>
        </div>
      </div>
      <div class="brand-decoration"></div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="login-dialog__form">
      <div class="form-header">
        <h2 class="form-title">{{ t('dialog.login.form_title') }}</h2>
        <p class="form-subtitle">{{ t('dialog.login.form_subtitle') }}</p>
      </div>
      <a-form ref="formRef" :model="ruleForm" :rules="rules" class="login-form">
        <a-form-item name="account" class="form-item">
          <label class="form-label">{{ t('dialog.login.account') }}</label>
          <a-input
            v-model:value="ruleForm.account"
            :placeholder="t('dialog.login.account_placeholder')"
            allow-clear
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" class="form-item">
          <label class="form-label">{{ t('dialog.login.password') }}</label>
          <a-input-password
            v-model:value="ruleForm.password"
            :placeholder="t('dialog.login.password_placeholder')"
            allow-clear
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item class="form-item">
          <a-button type="primary" size="large" block :loading="loading" @click="onLogin">
            {{ t('dialog.login.login') }}
          </a-button>
        </a-form-item>
        <a-form-item class="form-item">
          <GoogleLogin :callback="onLoginGoogle" prompt auto-login />
        </a-form-item>
      </a-form>
      <div class="form-footer">
        <span class="footer-text">{{ t('dialog.login.no_account') }}</span>
        <button class="footer-link" @click="onSignup">{{ t('dialog.login.signup') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { useUserApi } from '~/api/useUserApi'
import { GoogleLogin } from 'vue3-google-login'

/* Emits */
const emits = defineEmits(['close', 'register'])

/* Hook */
const { t, tm, rt } = useI18n()
const appStore = useAppStore()
const userInfo = useCookie('userInfo')
const inviteCode = useCookie('invite_code')
const gclid = useCookie('gclid')

/* Api */
const userApi = useUserApi()

/* Ref */
const formRef = ref<FormInstance>()

// 表单
const ruleForm = ref({
  account: '',
  password: '',
  remember: false
})

// state
const state = reactive({
  // loading
  loading: false,
  // 校验规则
  rules: {
    account: [
      { required: true, message: t('dialog.login.account_placeholder'), trigger: 'change' }
    ],
    password: [
      { required: true, message: t('dialog.login.password_placeholder'), trigger: 'change' }
    ]
  } as any
})

// toRefs
const { loading, rules } = toRefs(state)

/**
 * 关闭
 */
const onClose = () => {
  emits('close')
}

/**
 * 注册
 */
const onSignup = () => {
  emits('register')
}

/**
 * 登录
 */
const onLogin = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const res: any = await userApi.login(ruleForm.value)
    appStore.setUserInfo(res.data.userinfo)
    userInfo.value = res.data.userinfo
    message.success(res.msg)
    emits('close')
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

/**
 * 登录谷歌
 * @param data
 */
const onLoginGoogle = async (data: any) => {
  if (!data) {
    return
  }
  try {
    loading.value = true
    const response: any = await userApi.googleLogin({
      credential: data.credential,
      inviter_code: inviteCode.value || '',
      bid_identification: gclid.value || ''
    })
    if (response) {
      appStore.setUserInfo({
        token: response.data.userinfo
      })
      userInfo.value = response.data.userinfo
      message.success(response.msg)
      emits('close')
      loading.value = false
    }
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 登录弹框
.login-dialog {
  display: flex;
  width: 100%;
  min-height: 450px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }

  // 关闭按钮
  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba(0, 0, 0, 0.04);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #64748b;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #0f172a;
      transform: rotate(90deg);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  // 左侧品牌区
  .login-dialog__brand {
    flex: 0 0 50%;
    background: linear-gradient(
      135deg,
      rgba(13, 255, 255, 0.08) 0%,
      rgba(0, 81, 239, 0.08) 50%,
      rgba(164, 0, 191, 0.08) 100%
    );
    padding: 40px 35px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
      display: none;
    }

    .brand-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 30%, rgba(13, 255, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(164, 0, 191, 0.15) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }

    .brand-content {
      position: relative;
      z-index: 1;
    }

    .brand-logo {
      margin-bottom: 35px;
      animation: fadeInUp 0.6s ease-out;

      @media (max-width: 768px) {
        margin-bottom: 25px;
      }
    }

    .logo-text {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(138.69deg, #0dffff -2.74%, #0051ef 39.11%, #a400bf 98.64%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      letter-spacing: -0.02em;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }

    .logo-subtitle {
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
      letter-spacing: 0.01em;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }

    .brand-tags {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tag-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(4px);
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .tag-icon {
        font-size: 18px;
        flex-shrink: 0;
      }

      .tag-text {
        font-size: 14px;
        color: #475569;
        line-height: 1.5;
        font-weight: 500;
      }
    }
  }

  // 右侧表单区
  .login-dialog__form {
    flex: 0 0 50%;
    padding: 40px 45px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ffffff;

    @media (max-width: 768px) {
      flex: 1;
      width: 100%;
      padding: 30px 25px;
    }

    .form-header {
      margin-bottom: 30px;
      animation: fadeInUp 0.6s ease-out 0.2s both;

      @media (max-width: 768px) {
        margin-bottom: 25px;
      }
    }

    .form-title {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
      letter-spacing: 0.05em;

      @media (max-width: 768px) {
        font-size: 24px;
      }
    }

    .form-subtitle {
      font-size: 15px;
      color: #64748b;
      margin: 0;
      font-weight: 400;
    }

    .login-form {
      animation: fadeInUp 0.6s ease-out 0.3s both;
    }

    .form-item {
      margin-bottom: 20px;

      :deep(.el-form-item__label) {
        display: none;
      }

      :deep(.el-form-item__content) {
        margin-left: 0 !important;
      }
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      letter-spacing: 0.01em;
    }

    .login-btn {
      width: 100%;
      height: 52px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #0dffff 0%, #0051ef 50%, #a400bf 100%);
      border: none;
      box-shadow:
        0 4px 12px rgba(0, 81, 239, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      margin-top: 8px;

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 6px 16px rgba(0, 81, 239, 0.4),
          0 4px 8px rgba(0, 0, 0, 0.15);
      }

      &:active {
        transform: translateY(0);
      }

      :deep(.el-loading-spinner) {
        .path {
          stroke: #ffffff;
        }
      }
    }

    .form-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      animation: fadeInUp 0.6s ease-out 0.4s both;

      .footer-text {
        margin-right: 8px;
      }

      .footer-link {
        background: none;
        border: none;
        color: #0051ef;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        font-size: 14px;
        transition: all 0.2s ease;
        text-decoration: underline;
        text-underline-offset: 3px;

        &:hover {
          color: #a400bf;
          text-decoration: none;
        }
      }
    }
  }

  // 通用输入框样式（登录和注册共用）
  .custom-input {
    :deep(.ant-input) {
      border-radius: 12px;
      // border: 1.5px solid #e2e8f0;
      background: #ffffff;
      // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      padding: 0 16px;
      color: #0f172a;
      font-size: 15px;
      height: 32px;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &:focus {
        border-color: #0051ef;
        box-shadow:
          0 0 0 3px rgba(0, 81, 239, 0.1),
          0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &::placeholder {
        color: #94a3b8;
      }
    }

    :deep(.ant-input-password) {
      .ant-input {
        border-radius: 12px;
        border: 1.5px solid #e2e8f0;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        padding: 0 16px;
        color: #0f172a;
        font-size: 15px;
        height: 48px;

        &:hover {
          border-color: #cbd5e1;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        &:focus {
          border-color: #0051ef;
          box-shadow:
            0 0 0 3px rgba(0, 81, 239, 0.1),
            0 2px 6px rgba(0, 0, 0, 0.08);
        }

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    :deep(.ant-input-affix-wrapper) {
      border-radius: 12px;
      border: 1.5px solid #e2e8f0;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      padding: 0 16px;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      &.ant-input-affix-wrapper-focused {
        border-color: #0051ef;
        box-shadow:
          0 0 0 3px rgba(0, 81, 239, 0.1),
          0 2px 6px rgba(0, 0, 0, 0.08);
      }

      .ant-input-prefix {
        color: #94a3b8;
        margin-right: 12px;
      }
    }
  }
}

// 动画定义
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
</style>
