import { createApp } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue';
import Account from './pages/Account.vue';
import UserProfile from './pages/UserProfile.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home},
        { path: "/account", component: Account },
        { path: "/user/:username", component: UserProfile },
    ]
});

createApp(App).use(router).mount('#app');
