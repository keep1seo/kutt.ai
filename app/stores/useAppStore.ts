export const useAppStore = defineStore('appStore', {
  state: () => ({
    // 登录弹窗
    loginVisible: false,
    // 用户信息
    userInfo: {}
  }),
  actions: {
    /**
     * 设置登录弹窗是否可见
     * @param visible
     */
    setLoginVisible(visible: boolean) {
      this.loginVisible = visible
    },
    /**
     * 设置用户信息
     * @param userInfo
     */
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
    }
  }
})
