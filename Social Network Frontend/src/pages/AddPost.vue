<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserToken, ImageFile } from '../utils/types';

export default defineComponent({
    props: {
        user: {
            type: Object as PropType<UserToken | null>,
            required: false,
        },
        mode: {
            type: String,
            default: 'light',
        },
    },
    data() {
        return {
            form: {
                postContent: '',
                visibility: 'public',
                images: [] as ImageFile[]
            },
        };
    },
    methods: {
        uploadImages(event: Event) {
            // leggi il tag che ha generato l'evento
            const target = event.target as HTMLInputElement;
            // operatore ternario di js per controllare se ci sonon i file caricati, se non ci sono file caricati allora ritorna un array vuoto
            const files = target.files ? Array.from(target.files) : [];

            // per ogni file caricato, legge il file caricato e assegna nome, url e file al dato form che salverà le informazioni del file 
            // nome del file, l'url in base64 e il tipo di oggetto caricato
            for (let file of files) {
                const reader = new FileReader();

                reader.onload = (e: ProgressEvent<FileReader>) => {
                    if (e.target) {
                        this.form.images.push({
                            name: file.name,
                            url: e.target.result as string,
                            file: file,
                        });
                    }
                };

                // legge i dati in formato base64 che permette di visualizzarli nell html in un tag img
                reader.readAsDataURL(file);
            }

            console.log(this.form.images);
        },
        removeImage(index: number) {
            // Rimuovi l'immagine dall'array
            this.form.images.splice(index, 1);

            // Ricrea l'input file per aggiornare i file selezionati
            const input = this.$refs.imageInput as HTMLInputElement;
        
            // crea un oggetto datatransfer che conterrà i dati da trasferire
            let newInput: DataTransfer = new DataTransfer();

            // iterazione sull'array originale contentnete i file lda caricare
            // aggiunge i file, diversi da quello da elminare, al datatransfer
            if (input.files) {
                for (let i = 0; i < input.files?.length; i++) {
                    if (i !== index) {
                        let file = input.files.item(i);
                        if (file != null) {
                            newInput.items.add(file);
                        }
                    }
                }
            }
            
            // salva i nuovi file nell'input del form
            input.files = newInput.files;

            console.log(input.files);

        },
        clearForm() {
            this.form.postContent = '';
            this.form.visibility = 'public';
            // Elimina l'array delle immagini
            this.form.images = [];
            const imageInput = this.$refs.imageInput as HTMLInputElement;
            // Resetta l'input file
            if (imageInput) {
                imageInput.value = ''; 
            }
        },
        async publishPost(event: Event) {
            event.preventDefault();

            if (!this.form.postContent.trim()) {
                alert('Content cannot be empty!');
                return;
            }

            try {
                // Crea FormData con i dati del form
                const formData = new FormData();
                formData.append('postContent', this.form.postContent);
                formData.append('visibility', this.form.visibility);

                // Aggiungi le immagini al FormData
                this.form.images.forEach((image, index) => {
                    formData.append(`image`, image.file);
                });

                // Effettua la richiesta HTTP al server
                const response = await fetch('/api/newPost', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    alert('Post published!');
                    window.location.href = '/'; // Reindirizza alla homepage
                } else {
                    const errorText = await response.text();
                    alert(`Failed to publish post: ${errorText}`);
                }
            } catch (error) {
                console.error('Error while publishing post:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        },
    },
});
</script>

<template>
    <section class="new-post" :class="`${mode}-mode`">
        <template v-if="user">
            <header>
                <h2 class="new-post-title">Create a New Post</h2>
            </header>

            <!-- form -->
            <form class="new-post-form" action="/api/newPost" method="POST" enctype="multipart/form-data" @submit.prevent="publishPost">

                <!-- Textarea -->
                <fieldset class="form-group">
                    <legend>Publish a new post</legend>
                    <label for="postContent" class="visually-hidden">Post Content</label>
                    <textarea id="postContent" v-model="form.postContent" name="postContent" placeholder="Write here..."
                        required></textarea>
                </fieldset>

                <!-- ssCEGLI un immagine da inviare -->
                <fieldset class="form-group">
                    <legend>Upload an image</legend>
                    <label for="imageUpload" class="image-upload-label" :class="`${mode}-mode`"
                        v-show="form.images.length === 0">
                        <input type="file" id="imageUpload" name="image" @change="uploadImages" hidden ref="imageInput"
                            multiple />
                        {{ form.images.length }}
                    </label>
                    <template v-if="form.images.length > 0">
                        <p class="file-feedback">Selected files:</p>
                        <section class="image-preview-container">
                            <article v-for="(image, index) in form.images" :key="index" class="image-preview">
                                <img :src="image.url" :alt="image.name" />
                                <button @click.prevent="removeImage(index)">Remove</button>
                            </article>
                        </section>
                    </template>
                </fieldset>

                <!-- decidi la visibilitità -->
                <fieldset class="form-group">
                    <legend>Post visibility</legend>
                    <label for="visibility" class="visually-hidden">Visibility</label>
                    <select id="visibility" v-model="form.visibility" name="visibility">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </fieldset>

                <!-- invia oppure elimianre il contenntuto da inviare-->
                <section class="form-buttons">
                    <input type="button" value="Cancel" class="btn cancel-btn" @click="clearForm" />
                    <input type="submit" value="Publish" class="btn publish-btn" />
                </section>
            </form>
        </template>


        <template v-else>
            <article class="error-message">
                <p>Only registered users can add a new post.</p>
            </article>
        </template>
    </section>
</template>

<style lang="css" scoped>
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
