import { createApp } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue';
import NotFound from "./pages/NotFound.vue"
import Login from './pages/Login.vue';
import Profile from './pages/Profile.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home},
        { path: "/login", component: Login },
        { path: "/user/:username", component: Profile },
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
});

createApp(App).use(router).mount('#app');
