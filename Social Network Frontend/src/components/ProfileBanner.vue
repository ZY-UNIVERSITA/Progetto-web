<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { User, UserToken } from '../utils/types';
import SinglePostComponent from '../components/singlePostComponent.vue';

export default defineComponent({
    components: {
        SinglePostComponent
    },
    props: {
        user: {
            type: Object as PropType<UserToken | null>,
            required: false,
        },
        userProfile: {
            type: Object as PropType<User | null>,
            required: false
        },
        mode: String
    },
    data() {
        return {
            userProfile: null as User | null,
            isFriend: false as boolean
        }
    },
    methods: {
        async getUserProfile() {
            console.log(this.$route.params.username)
            try {
                const username = this.$route.params.username !== undefined ? this.$route.params.username : this.user?.username;
                const profile: any = await axios.get("api/user/" + username);
                this.userProfile = profile.data[0];
            } catch (e: any) {
                console.error(e);
            }
        },
        async getIsFriend() {
            const username = this.$route.params.username !== undefined ? this.$route.params.username : this.user?.username;
            
            if (this.user !== undefined && this.user !== null && username !== undefined) {
                if (this.user.username !== username) {
                    try {
                        const isFriendQuery: any = await axios.get("api/friend/search/" + username);

                        console.log(isFriendQuery)

                        if (isFriendQuery.data.length === 0) {
                            this.isFriend = false;
                        } else {
                            this.isFriend = true;
                        }
                    } catch (e: any) {
                        console.error(e);
                    }
                }
            }
        },
        async follow() {
            const response =  await axios.put("api/follow/" + this.userProfile?.user_id );

            if (response.data === "Tutto ok") {
                this.isFriend = !this.isFriend;
            }
        }
    },
    created() {
        this.getUserProfile();
        this.getIsFriend();
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
                            <span class="stat-label">Followers: </span>
                            <span class="stat-value">{{ userProfile.follower }}</span>
                        </p>
                        <p>
                            <span class="stat-label">Following: </span>
                            <span class="stat-value">{{ userProfile.following }}</span>
                        </p>
                    </section>
                    <section v-if="user != null">
                        <button v-if="!isFriend" class="follow" :class="`${mode}-mode`" @click="follow">Follow</button>
                        <button v-else class="unfollow" :class="`${mode}-mode`" @click="follow">Unfollow</button>
                    </section>
                </section>
            </main>
        </section>
    </template>
</template>
