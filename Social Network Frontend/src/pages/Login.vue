<script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import axios from "axios"
    import { User } from '../utils/types';

    export default defineComponent({
        name: "Login",
        data() {
            return {
                logged: true as boolean,
                username: "" as string,
                password: "" as string
            }
        },
        computed: {
            loginRegisterText() {
                return this.logged ? "Login" : "Register";
            }
        },
        methods: {
            loginRegisterButton() {
                this.logged = !this.logged;
            },
            async login() {
                try {
                    await axios.post("/api/auth/login", {
                        usernameOrEmail: this.username,
                        password: this.password,
                    });
                    location.href="/"
                } catch (e: any) {
                    console.error('Errore durante il login:', e);

                    console.error(e.response);
                    console.error(e.request);
                }
                
            }
        },
        props: {
            user: Object as PropType<User>
        }
    });
</script>

<template>
    <form>  
        <input type="button" v-on:click="loginRegisterButton" v-bind:value="loginRegisterText"></input>
    </form>
    <template v-if="logged">
        <form method="POST" action="/api/auth/register">
            <label for="username">Enter your username*: </label>
            <input type="text" name="username" id="username" required />

            <label for="email">Enter your email*: </label>
            <input type="email" name="email" id="email" required />
    
            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required />

            <label for="birthDate">Enter your birth date: </label>
            <input type="date" name="birthDate" id="birthDate" required />
        
            <input type="submit" value="Register" />
        </form>

        <form method="POST" action="/api/auth/logout">
            <input type="submit" value="Logout" />
        </form>
    </template>
    <!-- <template v-else>
        <form method="POST" action="/api/auth/login">
            <label for="usernameOrEmail">Enter your username/email: </label>
            <input type="text" name="usernameOrEmail" id="usernameOrEmail" required />
    
            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required />
        
            <input type="submit" value="Login" />
        </form>
    </template> -->

    <template v-else>
        <form @submit.prevent="login">
            <label>Enter your username/email: </label>
            <input type="text" name="usernameOrEmail" id="usernameOrEmail" required v-model="username" />
    
            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required v-model="password" />
            <button type="submit" class="InLoginButton">In</button>
        </form>
    </template>
</template>
