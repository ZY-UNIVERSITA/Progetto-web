export interface User {
    user_id: string
    username: string
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string,
    birthDate: string
}

export interface UserUsernameEmail {
    username: string
    email: string
}