import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

import SocietyList from '../views/societies/SocietyList.vue'
import SocietyForm from '../views/societies/SocietyForm.vue'
import BiuldingList from '../views/buildings/BuildingList.vue'
import BiuldingForm from '../views/buildings/BuildingForm.vue'
import FlatList from '../views/flats/FlatList.vue'
import FlatForm from '../views/flats/FlatForm.vue'

const routes = [
    { path: '/login', component: Login },

    {
        path: '/',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'societies', component: SocietyList },
            { path: 'societies/create', component: SocietyForm },
            { path: 'societies/:id', component: SocietyForm },
            { path: 'buildings', component: BiuldingList },
            { path: 'buildings/create', component: BiuldingForm },
            { path: 'buildings/:id', component: BiuldingForm },
            { path: 'flats', component: FlatList },
            { path: 'flats/create', component: FlatForm },
            { path: 'flats/:id', component: FlatForm }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.token) {
        return '/login'
    }
})

export default router
