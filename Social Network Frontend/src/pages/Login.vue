<script lang="ts">
import { defineComponent, PropType } from 'vue';
import axios from "axios"
import { loginForm, User } from '../utils/types';

export default defineComponent({
    name: "Login",
    data() {
        return {
            logged: true as boolean,
            username: "" as string,
            password: "" as string,
            formData: {
                username: '',
                email: '',
                password: '',
                full_name: '',
                bio: '',
                birthDate: new Date(),
                visibility: 'public'
            } as loginForm,
            login_error: false as boolean,
        }
    },
    computed: {
        loginRegisterText() {
            return this.logged ? "Register" : "Login";
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

                this.login_error = true;
            }
        },
        async register() {
            const response = await axios.post('/api/auth/register', this.formData);
            console.log(response.data.message);
            if (response.data.message == "Registration ok.") {
                window.location.href = '/';
            } else {
                alert("errore nella registrazione");
            }
        },
        async close() {
            this.login_error = !this.login_error;
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
    <template v-if="!logged && !login_error">
        <form @submit.prevent="register">
            <label for="username">Enter your username*: </label>
            <input v-model="formData.username" type="text" id="username" required />

            <label for="email">Enter your email*: </label>
            <input v-model="formData.email" type="email" id="email" required />

            <label for="password">Enter your password*: </label>
            <input v-model="formData.password" type="password" id="password" minlength="16" required />

            <label for="full_name">Enter your full name: </label>
            <input v-model="formData.full_name" type="text" id="full_name" />

            <label for="bio">Describe yourself: </label>
            <textarea v-model="formData.bio" id="bio" rows="4" cols="50">Default bio</textarea>

            <label for="birthDate">Enter your birth date: </label>
            <input v-model="formData.birthDate" type="date" id="birthDate" required />

            <label for="visibility">Choose Visibility:</label>
            <select v-model="formData.visibility" id="visibility">
                <option value="public">Public</option>
                <option value="private">Private</option>
            </select>

            <input type="submit" value="Register" :class="`${mode}-mode`"/>
        </form>

        <template v-if="user">
            <form method="POST" action="/api/auth/logout">
                <input type="submit" value="Logout" :class="`${mode}-mode`" />
            </form>
        </template>
    </template>

    <template v-else-if="!login_error">
        <form @submit.prevent="login">
            <label>Enter your username/email: </label>
            <input type="text" name="usernameOrEmail" id="usernameOrEmail" required v-model="username" />

            <label for="password">Enter your password*: </label>
            <input type="password" name="password" id="password" minlength="16" required v-model="password" />
            <input type="submit" value="Login" :class="`${mode}-mode`"></input>
        </form>
    </template>

    <template v-else>
        <form @click="close">
            <p>Errore nell'inserimento della password o dell'username/email.</p>
            <p>Premi questa schermata per riprovare.</p>
        </form>
    </template>    
</template>
