<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, User, UserToken } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';
    import NotFound from './NotFound.vue';

    export default defineComponent({
        components: { 
            singlePostComponent,
            NotFound,
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
                contatore: 0 as number,
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
                        console.log(results.data);
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

            <header>
                <template v-if="userProfile.profile_picture">
                    <img class="profilePicture" :src="'/images/profile_photo/' + userProfile.username + '.jpg'" alt="profileImage" />
                </template>
                <template v-else>
                    <img class="profilePicture" :src="'/images/profile_photo/vite.svg'" alt="profileImage" />
                </template>

                <p class="full-name">
                    {{ userProfile.full_name }}
                </p>
                <p>
                    {{ "@" + userProfile.username }}
                </p>
                <p> 
                    {{ userProfile.bio }}
                </p>
            </header>

            <section>
                <template v-if="userProfile.visibility === 'private' &&  user === null">
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
