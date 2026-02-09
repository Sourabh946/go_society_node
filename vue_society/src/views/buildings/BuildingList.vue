<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const buildings = ref([])
const search = ref('')
const loading = ref(false)
const error = ref('')

// pagination
const page = ref(1)
const perPage = 7

const load = async () => {
    loading.value = true
    try {
        const res = await api.get('/buildings')
        buildings.value = res.data
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to load'
    } finally {
        loading.value = false
    }
}

const filtered = computed(() => {
    if (!search.value) return buildings.value
    return buildings.value.filter(b =>
        b.name.toLowerCase().includes(search.value.toLowerCase()) ||
        b.society?.name.toLowerCase().includes(search.value.toLowerCase())
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
    if (!confirm('Delete this building?')) return
    try {
        await api.delete(`/buildings/${id}`)
        load()
    } catch (e) {
        alert(e.response?.data?.message)
    }
}

onMounted(load)
</script>

<template>
    <div class="card">
        <div class="table-toolbar">
            <h2>Buildings</h2>

            <router-link to="/buildings/create" class="btn btn-primary">
                + Add Building
            </router-link>
        </div>

        <input v-model="search" placeholder="Search by building or society name" />
    </div>

    <div class="card">
        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Building Name</th>
                        <th>Society</th>
                        <th width="150">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-if="loading">
                        <td colspan="4">Loading...</td>
                    </tr>

                    <tr v-for="(b, index) in paginated" :key="b.id">
                        <td>
                            <span class="badge">
                                {{ (page - 1) * perPage + index + 1 }}
                            </span>
                        </td>
                        <td>{{ b.name }}</td>
                        <td>{{ b.Society?.name }}</td>
                        <td class="table-actions">
                            <router-link :to="`/buildings/${b.id}`" class="btn btn-primary">
                                Edit
                            </router-link>

                            <button class="btn btn-danger" @click="remove(b.id)">
                                Delete
                            </button>
                        </td>
                    </tr>

                    <tr v-if="!loading && paginated.length === 0">
                        <td colspan="4">No buildings found</td>
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
