import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Follower, Post, User, userSearch } from "../utils/types";
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


export const getPostComments = async (req: Request, res: Response): Promise<void> => {
    const post_id = req.params.id;

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


export const postNewComment = async (req: Request, res: Response): Promise<void> => {
    const { post_id, post_comment } = req.body;

    const user: User | null = getUser(req, res);

    if (user === null) {
        console.log("L'utente non è registrato.");
        res.status(401).send("Don't have authorization to do this action.")
        return;
    }

    if (post_id === null) {
        console.log("Il post è inesistente");
        res.status(404).send("Post not found.");
        return;
    }

    if (post_comment === null) {
        console.log("Il post è vuoto.");
        res.status(404).send("The comment is blank");
        return;
    }

    // Verifica l'esistenza del post
    const querySQL: string = 
    `
        SELECT
            p.post_id, 
            p.user_id, 
            p.content, 
            p.created_at, 
            p.likes, 
            p.comments, 
            p.shares, 
            p.visibility AS post_visibility, 
            u.username, 
            u.full_name, 
            u.visibility AS user_visibility
        FROM posts as p join users as u ON (p.user_id = u.user_id)
        WHERE p.post_id LIKE ?
    `;

    const [ result ]: Post[] = await executeQuerySQL(req, res, querySQL, false, post_id);

    // Post privato: nessuno può commentare tranne il proprietario del post
    if (result.post_visibility === "private" && result.user_id !== user.user_id ) {
        console.log("Il post è privato e l'utente non è l'autore del post.");
        res.status(401).send("Don't have authorization to do this action.");
        return;
    }

    // Post pubblico ma account privato: solo il proprietario e gli amici possono commentare
    if (result.post_visibility === "public" && result.user_visibility === "private" && result.user_id !== user.user_id) {
        const followeQuerySQL: string = 
        `
            SELECT *
            FROM follower as f
            WHERE f.follower_user_id LIKE ? AND f.following_user_id LIKE ?
        `;

        const [ followerResult ]: Follower[] = await executeQuerySQL(req, res, followeQuerySQL, false, user.user_id, result.user_id);
        
        if (followerResult === undefined) {
            console.log("Il post è privato, l'autore è privato e l'utente non è l'autore del post ne un amico.");
            res.status(401).send("Don't have authorization to do this action.");
            return;
        }
    }

    const insertCommentQuerySQL: string = 
    `
        INSERT INTO posts_comments (post_id, user_id, content)
        VALUES (?, ?, ?)
    `;

    console.log(post_id, user.user_id, post_comment);

    await executeQuerySQL(req, res, insertCommentQuerySQL, false, post_id, user.user_id, post_comment);
    res.status(200).send("Tutto ok");
};


// da migliorare. aggiungere i controlli per utenti/post pubblici e private
export const search = async (req: Request, res: Response): Promise<void> => {
    const searchQuery: string = "%" + req.params.query + "%";

    console.log(searchQuery);

    let querySQL: string = 
    `
        SELECT u.username, u.full_name, u.profile_picture
        FROM users as u
        WHERE u.username LIKE ?
        LIMIT 10
    `;

    const usersResults: userSearch[] = await executeQuerySQL(req, res, querySQL, false, searchQuery);

    querySQL = 
    `
        SELECT
            p.post_id, 
            p.user_id, 
            p.content, 
            p.created_at, 
            p.likes, 
            p.comments, 
            p.shares, 
            p.visibility AS post_visibility, 
            u.username, 
            u.full_name, 
            u.visibility AS user_visibility
        FROM users as u JOIN posts as p ON (u.user_id = p.user_id)
        WHERE p.content LIKE ?
        LIMIT 10
    `;    

    // AND (
    //     p.visibility = 'public' OR 
    //     (p.visibility = 'private' AND u.user_id = ?)
    //     )

    const postsResults: Post[] = await executeQuerySQL(req, res, querySQL, false, searchQuery);

    const combinedResult: (Post[] | userSearch[])[] = [ usersResults, postsResults];

    res.status(200).send(combinedResult);
};