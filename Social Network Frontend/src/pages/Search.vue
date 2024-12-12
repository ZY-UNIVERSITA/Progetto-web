<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, UserSearch, UserToken } from '../utils/types';
import SinglePostComponent from '../components/SinglePostComponent.vue';

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
            <h2 v-if="users[0] !== undefined">Utenti Trovati</h2>
            <ul v-if="users[0] !== undefined" class="user-list">
                <li v-for="user in users" :key="user.username" class="user-card">
                    <figure class="user-avatar">
                        <img :src="'profileImage.png'" alt="Avatar" class="avatar-image" />
                    </figure>
                    <article class="user-info">
                        <p class="user-name">{{ user.full_name }}</p>
                        <p class="user-username">@{{ user.username }}</p>
                    </article>
                </li>
            </ul>
            <p v-else class="no-results">Nessun utente trovato.</p>
        </section>

        <section id="contentResults" class="results-section">
            <h2 v-if="posts[0] !== undefined">Post Trovati</h2>
            <ul v-if="posts[0] !== undefined" class="post-list">
                <li v-for="post in posts" :key="post.post_id" class="post-card">
                    <article class="post-content-container">
                        <p class="post-content">{{ post.content }}</p>
                    </article>
                </li>
            </ul>
            <p v-else class="no-results">Nessun post trovato.</p>
        </section>
    </section>
</template>

<style lang="css" scoped>
.search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.search-form {
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 5px;
    background-color: #fff;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px;
    font-size: 16px;
}

.search-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
}

.search-button:hover {
    background-color: #0056b3;
}

.results-section {
    width: 100%;
    max-width: 600px;
    margin-bottom: 20px;
}

.user-list,
.post-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0;
    /* Rimuovi il padding predefinito delle liste */
    margin: 0;
    /* Rimuovi il margin predefinito delle liste */
    list-style: none;
    /* Rimuovi i puntini predefiniti delle liste */
}

.user-card,
.post-card {
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 10px;
}

.user-avatar {
    margin-right: 10px;
}

.avatar-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}


.user-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.user-username {
    color: #888;
    font-size: 0.9em;
}

.post-content-container {
    width: 100%;
}

.post-content {
    font-size: 16px;
}


.no-results {
    color: #888;
    text-align: center;
}
</style>