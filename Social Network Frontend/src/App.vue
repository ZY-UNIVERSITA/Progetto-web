<script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import { User } from './utils/types';
 
  export default defineComponent({
    data() {
      return {
        user: null as User | null,
        mode: 'dark', // default theme
      }
    }, 
    methods: {
      async getUserInfo() {
        try {
          const results: any = await axios.get("/api/auth/profile");
          this.user = results.data;
        } catch (e: any) {
          console.error("error", e);
        }
      },
      toggleTheme() {
        this.mode = this.mode === 'dark' ? 'light' : 'dark';
        document.body.className = `${this.mode}-mode`;
        localStorage.setItem('theme', this.mode);
      },
      initializeTheme() {
        // Recupera il tema dal localStorage o usa il valore predefinito
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.mode = savedTheme;
        document.body.className = `${this.mode}-mode`;
      },
    },
    mounted() {
      this.getUserInfo();
      this.initializeTheme();
    }
  });
</script>

<template>
  <header>
    <h1>DailyDot</h1>
  </header>
  <main>
    <RouterView :user="user" :mode="mode" :toggleTheme="toggleTheme"></RouterView>
  </main>
  <nav :class="`${mode}-mode`">
    <ul>
      <li><RouterLink to="/"><img :src="mode === 'dark' ? 'icons/home-l.svg' : 'icons/home-d.svg'" alt="Home"/></RouterLink></li>
      <li><RouterLink to="/search"><img :src="mode === 'dark' ? 'icons/search-l.svg' : 'icons/search-d.svg'" alt="Search"/></RouterLink></li>
      <li><RouterLink to="/post"><img :src="mode === 'dark' ? 'icons/add-l.svg' : 'icons/add-d.svg'" alt="Add Post"/></RouterLink></li>
      <li><RouterLink to="/profile"><img :src="mode === 'dark' ? 'icons/user-l.svg' : 'icons/user-d.svg'" alt="Profile"/></RouterLink></li>
    </ul>
  </nav>
</template>

<style lang="scss">
@use "./styles/style.scss";
</style>
