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
                location.href = "/"
            } catch (e: any) {
                console.error('Errore durante il login:', e);

                console.error(e.response);
                console.error(e.request);
            }

        }
    },
    props: {
        user: Object as PropType<User>,
        mode: String
    }
});
</script>

<template>
    <form>
        <input type="button" v-on:click="loginRegisterButton" v-bind:value="loginRegisterText"
            :class="`${mode}-mode`"></input>
    </form>
    <template v-if="logged">
        <form method="POST" action="/api/auth/register">
            <label for="username">Enter your username*: </label>
            <input type="text" name="username" id="username" required />

            <label for="email">Enter your email*: </label>
            <input type="email" name="email" id="email" required />

            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required />


            <label for="full_name">Enter your full name: </label>
            <input type="text" name="full_name" id="full_name" />


            <label for="bio">Describe yourself: </label>
            <textarea id="bio" name="bio" rows="4" cols="50">Default bio </textarea>

            <label for="birthDate">Enter your birth date: </label>
            <input type="date" name="birthDate" id="birthDate" required />

            <label for="visibility">Choose Visibility:</label>
            <select id="visibility" name="visibility">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>

            <input type="submit" value="Register" :class="`${mode}-mode`" />
        </form>

        <template v-if="user">
            <form method="POST" action="/api/auth/logout">
                <input type="submit" value="Logout" :class="`${mode}-mode`" />
            </form>
        </template>
    </template>

    <template v-else>
        <form @submit.prevent="login">
            <label>Enter your username/email: </label>
            <input type="text" name="usernameOrEmail" id="usernameOrEmail" required v-model="username" />

            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required v-model="password" />
            <input type="submit" value="Login" :class="`${mode}-mode`"></input>
        </form>
    </template>
</template>
