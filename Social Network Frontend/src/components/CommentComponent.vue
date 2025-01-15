<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Comment, Post, UserToken } from '../utils/types';
    import axios from 'axios';

    export default defineComponent({
        data() {
            return {
                comments: [] as Comment[]
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
        },
        methods: {
            async getComments(): Promise<void> {
                try {
                    const result = await axios.get("/api/post/comments/" + this.post.post_id);
                    this.comments = result.data;
                } catch (e: any) {
                    console.error(e);
                }
            }
        }, mounted() {
            this.getComments();
        }
    });
  </script>

<template>
    <section id="comments">
        <template v-for="comment in comments" v-bind:key="comment.comment_id">
            <article>
                <section class="header">
                    <template v-if="comment.profile_picture">
                        <img class="profilePicture" :src="'/siteUpload/profile_photo/' + comment.profile_picture" alt="profileImage" />
                    </template>
                    <template v-else>
                        <img class="profilePicture" :src="'/images/profile_photo/vite.svg'" alt="profileImage" />
                    </template>
                    <p>{{ comment.full_name }} @{{ comment.username }}</p>
                </section>
                <section class="comments_body"> 
                    <p>{{ comment.content }}</p>
                    <p>{{ comment.created_at }}</p>
                </section>
            </article>
        </template> 
    </section>
</template>

<style lang="css" scoped>
.header {
    display: flex;
    align-items: center;
    
    .p {
        margin: 0;
        font-weight: bold;
        display: flex;
        align-items: center;

        a {
            text-decoration: none;
            color: inherit;
        }
    }
}
</style>
