<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const submit = async () => {
    error.value = ''

    if (!email.value) {
        error.value = 'Email is required'
        return
    }

    if (!isValidEmail(email.value)) {
        error.value = 'Enter a valid email address'
        return
    }

    if (!password.value) {
        error.value = 'Password is required'
        return
    }

    try {
        await auth.login({
            email: email.value,
            password: password.value
        })
    } catch (e) {
        error.value = e.response?.data?.message || 'Login failed'
    }
}
</script>

<template>
    <div style="max-width:400px;margin:120px auto">
        <div class="card">
            <h2>Login</h2><br />

            <div v-if="error" style="color:#dc2626;margin-bottom:10px">
                {{ error }}
            </div>

            <input v-model="email" placeholder="Email" type="email" />

            <input v-model="password" type="password" placeholder="Password" />

            <button class="btn btn-primary" @click="submit">
                Login
            </button>
        </div>
    </div>
</template>
