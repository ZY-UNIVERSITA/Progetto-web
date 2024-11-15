<template>
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
</template>

<style lang="css" scoped>
    label {
        display: block;
    }
</style>