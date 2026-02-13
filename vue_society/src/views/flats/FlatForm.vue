<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/axios'

const route = useRoute()
const router = useRouter()

/* --------------------
   State
-------------------- */
const flatId = route.params.id
const isEdit = !!flatId
const isInitializing = ref(true)

const form = ref({
    flat_number: '',
    society_id: '',
    building_id: ''
})

const societies = ref([])
const buildings = ref([])

const loading = ref(false)
const error = ref('')

/* --------------------
   API Calls
-------------------- */
const loadSocieties = async () => {
    const res = await api.get('/societies')
    societies.value = res.data
}

const loadBuildings = async (societyId) => {
    if (!societyId) {
        buildings.value = []
        return
    }

    const res = await api.get(`/buildings?society_id=${societyId}`)
    buildings.value = res.data
}

const loadFlat = async () => {
    if (!isEdit) {
        isInitializing.value = false
        return
    }

    const res = await api.get(`/flats/${flatId}`)
    const flat = res.data

    form.value.flat_number = flat.flat_number
    form.value.society_id = flat.building.society_id

    // 🔥 Load dependent data BEFORE setting selected value
    await loadBuildings(form.value.society_id)

    form.value.building_id = flat.building_id
    isInitializing.value = false
}

/* --------------------
   Watchers
-------------------- */
watch(
    () => form.value.society_id,
    async (newVal, oldVal) => {
        if (isInitializing.value) return   // 🔥 PREVENT DOUBLE CALL
        if (!newVal) {
            buildings.value = []
            form.value.building_id = ''
            return
        }

        await loadBuildings(newVal)

        // Reset building ONLY when user changes society
        if (!isInitializing.value && newVal !== oldVal) {
            form.value.building_id = ''
        }
    }
)

/* --------------------
   Submit
-------------------- */
const submit = async () => {
    error.value = ''

    if (!form.value.flat_number || !form.value.society_id || !form.value.building_id) {
        error.value = 'All fields are required'
        return
    }

    loading.value = true
    try {
        if (isEdit) {
            await api.patch(`/flats/${flatId}`, form.value)
        } else {
            await api.post('/flats', form.value)
        }
        router.push('/flats')
    } catch (e) {
        error.value = e.response?.data?.message || 'Something went wrong'
    } finally {
        loading.value = false
    }
}

/* --------------------
   Lifecycle
-------------------- */
onMounted(async () => {
    await loadSocieties()
    await loadFlat()
})
</script>

<template>
    <div class="card" style="max-width:520px">
        <h2>{{ isEdit ? 'Edit Flat' : 'Create Flat' }}</h2><br />

        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <label>Flat Number</label>
        <input v-model="form.flat_number" />

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

        <button class="btn btn-primary" :disabled="loading" @click="submit">
            {{ loading ? 'Saving...' : 'Save' }}
        </button>

        <button class="btn" style="margin-left:10px" @click="$router.back()">
            Cancel
        </button>
    </div>
</template>
