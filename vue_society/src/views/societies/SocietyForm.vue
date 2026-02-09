<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/axios'

const route = useRoute()
const router = useRouter()

const isEdit = route.params.id

const form = ref({
    name: '',
    address: ''
})

const error = ref('')
const loading = ref(false)

const load = async () => {
    if (!isEdit) return
    const res = await api.get('/societies')
    const s = res.data.find(x => x.id == isEdit)
    if (s) form.value = s
}

const submit = async () => {
    error.value = ''

    if (!form.value.name || !form.value.address) {
        error.value = 'All fields are required'
        return
    }

    loading.value = true
    try {
        if (isEdit) {
            await api.patch(`/societies/${isEdit}`, form.value)
        } else {
            await api.post('/societies', form.value)
        }
        router.push('/societies')
    } catch (e) {
        error.value = e.response?.data?.message
    } finally {
        loading.value = false
    }
}

onMounted(load)
</script>

<template>
    <div class="card" style="max-width:520px">
        <h2>{{ isEdit ? 'Edit Society' : 'Create Society' }}</h2><br />

        <div v-if="error" style="color:#dc2626">{{ error }}</div>

        <label>Name</label>
        <input v-model="form.name" />

        <label>Address</label>
        <input v-model="form.address" />

        <button class="btn btn-primary" :disabled="loading" @click="submit">
            {{ loading ? 'Saving...' : 'Save' }}
        </button>

        <button class="btn" style="margin-left:10px" @click="$router.back()">
            Cancel
        </button>
    </div>
</template>
