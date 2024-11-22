import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Post, postID_interface, User } from "../utils/types";
import { getUser } from "../utils/auth";


const publicVisibility: string = "public";
const privateVisibility: string = "private";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const postLike = async (req: Request, res: Response): Promise<void> => {
    const { post_id } = req.body;

    const user: User | null = getUser(req, res);

    if (user === null || post_id === null) {
        console.log("L'utente ha prova a mettere like ma non è loggato");
        res.status(401).send("User don't have the permission to do this.");
        return;
    }

    // controlla se il like è già presente
    const likeQuerySQL: string = 
    `
        SELECT *
        FROM posts_likes as pl
        WHERE pl.post_id LIKE ? AND pl.user_id LIKE ?
    `;

    const [ result ]: any = await executeQuerySQL(req, res, likeQuerySQL, false, post_id, user.user_id);    

    // Se il like esiste, ritorna errore
    if (result !== undefined) {
        res.status(409).send("L'utente ha già messo like");
        return;
    }

    const querySQL: string = 
    `
        INSERT INTO posts_likes (post_id, user_id)
        VALUES (?, ?)
    `;

    await executeQuerySQL(req, res, querySQL, false, post_id, user.user_id);    

    console.log("Like messo");
    res.status(201).send("Il like è stato messo");
};
