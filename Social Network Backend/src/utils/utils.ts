import { Request, Response } from "express";
import executeQuerySQL from "./querySQL";
import { User } from "./types";

// Funzione per verificare se l'utente è l'autore del post
export const isPostOwner = (user: User | null, postUserId: string): boolean => {
    return user !== null && user.user_id === postUserId;
};

// Funzione per verificare se un utente è un amico
export const isFriend = async (
        req: Request,
        res: Response,
        userId: string,
        friendUserId: string 
    ): Promise<boolean> => {

        const confirmIfFriendQuerySQL: string = `
        SELECT *
        FROM follower AS f
        WHERE f.follower_user_id = ? AND f.following_user_id = ?;
    `;

    const resultFriend: any[] = await executeQuerySQL(
        req,
        res,
        confirmIfFriendQuerySQL,
        false,
        userId,
        friendUserId
    );

    return resultFriend.length > 0;
};