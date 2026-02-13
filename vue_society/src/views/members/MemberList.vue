<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const members = ref([])
const loading = ref(false)
const error = ref('')
const search = ref('')

// pagination
const page = ref(1)
const perPage = 7

const load = async () => {
    loading.value = true
    try {
        const res = await api.get('/members')
        members.value = res.data
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to load members'
    } finally {
        loading.value = false
    }
}

const filtered = computed(() => {
    if (!search.value) return members.value

    return members.value.filter(m =>
        m.user.name.toLowerCase().includes(search.value.toLowerCase()) ||
        m.flat.flat_number.toLowerCase().includes(search.value.toLowerCase())
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
    if (!confirm('Remove this member from flat?')) return
    try {
        await api.delete(`/members/${id}`)
        load()
    } catch (e) {
        alert(e.response?.data?.message || 'Delete failed')
    }
}

onMounted(load)
</script>

<template>
    <div class="card">
        <div class="table-toolbar">
            <h2>Flat Members</h2>

            <router-link to="/members/create" class="btn btn-primary">
                Assign Member
            </router-link>
        </div>

        <input v-model="search" placeholder="Search by user or flat" />
    </div>

    <div class="card">
        <div v-if="error" class="error">{{ error }}</div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Flat</th>
                        <th>Building</th>
                        <th>Society</th>
                        <th>Role</th>
                        <th width="120">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="loading">
                        <td colspan="8">Loading...</td>
                    </tr>

                    <tr v-for="(m, index) in paginated" :key="m.id">
                        <td>
                            <span class="badge">
                                {{ (page - 1) * perPage + index + 1 }}
                            </span>
                        </td>

                        <td>{{ m.user.name }}</td>
                        <td>{{ m.user.email }}</td>
                        <td>{{ m.flat.flat_number }}</td>
                        <td>{{ m.flat.building.name }}</td>
                        <td>{{ m.flat.building.society.name }}</td>

                        <td>
                            <span class="badge" :class="{
                                owner: m.role === 'owner',
                                tenant: m.role === 'tenant'
                            }">
                                {{ m.role }}
                            </span>
                        </td>

                        <td class="table-actions">
                            <button class="btn btn-danger" @click="remove(m.id)">
                                Remove
                            </button>
                        </td>
                    </tr>

                    <tr v-if="!loading && paginated.length === 0">
                        <td colspan="8">No members found</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- pagination -->
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