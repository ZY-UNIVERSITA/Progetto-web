<script lang="ts">
    import { defineComponent } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
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
                this.isUserLoggedIn = !!userData;
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
            this.$router.push({ name: 'Login' });
        }
    },
    mounted() {
        this.getPopularPosts();
    }
    });
    </script>

<template>
    <div class="auth-buttons">
        <button v-if="!isUserLoggedIn" @click="login">Login</button>
        <button v-if="isUserLoggedIn" @click="logout">Logout</button>
    </div>

    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post"></singlePostComponent>
        </template>
    </section>
</template>
