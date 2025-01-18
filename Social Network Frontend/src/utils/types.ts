export interface UserToken {
    user_id: string,
    username: string,
}

export interface User extends UserToken {
    full_name: string,
    bio: string,
    birth_date: Date,
    profile_picture: string,
    banner_picture: string,
    visibility: string,
    follower: number,
    following: number
}

export interface Post extends UserToken {
    post_id: string,
    user_id: string,
    content: string,
    created_at: Date,
    visibility: string,
    likes: number,
    comments: number,
    shares: number,

    images: string[],

    full_name: string,
    profile_picture: string,

    post_liked: number,

    post_visibility: string
}

export interface PostImages {
    url: string
}

export interface Comment {
    comment_id: number,
    username: string,
    full_name: string,
    profile_picture: string,
    created_at: Date,
    content: string
}

export interface UserSearch {
    username: string,
    full_name: string,
    profile_picture: string
}

export interface ImageFile {
    name: string;
    url: string;
    file: File;
}

export interface loginForm {
    username: string,
    email: string,
    password: string,
    full_name: string,
    bio: string,
    birthDate: Date,
    visibility: string,
    profile_picture: string | null,
    banner_picture: string | null
}

export interface Messages {
    receiver_id: string,
    sender_id: string,
    receiver_username: string,
    sender_username: string,
    timestamp: Date,
    content: string,
    status: string
}

export interface ChatMessage {
    sender_id?: string,
    sender_username?: string,
    receiver_id: string,
    receiver_username?: string,
    message: string,
    timestamp: Date,
    status?: string
}

export interface User_messages {
    id: string,
    name: string,
    lastMessage: string,
    lastMessageTimestamp: Date | null,
    messages: ChatMessage[]
}

export interface Friends_list {
    user_id: string,
    username: string
}