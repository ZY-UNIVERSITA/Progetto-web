<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, User, UserToken } from '../utils/types';
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
        goToPost(postID: string) {
            this.$router.push({
                name: 'SinglePost',
                params: { "id": postID }
            });
        }
    },
    created() {
        if (this.user !== null) {
            this.getUserProfile();
            this.getPosts();
        }
    }
});
</script>

<template>
    <template v-if="userProfile">
        <section id="user-profile">
            <header id="user-profile-header">
                <section class="profile-header-bg">
                    <img src="/images/profile_banner/vue_banner.png" alt="user profile banner" />
                </section>
            </header>

            <main>
                <section class="user-info-section">
                    <section class="profile-picture-container">
                        <img :src="userProfile.profile_picture || '/images/profile_photo/default.svg'"
                            :alt="'Profile picture of ' + userProfile.full_name" class="profile-picture" />
                    </section>
                    <section class="user-details">
                        <h1 id="user-info">
                            {{ userProfile.full_name }}
                        </h1>
                        <p class="username">@{{ userProfile.username }}</p>
                    </section>
                </section>
                <section>
                    <p v-if="userProfile.bio" class="bio">{{
                        userProfile.bio }}</p>
                    <p v-if="userProfile.birth_date" class="birthdate">
                        Born on {{ new Date(userProfile.birth_date).toLocaleString() }}
                    </p>
                    <section class="profile-stats">
                        <p>
                            <span class="stat-label">Followers:</span>
                            <span class="stat-value">Follower count</span>
                        </p>
                        <p>
                            <span class="stat-label">Following:</span>
                            <span class="stat-value">Following count</span>
                        </p>
                    </section>
                </section>
            </main>
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
                <button v-for="tab in tabs" @click="activeTab = tab" :class="[
                    `${mode}-mode`,
                    { 'active-light': mode === 'light' && activeTab === tab },
                    { 'active-dark': mode === 'dark' && activeTab === tab }
                ]">
                    {{ tab }}
                </button>
            </section>

            <section class="tab-content">
                <template v-if="activeTab === 'Posts'">
                    <h2>Posts</h2>
                    <section id="posts">
                        <template v-for="post in posts">
                            <SinglePostComponent class="post" :post="post" :user="user"
                                v-on:click="goToPost(post.post_id)"></SinglePostComponent>
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

<style lang="css" scoped>
#user-profile {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    font-family: sans-serif;
}

#user-profile-header {
    position: relative;
    height: 100px;
    /* Ridotta l'altezza dell'header */
}

.profile-header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
}

.profile-header-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-picture-container {
    position: relative;
    width: 80px;
    /* Regola la dimensione dell'immagine */
    height: 80px;
    /* Regola la dimensione dell'immagine */
    border-radius: 50%;
    border: 4px solid white;
    overflow: hidden;
    margin-right: 20px;
    z-index: 1;
    flex-shrink: 0;
}

.profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

#user-info {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.username {
    color: #555;
    margin-bottom: 10px;
}

.bio {
    margin-bottom: 10px;
}

.birthdate {
    color: #777;
}

.profile-stats p {
    display: inline-block;
    margin-right: 1rem;
}
</style>