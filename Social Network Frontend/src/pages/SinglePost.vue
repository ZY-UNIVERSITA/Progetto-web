<script lang="ts">
    import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, UserToken } from '../utils/types';
import singlePostComponent from '../components/singlePostComponent.vue';
import NotFound from './NotFound.vue';
import CommentComponent from '../components/CommentComponent.vue';

    export default defineComponent({
        components: { 
            singlePostComponent,
            NotFound,
            CommentComponent
        },
        props: {
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
        },
        data() {
            return {
                post: null as Post | null,
                loading: true as boolean,
            }
        },
        methods: {
            async getPostByID() {
                try {
                    this.loading = true;
                    const results: any = await axios.get("/api/post/" + this.$route.params.id);
                    this.post = results.data;
                } catch (e: any) {
                    console.error(e);
                }

                // Simula un ritardo per evitare che la pagina carichi se non ci sono ritardi nella query
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
            },
        },
        // Vue riusa lo stesso componente quindi se si cambia id del post potrebbe non funzionare
        // Si crea un watch sui parametri del link
        watch: {
            '$route.params': {
                handler() {
                    // resetta il post
                    this.post = null;
                    // Fai una nuova fetch
                    this.getPostByID();
                },
                // Esegue la funzione al caricamento del componente ed è come se this.getPostByID() fosse inserito in created()
                immediate: true,
            },
        },
    });
</script>

<template>
    <section id="post">
        <h2>Singolo post</h2>
        <template v-if="loading">
            <p>Page is loading...</p>
        </template>
        <template v-else>
            <template v-if="post">
                <singlePostComponent :post="post" :user="user"></singlePostComponent>
                <form action="/api/post/addComment/" method="POST" enctype="application/x-www-form-urlencoded">
                    <input type="hidden" name="post_id" :value="post.post_id">
                    <label for="postComment" class="visually-hidden">Your comment</label>
                    <textarea id="postComment" name="post_comment" placeholder="Enter a comment..." required></textarea>
                    <input type="submit" value="Send the comment">
                </form>
                <CommentComponent :post="post" :user="user"></CommentComponent>
            </template>
            <template v-else>
                <NotFound></NotFound>    
            </template>
        </template>
    </section>
</template>

<style lang="css" scoped>
#post {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

form {
  width: 100%;
}

textarea {
  width: 100%;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0, 0, 0, 0);
    overflow: hidden;
    white-space: nowrap;
}
</style>
