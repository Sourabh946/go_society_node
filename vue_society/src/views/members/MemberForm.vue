<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'

const router = useRouter()

const form = ref({
    user_id: '',
    society_id: '',
    building_id: '',
    flat_id: '',
    role: 'tenant'
})

const users = ref([])
const societies = ref([])
const buildings = ref([])
const flats = ref([])

const error = ref('')
const loading = ref(false)

/* Load initial data */
const loadUsers = async () => {
    const res = await api.get('/users')
    users.value = res.data
}

const loadSocieties = async () => {
    const res = await api.get('/societies')
    societies.value = res.data
}

/* Cascading loads */
const loadBuildings = async (societyId) => {
    buildings.value = []
    flats.value = []
    if (!societyId) return

    const res = await api.get(`/buildings?society_id=${societyId}`)
    buildings.value = res.data
}

const loadFlats = async (buildingId) => {
    flats.value = []
    if (!buildingId) return

    const res = await api.get(`/flats?building_id=${buildingId}`)
    flats.value = res.data.data
}

/* Watchers */
watch(() => form.value.society_id, (v) => {
    form.value.building_id = ''
    form.value.flat_id = ''
    loadBuildings(v)
})

watch(() => form.value.building_id, (v) => {
    form.value.flat_id = ''
    loadFlats(v)
})

/* Submit */
const submit = async () => {
    error.value = ''

    if (!form.value.user_id || !form.value.flat_id || !form.value.role) {
        error.value = 'All fields are required'
        return
    }

    loading.value = true
    try {
        await api.post('/members', form.value)
        router.push('/members')
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to assign member'
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    await loadUsers()
    await loadSocieties()
})
</script>

<template>
    <div class="card" style="max-width:520px">
        <h2>Assign Member to Flat</h2><br />

        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <label>User</label>
        <select v-model="form.user_id">
            <option value="">Select User</option>
            <option v-for="u in users" :key="u.id" :value="u.id">
                {{ u.name }} ({{ u.email }})
            </option>
        </select>

        <label>Society</label>
        <select v-model="form.society_id">
            <option value="">Select Society</option>
            <option v-for="s in societies" :key="s.id" :value="s.id">
                {{ s.name }}
            </option>
        </select>

        <label>Building</label>
        <select v-model="form.building_id" :disabled="!form.society_id">
            <option value="">Select Building</option>
            <option v-for="b in buildings" :key="b.id" :value="b.id">
                {{ b.name }}
            </option>
        </select>

        <label>Flat</label>
        <select v-model="form.flat_id" :disabled="!form.building_id">
            <option value="">Select Flat</option>
            <option v-for="f in flats" :key="f.id" :value="f.id">
                {{ f.flat_number }}
            </option>
        </select>

        <label>Role</label>
        <select v-model="form.role">
            <option value="">Select Role</option>
            <option value="owner">Owner</option>
            <option value="tenant">Tenant</option>
            <option value="family">Family</option>
        </select>

        <button class="btn btn-primary" :disabled="loading" @click="submit">
            {{ loading ? 'Assigning...' : 'Assign Member' }}
        </button>

        <button class="btn" style="margin-left:10px" @click="$router.back()">
            Cancel
        </button>
    </div>
</template>