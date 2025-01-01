<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, User, UserToken, Comment } from '../utils/types';
import SinglePostComponent from '../components/singlePostComponent.vue';
import ProfileBanner from '../components/ProfileBanner.vue';
import type { ComponentPublicInstance } from 'vue';

export default defineComponent({
    components: {
        SinglePostComponent,
        ProfileBanner
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
            tabs: ["Posts", "Comments" ],
            activeTab: "Posts",

            comments: [] as Comment[],

            userProfile: null as User | null
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
        async getComments() {
            try {
                const results: any = await axios.get('/api/comments/user/' + this.user.username);
                this.comments = results.data;
            } catch (e: any) {
                console.error(e);
            }
        },
        async getUserProfile() {
            if (this.user !== null) {
                try {
                    const profile: any = await axios.get("api/user/" + this.user.username);
                    this.userProfile = profile.data[0];
                } catch (e: any) {
                    console.error(e);
                }
            }
        },
        async deletePost(postID: string, index: number) {
            try {
                console.log(postID);
                await axios.delete(`/api/post/${postID}`);
                this.posts = this.posts.filter(post => post.post_id !== postID); // Rimuovi il post localmente

                // Notifica al componente figlio di svuotare le immagini
                const child = (this.$refs.singlePostComponents as unknown as ComponentPublicInstance<typeof SinglePostComponent>[])[index];
                if (child) {
                    child.clearImages();
                }
            } catch (e: any) {
                console.error("Error deleting post: ", e);
            }
        },
        async deleteComment(commentID: number) {
            try {
                console.log(commentID);
                await axios.delete(`/api/comment/${commentID}`);
                this.comments = this.comments.filter(comment => comment.comment_id !== commentID); // Rimuovi il commento localmente
            } catch (e: any) {
                console.error("Error deleting comment: ", e);
            }
        },
        goToPost(postID: string) {
            this.$router.push({
                name: 'SinglePost',
                params: { "id": postID }
            });
        },
        settings() {
            this.$router.push({ name: 'Settings' });
        }
    },
    created() {
        if (this.user !== null) {
            this.getUserProfile();
            this.getPosts();
            this.getComments();
        }
    }
});
</script>

<template>
    <template v-if="userProfile">
        <ProfileBanner :user="user" :userProfile="userProfile" :toggleTheme="toggleTheme" :mode="mode"></ProfileBanner>

        <div class="buttons-profile">
        <section class="theme-toggle-container">
            <label for="theme-toggle" class="theme-label">Change Theme</label>
            <label class="switch">
                <input type="checkbox" id="theme-toggle" :checked="mode === 'light'" @change="toggleTheme" />
                <span class="slider"></span>
            </label>
        </section>

        <button @click="settings" class="set-btn">Settings</button>
        </div>

        <section class="profile-tabs">
            <!-- Tab dinavigazione -->
            <section class="tab-navigation">
                <button v-for="tab in tabs" @click="activeTab = tab" :class="[
                    `${mode}-mode`,
                    { 'active-light': mode === 'light' && activeTab === tab },
                    { 'active-dark': mode === 'dark' && activeTab === tab }
                ]">
                    {{ tab }}
                </button>
            </section>

            <section class="tab-content" :class="`${mode}-mode`">
                <template v-if="activeTab === 'Posts'">
                    <h2>Posts</h2>
                    <section id="posts">
                        <template v-for="(post, index) in posts">
                            <div class="post-container">
                                <SinglePostComponent ref="singlePostComponents" class="post" :post="post" :user="user" :class="`${mode}-mode`"
                                    v-on:click="goToPost(post.post_id)"></SinglePostComponent>
                                <button @click="deletePost(post.post_id, index)" class="delete-btn">Delete</button>
                            </div>
                        </template>
                    </section>
                </template>

                <template v-if="activeTab === 'Comments'">
                    <section id="comments">
                        <h2>Comments</h2>
                        <template v-for="comment in comments">
                            <article class="comment" :class="`${mode}-mode`">
                                <p>{{ comment.content }}</p>
                                <button @click="deleteComment(comment.comment_id)" class="delete-btn">Delete</button>
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
