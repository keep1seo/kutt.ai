<template>
  <div class="home-price-standard">
    <!-- Free plan -->
    <div class="home-price-standard_item home-price-standard_item--free">
      <div class="price-standard">
        <div class="price-standard-header">
          <h3>{{ $t('pages.price.config.standard.hobby.title') }}</h3>
          <p>{{ $t('pages.price.config.standard.hobby.desc') }}</p>
        </div>

        <div class="price-standard-body">
          <div class="price-standard-body_title">
            {{ $t('pages.price.config.standard.hobby.free.title') }}
          </div>

          <dl class="price-standard-body_tags">
            <dd v-for="(item, i) in getStandardHobbyFreeTags" :key="i">
              {{ item }}
            </dd>
          </dl>
        </div>

        <a-button class="price-standard-botton">
          {{ $t('pages.price.config.standard.hobby.buttonText') }}
        </a-button>
      </div>

      <div class="price-standard-footer">
        <span>{{ $t('pages.price.config.standard.hobby.footerTips') }}</span>
      </div>
    </div>
    <!-- Pro Plan -->
    <div class="home-price-standard_item home-price-standard_item--pro">
      <div class="price-standard-hot">
        <div class="price-standard-hot_text">
          {{ $t('pages.price.config.standard.mostPopular') }}
        </div>
      </div>

      <div class="price-standard">
        <div class="price-standard-header">
          <h3>{{ $t('pages.price.config.standard.pro.title') }}</h3>
          <div class="price-standard-header-desc-paytype">
            <p>{{ $t('pages.price.config.standard.pro.desc') }}</p>
            <img src="https://api.pixelfox.ai/assets/img/payment/stripepay.png" />
            <img src="https://api.pixelfox.ai/assets/img/payment/paypal.png" />
          </div>
        </div>

        <div class="price-standard-body">
          <ul class="price-standard-body_credit">
            <li v-for="(item, i) in getStandardProCreditType" :key="i">
              <div class="price-standard-body_credit_item">
                <PriceSvg :type="item.type" />
                <span>{{ item.title }}</span>
              </div>
            </li>
          </ul>

          <div class="price-standard-body_price">
            <div class="price-header">
              <client-only>
                <div class="price-header-top">
                  <a-statistic
                    :value="state.pro.price"
                    :precision="2"
                    :value-style="{ fontSize: '28px' }"
                  >
                    <template #suffix>
                      <div :style="{ fontSize: '16px' }">
                        /{{ state.pro.realCredit }}
                        {{ $t('pages.price.config.standard.pro.credit') }}
                      </div>
                    </template>
                    <template #prefix>
                      <div :style="{ fontSize: '28px' }">
                        {{ state.pro.currency }}
                      </div>
                    </template>
                  </a-statistic>
                  <div class="select-currency">
                    <a-select
                      v-model:value="currency"
                      show-search
                      @change="onChangeCurrency"
                      size="small"
                      :bordered="false"
                    >
                      <a-select-option v-for="item in currencyList" :key="item" :value="item">
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
              </client-only>
              <div class="price-header-tips">
                {{ $t('pages.price.config.standard.pro.creditTips') }}
              </div>
            </div>

            <div class="pro-price-tabs">
              <div
                class="pro-price-tab"
                :class="{ 'pro-price-tab--active': state.pro.tabActive === 0 }"
                @click="handleProTabClick(0)"
              >
                <span>{{ $t('pages.price.config.standard.pro.payMonthly') }}</span>
              </div>
              <div
                class="pro-price-tab"
                :class="{ 'pro-price-tab--active': state.pro.tabActive === 1 }"
                @click="handleProTabClick(1)"
              >
                <span>{{ $t('pages.price.config.standard.pro.payYearly') }}</span>
                <i>{{ $t('pages.price.config.standard.pro.off') }}</i>
              </div>
            </div>

            <div class="price-list" :style="{ height: state.pro.isCollapse ? 'auto' : '96px' }">
              <a-radio-group v-model:value="state.pro.credit" v-if="state.pro.tabActive === 0">
                <div class="price-list_radio" v-for="(item, i) in state.pro.payMonthly" :key="i">
                  <a-radio :value="item.id" @click="onChangePack(item.id)">
                    <div class="price-list_item">
                      <div class="price-list_item-score">
                        {{ item.score }} Credits <small>/ Month</small>
                      </div>
                      <div>{{ item.currency }}{{ item.price }}</div>
                    </div>
                  </a-radio>
                </div>
              </a-radio-group>

              <a-radio-group v-model:value="state.pro.credit" v-if="state.pro.tabActive === 1">
                <div class="price-list_radio" v-for="(item, i) in state.pro.payYearly" :key="i">
                  <a-radio :value="item.id" @click="onChangePack(item.id)">
                    <div class="price-list_item">
                      <div class="price-list_item-score">
                        {{ item.score }} Credits <small>/ Year</small>
                      </div>
                      <div>{{ item.currency }}{{ item.price }}</div>
                    </div>
                  </a-radio>
                </div>
              </a-radio-group>
            </div>

            <a-divider>
              <div
                class="price-divider-more"
                v-if="!state.pro.isCollapse"
                @click="state.pro.isCollapse = !state.pro.isCollapse"
              >
                <div class="price-divider-more_text">
                  {{ $t('pages.price.config.standard.pro.viewMore') }}
                </div>
                <component :is="DownOutlined" />
              </div>

              <div
                class="price-divider-more"
                v-if="state.pro.isCollapse"
                @click="state.pro.isCollapse = !state.pro.isCollapse"
              >
                <div class="price-divider-more_text">
                  {{ $t('pages.price.config.standard.pro.collapse') }}
                </div>
                <component :is="UpOutlined" />
              </div>
            </a-divider>
          </div>

          <dl class="price-standard-body_tags">
            <dt>{{ $t('pages.price.config.standard.pro.everything') }}</dt>
            <dd v-for="(item, i) in getStandardProEverythingTags" :key="i">
              {{ item }}
            </dd>
          </dl>
        </div>

        <a-button type="primary" class="price-standard-botton" @click="handleProButtonClick">
          {{ $t('pages.price.config.standard.pro.buttonText') }}
        </a-button>
      </div>

      <div class="price-standard-footer">
        <span>{{ $t('pages.price.config.standard.pro.footerTips') }}</span>
      </div>
    </div>
    <!-- Flexible Plan -->
    <div class="home-price-standard_item home-price-standard_item--flexible">
      <div class="price-standard">
        <div class="price-standard-header">
          <h3>{{ $t('pages.price.config.standard.flexible.title') }}</h3>
          <div class="price-standard-header-desc-paytype">
            <p>{{ $t('pages.price.config.standard.flexible.desc') }}</p>
            <img src="https://api.pixelfox.ai/assets/img/payment/stripepay.png" />
            <img src="https://api.pixelfox.ai/assets/img/payment/paypal.png" />
            <img src="https://api.pixelfox.ai/assets/img/payment/alipay.png" />
            <img src="https://api.pixelfox.ai/assets/img/payment/wechatpay.png" />
          </div>
        </div>

        <div class="price-standard-body">
          <ul class="price-standard-body_credit">
            <li v-for="(item, i) in getStandardFlexibleCreditType" :key="i">
              <div class="price-standard-body_credit_item">
                <PriceSvg :type="item.type" />
                <span>{{ item.title }}</span>
              </div>
            </li>
          </ul>

          <div class="price-standard-body_price">
            <div class="price-header">
              <client-only>
                <div class="price-header-top">
                  <a-statistic
                    :value="state.flexible.price"
                    :precision="2"
                    :value-style="{ fontSize: '32px' }"
                  >
                    <template #suffix>
                      <div :style="{ fontSize: '16px' }">
                        /{{ state.flexible.realCredit }}
                        {{ $t('pages.price.config.standard.flexible.credit') }}
                      </div>
                    </template>
                    <template #prefix>
                      <div :style="{ fontSize: '32px' }">
                        {{ state.flexible.currency }}
                      </div>
                    </template>
                  </a-statistic>
                  <div class="select-currency">
                    <a-select
                      v-model:value="currency_flex"
                      show-search
                      @change="onChangeFlexCurrency"
                      size="small"
                      :bordered="false"
                    >
                      <a-select-option v-for="item in currencyFlexList" :key="item" :value="item">
                        {{ item }}
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
              </client-only>
              <div class="price-header-tips">
                {{ $t('pages.price.config.standard.flexible.creditTips') }}
              </div>
            </div>

            <div
              class="price-list"
              :style="{ height: state.flexible.isCollapse ? 'auto' : '96px' }"
            >
              <a-radio-group v-model:value="state.flexible.credit">
                <div class="price-list_radio" v-for="(item, i) in state.flexible.payList" :key="i">
                  <a-radio :value="item.id" @click="onChangeFlexPack(item.id)">
                    <div class="price-list_item">
                      <div class="price-list_item-score">{{ item.score }} Credits</div>
                      <div>{{ item.currency }}{{ item.price }}</div>
                    </div>
                  </a-radio>
                </div>
              </a-radio-group>
            </div>

            <a-divider>
              <div
                class="price-divider-more"
                v-if="!state.flexible.isCollapse"
                @click="state.flexible.isCollapse = !state.flexible.isCollapse"
              >
                <div class="price-divider-more_text">
                  {{ $t('pages.price.config.standard.flexible.viewMore') }}
                </div>
                <component :is="DownOutlined" />
              </div>

              <div
                class="price-divider-more"
                v-if="state.flexible.isCollapse"
                @click="state.flexible.isCollapse = !state.flexible.isCollapse"
              >
                <div class="price-divider-more_text">
                  {{ $t('pages.price.config.standard.flexible.collapse') }}
                </div>
                <component :is="UpOutlined" />
              </div>
            </a-divider>
          </div>

          <dl class="price-standard-body_tags">
            <dt>{{ $t('pages.price.config.standard.flexible.everything') }}</dt>
            <dd v-for="(item, i) in getStandardFlexibleEverythingTags" :key="i">
              {{ item }}
            </dd>
          </dl>
        </div>

        <a-button class="price-standard-botton" @click="handleFlexibleButtonClick">
          {{ $t('pages.price.config.standard.flexible.buttonText') }}
        </a-button>
      </div>

      <div class="price-standard-footer">
        <span>{{ $t('pages.price.config.standard.flexible.footerTips') }}</span>
      </div>
    </div>
    <!-- 支付弹框 -->
    <a-modal
      :key="modalKey"
      v-model:open="paymentTypePopVisible"
      :width="700"
      :z-index="3001"
      :footer="null"
      centered
      @cancel="cancelPaytypeChooseDialog"
    >
      <div class="payment-modal-content">
        <div class="payment-modal-header">
          <div class="payment-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <h2 class="payment-title">{{ $t('pages.price.config.standard.payment.title') }}</h2>
          <p class="payment-subtitle">{{ $t('pages.price.config.standard.payment.subtitle') }}</p>
        </div>

        <div class="payment-options">
          <div
            v-for="item in paytypeList"
            :key="item.value"
            :class="['payment-option-card', { 'payment-option-selected': paytype === item.value }]"
            @click.stop="paytype = item.value"
          >
            <div class="payment-option-content">
              <img :src="item.img" alt="" class="payment-logo" />
              <div class="payment-check-icon" v-if="paytype === item.value">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="payment-modal-footer">
          <a-button size="large" @click="cancelPaytypeChooseDialog" class="payment-cancel-btn">
            取消
          </a-button>
          <a-button
            size="large"
            type="primary"
            @click="executePayment"
            :loading="paymentLoading"
            class="payment-confirm-btn"
          >
            确认支付
          </a-button>
        </div>
      </div>
    </a-modal>
    <template>
      <div v-html="noStripePayResponse"></div>
    </template>
  </div>
</template>

<script setup>
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { usePriceApi } from '~/api/usePriceApi'

/* Api */
const priceApi = usePriceApi()

// state
const state = reactive({
  pro: {
    realCredit: 0,
    credit: 0,
    price: 0,
    currency: '$',
    isCollapse: false,
    tabActive: 0,
    payMonthly: [],
    payYearly: []
  },
  flexible: {
    realCredit: 0,
    credit: 0,
    price: 0,
    currency: '$',
    isCollapse: false,
    payList: []
  },
  // 币种
  currency: 'USD',
  // 币种下拉框
  currencyList: ['USD'],
  // 币种-flexible
  currency_flex: 'USD',
  // 币种下拉框-flexible
  currencyFlexList: ['USD']
})

// toRefs
const { currency, currencyList, currency_flex, currencyFlexList } = toRefs(state)

const getStandardHobbyFreeTags = computed(() => {
  let arr = []
  const arrTm = $tm('pages.price.config.standard.hobby.free.tags')
  if (arrTm && arrTm.length) {
    arr = JSON.parse(JSON.stringify(arrTm.map((e) => $rt(e))))
  }
  return arr
})

const getStandardProEverythingTags = computed(() => {
  let arr = []
  const arrTm = $tm('pages.price.config.standard.pro.everythingTags')
  if (arrTm && arrTm.length) {
    arr = JSON.parse(JSON.stringify(arrTm.map((e) => $rt(e))))
  }
  return arr
})

const getStandardFlexibleEverythingTags = computed(() => {
  let arr = []
  const arrTm = $tm('pages.price.config.standard.pro.flexible.everythingTags')
  if (arrTm && arrTm.length) {
    arr = JSON.parse(JSON.stringify(arrTm.map((e) => $rt(e))))
  }
  return arr
})

const getStandardProCreditType = computed(() => {
  let arr = []
  const arrTm = $tm('pages.price.config.standard.pro.creditType')
  if (arrTm && arrTm.length) {
    arr = JSON.parse(
      JSON.stringify(
        arrTm.map((e) => {
          return {
            title: $rt(e.title),
            type: $rt(e.type)
          }
        })
      )
    )
  }
  return arr
})

const getStandardFlexibleCreditType = computed(() => {
  let arr = []
  const arrTm = $tm('pages.price.config.standard.flexible.creditType')
  if (arrTm && arrTm.length) {
    arr = JSON.parse(
      JSON.stringify(
        arrTm.map((e) => {
          return {
            title: $rt(e.title),
            type: $rt(e.type)
          }
        })
      )
    )
  }
  return arr
})

/**支付选项弹窗--Start**/
/** 显示弹窗 */
const paymentTypePopVisible = ref(false)
/** 用于更新弹窗 */
const modalKey = ref(0)
/** 打开弹窗 */
const openPaytypeChooseDialog = () => {
  if (!paymentTypePopVisible.value) {
    paymentTypePopVisible.value = true
  }
}
/** 关闭弹窗 */
const cancelPaytypeChooseDialog = () => {
  paymentTypePopVisible.value = false
}
/** 支付方式 */
const paytype = ref('stripe')
/** 支付方式数据 */
const paytypeList = ref([])
/** 支付类型：专业、灵活 */
const paymentPlan = ref('subscribe')
/** 支付金额 */
const payamount = ref(0)
/** 订阅类型下区分年月 */
const subscribeType = ref('month')
/**支付选项弹窗--End**/
const noStripePayResponse = ref('')
// 支付loading状态
const paymentLoading = ref(false)
// 所有套餐
const list = ref([])
// 其他套餐
const flexList = ref([])
// 类型
const type = ref(1)

/**
 * 修改币种
 */
const onChangeCurrency = (value) => {
  state.pro.payMonthly.forEach((item) => {
    if (item['currency_rate'][value]) {
      item['currency'] = item['currency_rate'][value]['currency']
      item['price'] = item['currency_rate'][value]['month_price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (state.pro.credit === item['id']) {
      state.pro.currency = item['currency']
      state.pro.price = item['price']
    }
  })
  state.pro.payYearly.forEach((item) => {
    if (item['currency_rate'][value]) {
      item['currency'] = item['currency_rate'][value]['currency']
      item['price'] = item['currency_rate'][value]['price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (state.pro.credit === item['id']) {
      state.pro.currency = item['currency']
      state.pro.price = item['price']
    }
  })
}

/**
 * 修改币种-flexible
 * @param value
 */
const onChangeFlexCurrency = (value) => {
  state.flexible.payList.forEach((item) => {
    if (item['currency_rate'][value]) {
      item['currency'] = item['currency_rate'][value]['currency']
      item['price'] = item['currency_rate'][value]['price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (state.flexible.credit === item['id']) {
      state.flexible.currency = item['currency']
      state.flexible.price = item['price']
    }
  })
}

/**
 * 修改套餐
 * @param id
 */
const onChangePack = (id) => {
  state.pro.payMonthly.forEach((item) => {
    if (item['currency_rate'][currency.value]) {
      item['currency'] = item['currency_rate'][currency.value]['currency']
      item['price'] = item['currency_rate'][currency.value]['month_price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (id === item['id']) {
      state.pro.currency = item['currency']
      state.pro.price = item['price']
      state.pro.realCredit = item['score']
    }
  })
  state.pro.payYearly.forEach((item) => {
    if (item['currency_rate'][currency.value]) {
      item['currency'] = item['currency_rate'][currency.value]['currency']
      item['price'] = item['currency_rate'][currency.value]['price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (id === item['id']) {
      state.pro.currency = item['currency']
      state.pro.price = item['price']
      state.pro.realCredit = item['score']
    }
  })
}

/**
 * 修改套餐-flexible
 * @param id
 */
const onChangeFlexPack = (id) => {
  state.flexible.payList.forEach((item) => {
    if (item['currency_rate'][currency_flex.value]) {
      item['currency'] = item['currency_rate'][currency_flex.value]['currency']
      item['price'] = item['currency_rate'][currency_flex.value]['price']
    } else {
      item['currency'] = item['default_currency']
      item['price'] = item['default_month_price']
    }
    if (id === item['id']) {
      state.flexible.currency = item['currency']
      state.flexible.price = item['price']
      state.flexible.realCredit = item['score']
    }
  })
}

/** 获取列表数据 */
const handleGetPriceData = () => {
  priceApi
    .getPriceList()
    .then((response) => {
      const res = response.data || {}
      if (res) {
        if (res.subscribe && res.subscribe.year && res.subscribe.year.length > 0) {
          // 推荐币种
          currency.value = res?.currency || 'USD'
          // 币种下拉框
          currencyList.value = [
            ...new Set(['USD', ...Object.keys(res.subscribe.year[0]['currency_rate'])])
          ]
          for (let i = 0; i < res.subscribe.year.length; i++) {
            const item = res.subscribe.year[i]
            // 设置真实金额
            item['real_price'] = item['price']
            // 默认币种
            item['default_currency'] = item['currency']
            // 默认金额
            item['default_month_price'] = item['month_price']
            // 将美元汇率进行存储
            item['currency_rate']['USD'] = {
              currency: item['currency'],
              price: item['price'],
              month_price: item['month_price'],
              currency_code: 'USD'
            }
          }
          list.value = res.subscribe.year || []
          const year = res.subscribe.year.filter((item) => item.subscribe_type === 'year')
          const month = res.subscribe.year.filter((item) => item.subscribe_type === 'month')

          if (year.length > 0) {
            state.pro.payYearly = year
            state.pro.payYearly.forEach((item) => {
              if (item['currency_rate'][currency.value]) {
                item['currency'] = item['currency_rate'][currency.value]['currency']
                item['price'] = item['currency_rate'][currency.value]['price']
              } else {
                item['currency'] = item['default_currency']
                item['price'] = item['default_month_price']
              }
            })
          }

          if (month.length > 0) {
            state.pro.payMonthly = month
            state.pro.payMonthly.forEach((item) => {
              if (item['currency_rate'][currency.value]) {
                item['currency'] = item['currency_rate'][currency.value]['currency']
                item['price'] = item['currency_rate'][currency.value]['month_price']
              } else {
                item['currency'] = item['default_currency']
                item['price'] = item['default_month_price']
              }
            })
            state.pro.credit = month[0].id || 0
            state.pro.realCredit = month[0].score || 0
            state.pro.currency = month[0].currency || ''
            state.pro.price = month[0].price || 0
          }
        }

        if (res.flexible && res.flexible.length > 0) {
          // 推荐币种
          currency_flex.value = res?.currency || 'USD'
          // 币种下拉框
          currencyFlexList.value = [
            ...new Set(['USD', ...Object.keys(res.flexible[0]['currency_rate'])])
          ]
          for (let i = 0; i < res.flexible.length; i++) {
            const item = res.flexible[i]
            // 设置真实金额
            item['real_price'] = item['price']
            // 默认币种
            item['default_currency'] = item['currency']
            // 默认金额
            item['default_month_price'] = item['price']
            // 将美元汇率进行存储
            item['currency_rate']['USD'] = {
              currency: item['currency'],
              price: item['price'],
              month_price: item['price'],
              currency_code: 'USD'
            }
          }
          flexList.value = res.flexible || []
          state.flexible.payList = res.flexible
          state.flexible.payList.forEach((item) => {
            if (item['currency_rate'][currency_flex.value]) {
              item['currency'] = item['currency_rate'][currency_flex.value]['currency']
              item['price'] = item['currency_rate'][currency_flex.value]['price']
            } else {
              item['currency'] = item['default_currency']
              item['price'] = item['default_month_price']
            }
          })
          state.flexible.credit = res.flexible[0].id || 0
          state.flexible.realCredit = res.flexible[0].score || 0
          state.flexible.currency = res.flexible[0].currency || ''
          state.flexible.price = res.flexible[0].price || 0
        }
      }
    })
    .catch((e) => {
      if (import.meta.client) {
        message.error(e.message || '获取价格列表失败')
      }
    })
}
handleGetPriceData()

const handleProTabClick = (index) => {
  state.pro.tabActive = index

  if (index === 0) {
    state.pro.credit = state.pro.payMonthly[0].id || 0
    state.pro.price = state.pro.payMonthly[0].price || 0
    state.pro.currency = state.pro.payMonthly[0].currency || ''
    return
  }
  state.pro.credit = state.pro.payYearly[0].id || 0
  state.pro.price = state.pro.payYearly[0].price || 0
  state.pro.currency = state.pro.payYearly[0].currency || ''
}

/** 订阅 */
const handleProButtonClick = () => {
  type.value = 1
  // TODO: 实现登录逻辑
  // const token = getToken()
  // if (!token) {
  //   $userStore.setShowLoginModal(true)
  // } else {
  paymentPlan.value = 'subscribe'
  payamount.value = state.pro.price
  subscribeType.value = state.pro.tabActive === 0 ? 'month' : 'year'
  paytypeList.value = [
    {
      value: 'stripe',
      img: 'https://api.pixelfox.ai/assets/img/payment/stripepay.png'
    },
    {
      value: 'paypal',
      img: 'https://api.pixelfox.ai/assets/img/payment/paypal.png'
    }
  ]
  openPaytypeChooseDialog()
  // }
}

/** 灵活 */
const handleFlexibleButtonClick = () => {
  type.value = 2
  // TODO: 实现登录逻辑
  // const token = getToken()
  // if (!token) {
  //   $userStore.setShowLoginModal(true)
  // } else {
  paymentPlan.value = 'flexible'
  payamount.value = state.flexible.price
  subscribeType.value = ''
  paytypeList.value = [
    {
      value: 'stripe',
      img: 'https://api.pixelfox.ai/assets/img/payment/stripepay.png'
    },
    {
      value: 'paypal',
      img: 'https://api.pixelfox.ai/assets/img/payment/paypal.png'
    },
    {
      value: 'alipay',
      img: 'https://api.pixelfox.ai/assets/img/payment/alipay.png'
    },
    {
      value: 'wechat',
      img: 'https://api.pixelfox.ai/assets/img/payment/wechatpay.png'
    }
  ]
  openPaytypeChooseDialog()
  // }
}

/**
 * 执行支付
 */
const executePayment = () => {
  if (
    paytype.value !== 'stripe' &&
    paytype.value !== 'paypal' &&
    paymentPlan.value === 'subscribe'
  ) {
    if (import.meta.client) {
      message.error('订阅模式仅使用PayPal与Stripe支付')
    }
    return
  }
  cancelPaytypeChooseDialog()
  let pack = null
  if (type.value === 1) {
    pack = list.value.find((item) => item.id === state.pro.credit)
  } else {
    pack = flexList.value.find((item) => item.id === state.flexible.credit)
  }
  const params = {
    paytype: paytype.value,
    rechargeType: paymentPlan.value,
    amount: pack.real_price,
    subscribeType: subscribeType.value,
    currency: type.value === 1 ? currency.value : currency_flex.value
  }
  // 执行支付
  paymentLoading.value = true
  priceApi
    .initiateUserRechargeScore(params)
    .then((res) => {
      noStripePayResponse.value = res.data
    })
    .catch((e) => {
      if (import.meta.client) {
        message.error(e.message || '支付失败')
      }
    })
    .finally(() => {
      paymentLoading.value = false
    })
}
</script>

<style lang="scss" scoped>
.home-price-standard {
  display: grid;
  grid-gap: 24px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
  align-items: stretch;
  grid-auto-rows: 1fr;

  .price-standard {
    padding: 40px 28px;
    border-radius: 24px;
    background: #ffffff;
    box-shadow:
      0 4px 20px rgba(0, 0, 0, 0.08),
      0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 100%;

    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.12),
        0 4px 8px rgba(0, 0, 0, 0.08);
    }

    &-hot {
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      z-index: 10;
      animation: pulse 2s ease-in-out infinite;

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      &_text {
        height: 44px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        line-height: 44px;
        border-radius: 22px;
        padding: 0 24px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        letter-spacing: 0.5px;
      }
    }

    &-header {
      margin-bottom: 24px;
      flex-shrink: 0;

      h3 {
        margin: 0 0 8px 0;
        font-size: 28px;
        line-height: 36px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      p {
        margin: 0 0 12px;
        font-size: 15px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.65);
      }
    }

    &-body {
      flex: 1;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      padding-right: 8px;
      min-height: 0;

      &_title {
        font-size: 32px;
        line-height: 56px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 16px;
      }

      &_credit {
        padding: 0;
        margin: 0 0 16px;
        list-style: none;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 6px;
        overflow-x: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }

        &_item {
          display: flex;
          align-items: center;
          padding: 3px 6px;
          background: rgba(102, 126, 234, 0.08);
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;

          &:hover {
            background: rgba(102, 126, 234, 0.15);
          }

          :deep(svg),
          :deep(i) {
            width: 12px;
            height: 12px;
            margin-right: 3px;
            flex-shrink: 0;
          }

          span {
            display: inline-block;
            font-size: 10px;
            color: rgba(0, 0, 0, 0.7);
            font-weight: 500;
            line-height: 1.2;
          }
        }
      }

      &_price {
        margin-bottom: 24px;

        .price-header {
          padding: 20px;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.05) 0%,
            rgba(118, 75, 162, 0.05) 100%
          );
          border-radius: 16px;
          border: 1px solid rgba(102, 126, 234, 0.1);
          margin-bottom: 16px;

          &-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }
        }

        .price-header-tips {
          margin-bottom: 16px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.6);
          padding: 8px 12px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 8px;
          border-left: 3px solid #667eea;
        }

        .pro-price-tabs {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
        }

        .pro-price-tab {
          cursor: pointer;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          height: 36px;
          border-radius: 8px;
          transition: all 0.2s ease;
          color: rgba(0, 0, 0, 0.65);
          font-weight: 500;

          i {
            font-size: 11px;
            font-weight: 600;
            font-style: normal;
            border-radius: 4px;
            padding: 2px 6px;
            margin-left: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            transform: scale(0.9);
          }

          &:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
          }

          &--active {
            font-weight: 600;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);

            i {
              background: rgba(255, 255, 255, 0.3);
            }
          }
        }

        .price-list {
          width: 100%;
          margin-bottom: 16px;
          overflow: hidden;
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.02);
          box-sizing: border-box;

          :deep(.ant-radio-group) {
            width: 100%;
            display: flex;
            flex-direction: column;
          }

          &_radio {
            width: 100%;
            padding: 2px;
            box-sizing: border-box;

            :deep(.ant-radio-wrapper) {
              display: flex;
              width: 100%;
              padding: 10px 12px;
              border-radius: 8px;
              transition: all 0.2s ease;
              margin: 3px 0;
              box-sizing: border-box;
              align-items: center;

              &:hover {
                background: rgba(102, 126, 234, 0.08);
              }
            }

            :deep(.ant-radio-wrapper-checked) {
              background: rgba(102, 126, 234, 0.12);
              border: 1px solid rgba(102, 126, 234, 0.3);
            }

            :deep(.ant-radio) {
              flex-shrink: 0;
              margin-right: 8px;
            }

            :deep(.ant-radio-inner) {
              border-color: #667eea;

              &::after {
                background-color: #ffffff;
              }
            }

            :deep(.ant-radio-wrapper-checked .ant-radio-inner) {
              border-color: #667eea;
              background-color: #667eea;

              &::after {
                background-color: #ffffff;
              }
            }
          }

          &_item {
            flex: 1;
            display: flex;
            width: 100%;
            min-width: 0;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            box-sizing: border-box;
            gap: 12px;
            white-space: nowrap;

            &-score {
              flex: 1;
              min-width: 0;
              font-size: 15px;
              font-weight: 600;
              color: #1a1a1a;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              display: flex;
              align-items: center;
              gap: 4px;

              small {
                font-size: 11px;
                color: rgba(0, 0, 0, 0.5);
                font-weight: 400;
                white-space: nowrap;
                flex-shrink: 0;
              }
            }

            & > div:last-child {
              font-size: 16px;
              font-weight: 700;
              color: #667eea;
              white-space: nowrap;
              flex-shrink: 0;
              min-width: fit-content;
            }
          }
        }

        .price-divider-more {
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #667eea;
          transition: all 0.2s ease;
          padding: 8px;
          border-radius: 8px;
          justify-content: center;

          &:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
          }

          &_text {
            font-size: 14px;
            margin-right: 6px;
            font-weight: 500;
          }
        }
      }

      &_tags {
        margin-top: 24px;

        dt {
          margin: 0 0 12px 0;
          padding: 0;
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: #1a1a1a;
        }

        dd {
          position: relative;
          padding-left: 24px;
          margin: 0 0 10px 0;
          font-size: 14px;
          line-height: 24px;
          color: rgba(0, 0, 0, 0.7);
          transition: all 0.2s ease;

          &:hover {
            color: #667eea;
            padding-left: 28px;
          }

          &::before {
            content: '✓';
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            line-height: 20px;
          }
        }
      }
    }

    &-botton {
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
      margin-top: auto;
      flex-shrink: 0;

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

    &-footer {
      font-size: 12px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.6);
      text-align: center;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      flex-shrink: 0;
    }

    &-header-desc-paytype {
      margin-top: 12px;

      p {
        margin: 0 0 12px 0;
        width: 100%;
      }

      // 图片单独占一行，且在同一行显示
      img {
        height: 24px;
        opacity: 0.8;
        transition: all 0.2s ease;
        filter: grayscale(20%);
        margin-right: 8px;
        display: inline-block;
        vertical-align: middle;

        &:hover {
          opacity: 1;
          transform: scale(1.05);
          filter: grayscale(0%);
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;

      &:hover {
        background: rgba(0, 0, 0, 0.3);
      }
    }
  }

  &_item {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &--free {
      grid-column-start: 1;
      grid-column-end: 7;
      grid-row-start: 5;
      grid-row-end: 7;
    }

    &--pro {
      grid-column-start: 1;
      grid-column-end: 7;
      grid-row-start: 1;
      grid-row-end: 3;

      .price-standard {
        background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
        border: 2px solid rgba(102, 126, 234, 0.2);
      }
    }

    &--flexible {
      grid-column-start: 1;
      grid-column-end: 7;
      grid-row-start: 3;
      grid-row-end: 5;
    }
  }
}

@media only screen and (min-width: 768px) {
  .home-price-standard {
    grid-gap: 24px;
    align-items: stretch;

    &_item {
      &--free {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 4;
        grid-row-end: 7;
      }

      &--pro {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 4;
      }

      &--flexible {
        grid-column-start: 4;
        grid-column-end: 7;
        grid-row-start: 1;
        grid-row-end: 4;
      }
    }
  }
}

@media only screen and (min-width: 992px) {
  .home-price-standard {
    grid-gap: 28px;
    align-items: stretch;

    &_item {
      &--free {
        grid-column-start: 1;
        grid-column-end: 3;
        grid-row-start: 1;
        grid-row-end: 7;
      }

      &--pro {
        grid-column-start: 3;
        grid-column-end: 5;
        grid-row-start: 1;
        grid-row-end: 7;
      }

      &--flexible {
        grid-column-start: 5;
        grid-column-end: 7;
        grid-row-start: 1;
        grid-row-end: 7;
      }
    }
  }
}

// 支付弹窗样式
.payment-modal-content {
  padding: 12px 0;
}

.payment-modal-header {
  text-align: center;
  margin-bottom: 32px;

  .payment-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);

    svg {
      color: #ffffff;
    }
  }

  .payment-title {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    letter-spacing: -0.02em;
  }

  .payment-subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.payment-option-card {
  position: relative;
  padding: 24px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: #9ca3af;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  &.payment-option-selected {
    border-color: #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%
    );
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
  }
}

.payment-option-content {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 48px;

  .payment-logo {
    max-width: 120px;
    height: auto;
    max-height: 40px;
    object-fit: contain;
    filter: grayscale(0.3);
    transition: filter 0.3s ease;
  }

  .payment-check-icon {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    animation: checkmark-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

    svg {
      color: #ffffff;
    }
  }
}

.payment-option-card.payment-option-selected .payment-logo {
  filter: grayscale(0);
}

@keyframes checkmark-pop {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.payment-modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  .payment-cancel-btn,
  .payment-confirm-btn {
    min-width: 120px;
    height: 44px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .payment-cancel-btn {
    border-color: #e5e7eb;
    color: #6b7280;

    &:hover {
      border-color: #9ca3af;
      color: #374151;
    }
  }

  .payment-confirm-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

    &:hover {
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.select-currency {
  flex-shrink: 0;
  margin-left: 12px;

  :deep(.ant-select) {
    min-width: 80px;
    transition: all 0.2s ease;
  }

  :deep(.ant-select-selector) {
    border-radius: 6px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    background: rgba(255, 255, 255, 0.8);
    transition: all 0.2s ease;
    height: 28px;
    padding: 0 8px;

    &:hover {
      border-color: #667eea;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.15);
    }
  }

  :deep(.ant-select-focused .ant-select-selector) {
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.15);
    background: rgba(255, 255, 255, 1);
  }

  :deep(.ant-select-selection-item) {
    line-height: 26px;
    font-size: 12px;
    font-weight: 500;
    color: #667eea;
  }

  :deep(.ant-select-arrow) {
    color: #667eea;
    font-size: 10px;
  }

  :deep(.ant-select-selection-placeholder) {
    line-height: 26px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
