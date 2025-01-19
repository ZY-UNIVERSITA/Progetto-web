<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, User, UserToken, Comment } from '../utils/types';
import SinglePostComponent from '../components/singlePostComponent.vue';
import ProfileBanner from '../components/ProfileBanner.vue';
import ModifyPost from '../components/ModifyPost.vue';

export default defineComponent({
    components: {
        SinglePostComponent,
        ProfileBanner,
        ModifyPost
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
            tabs: ["POSTS", "COMMENTS"],
            activeTab: "POSTS",

            comments: [] as Comment[],

            userProfile: null as User | null,
            modifyPost: false as boolean,
            motifyPostContent: null as Post | null,
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
        },

        notifyParent(postContent: Post) {
            this.motifyPostContent = postContent;
            this.modifyPost = true;
        },

        closeModifyView() {
            this.motifyPostContent = null;
            this.modifyPost = false;
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
                    <span class="slider profile-slider"></span>
                </label>
            </section>

            <button @click="settings" class="set-btn" :class="`${mode}-mode`">Settings</button>
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
                <template v-if="activeTab === 'POSTS'">
                    <section id="posts">
                        <template v-for="(post, index) in posts">
                            <div class="post-container">
                                <SinglePostComponent ref="singlePostComponents" class="post" :post="post" :user="user"
                                    :class="`${mode}-mode`" v-on:click="goToPost(post.post_id)" @notify="notifyParent">
                                </SinglePostComponent>
                                <!-- <button @click="deletePost(post.post_id, index)" class="delete-btn">Delete</button> -->
                            </div>
                        </template>
                    </section>
                </template>

                <template v-if="activeTab === 'COMMENTS'">
                    <section id="comments">
                        <template v-for="comment in comments">
                            <article class="comment" :class="`${mode}-mode`">
                                <p>{{ comment.content }}</p>
                                <button @click="deleteComment(comment.comment_id)" class="delete-btn" :class="`${mode}-mode`">Delete</button>
                            </article>
                        </template>
                    </section>
                </template>
            </section>
        </section>

    </template>
    <template v-else>
        <section class="new-post" :class="`${mode}-mode`">
            <article class="error-message">
                <p>User personal page. Login to continue.</p>
            </article>
        </section>
    </template>

    <template v-if="modifyPost && motifyPostContent !== null">
        <section id="modifyPost_section">
            <ModifyPost :user="user" :post="motifyPostContent" @notify="closeModifyView"></ModifyPost>
        </section>
    </template>
</template>

<style lang="scss" scoped>
.error-message {
    text-align: center;
    font-weight: bold;
    margin-top: 1rem;
}

#modifyPost_section {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(48, 41, 41, 0.5); 
  z-index: 1000;
  padding: 0; 
  box-sizing: border-box;
  overflow: hidden; 
}

#modify_post {
  position: absolute; 
  top: 5%; 
  left: 5%; 
  right: 5%; 
  bottom: 5%; 
  background-color: rgb(63, 58, 58); 
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto; 
}






</style>