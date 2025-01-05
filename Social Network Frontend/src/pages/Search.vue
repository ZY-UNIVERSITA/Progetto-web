<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, UserSearch, UserToken } from '../utils/types';
import SinglePostComponent from '../components/singlePostComponent.vue';

export default defineComponent({
    components: {
        SinglePostComponent
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
        <section class="search-form">
            <form @submit.prevent  class="search-input-wrapper">
                <input type="search" v-model="searchQuery" placeholder="Cerca..." class="search-input" />
            </form>
        </section>

        <section id="userResults" class="results-section">
            <template v-if="users[0] !== undefined">
                <h2 >Utenti Trovati</h2>
                <ul class="user-list">
                    <li v-for="user in users" :key="user.username" class="user-card">
                        <figure class="user-avatar">
                            <img :src="'/siteUpload/profile_photo/vite.svg'" alt="Avatar" class="avatar-image" />
                        </figure>
                        <article class="user-info">
                            <p class="user-name">{{ user.full_name }}</p>
                            <p class="user-username">@{{ user.username }}</p>
                        </article>
                    </li>
                </ul>
            </template>
            <template v-else>
               <p class="no-results">Nessun utente trovato.</p>
        </template>
        </section>

        <section id="contentResults" class="results-section">
            <h2 v-if="posts[0] !== undefined">Post Trovati</h2>
            <ul v-if="posts[0] !== undefined" class="post-list">
                <li v-for="post in posts" :key="post.post_id" class="post-card">
                    <article class="post-content-container" @click="goToPost(post.post_id)">
                        <p class="post-author">{{ post.username }}</p>
                        <p class="post-content">{{ post.content }}</p>
                    </article>
                </li>
            </ul>
            <template v-else>
                <p class="no-results">Nessun post trovato.</p>
            </template>
        </section>
    </section>
</template>
