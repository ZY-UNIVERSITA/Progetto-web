import { createApp } from 'vue';
import { createRouter, createWebHashHistory, Router } from 'vue-router';
import App from './App.vue';
import Account from './pages/Account.vue';
import Home from './pages/Home.vue';
import UserProfile from './pages/UserProfile.vue';
import { User } from './utils/types';
import axios from 'axios';
import './style.css';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/account", component: Account },
        { path: "/user/:username", component: UserProfile },
    ]
});


router.beforeEach(async (to) => {
    const results = await axios.get("/api/auth/profile");
});


createApp(App).use(router).mount('#app');
