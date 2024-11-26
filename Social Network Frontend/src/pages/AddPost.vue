<template>
    <form action="/api/newPost" method="POST" enctype="multipart/form-data">
        <textarea name="postContent" placeholder="Write here..."></textarea>
        
        <label for="imageUpload" class="add-img-btn">
            Add img
            <input type="file" id="imageUpload" name="image" style="display:none;">
        </label>

        <label for="visibility">Visibility</label>
        <select id="visibility" name="visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
        </select>
            
        <button type="button" class="cancel-btn" onclick="clearForm()">Cancel</button>
        <button type="submit" class="publish-btn">Publish</button>
    </form>
</template>