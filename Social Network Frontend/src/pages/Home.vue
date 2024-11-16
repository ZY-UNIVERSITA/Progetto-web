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
        posts: null as Post | null
        }
    },
    inject: [
        "provideUserInfo",
    ],
    computed: {
        axiosCompleted(): User | null {
            if (typeof this.provideUserInfo === "function") {
                const userData: User | null = this.provideUserInfo();
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
        }
    },
    mounted() {
        this.getPopularPosts();
    }
    });
    </script>

<template>
    <template v-if="axiosCompleted">
        <p>Welcome {{ axiosCompleted.username }}</p>
        
    </template>
    <template v-else>
        <section id="popularPosts">
            <template v-for="post in posts">
                <singlePostComponent :post="post"></singlePostComponent>
            </template>
        </section>
    </template>
</template>