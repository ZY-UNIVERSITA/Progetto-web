<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Comment, Post, UserToken } from '../utils/types';
import axios from 'axios';

export default defineComponent({
    data() {
        return {
            comments: [] as Comment[],
            new_post: {
                user_id: this.post.user_id,
                post_id: this.post.post_id,
                content: this.post.content,
                visibility: this.post.post_visibility
            } as Post,
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
        async handleSubmit() {
            console.log(this.new_post);
            const result = await axios.put("/api/post", this.new_post);

            if (result.status == 200) {
                window.location.reload();
            } else {
                alert("Errore nella modifica del post.");
            }
        },
        cancelEdit() {
            document.body.classList.remove('no-scroll');
            this.$emit("notify", "false");
        }
    }, mounted() {

    }
});
</script>

<template>
    <section id="modify_post" class="modify_post">
        <header>
            <h2 id="modify_post_heading">Modify post</h2>
        </header>
        <main>
            <form @submit.prevent="handleSubmit">
                <fieldset>
                    <legend>Modify post content</legend>
                    <label for="postContent">Post content</label>
                    <textarea name="postContent" id="postContent" v-model="new_post.content" required>{{ new_post.content }}</textarea>
                </fieldset>

                <fieldset>
                    <legend>Modify post visbility</legend>
                    <label for="visibility">Visibility:</label>
                    <select name="visibility" id="visibility" v-model="new_post.visibility">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </fieldset>

                <div class="actions">
                    <button type="submit">Salva modifiche</button>
                    <button type="button" @click="cancelEdit">Annulla</button>
                </div>
            </form>
        </main>
    </section>
</template>

<style lang="css" scoped>
.modify_post {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

h2 {
    margin: 0;
}

fieldset {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px;
    margin-bottom: 20px;
}

legend {
    font-weight: bold;
}


label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

textarea {
    box-sizing: border-box;
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    min-height: 100px;
}

select {
    box-sizing: border-box;
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}

button[type="submit"] {
    background-color: #28a745;
    color: white;
}

button[type="button"] {
    background-color: #dc3545;
    color: white;
}

.actions {
    text-align: right;
}
</style>