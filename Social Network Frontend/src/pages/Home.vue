<script lang="ts">
  import { defineComponent } from 'vue';
  import { User } from '../utils/types';
 
  export default defineComponent({
    data() {
      return {
      }
    },
    inject: [
        "provideUserInfo"
    ],
    computed: {
        axiosCompleted(): User | null {
            if (typeof this.provideUserInfo === "function") {
                return this.provideUserInfo();
            }
            return null;
        }
    },
  });
  </script>

<template>
    <template v-if="axiosCompleted">
        <p>Welcome {{ axiosCompleted.username }}</p>
    </template>
    <template v-else>
        <p>The page is loading. Wait for a second...</p>
    </template>
</template>