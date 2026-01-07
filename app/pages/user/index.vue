<template>
  <div class="user-page">
    <div class="user-wrapper">
      <client-only>
        <!--左侧-->
        <UserCard @done="updateLoginUser" class="user-side" />
        <!--右侧-->
        <a-card :body-style="{ padding: 0, minHeight: '462px' }" class="user-body">
          <a-tabs
            v-model:activeKey="active"
            size="large"
            class="user-tabs"
            :tab-bar-style="{ margin: 0 }"
          >
            <a-tab-pane v-for="item in tables" :key="item.name" :tab="item.label"> </a-tab-pane>
          </a-tabs>
          <div class="user-tabs-content">
            <transition name="fade-slide" mode="out-in">
              <!--个人信息表单-->
              <UserForm
                v-if="active === 'info'"
                key="info"
                @done="updateLoginUser"
                :data="loginUser"
              />
              <!--账号绑定-->
              <UserAccount v-else-if="active === 'account'" key="account" :data="loginUser" />
              <!--充值记录-->
              <UserRechargeLog v-else-if="active === 'recharge-log'" key="recharge-log" />
              <!--消耗记录-->
              <UserConsumptionLog v-else-if="active === 'consumption-log'" key="consumption-log" />
              <!--订阅记录-->
              <UserSubscribeLog v-else-if="active === 'subscribe-log'" key="subscribe-log" />
              <!--邀请奖励记录-->
              <UserInviteRewardLog
                v-else-if="active === 'invite-reward-log'"
                key="invite-reward-log"
              />
              <!--截图记录-->
              <UserScreenshotLog v-else-if="active === 'screenshot-log'" key="screenshot-log" />
            </transition>
          </div>
        </a-card>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'UserProfile' })

/* Hook */
const appStore = useAppStore()
const { t } = useI18n()

/**
 * 栏目
 */
const tables = reactive([
  { name: 'info', label: t('pages.user.info') },
  { name: 'account', label: t('pages.user.account') },
  { name: 'recharge-log', label: t('pages.user.rechargeLog') },
  { name: 'consumption-log', label: t('pages.user.consumptionLog') },
  { name: 'subscribe-log', label: t('pages.user.subscribeLog') },
  { name: 'invite-reward-log', label: t('pages.user.inviteRewardLog') },
  { name: 'screenshot-log', label: t('pages.user.screenshotLog') }
])

/** 标签页选中 */
const active = ref('info')

// 登录用户
const loginUser = computed(() => appStore.userInfo ?? {})

/**
 * 修改登录用户
 * @param data
 */
const updateLoginUser = (data: any) => {
  appStore.setUserInfo({ ...loginUser.value, ...data })
}

onMounted(() => {
  // 链接待active,修改active值
  let currentAction = ''
  window.location.search
    .replace('?', '')
    .split('&')
    .forEach((item) => {
      if (item) {
        const parts = item.split('=')
        if (parts.length === 2 && parts[0] === 'active') {
          currentAction = parts[1]
        }
      }
    })
  if (currentAction) {
    active.value = currentAction
  }
})
</script>

<style lang="scss" scoped>
.user-page {
  min-height: calc(100vh - 64px);
  background: #f8f9fa;
  padding: 32px 24px;
  margin-top: 0;
}

.user-wrapper {
  display: flex;
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;

  .user-side {
    width: 360px;
    flex-shrink: 0;
  }

  .user-body {
    flex: 1;
    background: #ffffff;
    border-radius: 12px;
    box-shadow:
      0 2px 12px rgba(0, 0, 0, 0.06),
      0 0 1px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    border: none;
    transition: box-shadow 0.3s ease;
  }
}

.user-tabs {
  background: linear-gradient(to bottom, #ffffff 0%, #fafafa 100%);
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #e8e8e8 20%, #e8e8e8 80%, transparent);
  }

  :deep(.ant-tabs-nav) {
    margin: 0;
    padding: 0 24px;
    background: transparent;

    &::before {
      display: none;
    }
  }

  :deep(.ant-tabs-tab) {
    font-size: 15px;
    font-weight: 500;
    padding: 18px 24px;
    margin: 0 2px 0 0;
    color: #595959;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    position: relative;
    border-radius: 8px 8px 0 0;

    &:hover {
      color: #667eea;
      background: rgba(102, 126, 234, 0.06);
    }

    &.ant-tabs-tab-active {
      color: #764ba2;
      font-weight: 600;
      background: rgba(102, 126, 234, 0.08);

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px 2px 0 0;
        box-shadow: 0 -2px 8px rgba(102, 126, 234, 0.3);
      }
    }
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }
}

.user-tabs-content {
  padding: 24px 32px;
  background: #ffffff;
  min-height: 500px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #f0f0f0 20%, #f0f0f0 80%, transparent);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media screen and (max-width: 1200px) {
  .user-wrapper {
    .user-side {
      width: 320px;
    }
  }
}

@media screen and (max-width: 992px) {
  .user-wrapper {
    .user-side {
      width: 300px;
    }
  }

  .user-tabs-content {
    padding: 20px 28px;
  }
}

@media screen and (max-width: 768px) {
  .user-page {
    padding: 16px;
  }

  .user-wrapper {
    flex-direction: column;
    gap: 20px;

    .user-side {
      width: 100%;
    }
  }

  .user-tabs {
    :deep(.ant-tabs-nav) {
      padding: 0 16px;
    }

    :deep(.ant-tabs-tab) {
      font-size: 14px;
      padding: 16px 12px;
      margin-right: 2px;
    }
  }

  .user-tabs-content {
    padding: 16px 16px;
  }
}
</style>
