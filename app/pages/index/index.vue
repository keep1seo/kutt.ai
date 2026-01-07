<template>
  <div class="index-page">
    <!--IndexHeader-->
    <IndexHeader />
    <!--编辑器-->
    <GenerateEditor :inline="true" />
    <!--IndexCase-->
    <IndexCase />
    <!--IndexEasier-->
    <IndexEasier />
    <!--IndexAbility-->
    <IndexAbility />
    <!--IndexRemove-->
    <IndexRemove />
    <!--IndexHighlight-->
    <IndexHighlight />
    <!--IndexFeature-->
    <IndexFeature />
    <!--IndexToolSet-->
    <IndexToolSet />
    <!--IndexFaq-->
    <IndexFaq />
    <!--编辑器-->
    <GenerateEditor />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import GenerateEditor from '~/components/Generate/Editor.vue'

/* Hook */
const { t } = useI18n()

useSeoMeta({
  title: t('page.index.title'),
  ogTitle: t('page.index.title'),
  ogDescription: t('page.index.description'),
  description: t('page.index.description'),
  keywords: t('page.index.keywords')
})
</script>

<style lang="scss" scoped>
.index-page {
  margin: 0 auto;
  padding: 40px 0;
  padding-top: 0;
  text-align: center;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 40px 0;
    padding-top: 0;
  }

  @media (max-width: 480px) {
    padding: 30px 0;
    padding-top: 0;
  }
}
</style>
