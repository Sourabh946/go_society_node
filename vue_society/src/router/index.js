import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

import RoleList from '../views/roles/RoleList.vue'
import RoleForm from '../views/roles/RoleForm.vue'
import SocietyList from '../views/societies/SocietyList.vue'
import SocietyForm from '../views/societies/SocietyForm.vue'
import BiuldingList from '../views/buildings/BuildingList.vue'
import BiuldingForm from '../views/buildings/BuildingForm.vue'
import FlatList from '../views/flats/FlatList.vue'
import FlatForm from '../views/flats/FlatForm.vue'
import MemberList from '../views/members/MemberList.vue'
import MemberForm from '../views/members/MemberForm.vue'
import UserList from '../views/users/UserList.vue'
import UserForm from '../views/users/UserForm.vue'

const routes = [
    { path: '/login', component: Login },

    {
        path: '/',
        component: AdminLayout,
        meta: { requiresAuth: true },
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'roles', component: RoleList },
            { path: 'roles/create', component: RoleForm },
            { path: 'roles/:id', component: RoleForm },
            { path: 'societies', component: SocietyList },
            { path: 'societies/create', component: SocietyForm },
            { path: 'societies/:id', component: SocietyForm },
            { path: 'buildings', component: BiuldingList },
            { path: 'buildings/create', component: BiuldingForm },
            { path: 'buildings/:id', component: BiuldingForm },
            { path: 'flats', component: FlatList },
            { path: 'flats/create', component: FlatForm },
            { path: 'flats/:id', component: FlatForm },
            { path: 'members', component: MemberList },
            { path: 'members/create', component: MemberForm },
            { path: 'members/:id', component: MemberForm },
            { path: 'users', component: UserList },
            { path: 'users/create', component: UserForm },
            { path: 'users/:id', component: UserForm }
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
