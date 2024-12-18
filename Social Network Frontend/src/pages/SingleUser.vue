<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, User, UserToken } from '../utils/types';
    import singlePostComponent from '../components/SinglePostComponent.vue';
    import NotFound from './NotFound.vue';
import ProfileBanner from '../components/ProfileBanner.vue';

    export default defineComponent({
        components: { 
            singlePostComponent,
            NotFound,
            ProfileBanner
        },
        props: {
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
        },
        data() {
            return {
                posts: [] as Post[],
                userProfile: null as User | null,
            }
        },
        methods: {
            async fetchUserPosts() {
                try {
                    const profile = await axios.get("api/user/" + this.$route.params.username);
                    this.userProfile = profile.data[0];        
                    
                    if (this.userProfile !== null) {
                        console.log("io entro", this.userProfile);
                        const results: any = await axios.get("/api/posts/user/" + this.userProfile.username);
                        this.posts = results.data;
                    }
                } catch (e: any) {
                    console.log(e);
                }
            },
            goToPost(postID: string) {
                this.$router.push({ 
                    name: 'SinglePost', 
                    params: { "id": postID }
                });
            }
        },
        watch: {
            '$route.params': {
                handler() {
                    // resetta il post
                    this.posts = [];
                    this.userProfile = null;
                    // Fai una nuova fetch
                    this.fetchUserPosts();
                    console.log("faccio chiamata api");
                },
                immediate: true,
            },
        },
    });
</script>

<template>
    <section id="user_profile">
        <template v-if="userProfile">   
            <ProfileBanner :user="user"></ProfileBanner>

            <section>
                <template v-if="userProfile.visibility === 'private' && user === null">
                    <p>L'utente cercato è privato. Effettua il login oppure registrati per continuare.</p>
                </template>
                <template v-else v-for="post in posts">
                    <singlePostComponent :post="post" :user="user" v-on:click="goToPost(post.post_id)"></singlePostComponent>
                </template>
            </section> 

        </template>

        <template v-else>
            <NotFound></NotFound>    
        </template>
    </section>
</template>
