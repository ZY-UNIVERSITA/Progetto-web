<script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import { User } from './utils/types';
 
  export default defineComponent({
    data() {
      return {
        user: null as User | null,
        mode: 'dark', // default theme
        isMobile: window.innerWidth < 768,
      }
    }, 
    methods: {
      handleResize() {
      this.isMobile = window.innerWidth < 768;
      },
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
      // Aggiunge il listener per aggiornare `isMobile` al resize
      window.addEventListener('resize', this.handleResize);
      this.getUserInfo();
      this.initializeTheme();
    }
  });
</script>

<template>
  
  <header>
    <h1>DailyDot</h1>
  </header>
  
  <nav :class="`${mode}-mode`">
    <ul>
      <li :class="`${mode}-mode`">
        <RouterLink to="/">
          <img class="icon" :src="mode === 'dark' ? 'icons/home-l.svg' : 'icons/home-d.svg'" :alt="isMobile ? 'Vai alla pagina Home' : ''"/>
          <span class="text" :class="`${mode}-mode`">Home</span>
        </RouterLink>
      </li>
      <li :class="`${mode}-mode`">
        <RouterLink to="/search">
          <img class="icon" :src="mode === 'dark' ? 'icons/search-l.svg' : 'icons/search-d.svg'" :alt="isMobile ? 'Vai alla pagina Search' : ''"/>
          <span class="text" :class="`${mode}-mode`">Search</span>
        </RouterLink>
      </li>
      <li :class="`${mode}-mode`">
        <RouterLink to="/post">
          <img class="icon" :src="mode === 'dark' ? 'icons/add-l.svg' : 'icons/add-d.svg'" :alt="isMobile ? 'Vai alla pagina Add post' : ''"/>
          <span class="text" :class="`${mode}-mode`">Add Post</span>
        </RouterLink></li>
      <li :class="`${mode}-mode`">
        <RouterLink to="/profile">
          <img class="icon" :src="mode === 'dark' ? 'icons/user-l.svg' : 'icons/user-d.svg'" :alt="isMobile ? 'Vai alla pagina Profile' : ''"/>
          <span class="text" :class="`${mode}-mode`">Profile</span>
        </RouterLink>
      </li>
    </ul>
  </nav>

  <main>
    <RouterView :user="user" :mode="mode" :toggleTheme="toggleTheme"></RouterView>
  </main>

  <footer>
        <p>Progetto realizzato da: Skybun Nataliia e Zhu Yuhang</p>
        <p>A.A. 2024/2025</p>
  </footer>

</template>

<style lang="scss">
@use "./styles/style.scss";
</style>
