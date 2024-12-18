<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { Post, User, UserToken } from '../utils/types';
import SinglePostComponent from '../components/SinglePostComponent.vue';

export default defineComponent({
    components: {
        SinglePostComponent
    },
    props: {
        user: {
            type: Object as PropType<UserToken | null>,
            required: true,
        },
    },
    data() {
        return {
            userProfile: null as User | null
        }
    },
    methods: {
        async getUserProfile() {
            if (this.user !== null) {
                try {
                    const profile: any = await axios.get("api/user/" + this.user.username);
                    this.userProfile = profile.data[0];
                } catch (e: any) {
                    console.error(e);
                }
            }
        },
    },
    created() {
        if (this.user !== null) {
            this.getUserProfile();
        }
    }
});
</script>

<template>
    <template v-if="userProfile">
        <section id="user-profile">
            <header id="user-profile-header">
                <section class="profile-header-bg">
                    <img src="/images/profile_banner/vue_banner.png" alt="user profile banner" />
                </section>
            </header>

            <main>
                <section class="user-info-section">
                    <section class="profile-picture-container">
                        <img :src="userProfile.profile_picture || '/images/profile_photo/default.svg'"
                            :alt="'Profile picture of ' + userProfile.full_name" class="profile-picture" />
                    </section>
                    <section class="user-details">
                        <h1 id="user-info">
                            {{ userProfile.full_name }}
                        </h1>
                        <p class="username">@{{ userProfile.username }}</p>
                    </section>
                </section>
                <section>
                    <p v-if="userProfile.bio" class="bio">{{
                        userProfile.bio }}</p>
                    <p v-if="userProfile.birth_date" class="birthdate">
                        Born on {{ new Date(userProfile.birth_date).toLocaleString() }}
                    </p>
                    <section class="profile-stats">
                        <p>
                            <span class="stat-label">Followers:</span>
                            <span class="stat-value">Follower count</span>
                        </p>
                        <p>
                            <span class="stat-label">Following:</span>
                            <span class="stat-value">Following count</span>
                        </p>
                    </section>
                </section>
            </main>
        </section>
    </template>
</template>

<style lang="css" scoped>
#user-profile {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    font-family: sans-serif;
}

#user-profile-header {
    position: relative;
    height: 100px;
    /* Ridotta l'altezza dell'header */
}

.profile-header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
}

.profile-header-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.user-info-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.profile-picture-container {
    position: relative;
    width: 80px;
    /* Regola la dimensione dell'immagine */
    height: 80px;
    /* Regola la dimensione dell'immagine */
    border-radius: 50%;
    border: 4px solid white;
    overflow: hidden;
    margin-right: 20px;
    z-index: 1;
    flex-shrink: 0;
}

.profile-picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

#user-info {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
}

.username {
    color: #555;
    margin-bottom: 10px;
}

.bio {
    margin-bottom: 10px;
}

.birthdate {
    color: #777;
}

.profile-stats p {
    display: inline-block;
    margin-right: 1rem;
}
</style>
