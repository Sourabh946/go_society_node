<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/axios'

const route = useRoute()
const router = useRouter()

const isEdit = route.params.id

const form = ref({
    name: '',
    society_id: ''
})

const societies = ref([])
const error = ref('')
const loading = ref(false)

/* Load societies for dropdown */
const loadSocieties = async () => {
    const res = await api.get('/societies')
    societies.value = res.data
}

/* Load building when editing */
const load = async () => {
    if (!isEdit) return

    const res = await api.get('/buildings')
    const b = res.data.find(x => x.id == isEdit)
    if (b) {
        form.value = {
            name: b.name,
            society_id: b.society_id
        }
    }
}

const submit = async () => {
    error.value = ''

    if (!form.value.name || !form.value.society_id) {
        error.value = 'All fields are required'
        return
    }

    loading.value = true
    try {
        if (isEdit) {
            await api.patch(`/buildings/${isEdit}`, form.value)
        } else {
            await api.post('/buildings', form.value)
        }
        router.push('/buildings')
    } catch (e) {
        error.value = e.response?.data?.message
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadSocieties()
    load()
})
</script>

<template>
    <div class="card" style="max-width:520px">
        <h2>{{ isEdit ? 'Edit Building' : 'Create Building' }}</h2><br />

        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <label>Building Name</label>
        <input v-model="form.name" />

        <label>Society</label>
        <select v-model="form.society_id">
            <option value="">Select Society</option>
            <option v-for="s in societies" :key="s.id" :value="s.id">
                {{ s.name }}
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
