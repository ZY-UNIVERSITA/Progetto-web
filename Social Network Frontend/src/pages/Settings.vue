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
    },
    data() {
        return {
          userInfo: {} as User,

          oldPassword: '',
          newPassword: ''
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
  },
  created() { 
    this.loadUserInfo(); 
  }
});
</script>

<template>
  <div class="settings-container">

    <!-- Modifica informazioni -->
    <section class="settings-section" v-if="userInfo">
      <h2>Modifica Informazioni</h2>
      <label>
        Full name:
        <input v-model="userInfo.full_name" type="text" placeholder="Inserisci nuovo nome" />
      </label>
      <label>
        Bio:
        <input v-model="userInfo.bio" type="text" placeholder="Inserisci nuovo bio" />
      </label>
      <label>
        Visibility:
        <select v-model="userInfo.visibility" name="visibility">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
      <button class="update-button" @click="updateInfo">Aggiorna info</button>
    </section>

    <!-- Cambia password -->
    <section class="settings-section">
      <h2>Cambia Password</h2>
      <label>
        Vecchia password:
        <input v-model="oldPassword" type="password" minlength="16" placeholder="Inserisci vecchia password" />
      </label>
      <label>
        Nuova password:
        <input v-model="newPassword" type="password" minlength="16" placeholder="Inserisci nuova password" />
      </label>
      <button class="update-button" @click="changePassword">Cambia Password</button>
    </section>
  
    <!-- Elimina account -->
    <section class="settings-section">
        <h2>Elimina Account</h2>
        <button class="delete-button" @click="deleteAccount">Elimina Account</button>
    </section>
    
  </div>
</template>
  