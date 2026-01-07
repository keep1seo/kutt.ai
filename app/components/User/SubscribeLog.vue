<template>
  <div class="subscribe-log-wrapper">
    <a-table
      :columns="tableColumns"
      :data-source="subscribeSource"
      :pagination="false"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 'max-content' }"
      class="subscribe-table"
    >
      <template #emptyText>
        <a-empty :description="t('pages.user.no_data')" :image="false" />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === 'normal'" color="success">
            {{ t('pages.user.normal') }}
          </a-tag>
          <a-tag v-else-if="record.status === 'hidden'" color="error">
            {{ t('pages.user.cancelled') }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button
            v-if="record.status === 'normal'"
            type="link"
            danger
            @click="singleCancelSubscription(record.id)"
          >
            {{ t('pages.user.unsubscribe') }}
          </a-button>
          <span v-else>-</span>
        </template>
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
    <!-- 取消订阅对话框 -->
    <a-modal
      v-model:open="dialogVisible"
      :title="t('pages.user.warning')"
      :width="500"
      @cancel="onClose"
    >
      <p>{{ t('pages.user.cancel_text') }}</p>
      <template #footer>
        <a-button @click="onClose">{{ t('pages.user.cancel') }}</a-button>
        <a-button type="primary" danger @click="runCancelSubscription">
          {{ t('pages.user.confirm') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'
import { useUserApi } from '~/api/useUserApi'

const { t } = useI18n()
const userApi = useUserApi()

/** 表格列配置 */
const tableColumns = computed(() => {
  return [
    {
      title: t('pages.user.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: {
        showTitle: true
      }
    },
    {
      title: t('pages.user.price'),
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      width: 120,
      sorter: true,
      ellipsis: true
    },
    {
      title: t('pages.user.score'),
      dataIndex: 'score',
      key: 'score',
      align: 'center',
      width: 120,
      sorter: true,
      ellipsis: true
    },
    {
      title: t('pages.user.create_time'),
      dataIndex: 'createtime',
      key: 'createtime',
      align: 'center',
      width: 180,
      sorter: true,
      ellipsis: true
    },
    {
      title: t('pages.user.status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120
    },
    {
      title: t('pages.user.action'),
      key: 'action',
      align: 'center',
      width: 130,
      fixed: 'right'
    }
  ]
})

// state
const state = reactive({
  page: 1,
  pageSize: 10,
  listTotal: 0,
  loading: false,
  subscribeSource: [],
  dialogVisible: false,
  subscribeSelections: []
})

// toRefs
const { page, pageSize, listTotal, loading, subscribeSource, dialogVisible, subscribeSelections } =
  toRefs(state)

/**
 * 获取订阅记录
 */
const fetchList = () => {
  loading.value = true
  userApi
    .getUserSubscriptionList({
      limit: pageSize.value,
      page: page.value
    })
    .then((res: any) => {
      const data = res.data
      listTotal.value = data?.count || 0
      if (Array.isArray(data?.list)) {
        subscribeSource.value = data.list
      } else if (Array.isArray(data)) {
        subscribeSource.value = data
      } else {
        subscribeSource.value = []
      }
    })
    .catch((error) => {
      subscribeSource.value = []
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
const onPageChange = (current: number, size: number) => {
  page.value = current
  pageSize.value = size
  fetchList()
}

/**
 * 单个选择取消订阅
 * @param id
 */
const singleCancelSubscription = (id: number) => {
  subscribeSelections.value = [id as never]
  dialogVisible.value = true
}

/**
 * 执行取消订阅
 */
const runCancelSubscription = () => {
  const ids = subscribeSelections.value.join(',')
  userApi
    .cancelUserSubscription({ id: ids })
    .then((res: any) => {
      const msg = res?.msg || res?.data?.msg || t('pages.user.unsubscribe_success')
      message.success(msg)
      fetchList()
    })
    .catch((error) => {
      console.error('取消订阅失败:', error)
    })
    .finally(() => {
      subscribeSelections.value = []
      onClose()
    })
}

/**
 * 取消订阅弹窗关闭
 */
const onClose = () => {
  dialogVisible.value = false
  subscribeSelections.value = []
}

onMounted(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
.subscribe-log-wrapper {
  padding: 16px 20px;

  .subscribe-table {
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
    }

    :deep(.ant-table-tbody > tr > td:not(:first-child)) {
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
  .subscribe-log-wrapper {
    padding: 12px 16px;

    .subscribe-table {
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
