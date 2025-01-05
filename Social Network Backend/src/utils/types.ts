export interface User {
    user_id: string
    username: string
}

export interface UserVisibility extends User {
    visibility: string
}

export interface RegisterRequest {
    username: string,
    email: string,
    password: string,
    birthDate: string,
    bio: string,
    visibility: visibility,
    full_name: string
}

enum visibility {
    PUBLIC = "public",
    PRIVATE = "private"
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

export interface Post_base {
    post_id: string,
    user_id: string,
    content: string,
    created_at: Date,
    likes: number,
    comments: number, 
    shares: number, 
    post_visibility: string,
}

export interface Post extends Post_base {
    username: string,
    full_name: string,
    user_visibility: string,
    post_liked: number,
}

export interface createNewPost {
    postContent: string,
    image?: string,
    visibility: string
}

export interface Follower {
    follower_user_id: string,
    following_user_id: string
}

export interface userSearch {
    username: string,
    full_name: string,
    profile_picture: string
}

export interface modificableInfo {
    full_name: string,
    bio: string,
    visibility: visibility
}

export interface newOldPassword {
    oldPassword: string,
    newPassword: string,
}