export interface User {
    user_id: string
    username: string
}

export interface Post {
    post_id: string,
    user_id: string,
    content: string,
    created_at: Date,
    visibility: string,
    likes: number,
    comments: number,
    shares: number,

    images: string[],

    username: string,
    full_name: string,
    profile_picture: string,
}