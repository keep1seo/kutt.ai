<template>
  <a-modal
    v-model:open="visible"
    :title="t('app.passwordModal.change_pass')"
    :width="520"
    :footer="null"
    class="password-modal"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="vertical" class="password-form">
      <a-form-item :label="t('app.passwordModal.old_pass')" name="oldpassword">
        <a-input-password
          v-model:value="form.oldpassword"
          :placeholder="t('app.passwordModal.please_input_old_pass')"
          :maxlength="20"
          size="large"
          class="password-input"
        />
      </a-form-item>
      <a-form-item :label="t('app.passwordModal.new_pass')" name="password">
        <a-input-password
          v-model:value="form.password"
          :placeholder="t('app.passwordModal.please_input_new_pass')"
          :maxlength="20"
          size="large"
          class="password-input"
        />
      </a-form-item>
      <a-form-item :label="t('app.passwordModal.confirm_pass')" name="password2">
        <a-input-password
          v-model:value="form.password2"
          :placeholder="t('app.passwordModal.once_again_input_new_pass')"
          :maxlength="20"
          size="large"
          class="password-input"
        />
      </a-form-item>
      <a-form-item class="form-actions">
        <a-button type="default" class="cancel-btn" @click="handleCancel">
          {{ t('app.passwordModal.cancel') }}
        </a-button>
        <a-button type="primary" class="submit-btn" :loading="loading" @click="handleOk">
          {{ t('app.passwordModal.save') }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useUserApi } from '~/api/useUserApi'

const { t } = useI18n()
const userApi = useUserApi()

/** 弹窗是否打开 */
const visible = defineModel({ type: Boolean, default: false })

/** 提交loading */
const loading = ref(false)

/** 表单实例 */
const formRef = ref(null)

/** 表单数据 */
const form = reactive({
  oldpassword: '',
  password: '',
  password2: ''
})

/** 表单验证规则 */
const rules = reactive({
  oldpassword: [
    {
      required: true,
      message: t('app.passwordModal.please_input_old_pass'),
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: t('app.passwordModal.please_input_new_pass'),
      trigger: 'blur'
    },
    {
      pattern: /^[\S]{5,18}$/,
      message: t('app.passwordModal.pass_require_5_8_not_nul'),
      trigger: 'blur'
    }
  ],
  password2: [
    {
      required: true,
      message: t('app.passwordModal.once_again_input_new_pass'),
      trigger: 'blur'
    },
    {
      validator: (_rule, value) => {
        if (value && value !== form.password) {
          return Promise.reject(new Error(t('app.passwordModal.input_pass_inconsistent')))
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ]
})

/** 关闭弹窗 */
const handleCancel = () => {
  visible.value = false
  resetForm()
}

/** 重置表单 */
const resetForm = () => {
  form.oldpassword = ''
  form.password = ''
  form.password2 = ''
  formRef.value?.clearValidate()
  loading.value = false
}

/** 保存修改 */
const handleOk = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    const res = await userApi.updatePassword({
      oldpassword: form.oldpassword,
      password: form.password
    })
    loading.value = false
    if (res) {
      message.success(res?.msg || t('app.passwordModal.change_pass_success') || '修改密码成功')
      handleCancel()
    }
  } catch (error) {
    loading.value = false
    if (error?.errorFields) {
      // 表单验证错误
      return
    }
    message.error(error?.message || t('app.passwordModal.change_pass_failed') || '修改密码失败')
  }
}

watch(visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>

<style lang="scss" scoped>
:deep(.password-modal) {
  .ant-modal-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    padding: 20px 24px;
    border-radius: 8px 8px 0 0;

    .ant-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #667eea;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .ant-modal-body {
    padding: 40px 24px 24px;
    background: #ffffff;
  }

  .ant-modal-close {
    color: #667eea;
    transition: all 0.3s ease;

    &:hover {
      color: #764ba2;
      transform: rotate(90deg);
    }
  }
}

.password-form {
  margin-top: 24px;
  
  :deep(.ant-form-item) {
    margin-bottom: 24px;

    .ant-form-item-label {
      padding-bottom: 8px;
      
      > label {
        font-weight: 500;
        color: #333333;
        font-size: 14px;
        height: auto;
      }
    }
  }

  .password-input {
    border-radius: 8px;
    border: 1.5px solid #e0e0e6;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 14px;

    &:hover {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.08);
    }

    &:focus,
    &.ant-input-focused {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }

    &::placeholder {
      color: #999999;
    }
  }

  .form-actions {
    margin-top: 32px;
    margin-bottom: 0;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;

    :deep(.ant-form-item-control-input-content) {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }

  .cancel-btn {
    min-width: 100px;
    height: 40px;
    border-radius: 8px;
    border: 1.5px solid #e0e0e6;
    color: #666666;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #ffffff;

    &:hover {
      border-color: #667eea;
      color: #667eea;
      background: rgba(102, 126, 234, 0.05);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .submit-btn {
    min-width: 100px;
    height: 40px;
    border-radius: 8px;
    border: none;
    font-weight: 500;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #7c8ef5 0%, #8a5fb8 100%);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }
  }
}

// 表单验证错误样式
:deep(.ant-form-item-has-error) {
  .password-input {
    border-color: #ff4d4f;

    &:hover {
      border-color: #ff4d4f;
    }

    &:focus,
    &.ant-input-focused {
      border-color: #ff4d4f;
      box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.15);
    }
  }
}

// 动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.password-form {
  animation: fadeIn 0.3s ease-out;
}
</style>

