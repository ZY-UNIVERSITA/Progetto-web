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
            searchQuery: "" as String,
            activeTab: 'users' as String,
        }
    },
    computed: {
        indicatorStyle() {
            // Calcola la posizione e la larghezza dinamicamente
            const tabCount = 2;  // Numero di tab (Utenti e Post)
            const tabWidth = 100 / tabCount;  // Percentuale della larghezza di ogni tab
            const translateX = this.activeTab === 'users' ? 0 : 100;

            return {
                width: `${tabWidth}%`,
                transform: `translateX(${translateX}%)`
            };
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
        },
        goToUser(username: string) {
            this.$router.push({
                name: 'SingleProfile',
                params: { "username": username }
            })
        }
    },
});
</script>

<template>
    <section class="search-container">
        <section class="search-form">
            <form @submit.prevent class="search-input-wrapper">
                <label for="searchInput" class="visually-hidden">Search</label>
                <input id="searchInput" type="search" v-model="searchQuery" placeholder="Cerca..."
                    class="search-input" />
            </form>
        </section>

        <!-- Sezione Tab con Stile Integrato -->
        <div class="tab-container">
            <div class="tabs-wrapper">
                <div class="tab" :class="[activeTab === 'users' ? 'active' : '', `${mode}-mode`]" @click="activeTab = 'users'" >
                    UTENTI
                </div>
                <div class="tab" :class="[activeTab === 'users' ? 'active' : '', `${mode}-mode`]" @click="activeTab = 'posts'">
                    POST
                </div>
            </div>
            <div class="active-indicator" :style="indicatorStyle" :class="`${mode}-mode`"></div>
        </div>

        <!-- Contenuto dei Tab -->
        <section v-if="activeTab === 'users'" id="userResults" class="results-section">
            <template v-if="users.length > 0">
                <h2>Utenti Trovati</h2>
                <ul class="user-list">
                    <li v-for="user in users" :key="user.username" class="user-card" :class="`${mode}-mode`">
                        <figure class="user-avatar">
                            <img :src="user.profile_picture ? 'siteUpload/profile_photo/' + user.profile_picture : '/siteUpload/profile_photo/vite.svg'" alt="Avatar" class="avatar-image" />
                        </figure>
                        <article class="user-info" @click="goToUser(user.username)">
                            <p class="user-name">{{ user.full_name }}</p>
                            <p class="user-username">@{{ user.username }}</p>
                        </article>
                    </li>
                </ul>
            </template>
            <p v-else class="no-results">Nessun utente trovato.</p>
        </section>

        <section v-if="activeTab === 'posts'" id="contentResults" class="results-section">
            <template v-if="posts.length > 0">
                <h2>Post Trovati</h2>
                <ul class="post-list">
                    <li v-for="post in posts" :key="post.post_id" class="post-card" :class="`${mode}-mode`">
                        <article class="post-content-container" @click="goToPost(post.post_id)">
                            <p class="post-author">@{{ post.username }}</p>
                            <p class="post-content">{{ post.content }}</p>
                        </article>
                    </li>
                </ul>
            </template>
            <p v-else class="no-results">Nessun post trovato.</p>
        </section>
    </section>
</template>

<style lang="css" scoped>
.post-author {
    font-size: 25px
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    white-space: nowrap;
}

#searchInput::placeholder {
    color: black;
}
</style>
