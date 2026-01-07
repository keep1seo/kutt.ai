<template>
  <div class="register-dialog">
    <!--关闭按钮-->
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

    <!-- 左侧表单区 -->
    <div class="register-dialog__form">
      <div class="form-header">
        <div class="form-badge">
          <span class="badge-icon">🎁</span>
          <span class="badge-text">{{ t('dialog.register.title') }}</span>
        </div>
        <h2 class="form-title">{{ t('dialog.register.form_title') }}</h2>
        <p class="form-subtitle">{{ t('dialog.register.form_subtitle') }}</p>
      </div>
      <a-form ref="formRef" :model="ruleForm" :rules="rules" class="register-form">
        <a-form-item name="account" class="form-item">
          <label class="form-label">{{ t('dialog.register.account') }}</label>
          <a-input
            v-model:value="ruleForm.account"
            :placeholder="t('dialog.register.account_placeholder')"
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
        <a-form-item name="code" class="form-item">
          <label class="form-label">{{ t('dialog.register.code') }}</label>
          <div class="code-input-wrapper">
            <a-input
              v-model:value="ruleForm.code"
              :placeholder="t('dialog.register.code_placeholder')"
              allow-clear
              size="large"
              class="custom-input code-input"
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
                  <rect x="3" y="2" width="18" height="20" rx="2" ry="2"></rect>
                  <line x1="7" y1="6" x2="17" y2="6"></line>
                  <line x1="7" y1="10" x2="17" y2="10"></line>
                  <line x1="7" y1="14" x2="17" y2="14"></line>
                  <line x1="7" y1="18" x2="17" y2="18"></line>
                </svg>
              </template>
            </a-input>
            <a-button
              class="code-btn"
              :loading="loading"
              :disabled="codeCountdown > 0"
              @click="onSendCode"
            >
              {{ codeCountdown > 0 ? `${codeCountdown}s` : t('dialog.register.send_code') }}
            </a-button>
          </div>
        </a-form-item>
        <a-form-item name="password" class="form-item">
          <label class="form-label">{{ t('dialog.register.password') }}</label>
          <a-input-password
            v-model:value="ruleForm.password"
            :placeholder="t('dialog.register.password_placeholder')"
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
          <a-button type="primary" block size="large" :loading="loading" @click="onRegister">
            {{ t('dialog.register.register') }}
          </a-button>
        </a-form-item>
      </a-form>
      <div class="form-footer">
        <span class="footer-text">{{ t('dialog.register.has_account') }}</span>
        <button class="footer-link" @click="onLogin">{{ t('dialog.register.login') }}</button>
      </div>
    </div>

    <!-- 右侧轮播区 -->
    <div class="register-dialog__carousel">
      <div class="carousel-wrapper">
        <a-carousel
          :autoplay="true"
          :autoplay-speed="4000"
          :dots="false"
          :arrows="true"
          :style="{ height: '450px' }"
        >
          <div v-for="(item, index) in tm('dialog.register.banner')" :key="index">
            <div class="banner-carousel_item">
              <div class="banner-carousel_item-content">
                <div class="quote-icon">"</div>
                <p>{{ rt(item?.content) }}</p>
              </div>
              <div class="banner-carousel_item-avatar">
                <div class="avatar-wrapper">
                  <img :src="rt(item?.avatar)" :alt="rt(item?.name)" loading="lazy" />
                </div>
                <dl>
                  <dt>{{ rt(item?.name) }}</dt>
                  <dd>{{ rt(item?.user) }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </a-carousel>
      </div>
      <div class="carousel-decoration"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserApi } from '~/api/useUserApi'
import type { FormInstance } from 'ant-design-vue'

/* Emits */
const emits = defineEmits(['close', 'login'])

/* Ref */
const formRef = ref<FormInstance>()

/* Api */
const userApi = useUserApi()

/* Hook */
const { t, tm, rt } = useI18n()
const appStore = useAppStore()

// 表单
const ruleForm = ref({
  account: '',
  code: '',
  password: ''
})

// state
const state = reactive({
  // loading
  loading: false,
  // 校验规则
  rules: {
    account: [
      { required: true, message: t('dialog.register.account_placeholder'), trigger: 'change' }
    ],
    code: [{ required: true, message: t('dialog.register.code_placeholder'), trigger: 'change' }],
    password: [
      { required: true, message: t('dialog.register.password_placeholder'), trigger: 'change' }
    ]
  } as any,
  // 验证码倒计时
  codeCountdown: 0
})

// toRefs
const { loading, rules, codeCountdown } = toRefs(state)

/**
 * 注册
 */
const onRegister = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const res: any = await userApi.register({
      account: ruleForm.value.account,
      code: ruleForm.value.code,
      password: ruleForm.value.password,
      bid_identification: '',
      iviter_code: ''
    })
    appStore.setUserInfo(res.data.userinfo)
    message.success(res.msg)
    emits('close')
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

/**
 * 发送验证码
 */
const onSendCode = async () => {
  if (!ruleForm.value.account) {
    message.warning(t('dialog.register.account_placeholder'))
    return
  }
  try {
    loading.value = true
    await userApi.sendCode({
      email: ruleForm.value.account,
      event: 'register'
    })
    codeCountdown.value = 60
    const timer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    message.success(t('dialog.register.send_code_success'))
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

/**
 * 关闭
 */
const onClose = () => {
  emits('close')
}

/**
 * 登录
 */
const onLogin = () => {
  emits('login')
}
</script>

<style lang="scss" scoped>
// 注册弹框
.register-dialog {
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

  // 左侧表单区
  .register-dialog__form {
    flex: 0 0 50%;
    padding: 35px 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #ffffff;
    position: relative;
    z-index: 1;

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

    .form-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: linear-gradient(
        135deg,
        rgba(13, 255, 255, 0.1) 0%,
        rgba(0, 81, 239, 0.1) 50%,
        rgba(164, 0, 191, 0.1) 100%
      );
      border-radius: 20px;
      border: 1px solid rgba(0, 81, 239, 0.2);
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 600;
      color: #0051ef;

      .badge-icon {
        font-size: 18px;
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
      line-height: 1.6;
    }

    .register-form {
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

    .code-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      width: 100%;

      .code-input {
        flex: 1;
      }

      .code-btn {
        flex-shrink: 0;
        height: 48px;
        padding: 0 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        background: #ffffff;
        border: 1.5px solid #e2e8f0;
        color: #0051ef;
        transition: all 0.3s ease;
        white-space: nowrap;

        &:hover:not(:disabled) {
          border-color: #0051ef;
          background: rgba(0, 81, 239, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 81, 239, 0.2);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .register-btn {
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
      margin-top: 32px;
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

  // 右侧轮播区
  .register-dialog__carousel {
    flex: 0 0 50%;
    background: linear-gradient(
      135deg,
      rgba(13, 255, 255, 0.08) 0%,
      rgba(0, 81, 239, 0.08) 50%,
      rgba(164, 0, 191, 0.08) 100%
    );
    padding: 35px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;

    @media (max-width: 768px) {
      display: none;
    }

    .carousel-decoration {
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

    .carousel-wrapper {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: visible;
    }

    :deep(.ant-carousel) {
      width: 100%;
      height: 100%;

      .slick-slide {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      .slick-arrow {
        z-index: 10;
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        color: #0051ef;
        opacity: 0.9;
        display: flex !important;
        align-items: center;
        justify-content: center;

        &:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 4px 12px rgba(0, 81, 239, 0.3);
          transform: scale(1.1);
        }

        &::before {
          font-size: 18px;
          color: #0051ef;
          display: block;
        }

        &.slick-prev {
          left: -15px;
        }

        &.slick-next {
          right: -15px;
        }

        &.slick-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
    }
  }

  .banner-carousel_item {
    width: 100%;
    padding: 30px 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    animation: fadeInUp 0.8s ease-out;

    &-content {
      position: relative;
      padding: 24px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      border: 1px solid rgba(0, 0, 0, 0.06);
      backdrop-filter: blur(10px);
      box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.04);
      margin-bottom: 24px;
      max-width: 100%;

      .quote-icon {
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 60px;
        font-weight: 700;
        color: rgba(0, 81, 239, 0.15);
        line-height: 1;
        font-family: Georgia, serif;
      }

      p {
        font-size: 16px;
        line-height: 1.8;
        color: #475569;
        margin: 0;
        padding-top: 20px;
        position: relative;
        z-index: 1;
        font-style: italic;

        @media (max-width: 768px) {
          font-size: 14px;
        }
      }
    }

    &-avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .avatar-wrapper {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      dl {
        margin: 0;
        text-align: center;

        dt {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 4px;
        }

        dd {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          font-weight: 400;
        }
      }
    }
  }
}

// 动画
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
