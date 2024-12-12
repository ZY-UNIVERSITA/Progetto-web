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
            <form class="new-post-form" action="/api/newPost" method="POST" enctype="multipart/form-data">

                <!-- Textarea -->
                <fieldset class="form-group">
                    <legend>Publish a new post</legend>
                    <textarea id="postContent" v-model="form.postContent" name="postContent" placeholder="Write here..."
                        required></textarea>
                </fieldset>

                <!-- ssCEGLI un immagine da inviare -->
                <fieldset class="form-group">
                    <legend>Upload an image</legend>
                    <label for="imageUpload" class="image-upload-label" :class="`${mode}-mode`"
                        v-show="form.images.length === 0">
                        Add an image
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

                <!-- prova con input piu sempilce per capire perchè non vada
                <input type="file" name="image" multiple />
                <input type="submit" value="Invia" /> -->

                <!-- decidi la visibilitità -->
                <fieldset class="form-group">
                    <legend>Post visibility</legend>
                    <label for="visibility">Visibility</label>
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


<style scoped>
img {
    width: 50%
}

.new-post {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.new-post.light-mode {
    background-color: #f9f9f9;
}

.new-post.dark-mode {
    background-color: #333;
    color: #fff;
}

.new-post-title {
    text-align: center;
    font-size: 1.25rem;
    margin-bottom: 1rem;
}

.new-post-form {
    display: flex;
    flex-direction: column;
}

fieldset {
    border: none;
    margin: 0;
    padding: 0;
}

legend {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

textarea,
select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

textarea:focus,
select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.4);
}

.image-upload-label {
    display: inline-block;
    background-color: #007bff;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
}

.image-upload-label:hover {
    background-color: #0056b3;
}

.file-feedback {
    font-size: 0.9rem;
    color: #555;
}

/* Buttons */
.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn {
    background-color: #dc3545;
    color: #fff;
}

.cancel-btn:hover {
    background-color: #c82333;
}

.publish-btn {
    background-color: #28a745;
    color: #fff;
}

.publish-btn:hover {
    background-color: #218838;
}

.error-message {
    text-align: center;
    font-weight: bold;
    margin-top: 1rem;
}
</style>