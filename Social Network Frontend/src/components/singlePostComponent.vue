<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { Post } from '../utils/types';

    export default defineComponent({
    data() {
      return {
      }
    },
    props: {
        post: {
            type: Object as PropType<Post>,
            required: true
        }
    }
    });
  </script>

<template>
    <article :id="post?.post_id">
        <header>
            <h2>Mhh</h2>
            <template v-if="post?.profile_picture">
                <img class="profilePicture" :src="'/img/profile_photo/' + post?.username + '.jpg'" alt="profileImage" />
            </template>
            <template v-else>
                <img class="profilePicture" :src="'/img/vite.svg'" alt="profileImage" />
            </template>
            <p>
                <RouterLink :to="'/user/' + post?.username">{{ "@" + post?.username }}</RouterLink>
            </p>
        </header>

        <section>
            <p class="flex-item">{{ post?.content }}</p>

            <!--
            <template v-if="post.media_url">
                <img class="postImages flex-item" :src="'/img/posts/' + post.post_id + '.png'" alt="postImage"/>
            </template>

            <svg v-on:click="like" id="heart" class="heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        -->
        </section>
    </article>
</template>

<style scoped>
    article {
        text-align: left;
        background-color: #1c314b;
        border-radius: 10px;
        margin: 1%;
        padding: 2.5%;
    }
</style>