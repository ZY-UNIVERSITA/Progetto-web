export interface User {
    user_id: string
    username: string
}

export interface postID_interface extends User {
    visibility: string
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

export interface LoginRequest {
    usernameOrEmail: string,
    password: string
}

export interface LoginVerify {
    username: string,
    user_id: string,
    password_hash: string
}

export interface Post {
    post_id: string,
    user_id: string,
    content: string,
    created_at: Date,
    likes: number,
    comments: number, 
    shares: number, 
    post_visibility: string, 
    username: string,
    full_name: string,
    user_visibility: string,
    post_liked: number,
}