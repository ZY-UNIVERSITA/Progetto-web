<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from 'axios';
    import { Post, User } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
    components: {
        singlePostComponent, 
    },
    data() {
        return {
        posts: null as Post | null,
        isUserLoggedIn: false
        }
    },
    inject: [
        "provideUserInfo",
    ],
    computed: {
        axiosCompleted(): User | null {
            if (typeof this.provideUserInfo === "function") {
                const userData: User | null = this.provideUserInfo();
                if (userData) { this.isUserLoggedIn = true; }
                else { this.isUserLoggedIn = false; }
                this.getPopularPosts();
                return userData;
            }
            return null;
        }
    },
    methods: {
        async getPopularPosts() {
            const results: any = await axios.get("/api/popularPosts");
            this.posts = results.data;
        },
        logout() {
            this.isUserLoggedIn = false;
            axios.post("/api/auth/logout").then(() => { this.isUserLoggedIn = false; })
        },
        login() {
            this.isUserLoggedIn = true;
            axios.post("/api/auth/login").then(() => { this.isUserLoggedIn = true; });
        }
    },
    mounted() {
        this.getPopularPosts();
    }
    });
    </script>

<template>
    <header>
        <h1>DailyDot</h1>
        <div class="auth-buttons">
          <button v-if="!isUserLoggedIn" @click="login">Login</button>
          <button v-if="isUserLoggedIn" @click="logout">Logout</button>
        </div>
    </header>

    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post"></singlePostComponent>
        </template>
    </section>
</template>
