<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  
  export default defineComponent({
    name: 'Settings',
    setup() {
      const userInfo = reactive({
        username: '',
        email: '',
      });
  

      /**
       * api/user/:username per ottenere le info utente:
       * bio
       * user birth date
       * full_name
       * visibility
       * 
       * 
       */

       /**
        * /api/account/information/",
        * per inviare quei 4 dati sopra da aggiornare.
        */

        /**
         * api/account/password/"
         * per poter aggiornare la password
        */
       /**
        * /api/account/delete/",
        * per poter eliminare l'account
         */
        
      const updateName = () => {
        alert(`Informazioni aggiornate`);
        // Logica per inviare i dati aggiornati al backend
      };

      const updateEmail = () => {
        alert(`Informazioni aggiornate`);
        // Logica per inviare i dati aggiornati al backend
      };
  
      const changePassword = () => {
        alert('Password cambiata!');
        // Logica per cambiare la password
      };
  
      const deleteAccount = () => {
        if (window.confirm('Sei sicuro di voler eliminare il tuo account?')) {
          alert('Account eliminato.');
          // Logica per eliminare l'account dal backend
        }
      };
  
      return { userInfo, updateName, updateEmail, changePassword, deleteAccount };
    },
  });
</script>

<template>
    <div class="settings-container">
  
    <!-- Modifica informazioni -->
    <section class="settings-section">
        <h2>Modifica Informazioni</h2>
        <label>
          Nome utente:
          <input v-model="userInfo.username" type="text" placeholder="Inserisci nuovo nome utente" />
        </label>
        <button class="update-button" @click="updateName">Aggiorna nome</button>
        <label>
          Email:
          <input v-model="userInfo.email" type="email" placeholder="Inserisci nuova email" />
        </label>
        <button class="update-button" @click="updateEmail">Aggiorna email</button>
    </section>
  
    <!-- Cambia password -->
    <section class="settings-section">
        <h2>Cambia Password</h2>
        <input type="password" placeholder="Inserisci nuova password" minlength="16" />
        <button class="update-button" @click="changePassword">Cambia Password</button>
    </section>
  
    <!-- Elimina account -->
    <section class="settings-section">
        <h2>Elimina Account</h2>
        <button class="delete-button" @click="deleteAccount">Elimina Account</button>
    </section>
    
    </div>
</template>
  