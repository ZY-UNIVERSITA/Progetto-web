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
    visibility: string
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
}

export interface PostImages {
    url: string
}

export interface Comment {
    username: string,
    full_name: string,
    profile_picture: string,
    created_at: Date,
    content: string
}

export interface UserSearch {
    username: string,
    full_name: string,
    profile_pictures: string
}

export interface ImageFile {
    name: string;
    url: string;
    file: File;
}