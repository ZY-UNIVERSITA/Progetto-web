<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import { UserToken } from '../utils/types';

    export default defineComponent({
        components: { 
            
        },
        props: {
            user: {
                type: Object as PropType<UserToken | null>,
                required: false,
            },
            mode: String
        },
    });
</script>

<template>
    <template v-if="user">
        <form action="/api/newPost" method="POST" enctype="multipart/form-data">
            <textarea name="postContent" placeholder="Write here..."></textarea>
            
            <label for="imageUpload" :class="`${mode}-mode`">
                Add img
                <input type="file" id="imageUpload" name="image" style="display:none;">
            </label>

            <label for="visibility">Visibility</label>
            <select id="visibility" name="visibility">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>
                
            <div class="cancel-publish">
            <button type="button" onclick="clearForm()" :class="`${mode}-mode`">Cancel</button>
            <button type="submit" :class="`${mode}-mode`">Publish</button>
            </div>
        </form>
    </template>
    <template v-else>
        <p>Only registered users can add a new post.</p>
    </template>
</template>