<template>
  <div class="home-price-custom">
    <h3>{{ $t('pages.price.config.custom.title') }}</h3>
    <p>{{ $t('pages.price.config.custom.subtitle') }}</p>

    <a-form
      ref="formRef"
      :model="dynamicValidateForm"
      layout="vertical"
    >
      <a-row :gutter="40">
        <a-col
          v-for="(item, index) in data.formData"
          :key="index"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <a-form-item :label="item.label" :name="item.key" :rules="item.rule">
            <PriceFormItem
              v-model:value="dynamicValidateForm[item.key]"
              :placeholder="item.placeholder"
              :type="item.type"
              :options="item.options"
            ></PriceFormItem>
          </a-form-item>
        </a-col>
      </a-row>

      <div class="home-price-custom_tips" v-html="data.tips"></div>

      <a-form-item>
        <a-button
          type="primary"
          size="large"
          :loading="data.loading"
          @click="onSubmit"
          class="home-price-custom_submit-btn"
        >
          {{ $t('pages.price.config.custom.buttonText') }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue'
import { usePriceApi } from '~/api/usePriceApi'

const { addPriceConsult } = usePriceApi()

const formRef = ref(null)
const dynamicValidateForm = reactive({})
const data = reactive({
  loading: false,
  tips: '',
  formData: []
})

const getParams = () => {
  const keyArray = Object.keys(dynamicValidateForm)
  const valueArray = Object.values(dynamicValidateForm)
  let params = {}
  keyArray.forEach((key, index) => {
    params[key] = valueArray[index]
  })

  return params
}

function onSubmit() {
  formRef.value
    ?.validate()
    .then(() => {
      data.loading = true
      addPriceConsult(getParams())
        .then(() => {
          if (import.meta.client) {
            message.success('提交成功！')
          }
          data.loading = false
        })
        .catch((e) => {
          if (import.meta.client) {
            message.error(e.message || '提交失败')
          }
          data.loading = false
        })
    })
    .catch(() => {
      // 验证失败
    })
}

const initForm = () => {
  const form = $tm('pages.price.config.custom.form')
  if (form && form.length) {
    data.formData = form.map((f) => {
      let rule = []
      if (f.rule && f.rule.length) {
        rule = f.rule.map((r) => {
          return {
            required: r.required,
            message: $rt(r.message),
            trigger: $rt(r.trigger) || 'blur'
          }
        })
      }

      let options = []
      if (f.options && f.options.length) {
        options = f.options.map((o) => {
          return {
            value: $rt(o.value),
            label: $rt(o.label)
          }
        })
      }

      return {
        key: $rt(f.key),
        label: $rt(f.label),
        placeholder: $rt(f.placeholder),
        type: $rt(f.type),
        required: f.required,
        rule,
        options
      }
    })
  }
}

// 渲染
onMounted(() => {
  initForm()
})
</script>

<style lang="scss" scoped>
.home-price-custom {
  padding: 24px 64px;
  border-radius: 20px;
  background-color: #ffffff;
  border: 1px solid rgba(64, 158, 255, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);

  h3 {
    margin: 0;
    font-size: 24px;
    line-height: 42px;
  }

  p {
    margin: 0 0 20px;
    font-size: 16px;
    line-height: 32px;
  }

  &_tips {
    margin-bottom: 24px;
    font-size: 12px;
    line-height: 26px;
  }

  &_submit-btn {
    height: 52px;
    width: 100%;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    color: #ffffff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    :deep(.ant-btn) {
      height: 100%;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      color: #ffffff;
    }

    :deep(.ant-btn-primary) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      color: #ffffff !important;

      &:hover {
        background: linear-gradient(135deg, #5568d3 0%, #653a8f 100%);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        color: #ffffff !important;
      }

      &:focus {
        color: #ffffff !important;
      }
    }

    :deep(.ant-btn-default) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

      &:hover {
        background: linear-gradient(135deg, #5568d3 0%, #653a8f 100%);
        border-color: transparent;
        color: #ffffff !important;
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      &:focus {
        color: #ffffff !important;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
}
</style>
