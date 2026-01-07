import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vue3GoogleLogin, {
    clientId: '930019304550-6fpvj65c57u44f7pnl897vrc8nsr04tc.apps.googleusercontent.com'
  })
})
