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
        },
        methods: {
            like(event: Event): void {
                const elem = event.currentTarget as SVGElement;
                elem.classList.toggle("red");
                elem.classList.toggle("pulse");
            },
            
        }
    });
  </script>

<template>
    <article :id="post?.post_id">
        <header>
            <h2>Post</h2>
            <template v-if="post?.profile_picture">
                <img class="profilePicture" :src="'/images/profile_photo/' + post?.username + '.jpg'" alt="profileImage" />
            </template>
            <template v-else>
                <img class="profilePicture" :src="'/images/profile_photo/vite.svg'" alt="profileImage" />
            </template>
            <p>
                {{ post.full_name }}
                <RouterLink :to="'/user/' + post?.username">{{ "@" + post?.username }}</RouterLink>
            </p>
        </header>

        <section>
            <p class="flex-item">{{ post?.content }}</p>

            <template v-if="post.profile_picture">
                <img class="" :src="'/img/posts/' + post.post_id + '.png'" alt="postImage"/>
            </template>

            <p>{{ post.created_at }}</p>

            <!-- click.stop permette di mettere like senza andare al post-->
            <svg v-on:click.stop="like" id="heart" class="heart" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
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

    .heart {
        fill: white;
        stroke: black;
        stroke-width: 2;
        cursor: pointer;
        transition: transform 0.5s, fill 0.5s, stroke-width 0.5s;
        width: 35px;
        height: 35px;
    }

    .heart.red {
            fill: red;
            stroke-width: 0;
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.5);
            }
            100% {
                transform: scale(1);
            }
        }

        .heart.pulse {
            animation: pulse 0.5s ease;
        }

        a {
            text-decoration: none;
        }
</style>