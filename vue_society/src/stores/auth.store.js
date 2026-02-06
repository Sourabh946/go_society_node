import { defineStore } from 'pinia'
import api from '../api/axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token')
    }),

    actions: {
        async login(data) {
            const res = await api.post('/auth/login', data)
            console.log(res);
            this.user = res.data.user
            this.token = res.data.token
            localStorage.setItem('token', this.token)
            router.push('/dashboard')
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
            router.push('/login')
        }
    }
})
