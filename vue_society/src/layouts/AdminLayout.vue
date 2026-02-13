<script setup>
import { useAuthStore } from '../stores/auth.store'
const auth = useAuthStore()
</script>

<template>
    <div class="app">
        <aside class="sidebar">
            <h3>Society Admin</h3>
            <p>{{ auth.user?.name }}</p>

            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/societies">Societies</router-link>
            <router-link to="/buildings">Buildings</router-link>
            <router-link to="/flats">Flats</router-link>
            <router-link to="/members">Members</router-link>
            <router-link to="/users">Users</router-link>
            <router-link to="/roles">Roles</router-link>

            <br />
            <button class="btn btn-danger" @click="auth.logout">Logout</button>
        </aside>

        <main class="main">
            <router-view />
        </main>
    </div>
</template>
