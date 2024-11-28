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
                type: Object as PropType<UserToken>,
                required: true,
            },
            mode: {
                type: String as PropType<'dark' | 'light'>,
                required: true,
            },
            toggleTheme: {
                type: Function as PropType<() => void>,
                required: true,
            },
        },
        data() {
            return {
                posts: [] as Post[],
            }
        },
        methods: {
            async getPosts() {
                try {
                    const results: any = await axios.get(`/api/posts/user/${this.user.user_id}`);
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
            this.getPosts(); 
        }
    });
</script>

<template>
    <!--<img src="path_to_profile_image.jpg" alt="Immagine Profilo" class="profile-img">-->
    <h2 class="username">{{user.username}}</h2>

    <label class="switch">
        <input type="checkbox" id="theme-toggle" :checked="mode === 'light'" @change="toggleTheme"/>
        <span class="slider"></span>
    </label>

    <section id="posts">
        <template v-for="post in posts">
            <singlePostComponent :post="post" :user="user" v-on:click="goToPost(post.post_id)"></singlePostComponent>
        </template>
    </section>
</template>
