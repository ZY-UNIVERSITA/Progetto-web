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
                const results: any = await axios.get("/api/popularPosts");
                this.posts = results.data;
            }, 
            async getPopularPersonalizedPost() {
                const results: any = await axios.get("/api/popularPosts/loggedUser");
                this.posts = results.data;
            }
        },
        mounted() {
            if (this.user !== null) {
                console.log(this.user);
                this.getPopularPersonalizedPost();
            } else {
                console.log("not logged")
                this.getPopularPosts(); 
            }
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