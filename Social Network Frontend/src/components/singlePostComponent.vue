<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Post, PostImages, UserToken } from '../utils/types';
import axios from 'axios';

export default defineComponent({
    data() {
        return {
            addedLike: false as boolean,
            images: [] as PostImages[],
            showMenu: false,
            url: "" as string,
        };
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
        },
        dateFormat(): string {
            let returnValue: string;

            let dateMilliseconds: number = Date.now() - new Date(this.post.created_at as Date).getTime();

            let days: number = Math.round(dateMilliseconds / (1000 * 60 * 60 * 24));
            let hours: number = Math.round(dateMilliseconds / (1000 * 60 * 60));
            let minutes: number = Math.round(dateMilliseconds / (1000 * 60));
            let seconds: number = Math.round(dateMilliseconds / (1000));

            if (seconds < 60) {
                returnValue = seconds + " seconds ago";
            } else if (minutes < 60) {
                returnValue = minutes + " minutes ago";
            } else if (hours < 24) {
                returnValue = hours + " hours ago";
            } else if (days < 7) {
                returnValue = days + " days ago";
            } else {
                return this.datePadding(new Date(this.post.created_at as Date));
            }

            return returnValue.toString();
        },
        datePadding(number: Date): string {
            // se uno dei valori della data, es. secondi è a singola cifra allora aggiungi degli "0" all'inizio
            let dateString: string = number.getFullYear() +
                "-" + (number.getMonth() + 1).toString().padStart(2, "0") +
                "-" + number.getDate().toString().padStart(2, "0") +
                " " + number.getHours().toString().padStart(2, "0") +
                ":" + number.getMinutes().toString().padStart(2, "0") +
                ":" + number.getSeconds().toString().padStart(2, "0");

            return dateString;
        },
        clearImages() {
            this.images = []; // Svuota le immagini localmente
        },


        toggleMenu() {
            this.showMenu = !this.showMenu;
        },

        // Modifica post
        editPost(postId: string) {
            console.log('Modifica post:', postId);
            // Qui puoi aprire una modale o navigare a una pagina di modifica
        },

        // Elimina post
        async deletePost(postID: string) {
            if (confirm('Sei sicuro di voler eliminare questo post?')) {
                try {
                    console.log(postID);
                    await axios.delete(`/api/post/${postID}`);
                    window.location.reload();

                } catch (e: any) {
                    console.error("Error deleting post: ", e);
                }
            }
        },

        // Chiude il menu se si clicca fuori
        closeMenu(event: any) {
            if (this.showMenu && !event.target.closest('.dropdown')) {
                this.showMenu = false;
            }
        },

        getURL(): void {
            this.url = this.$route.path;
        }
    }, mounted() {
        this.addedLike = this.post.post_liked == 1 ? true : false;
        this.getPostImages();
        this.getURL()
    }
});
</script>

<template>
    <article :id="post?.post_id" :class="`${mode}-mode`">
        <header class='profileHeader'>
            <template v-if="post.profile_picture">
                <figure>
                    <img class="profilePicture" :src="'/profile_photo' + post?.username + '.png'" alt="profileImage" />
                </figure>
            </template>
            <template v-else>
                <img class="profilePicture" :src="'/images/profile_photo/vite.svg'" alt="profileImage" />
            </template>

            <p class="full-name">
                {{ post.full_name }} 
                <RouterLink :to="'/user/' + post?.username">{{ "@" + post?.username }}</RouterLink>
            </p>

            <!-- Dropdown Menu con Pulsante a Tre Punti -->
            <nav class="dropdown" v-if="url == '/profile'">
                <button class="dots-btn" @click.stop="toggleMenu">
                    <svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path
                                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path
                                d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </g>
                    </svg>
                </button>

                <!-- Menu a tendina con ruoli ARIA -->
                <menu v-if="showMenu" class="dropdown-menu" >
                    <li>
                        <button @click="editPost(post?.post_id)">Modify post</button>
                    </li>
                    <li>
                        <button @click="deletePost(post?.post_id)">Delete post</button>
                    </li>
                </menu>
            </nav>
        </header>

        <section>
            <p class="content">{{ post?.content }}</p>

            <template v-if="images.length > 0">
                <template v-for="image in images">
                    <img class="user_uploaded_image" :src="'/usersUploads/' + image.url" alt="postImage" />
                </template>
            </template>

            <p>{{ dateFormat() }}</p>

            <svg v-on:click.stop="like" class="heart" :class="{ 'red pulse': addedLike }" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            <svg class="commentIcon" width="35px" fill="black" viewBox="0 0 24 24" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor"
                    stroke-linejoin="round" stroke-width="2"></path>
            </svg>

        </section>
    </article>
</template>

<style lang="css" scoped>
.profileHeader {
    display: flex;
    align-items: center;
}

.full-name {
    box-sizing: border-box;
    margin: 0 1%;
    font-weight: bold;
    display: flex;
    align-items: center;

    a {
        text-decoration: none;
        color: inherit;
    }
}

.user_uploaded_image {
    width: 50%;
}

.profileHeader>nav {
    margin-left: auto;
}

/* Contenitore del menu */

</style>