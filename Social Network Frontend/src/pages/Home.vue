<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { Post, User } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
        components: { singlePostComponent },
        props: {
            user: {
                type: Object as PropType<User | undefined>,
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
            logout() {
                axios.post("/api/auth/logout").then(() => { })
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
        <button v-if="user" @click="logout">Logout</button>
    </div>
    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post"></singlePostComponent>
        </template>
    </section>
</template>
