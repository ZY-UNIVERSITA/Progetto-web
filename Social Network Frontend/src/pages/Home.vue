<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, User } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';

    export default defineComponent({
        components: {
            singlePostComponent, 
        },
        props: {
            user: Object as PropType<User>
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
        },
        created() {
            this.getPopularPosts(); 
        },
    });
</script>

<template>
    <template v-if="user">
        <p>Welcome {{ user.username }}</p>
    </template>

    <template v-else>
        <p>Not welcome</p>
    </template>
    
    <section id="popularPosts">
        <template v-for="post in posts">
            <singlePostComponent :post="post"></singlePostComponent>
        </template>
    </section>
</template>