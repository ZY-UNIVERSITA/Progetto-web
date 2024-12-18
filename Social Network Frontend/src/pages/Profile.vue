<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, UserToken } from '../utils/types';
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
            posts: [] as Post[],
            tabs: ["Posts", "Comments", "Shared Posts"],
            activeTab: "Posts",

            comments: [
                { id: 1, text: "prova 1" },
                { id: 2, text: "prova 2." },
            ],
            sharedPosts: [
                { id: 1, content: "prova prova 1" },
                { id: 2, content: "prova prova 2." },
            ],
        }
    },
    methods: {
        async getPosts() {
            try {
                const results: any = await axios.get('/api/posts/user/' + this.user.username);
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

    <template v-if="user">
        <section id="user-profile-header">
            <img src="/images/profile_photo/vite.svg" alt="Immagine Profilo" class="profile-img">
            <div class="user-info">
                <h2 class="username">{{ user.username }}</h2>
                <p>{{ }}</p>
            </div>
        </section>

        <section class="theme-toggle-container">
            <label for="theme-toggle" class="theme-label">Change Theme</label>
            <label class="switch">
                <input type="checkbox" id="theme-toggle" :checked="mode === 'light'" @change="toggleTheme" />
                <span class="slider"></span>
            </label>
        </section>

        <section class="profile-tabs">
            <!-- Tab dinavigazione -->
            <section class="tab-navigation">
                <button v-for="tab in tabs" @click="activeTab = tab"
                :class="[
                    `${mode}-mode`,
                    { 'active-light': mode === 'light' && activeTab === tab },
                    { 'active-dark' : mode === 'dark' && activeTab === tab }
                    ]">
                    {{ tab }}
                </button>
            </section>

            <section class="tab-content">
                <template v-if="activeTab === 'Posts'">
                    <h2>Posts</h2>
                    <section id="posts">
                        <template v-for="post in posts">
                            <singlePostComponent class="post" :post="post" :user="user"
                                v-on:click="goToPost(post.post_id)"></singlePostComponent>
                        </template>
                    </section>
                </template>

                <template v-if="activeTab === 'Comments'">
                    <section id="comments">
                        <h2>Comments</h2>
                        <template v-for="comment in comments">
                            <article class="comment">
                                <p>{{ comment.text }}</p>
                            </article>
                        </template>
                    </section>
                </template>

                <template v-if="activeTab === 'Shared Posts'">
                    <section id="shared_posts">
                        <h2>Shared Posts</h2>
                        <template v-for="sharedPost in sharedPosts">
                            <article class="shared-post">
                                <p>{{ sharedPost.content }}</p>
                        </article>
                        </template>
                    </section>
                </template>
            </section>
        </section>

    </template>
    <template v-else>
        <p>User personal page. Login to continue.</p>
    </template>

</template>
