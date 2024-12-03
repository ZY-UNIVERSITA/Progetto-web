import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Post, postID_interface, User } from "../utils/types";
import { getUser } from "../utils/auth";


const publicVisibility: string = "public";
const privateVisibility: string = "private";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const postLikeAdd = async (req: Request, res: Response): Promise<void> => {
    const { post_id } = req.body;

    const user: User | null = getUser(req, res);

    if (user === null || post_id === null) {
        console.log("L'utente ha provato a mettere like ma non è loggato");
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
        console.log("L'utente ha già messo like.")
        res.status(409).send("L'utente ha già messo like.");
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


export const postLikeRemove = async (req: Request, res: Response): Promise<void> => {
    const { post_id } = req.body;

    const user: User | null = getUser(req, res);

    if (user === null || post_id === null) {
        console.log("L'utente ha provato a togliere like ma non è loggato");
        res.status(401).send("User don't have the permission to do this.");
        return;
    }

    // Controlla se il like è presente
    const likeQuerySQL: string = 
    `
        SELECT *
        FROM posts_likes as pl
        WHERE pl.post_id LIKE ? AND pl.user_id LIKE ?
    `;

    const [ result ]: any = await executeQuerySQL(req, res, likeQuerySQL, false, post_id, user.user_id);    

    // Se il like non esiste, allora ritorna errore
    if (result === undefined) {
        console.log("L'utente non ha mai messo like.")
        res.status(409).send("L'utente non ha mai messo like.");
        return;
    }

    const querySQL: string = 
    `
        DELETE FROM posts_likes as pl
        WHERE pl.post_id LIKE ? AND pl.user_id LIKE ?;
    `;

    await executeQuerySQL(req, res, querySQL, false, post_id, user.user_id);    

    console.log("Like tolto");
    res.status(201).send("Il like è stato tolto");
};


export const postComments = async (req: Request, res: Response): Promise<void> => {
    const post_id = req.params.id

    const user: User | null = getUser(req, res);

    if (post_id === null) {
        console.log("Il post è inesistente");
        res.status(404).send("Post not found.");
        return;
    }

    // Controlla se il like è presente
    const querySQL: string = 
    `
        SELECT pc.created_at, pc.content, u.username, u.full_name, u.profile_picture
        FROM posts_comments as pc JOIN users as u ON (pc.user_id = u.user_id)
        WHERE pc.post_id LIKE ?
    `;

    console.log("Commenti inviati");
    await executeQuerySQL(req, res, querySQL, true, post_id);    
};

