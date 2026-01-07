<template>
  <div class="screenshot-log-wrapper">
    <a-table
      :columns="tableColumns"
      :data-source="screenshotSource"
      :pagination="false"
      :loading="loading"
      row-key="id"
      :scroll="{ x: 'max-content' }"
      class="screenshot-table"
    >
      <template #emptyText>
        <a-empty :description="t('pages.user.no_data')" :image="false" />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'img'">
          <a-image
            v-if="record.img"
            :src="record.img"
            :width="80"
            :height="80"
            :preview="{
              src: record.img
            }"
            style="object-fit: cover; border-radius: 4px"
          />
          <span v-else>-</span>
        </template>
        <template v-else-if="column.key === 'share_url'">
          <a
            v-if="record.shar_url"
            :href="record.shar_url"
            target="_blank"
            rel="noopener noreferrer"
            style="color: #1890ff"
          >
            {{ record.shar_url }}
          </a>
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
      title: t('pages.user.img'),
      dataIndex: 'img',
      key: 'img',
      align: 'center',
      width: 120
    },
    {
      title: t('pages.user.share_url'),
      dataIndex: 'shar_url',
      key: 'share_url',
      align: 'center',
      width: 300,
      ellipsis: {
        showTitle: true
      }
    },
    {
      title: t('pages.user.create_time'),
      dataIndex: 'createtime_text',
      key: 'createtime_text',
      align: 'center',
      width: 180,
      ellipsis: true
    },
    {
      title: t('pages.user.status'),
      dataIndex: 'status_text',
      key: 'status_text',
      align: 'center',
      width: 120,
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
  screenshotSource: []
})

// toRefs
const { page, pageSize, listTotal, loading, screenshotSource } = toRefs(state)

/**
 * 获取截图记录
 */
const fetchList = () => {
  loading.value = true
  userApi
    .getUserScreenshotList({
      limit: pageSize.value,
      page: page.value
    })
    .then((res) => {
      const data = res.data
      listTotal.value = data?.count || 0
      if (Array.isArray(data?.list)) {
        screenshotSource.value = data.list
      } else if (Array.isArray(data)) {
        screenshotSource.value = data
      } else {
        screenshotSource.value = []
      }
    })
    .catch(() => {
      screenshotSource.value = []
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
.screenshot-log-wrapper {
  padding: 16px 20px;

  .screenshot-table {
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
  .screenshot-log-wrapper {
    padding: 12px 16px;

    .screenshot-table {
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
