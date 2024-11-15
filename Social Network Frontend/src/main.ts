import { createApp } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './pages/Home.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home}
    ]
});

createApp(App).use(router).mount('#app');
