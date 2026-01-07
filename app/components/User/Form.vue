<template>
  <div class="user-form-container">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      class="user-form"
    >
      <a-form-item :label="$t('pages.user.nickname')" name="nickname">
        <a-input
          v-model:value="form.nickname"
          :placeholder="$t('pages.user.please_enter_nickname')"
          :maxlength="20"
          show-count
          size="large"
          class="form-input"
        />
      </a-form-item>
      <a-form-item :label="$t('pages.user.gender')" name="gender">
        <a-select
          v-model:value="form.gender"
          :placeholder="$t('pages.user.please_select_gender')"
          size="large"
          class="form-select"
        >
          <a-select-option value="1">{{ $t('pages.user.man') }}</a-select-option>
          <a-select-option value="2">{{ $t('pages.user.woman') }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('pages.user.email')" name="email">
        <a-input
          v-model:value="form.email"
          :placeholder="$t('pages.user.please_enter_email')"
          :maxlength="100"
          size="large"
          class="form-input"
        />
      </a-form-item>
      <a-form-item :label="$t('pages.user.personal_profile')">
        <a-textarea
          v-model:value="form.bio"
          :placeholder="$t('pages.user.please_enter_personal_profile')"
          :rows="4"
          :maxlength="200"
          show-count
          class="form-textarea"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ offset: 5, span: 19 }" class="submit-form-item">
        <a-button type="primary" :loading="loading" @click="save" size="large" class="submit-btn">
          <template v-if="!loading">
            <span class="btn-content">
              <CheckOutlined class="btn-icon" />
              <span class="btn-text">{{ $t('pages.user.save_changes') }}</span>
            </span>
          </template>
          <template v-else>
            <span class="btn-content">
              <span class="btn-text">{{ $t('pages.user.saving') }}...</span>
            </span>
          </template>
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { useUserApi } from '~/api/useUserApi.js'

/* Emit */
const emit = defineEmits(['done'])

/* Props */
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const { getUserInfo, setProfile } = useUserApi()
const { t } = useI18n()

const form = ref({
  nickname: '',
  gender: '0',
  email: '',
  bio: ''
})

/** 登录用户信息 */
const fetchUser = () => {
  getUserInfo().then((res) => {
    // res 可能是 { code: 1, data: {...}, msg: '' } 格式，需要提取 data
    const userData = res?.data || res
    form.value = { ...form.value, ...userData }
  })
}
fetchUser()

// 监听 props.data 变化，更新表单
watch(
  () => props.data,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      form.value = { ...form.value, ...newData }
    }
  },
  { immediate: true, deep: true }
)

/** 提交状态 */
const loading = ref(false)

/** 表单实例 */
const formRef = ref(null)

/** 表单验证规则 */
const rules = reactive({
  nickname: [
    {
      required: true,
      message: t('pages.user.please_enter_nickname'),
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: t('pages.user.please_select_gender'),
      trigger: 'change'
    }
  ],
  email: [
    {
      required: true,
      message: t('pages.user.please_enter_email'),
      trigger: 'blur'
    }
  ]
})

/** 保存更改 */
const save = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    const data = await setProfile(form.value)
    loading.value = false
    message.success(t('pages.user.save_success'))
    emit('done', data)
  } catch (error) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.user-form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 40px 20px;
  width: 100%;
}

.user-form {
  width: 100%;
  max-width: 720px;
}

.user-form {
  :deep(.ant-form-item-label) {
    label {
      font-weight: 500;
      color: #262626;
      font-size: 14px;
      line-height: 1.5715;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 28px;
  }

  .form-input,
  .form-select {
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-color: #e0e0e6;

    &:hover {
      border-color: #667eea;
    }

    &:focus,
    &.ant-input-focused,
    &.ant-select-focused {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .form-textarea {
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border-color: #e0e0e6;

    &:hover {
      border-color: #667eea;
    }

    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .submit-btn {
    height: 48px;
    padding: 0 48px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.3px;
    border: none;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
      background: linear-gradient(135deg, #7c8ef5 0%, #8a5fb8 100%);

      &::before {
        left: 100%;
      }
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }

    &:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
    }

    .btn-content {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-icon {
      font-size: 16px;
      transition: transform 0.3s ease;
    }

    &:hover:not(:disabled) .btn-icon {
      transform: scale(1.1);
    }

    .btn-text {
      position: relative;
    }
  }

  :deep(.ant-input-count) {
    color: #bfbfbf;
    font-size: 12px;
  }

  :deep(.ant-form-item-explain-error) {
    font-size: 13px;
    margin-top: 4px;
  }
}

@media screen and (max-width: 768px) {
  .user-form-container {
    padding: 20px 16px;
  }

  .user-form {
    :deep(.ant-form-item-label) {
      label {
        font-size: 14px;
      }
    }

    :deep(.ant-form-item) {
      margin-bottom: 24px;
    }

    // 移动端按钮容器居中
    .submit-form-item {
      :deep(.ant-form-item-control) {
        margin-left: 0 !important;
        text-align: center;
      }

      :deep(.ant-col) {
        margin-left: 0 !important;
        max-width: 100%;
      }
    }

    .submit-btn {
      width: 100%;
      max-width: 100%;
      padding: 0 32px;
      height: 44px;
      font-size: 15px;
    }
  }
}
</style>
