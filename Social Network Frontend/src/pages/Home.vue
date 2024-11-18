<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, User } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
        components: { 
            singlePostComponent
        },
        props: {
            user: {
                type: Object as PropType<User | null>,
                required: false,
            },
        },
        data() {
            return {
                posts: [] as Post[]
            }
        },
        methods: {
            async getPopularPosts() {
                try {
                    const results: any = await axios.get("/api/popularPosts");
                    this.posts = results.data;
                } catch (e: any) {
                    console.error(e);
                }
            },
            async logout() {   
                try {
                    await axios.post("/api/auth/logout");
                    location.href="/"
                } catch (e: any) {
                    console.error(e);
                }
            },
            login() {
                this.$router.push({ name: 'Login' });
            }
        },
        created() {
            this.getPopularPosts(); 
        }
    });
</script>

<template>
    <div class="auth-buttons">
        <button v-if="!user" @click="login">Login</button>
        <button v-else @click="logout">Logout</button>
    </div>
    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post"></singlePostComponent>
        </template>
    </section>
</template>
