import { createApp } from 'vue'
import { createRouter, createWebHashHistory, Router } from 'vue-router'
import axios from 'axios';
import App from './App.vue'
import Home from './pages/Home.vue';
import NotFound from "./pages/NotFound.vue"
import Login from './pages/Login.vue';
import Search from './pages/Search.vue';
import AddPost from './pages/AddPost.vue';
import SinglePost from './pages/SinglePost.vue';
import SingleProfile from './pages/SingleUser.vue';
import Profile from './pages/Profile.vue';
import Settings from './pages/Settings.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: Home },
        { path: "/login", name: "Login", component: Login },
        { path: "/user/:username", component: SingleProfile },
        { path: "/search", component: Search },
        { path: "/post", component: AddPost },
        { path: "/post/:id", name: "SinglePost", component: SinglePost },
        { path: "/profile", component: Profile },
        { path: "/settings", name: "Settings", component: Settings},
        { path: "/:pathMatch(.*)*", component: NotFound }
    ]
});

router.beforeEach(async (/*to*/) => {
    await axios.get("/api/auth/profile");
});

createApp(App).use(router).mount('#app');
