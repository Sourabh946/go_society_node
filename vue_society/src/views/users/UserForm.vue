<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/axios'

const route = useRoute()
const router = useRouter()

const userId = route.params.id
const isEdit = !!userId

const form = ref({
    name: '',
    email: '',
    password: '',
    role_id: ''
})

const roles = ref([])
const error = ref('')
const loading = ref(false)

const loadRoles = async () => {
    const res = await api.get('/roles')
    roles.value = res.data
}

const loadUser = async () => {
    if (!isEdit) return

    const res = await api.get(`/users/${userId}`)
    form.value.name = res.data.name
    form.value.email = res.data.email
    form.value.role_id = res.data.role_id
}

const submit = async () => {
    error.value = ''

    const missingFields = []

    if (!form.value.name) missingFields.push('Name')
    if (!form.value.email) missingFields.push('Email')
    if (!isEdit && !form.value.password) missingFields.push('Password')
    if (!form.value.role_id) missingFields.push('Role')

    if (missingFields.length > 0) {
        error.value = `${missingFields.join(', ')} ${missingFields.length > 1 ? 'are' : 'is'} required`
        return
    }

    loading.value = true
    try {
        if (isEdit) {
            await api.put(`/users/${userId}`, {
                name: form.value.name,
                email: form.value.email,
                role_id: form.value.role_id,
                password: form.value?.password
            })
        } else {
            await api.post('/users', form.value)
        }
        router.push('/users')
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to save user'
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadRoles()
    await loadUser()
})
</script>

<template>
    <div class="card" style="max-width:520px">
        <h2>{{ isEdit ? 'Edit User' : 'Create User' }}</h2><br />

        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <label>Name</label>
        <input v-model="form.name" />

        <label>Email</label>
        <input v-model="form.email" type="email" />

        <label>Password</label>
        <input v-model="form.password" type="password" />

        <label>Role</label>
        <select v-model="form.role_id">
            <option value="">Select Role</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">
                {{ r.name }}
            </option>
        </select>

        <button class="btn btn-primary" :disabled="loading" @click="submit">
            {{ loading ? 'Saving...' : 'Save' }}
        </button>

        <button class="btn" style="margin-left:10px" @click="$router.back()">
            Cancel
        </button>
    </div>
</template>