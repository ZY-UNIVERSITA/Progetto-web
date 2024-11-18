export interface User {
    user_id: string
    username: string
}

export interface Post extends User {
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
}