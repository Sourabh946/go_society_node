<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')

// pagination
const page = ref(1)
const perPage = 7

const load = async () => {
    loading.value = true
    try {
        const res = await api.get('/users')
        users.value = res.data
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to load users'
    } finally {
        loading.value = false
    }
}

const filtered = computed(() => {
    if (!search.value) return users.value
    return users.value.filter(u =>
        u.name.toLowerCase().includes(search.value.toLowerCase()) ||
        u.email.toLowerCase().includes(search.value.toLowerCase())
    )
})

const totalPages = computed(() =>
    Math.ceil(filtered.value.length / perPage)
)

const paginated = computed(() => {
    const start = (page.value - 1) * perPage
    return filtered.value.slice(start, start + perPage)
})

const remove = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
        await api.delete(`/users/${id}`)
        load()
    } catch (e) {
        alert(e.response?.data?.message)
    }
}
const changePassword = (id) => {
    router.push(`/users/${id}/password`)
}

onMounted(load)
</script>

<template>
    <div class="card">
        <div class="table-toolbar">
            <h2>Users</h2>

            <router-link to="/users/create" class="btn btn-primary">
                Add User
            </router-link>
        </div>

        <input v-model="search" placeholder="Search by name or email" />
    </div>

    <div class="card">
        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th width="180">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="loading">
                        <td colspan="5">Loading...</td>
                    </tr>

                    <tr v-for="(u, index) in paginated" :key="u.id">
                        <td>
                            <span class="badge">
                                {{ (page - 1) * perPage + index + 1 }}
                            </span>
                        </td>
                        <td>{{ u.name }}</td>
                        <td>
                            {{ u.email }}
                            <button class="btn-icon" @click="changePassword(u.id)" title="Change Password">
                                <i class="fas fa-key"></i>
                            </button>
                        </td>
                        <td>{{ u.role?.name }}</td>
                        <td class="table-actions">
                            <router-link :to="`/users/${u.id}`" class="btn btn-primary">
                                Edit
                            </router-link>

                            <button class="btn btn-danger" @click="remove(u.id)">
                                Delete
                            </button>
                        </td>
                    </tr>

                    <tr v-if="!loading && paginated.length === 0">
                        <td colspan="5">No users found</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination" v-if="totalPages > 1">
            <button class="btn" :disabled="page === 1" @click="page--">
                Prev
            </button>

            <span>Page {{ page }} / {{ totalPages }}</span>

            <button class="btn" :disabled="page === totalPages" @click="page++">
                Next
            </button>
        </div>
    </div>
</template>