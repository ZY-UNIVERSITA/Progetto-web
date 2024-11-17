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
  });
</script>

<template>
  <header>
    <h1>Social Network</h1>
  </header>
  <nav>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/account">Account</RouterLink></li>
    </ul>
  </nav>

  <main>
    <RouterView :user="user"></RouterView>
  </main>

</template>

<style lang="scss">
@use "./styles/style.scss";
</style>
