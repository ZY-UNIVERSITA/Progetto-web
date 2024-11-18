import { createApp } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import axios from 'axios';
import App from './App.vue'
import Home from './pages/Home.vue';
import NotFound from "./pages/NotFound.vue"
import Login from './pages/Login.vue';
import Profile from './pages/Profile.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home},
        { path: "/login", name: "Login", component: Login },
        { path: "/user/:username", component: Profile },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
});

router.beforeEach(async (to) => {
    await axios.get("/api/auth/profile");
});

createApp(App).use(router).mount('#app');
