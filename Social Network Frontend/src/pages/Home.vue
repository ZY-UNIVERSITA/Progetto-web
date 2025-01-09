<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, UserToken } from '../utils/types';
    import SinglePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
        components: { 
            SinglePostComponent
        },
        props: {
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
            mode: String
        },
        data() {
            return {
                posts: [] as Post[],
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
            },
            goToPost(postID: string) {
                this.$router.push({ 
                    name: 'SinglePost', 
                    params: { "id": postID }
                });
            },
        },
        created() {
            this.getPopularPosts(); 
        },
        mounted() {
            
        }
    });
</script>

<template>
    <div class="auth-buttons">
        <button v-if="!user" @click="login" :class="`${mode}-mode`">Login</button>
        <button v-else @click="logout" :class="`${mode}-mode`">Logout</button>
    </div>
    <section id="popularPosts">
        <h2>Popular posts</h2>
        <template v-for="post in posts">
            <SinglePostComponent :post="post" :user="user" :mode="`${mode}`" v-on:click="goToPost(post.post_id)"></SinglePostComponent>
        </template>
    </section>
</template>
