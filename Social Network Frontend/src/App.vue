<script lang="ts">
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import { User } from './utils/types';
 
  export default defineComponent({
    data() {
      return {
        user: null as User | null,
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
      }
    },
    mounted() {
      this.getUserInfo();
    }
  });
</script>

<template>
  <header>
    <h1>DailyDot</h1>
  </header>
  <nav>
    <ul>
      <li><router-link to="/"><img src="../public/icons/home.svg" alt="Home"/></router-link></li>
      <li><router-link to="/search"><img src="../public/icons/search.svg" alt="Search"/></router-link></li>
      <li><router-link to="/post"><img src="../public/icons/add.svg" alt="Add Post"/></router-link></li>
      <li><router-link to="/profile"><img src="../public/icons/user.svg" alt="Profile"/></router-link></li>
    </ul>
  </nav>
  <main>
    <RouterView :user="user"></RouterView>
  </main>
</template>

<style lang="scss">
@use "./styles/style.scss";
</style>
