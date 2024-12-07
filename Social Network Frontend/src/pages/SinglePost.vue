<script lang="ts">
    import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, UserToken } from '../utils/types';
import singlePostComponent from '../components/SinglePostComponent.vue';
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
        <template v-if="loading">
            <p>Page is loading...</p>
        </template>
        <template v-else>
            <template v-if="post">
                <singlePostComponent :post="post" :user="user"></singlePostComponent>
                <form action="/api/post/addComment/" method="POST" enctype="application/x-www-form-urlencoded">
                    <input type="hidden" name="post_id" :value="post.post_id">
                    <textarea name="post_comment" placeholder="Enter a comment..." required></textarea>
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
