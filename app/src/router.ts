import { createRouter, createWebHistory } from 'vue-router'
import { getUserState } from './data/firebase.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: '/login',
            component: () => import("./views/LoginPage.vue")
        },
        {
            path: "/register",
            component: () => import("./views/RegisterPage.vue")
        },
        {
            path: "/dashboard",
            component: () => import("./views/DashboardPage.vue"),
            children: [
                //Server
                {
                    path: "/dashboard/server/infos",
                    component: () => import("./views/dashboard/server/InfosPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "/dashboard/server/users",
                    component: () => import("./views/dashboard/server/UserPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                //Website
                {
                    path: "/dashboard/web/infos",
                    component: () => import("./views/dashboard/website/InfosPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "/dashboard/web/users",
                    component: () => import("./views/dashboard/website/UserPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                //Discord
                {
                    path: "/dashboard/discord/infos",
                    component: () => import("./views/dashboard/discord/InfosPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                },
                {
                    path: "/dashboard/discord/users",
                    component: () => import("./views/dashboard/discord/UserPanel.vue"),
                    meta: {
                        requiresAuth: true
                    }
                }
            ],
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/profile",
            component: () => import("./views/ProfilePage.vue"),
            meta: {
                requiresAuth: true
            }
        },
    ]
});

router.beforeEach(async (to, _from, next) => {
    const isAuth = await getUserState();

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if(requiresAuth && !isAuth) next('');
    else next();
});

export default router