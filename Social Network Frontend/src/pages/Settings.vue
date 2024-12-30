<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  
  export default defineComponent({
    name: 'Settings',
    setup() {
      const userInfo = reactive({
        username: '',
        email: '',
      });
  
      const updateInfo = () => {
        alert(`Informazioni aggiornate: ${userInfo.username}, ${userInfo.email}`);
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
  
      return { userInfo, updateInfo, changePassword, deleteAccount };
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
        <label>
          Email:
          <input v-model="userInfo.email" type="email" placeholder="Inserisci nuova email" />
        </label>
        <button @click="updateInfo">Aggiorna Informazioni</button>
    </section>
  
    <!-- Cambia password -->
    <section class="settings-section">
        <h2>Cambia Password</h2>
        <input type="password" placeholder="Inserisci nuova password" minlength="16" />
        <button @click="changePassword">Cambia Password</button>
    </section>
  
    <!-- Elimina account -->
    <div class="settings-section">
        <h2>Elimina Account</h2>
        <button class="delete-button" @click="deleteAccount">Elimina Account</button>
    </div>
    
    </div>
</template>
  
<style scoped>
  .settings-container {
    padding: 20px;
  }
  
  .settings-section {
    margin-bottom: 20px;
  }
  
  .delete-button {
    background-color: red;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
  