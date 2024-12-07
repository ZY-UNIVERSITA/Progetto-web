<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, UserSearch, UserToken     } from '../utils/types';
    import singlePostComponent from '../components/SinglePostComponent.vue';

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
                users: [] as UserSearch[],
                posts: [] as Post[],
                searchQuery: "" as String
            }
        },
        watch: {
          searchQuery() {
            this.getUsersSearch();
          }
        },
        methods: {
            async getUsersSearch() {
                if (this.searchQuery !== "") {
                        try {
                        const results: any = await axios.get("/api/search/" + this.searchQuery);
                        this.users = results.data[0];
                        this.posts = results.data[1];
                    } catch (e: any) {
                        console.error(e);
                    }
                } else {
                    this.users = [];
                    this.posts = [];
                }
            },
            goToPost(postID: string) {
                this.$router.push({ 
                    name: 'SinglePost', 
                    params: { "id": postID }
                });
            }
        },
    });
</script>

<template>
    <section class="search-container">
        <!-- Casella di ricerca -->
        <!-- <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Search..."/> -->
        <form @submit.prevent="">  
            <input type="search" v-model="searchQuery" placeholder="Search..."/>
        </form>

        <section id="userResults">
            <template v-if="users[0] !== undefined" v-for="user in users">
                <p>{{ user.full_name }} @{{ user.username }}</p>
            </template>
        
            <template v-else>
                <p>No users found.</p>
            </template>
        </section>
        
        <section id="contentResults">
            <template v-if="posts[0] !== undefined" v-for="posts in posts">
                <p>{{ posts.content }}</p>
            </template>
        
            <template v-else>
                <p>No posts found.</p>
            </template>
        </section>
    </section>
  </template>