<template>
  <div class="list-wrapper">
    <div class="list-item">
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.confidential_mobile_phone') }}</span>
        <span class="list-item-desc"
          >{{ $t('pages.user.already_bound_phone') }}: {{ data.phone || '未绑定' }}</span
        >
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_modify_it') }}</a-button>
    </div>
    <a-divider style="margin: 0; opacity: 0.6" />
    <div class="list-item">
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.confidential_email') }}</span>
        <span class="list-item-desc"
          >{{ $t('pages.user.already_bound_email') }}: {{ data.email || '未绑定' }}</span
        >
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_modify_it') }}</a-button>
    </div>
    <a-divider style="margin: 0; opacity: 0.6" />
    <div class="list-item">
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.security_question') }}</span>
        <span class="list-item-desc">{{ $t('pages.user.no_security_issue_set') }}</span>
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_set_it_up') }}</a-button>
    </div>
    <a-divider style="margin: 0; opacity: 0.6" />
    <div class="list-item">
      <div class="list-item-icon qq-icon">
        <QqOutlined />
      </div>
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.bind_QQ') }}</span>
        <span class="list-item-desc">{{ $t('pages.user.currently_unbound_QQ_account') }}</span>
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_bind_it') }}</a-button>
    </div>
    <a-divider style="margin: 0; opacity: 0.6" />
    <div class="list-item">
      <div class="list-item-icon wechat-icon">
        <WechatOutlined />
      </div>
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.bind_wechat') }}</span>
        <span class="list-item-desc">{{ $t('pages.user.currently_unbound_wechat_account') }}</span>
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_bind_it') }}</a-button>
    </div>
    <a-divider style="margin: 0; opacity: 0.6" />
    <div class="list-item">
      <div class="list-item-icon alipay-icon">
        <AlipayOutlined />
      </div>
      <div class="list-item-body">
        <span class="list-item-title">{{ $t('pages.user.bind_alipay') }}</span>
        <span class="list-item-desc">{{ $t('pages.user.currently_unbound_alipay_account') }}</span>
      </div>
      <a-button type="link" class="list-item-action">{{ $t('pages.user.go_bind_it') }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { QqOutlined, WechatOutlined, AlipayOutlined } from '@ant-design/icons-vue'

// 用户信息
const data = useCookie('userInfo')
</script>

<style lang="scss" scoped>
.list-wrapper {
  padding: 6px 14px;
  box-sizing: border-box;

  .list-item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 12px 10px;

    .list-item-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .list-item-title {
        font-size: 14px;
        font-weight: 500;
        color: #262626;
        line-height: 1.5715;
      }

      .list-item-desc {
        font-size: 13px;
        color: #8c8c8c;
        line-height: 1.5715;
      }
    }

    .list-item-icon {
      color: #fff;
      padding: 10px;
      font-size: 24px;
      border-radius: 50%;
      background: #3492ed;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      flex-shrink: 0;

      &.wechat-icon {
        background: #4daf29;
      }

      &.alipay-icon {
        background: #1476fe;
      }
    }

    .list-item-action {
      padding: 0;
      height: auto;
      font-size: 14px;
    }
  }
}
</style>
