import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const createState = (set) => ({
  name: 'userInfo',
  user: {loginName:'dbgpt-test', name:'测试账号'},
  getUser: async () => {
    /* TODO: Dependent on user module.  */
    const default_user = {loginName:'dbgpt-test', name:'测试账号'}
    set({ user: default_user })
  },
  logout: async () => {
    /* TODO: Dependent on user module.  */
    console.log("logout")
    set({ user: {} })
  },
})

export const useUserStore = create(persist(createState, { name: 'userInfo' }))

export const useUserInfo = () => useUserStore((state) => state.user)
/* user login */
export const userGetUserInfo = () => useUserStore((state) => state.getUser)
/* user logout */
export const userLogout = () => useUserStore((state) => state.logout)
