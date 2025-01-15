<script lang="ts">
import axios from 'axios';
import { defineComponent, PropType } from 'vue';
import { User, UserToken } from '../utils/types';

export default defineComponent({
  name: 'Settings',
  props: {
    user: {
      type: Object as PropType<UserToken>,
      required: true,
    },
    mode: {
      type: String as PropType<'dark' | 'light'>,
      required: true,
    },
    toggleTheme: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  data() {
    return {
      userInfo: {} as User,

      oldPassword: '',
      newPassword: '',

      profile_picture: null as File | null,
      banner_picture: null as File | null,
    };
  },
  methods: {
    async loadUserInfo() {
      try {
        const response = await axios.get(`/api/user/${this.user.username}`);
        this.userInfo = response.data[0];
      } catch (error) {
        console.error('Errore nel caricare le informazioni utente:', error);
      }
    },
    async updateInfo() {
      try {
        const updatedUser = {
          full_name: this.userInfo.full_name,
          bio: this.userInfo.bio,
          visibility: this.userInfo.visibility
        };

        await axios.put('/api/account/information/', updatedUser);
        alert('Informazioni aggiornate');
      } catch (error) {
        console.error('Errore nell\'aggiornare le informazioni:', error);
        alert('Si è verificato un errore nell\'aggiornare le informazioni.');
      }
    },
    async changePassword() {
      const oldPasswordValue = this.oldPassword;
      const newPasswordValue = this.newPassword;

      try {
        const response = await axios.put('/api/account/password/', {
          oldPassword: oldPasswordValue,
          newPassword: newPasswordValue
        });

        if (response.status === 200) {
          alert('Password cambiata con successo!');
        } else {
          alert('Errore nel cambiare la password. Assicurati che la vecchia password sia corretta.');
        }
      } catch (error) {
        console.error('Errore durante il cambiamento della password:', error);
        alert('Si è verificato un errore durante il cambiamento della password. Riprova più tardi.');
      }
    },

    async deleteAccount() {
      if (window.confirm('Sei sicuro di voler eliminare il tuo account?')) {
        try {
          const response = await axios.delete('/api/account/delete/');

          if (response.status === 200) {
            alert('Il tuo account è stato eliminato con successo.');
            window.location.href = '/';
          } else {
            alert('Si è verificato un errore durante l\'eliminazione dell\'account.');
          }
        } catch (error) {
          console.error('Errore durante l\'eliminazione dell\'account:', error);
          alert('Si è verificato un errore durante l\'eliminazione dell\'account.');
        }
      }
    },

    async loadImages() {
      const formData = new FormData();

      console.log(this.profile_picture)
      console.log(this.banner_picture)

      if (this.profile_picture !== null) {
        formData.append("profile_picture", this.profile_picture);
      }

      if (this.banner_picture !== null) {
        formData.append("banner_picture", this.banner_picture);
      }

      const response = await axios.post('/api/upload/profile_banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        alert("Immagini cambiate");
        window.location.reload();
        // window.location.href = '/';
      } else {
        alert("errore nella modifca delle immagini");
      }
    },

    handleProfilePicture(event: any) {
      this.profile_picture = event.target.files[0];
    },
    handleBannerPicture(event: any) {
      this.banner_picture = event.target.files[0];
    }
  },
  created() {
    this.loadUserInfo();
  }
});
</script>

<template>
  <div class="settings-container">
    <h2 class="page-title">Settings</h2>
    <p class="page-subtitle">Manage your account settings and preferences</p>
    <div class="buttons-profile">
      <section class="theme-toggle-container">
        <label for="theme-toggle" class="theme-label">Change theme to 
          <template v-if="mode == 'light'">dark </template>
          <template v-else>light </template>
          mode
        </label>
        <label class="switch">
          <input type="checkbox" id="theme-toggle" :checked="mode === 'light'" @change="toggleTheme" />
          <span class="slider" :class="`${mode}-mode`"></span>
        </label>
      </section>

      <!-- <button @click="settings" class="set-btn" :class="`${mode}-mode`">Settings</button> -->
    </div>

    <template v-if="user">
      <!-- Modifica informazioni -->
      <section class="settings-section bottom-line" v-if="userInfo">
        <h2>Change info</h2>
        <label>
          Full name:
          <input v-model="userInfo.full_name" type="text" placeholder="Inserisci nuovo nome" />
        </label>
        <label>
          Bio:
          <textarea v-model="userInfo.bio" type="text" placeholder="Inserisci nuovo bio"></textarea>
        </label>
        <label>
          Visibility:
          <select v-model="userInfo.visibility" name="visibility">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <button class="update-button" :class="`${mode}-mode`" @click="updateInfo">Update info</button>
      </section>

      <!-- Modifica immagini -->
      <section class="settings-section bottom-line">
        <h2>Change profile picture</h2>
        <form @submit.prevent="">
          <label for="profile_picture">Profile Picture:</label>
          <input type="file" id="profile_picture" @change="handleProfilePicture" accept="image/*" />

          <label for="banner_picture">Banner Picture:</label>
          <input type="file" id="banner_picture" @change="handleBannerPicture" accept="image/*" />

          <button class="update-button" :class="`${mode}-mode`" @click="loadImages">Update pictures</button>
        </form>
      </section>

      <!-- Cambia password -->
      <section class="settings-section bottom-line">
        <h2>Change password</h2>
        <label>
          Current password:
          <input v-model="oldPassword" type="password" minlength="16" placeholder="Current password" />
        </label>
        <label>
          New password:
          <input v-model="newPassword" type="password" minlength="16" placeholder="New password" />
        </label>
        <button class="update-button" :class="`${mode}-mode`" @click="changePassword">Change Password</button>
      </section>

      <!-- Elimina account -->
      <section class="settings-section bottom-line">
        <h2>Delete Account</h2>
        <button class="delete-button" :class="`${mode}-mode`" @click="deleteAccount">Delete Account</button>
      </section>
    </template>
  </div>
</template>