import { createRouter, createWebHistory } from 'vue-router'
import { getUserState, getUserRoles } from './data/firebase.ts';

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
                requiresAuth: true,
                requiredRole: 'Administrateur'
            }
        },
        {
            path: "/profile",
            component: () => import("./views/ProfilePage.vue"),
            meta: {
                requiresAuth: true,
                requiredRole: 'Modérateur'
            }
        },
    ]
});

router.beforeEach(async (to, _from, next) => {
    const user = await getUserState();

    if (to.meta.requiresAuth && !user) {
        next('/login'); // Rediriger vers la page de connexion si non connecté
    } else if (to.meta.requiredRole && user) {
        const roles = await getUserRoles(user.uid); // Récupère un tableau de rôles
        if (!roles.includes(to.meta.requiredRole)) {
            next('/unauthorized'); // Rediriger si l'utilisateur n'a pas le bon rôle
        } else {
            next(); // Continuer avec la navigation
        }
    } else {
        next(); // Continuer avec la navigation
    }
});

export default router