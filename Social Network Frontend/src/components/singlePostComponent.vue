<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Post, PostImages, UserToken } from '../utils/types';
    import axios from 'axios';

    export default defineComponent({
        data() {
            return {
                addedLike: false as boolean,
                images: [] as PostImages[]
            }
        },
        props: {
            post: {
                type: Object as PropType<Post>,
                required: true
            },
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
            mode: String
        },
        methods: {
            async like(/*event: Event*/): Promise<void> {
                this.addedLike = !this.addedLike;

                if (this.user != undefined) {
                    
                    try {
                        if (this.addedLike) {
                            await axios.post("/api/post/like/add", {
                                post_id: this.post.post_id
                            });
                            console.log("Like messo");
                        } else {
                            await axios.post("/api/post/like/remove", {
                                post_id: this.post.post_id
                            });
                            console.log("Like rimosso");
                        }
                        
                    } catch (e: any) {
                        console.error(e);
                    }
                }
            },
            async getPostImages(): Promise<void> {
                try {
                    const result = await axios.get("/api/post/images/", {
                        params: {
                            post_id: this.post.post_id
                        }
                    });
                    this.images = result.data;
                } catch (e: any) {
                    console.error(e);
                }
            }
        }, mounted() {
            this.addedLike = this.post.post_liked == 1 ? true : false;
            this.getPostImages();
        }
    });
  </script>

<template>
    <article :id="post?.post_id" :class="`${mode}-mode`">
        <header class ='profileHeader'>
            <template v-if="post.profile_picture">
                <img class="profilePicture" :src="'/images/profile_photo/' + post?.username + '.jpg'" alt="profileImage" />
            </template>
            <template v-else>
                <img class="profilePicture" :src="'/images/profile_photo/vite.svg'" alt="profileImage" />
            </template>
            <p class="full-name">
                {{ post.full_name }}
                <RouterLink :to="'/user/' + post?.username">{{ "@" + post?.username }}</RouterLink>
            </p>
        </header>

        <section>
            <p class="flex-item">{{ post?.content }}</p>

            <template v-if="images.length > 0">
                <template v-for="image in images">
                    <img class="" :src="'/usersUploads/' + image.url" alt="postImage"/>
                </template>
            </template>

            <p>{{ post.created_at }}</p>

            <!-- click.stop permette di mettere like senza andare al post-->
            <svg v-on:click.stop="like" id="heart" class="heart" :class="{'red pulse': addedLike}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            
                
            </svg>

            <svg id="comment" width="35px" fill="black" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            
            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path>

        </svg>

        </section>
    </article>
</template>

<style lang="css" scoped>
    img {
        width: 50%
    }

    #comment {
        fill: white;
    stroke: black;
    }
</style>

