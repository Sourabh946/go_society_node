<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/axios'

const flats = ref([])
const search = ref('')
const loading = ref(false)
const error = ref('')

// pagination
const page = ref(1)
const perPage = 7

const load = async () => {
    loading.value = true
    try {
        const res = await api.get('/flats')
        flats.value = res.data
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to load'
    } finally {
        loading.value = false
    }
}

const filtered = computed(() => {
    if (!search.value) return flats.value
    return buildings.value.filter(b =>
        b.flat_number.toLowerCase().includes(search.value.toLowerCase()) ||
        b.society?.name.toLowerCase().includes(search.value.toLowerCase()) ||
        b.building?.name.toLowerCase().includes(search.value.toLowerCase())
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
    if (!confirm('Delete this flat?')) return
    try {
        await api.delete(`/flats/${id}`)
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
            <h2>FLats</h2>

            <router-link to="/flats/create" class="btn btn-primary">
                + Add Flat
            </router-link>
        </div>

        <input v-model="search" placeholder="Search by flat number or building/society name" />
    </div>

    <div class="card">
        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Flat Number</th>
                        <th>Society</th>
                        <th>Building Name</th>
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
                        <td>{{ b.flat_number }}</td>
                        <td>{{ b.building?.society?.name }}</td>
                        <td>{{ b.building?.name }}</td>
                        <td class="table-actions">
                            <router-link :to="`/flats/${b.id}`" class="btn btn-primary">
                                Edit
                            </router-link>

                            <button class="btn btn-danger" @click="remove(b.id)">
                                Delete
                            </button>
                        </td>
                    </tr>

                    <tr v-if="!loading && paginated.length === 0">
                        <td colspan="4">No flats found</td>
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
