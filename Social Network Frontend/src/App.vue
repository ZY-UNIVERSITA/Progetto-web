<script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import { User } from './utils/types';
  import { RouterView } from 'vue-router';
 
  export default defineComponent({
    data() {
      return {
        user: null as User | null,
      }
    }, 
    methods: {
      async getUserInfo() {
        const results: any = await axios.get("/api/auth/profile");
        this.user = results.data;
      }
    },
    mounted() {
      this.getUserInfo();
    },
    // Effettua un provide a tutti i discendenti figli di una funzione computed
    provide() {
      return {
        provideUserInfo: (() => this.dataUserComputed) as () => User | null,
      }
    },
    // ritorna il valore di this.user in modo dinamico.
    // Permettendo di gestire il caso in cui il componente figlio venisse caricato prima della fine della chiamata axios
    computed: {
      dataUserComputed(): User | null {
        return this.user;
      }
    }
  });
</script>

<template>
  <header>
    <h1>DailyDot</h1>
  </header>
  <nav>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/search">Search</router-link></li>
      <li><router-link to="/post">Add Post</router-link></li>
      <li><router-link to="/account">Account</router-link></li>
    </ul>
  </nav>
  <main>
    <RouterView></RouterView>
  </main>
</template>

<style lang="scss">
@use "./styles/style.scss";
</style>
