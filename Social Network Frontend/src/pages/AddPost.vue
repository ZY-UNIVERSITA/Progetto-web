<template>
    <form action="#" method="POST" enctype="multipart/form-data">
        <textarea name="postContent" placeholder="Write here..."></textarea>
            
        <label for="imageUpload" class="add-img-btn">
            Add img
            <input type="file" id="imageUpload" name="image" style="display:none;">
        </label>
                
        <button type="button" class="cancel-btn" onclick="clearForm()">Cancel</button>
        <button type="submit" class="publish-btn">Publish</button>
    </form>
</template>