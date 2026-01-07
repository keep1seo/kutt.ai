<template>
  <div class="recharge-log-wrapper">
    <a-table
      :columns="tableColumns"
      :data-source="rechargeSource"
      :pagination="false"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 'max-content' }"
      class="recharge-table"
    >
      <template #emptyText>
        <a-empty :description="t('pages.user.no_data')" :image="false" />
      </template>
    </a-table>
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="page"
        v-model:page-size="pageSize"
        :total="listTotal"
        :show-size-changer="false"
        :show-total="(total) => `${t('pages.user.total')} ${total} ${t('pages.user.records')}`"
        @change="onPageChange"
        :hide-on-single-page="listTotal <= pageSize"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, toRefs, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserApi } from '~/api/useUserApi'

const { t } = useI18n()
const userApi = useUserApi()

/** 表格列配置 */
const tableColumns = computed(() => {
  return [
    {
      title: t('pages.user.title'),
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      width: 150,
      ellipsis: {
        showTitle: true
      }
    },
    {
      title: t('pages.user.amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      width: 120,
      sorter: true,
      ellipsis: true
    },
    {
      title: t('pages.user.pay_amount'),
      dataIndex: 'payamount',
      key: 'payamount',
      align: 'center',
      width: 120,
      sorter: true,
      ellipsis: true
    },
    {
      title: t('pages.user.pay_time'),
      dataIndex: 'paytime_text',
      key: 'paytime_text',
      align: 'center',
      width: 180,
      sorter: true,
      ellipsis: true
    }
  ]
})

// state
const state = reactive({
  page: 1,
  pageSize: 10,
  listTotal: 0,
  loading: false,
  rechargeSource: []
})

// toRefs
const { page, pageSize, listTotal, loading, rechargeSource } = toRefs(state)

/**
 * 获取充值记录
 */
const fetchList = () => {
  loading.value = true
  userApi
    .getRechargeLog({
      limit: pageSize.value,
      page: page.value
    })
    .then((res) => {
      const data = res.data
      listTotal.value = data?.count || 0
      if (Array.isArray(data?.list)) {
        rechargeSource.value = data.list
      } else if (Array.isArray(data)) {
        rechargeSource.value = data
      } else {
        rechargeSource.value = []
      }
    })
    .catch(() => {
      rechargeSource.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

/**
 * 分页变化
 * @param current
 * @param size
 */
const onPageChange = (current, size) => {
  page.value = current
  pageSize.value = size
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
.recharge-log-wrapper {
  padding: 16px 20px;

  .recharge-table {
    :deep(.ant-table) {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
    }

    :deep(.ant-table-thead > tr > th) {
      background-color: #fafafa;
      font-weight: 500;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      color: #262626;
      font-size: 14px;
    }

    :deep(.ant-table-tbody > tr > td) {
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      color: #595959;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :deep(.ant-table-tbody > tr:hover > td) {
      background-color: #fafafa;
    }

    :deep(.ant-table-tbody > tr:last-child > td) {
      border-bottom: none;
    }

    :deep(.ant-table-placeholder) {
      padding: 40px 0;
    }
  }

  .pagination-wrapper {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
    padding: 0 4px;
  }
}

@media screen and (max-width: 768px) {
  .recharge-log-wrapper {
    padding: 12px 16px;

    .recharge-table {
      :deep(.ant-table-thead > tr > th),
      :deep(.ant-table-tbody > tr > td) {
        padding: 10px 12px;
        font-size: 13px;
      }
    }

    .pagination-wrapper {
      margin-top: 12px;
      justify-content: center;
    }
  }
}
</style>
