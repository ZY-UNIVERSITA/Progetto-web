<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from 'axios';
import { User, UserToken } from '../utils/types';

export default defineComponent({
    data() {
        return {
            recommendedList: [] as any[]
        }
    },
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
    methods: {
        async getRecommendedFriends() {
            try {
                const results: any = await axios.get("/api/recommendedFriends");
                this.recommendedList = results.data;

                this.recommendedList.forEach(element => {
                    element.status = "Follow"
                });
            } catch (e: any) {
                console.error("error", e);
            }
        },
        async followUser(userId: number) {
            try {
                const response =  await axios.put("api/follow/" + userId );

                if (response.status === 200) {
                    console.log("Tutto ok");

                    const [user_followed] = this.recommendedList.filter(element => element.user_id === userId);

                    if (user_followed.status === "Follow") {
                        user_followed.status = "Unfollow";
                    } else {
                        user_followed.status = "Follow";
                    }
                }
            } catch (e: any) {
                console.error("Errore", e);
            }
        },
        getUserProfilePicture(user: User): string {
            if (user.profile_picture) {
                return `/siteUpload/profile_photo/${user.profile_picture}`;
            } else {
                return `/siteUpload/profile_photo/vite.svg`;
            }
        },
    },
    mounted() {
        this.getRecommendedFriends();
    }
});
</script>

<template>
    <section class="recommended-users">
        <h3>UTENTI CONSIGLIATI</h3>
        <template v-if="recommendedList.length > 0">
            <ul>
                <li v-for="friend in recommendedList" :key="friend.user_id">
                    <article class="user-info">
                        <figure>
                            <img :src="getUserProfilePicture(friend)" :alt="`Immagine profilo di ${friend.username}`"
                                class="profile-picture" />
                        </figure>
                        <section class="user-details">
                            <router-link :to="`/user/${friend.username}`" class="username-link" :class="`${mode}-mode`">
                                {{ friend.username }}
                            </router-link>
                            <button class="follow-button" @click="followUser(friend.user_id)">
                                {{ friend.status }}
                            </button>
                        </section>
                    </article>
                </li>
            </ul>
        </template>
        <template v-else>
            <p>Non ci sono utenti raccomandati</p>
        </template>
    </section>
</template>



<style lang="scss" scoped>
@use "../styles/aside.scss";
</style>