<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from 'axios';
    import { Post, User } from '../utils/types';
    import singlePostComponent from '../components/singlePostComponent.vue';
    import notFound from './NotFound.vue';

    export default defineComponent({
        components: { 
            singlePostComponent,
            notFound,
        },
        props: {
            user: {
                type: Object as PropType<User | null>,
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
                }, 2500);
            }
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
                // Esegue la funzione al caricamento del componente ed è come fosse created()
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
                <singlePostComponent :post="post"></singlePostComponent>
            </template>
            <template v-else>
                <notFound></notFound>    
            </template>
        </template>
    </section>
</template>
