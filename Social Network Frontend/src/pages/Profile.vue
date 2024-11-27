<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, UserToken     } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
        components: { 
            singlePostComponent
        },
        props: {
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
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
            goToPost(postID: string) {
                this.$router.push({ 
                    name: 'SinglePost', 
                    params: { "id": postID }
                });
            }
        },
        created() {
            this.getPopularPosts(); 
        }
    });
</script>

<template>
    <!--<img src="path_to_profile_image.jpg" alt="Immagine Profilo" class="profile-img">-->
    <h2 class="username">Username</h2>
    
    <label class="switch">
        <input type="checkbox" id="theme-toggle">
        <span class="slider"></span>
    </label>

    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post" :user="user" v-on:click="goToPost(post.post_id)"></singlePostComponent>
        </template>
    </section>
</template>
/