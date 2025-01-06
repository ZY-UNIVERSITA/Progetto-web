import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Follower, Post, User, userSearch } from "../utils/types";
import { getUser } from "../utils/auth";

const PUBLIC_VISIBILITY: string = "public";
const PRIVATE_VISIBILITY: string = "private";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const getUsersComments = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);
    const username: string = req.params.username;

    if (user == null) {
        res.status(401).send("You don't have permission to do that.");
        return;
    }

    const userQuerySQL = `
        SELECT u.username, u.user_id
        FROM users AS u
        WHERE u.username LIKE ?
    `;

    const [ searchedUserResult ]: User[] = await executeQuerySQL(req, res, userQuerySQL, false, username);

    console.log(searchedUserResult)

    if (!searchedUserResult) {
        res.status(404).send("No users found.");
        return;
    }

    // controlla se il like è già presente
    const querySQL: string = `
        SELECT *
        FROM posts_comments as pc
        WHERE pc.user_id = ?
    `;

    await executeQuerySQL(req, res, querySQL, true, searchedUserResult.user_id);        
}


export const postLikeAdd = async (req: Request, res: Response): Promise<void> => {
    const { post_id } = req.body;

    const user: User | null = getUser(req, res);

    if (user === null || post_id === null) {
        console.log("L'utente ha provato a mettere like ma non è loggato");
        res.status(401).send("User don't have the permission to do this.");
        return;
    }

    // controlla se il like è già presente
    const likeQuerySQL: string = `
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
        SELECT pc.comment_id, pc.created_at, pc.content, u.username, u.full_name, u.profile_picture
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


// Funzione di ricerca di utenti e post
export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchQuery: string = `%${req.params.query}%`;
        const user: User | null = getUser(req, res);

        console.log("Search query: ", searchQuery);

        // Ricerca utenti: non ha bisogno di controlli, l'username degli utenti sono pubblici di natura
        const userQuerySQL: string = `
            SELECT u.username, u.full_name, u.profile_picture
            FROM users AS u
            WHERE u.username LIKE ?
            LIMIT 10;
        `;
        const usersResults: userSearch[] = await executeQuerySQL(req, res, userQuerySQL, false, searchQuery);

        // Ricerca dei post: ci sono dei controlli sulla privatezza del post e dell'autore del post
        // Provo a fare un unica query in base a tutti questi parametri
        // Da testare il suo funzionamento
        const postQuerySQL = `
            SELECT DISTINCT 
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
            FROM posts AS p
            JOIN users AS u ON p.user_id = u.user_id
            LEFT JOIN follower AS f ON f.follower_user_id = ? AND f.following_user_id = u.user_id
            WHERE p.content LIKE ?
            AND (
                -- Caso 1: Post pubblico e autore pubblico
                (p.visibility = ? AND u.visibility = ?)
                
                -- Caso 2: Post pubblico e autore privato, visibile solo agli amici o all'autore
                OR (p.visibility = ? AND u.visibility = ? AND (p.user_id = ? OR f.following_user_id IS NOT NULL))
                
                -- Caso 3: Post privato, visibile solo all'autore
                OR (p.visibility = ? AND p.user_id = ?)
            )
            LIMIT 10;
        `;

        // Parametri della query
        const queryParams = [
            user ? user.user_id : "",       // Per LEFT JOIN amici
            searchQuery,                    // Contenuto del post
            
            PUBLIC_VISIBILITY,              // Caso 1: Post pubblico 
            PUBLIC_VISIBILITY,              // e autore pubblico
            PUBLIC_VISIBILITY,              // Caso 2: Post pubblico
            PRIVATE_VISIBILITY,             //  e autore privato
            user ? user.user_id : "",       // Utente loggato (per verificarne se è l'autore)

            PRIVATE_VISIBILITY,             // Caso 3: Post privato
            user ? user.user_id : ""        // Utente loggato (per verificare se è l'autore del post)
        ];

        const postsResults: Post[] = await executeQuerySQL(req, res, postQuerySQL, false, ...queryParams);

        console.log(postsResults)

        // Combina i risultati
        const combinedResult: (userSearch[] | Post[])[] = 
            [ usersResults, postsResults,] ;

        res.status(200).send(combinedResult);
    } catch (error: any) {
        console.error("C'è qualcosa che non va. Ricontrollare: ", error);
        res.status(500).send("Server error.");
    }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const user: User | null = getUser(req, res);
        const comment_id = req.params.id as string;

        console.log("prova" + comment_id + user);

        if (user === null) {
            console.error("Non può eliminare.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
            DELETE FROM posts_comments
            WHERE posts_comments.comment_id = ? AND posts_comments.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, comment_id, user.user_id);

            // Conta il numero di righe eliminate.
            if (result.affectedRows > 0) {
                console.log("Il commento è stato eliminato con successo.");
                res.status(200).send("Tutto ok");
                return;
            }

            console.error("Errore nell'eliminazione del commento.");
            res.status(404).send("Post not found.")
        }    
    } catch (error: any) {
        console.error(`Errore nell'eliminazione del commento ${req.params.post_id}`, error);
        res.status(500).send("Server error.");
    }
};

export const follow = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);
        const id = req.params.id as string;

        console.log(id)

        if (user === null) {
            console.error("Non può followare/unfolloware.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
                SELECT *
                FROM follower AS f
                WHERE f.follower_user_id = ? AND f.following_user_id = ?
            `;

            const [result] = await executeQuerySQL(req, res, querySQL, false, user.user_id, id);
            
            console.log(result);

            if (result !== undefined) {
                const deleteQuerySQL: string =`
                    DELETE FROM follower
                    WHERE follower_user_id = ? AND following_user_id = ?
                `;

                const result = await executeQuerySQL(req, res, deleteQuerySQL, false, user.user_id, id);

            console.log("tutto ok 1?")

            } else {
                const insertQuerySQL: string = `
                    INSERT INTO follower (follower_user_id, following_user_id)
                    VALUES (?, ?)
                `
                const result = await executeQuerySQL(req, res, insertQuerySQL, false, user.user_id, id);

            console.log("tutto ok 2?")

            }

            res.status(200).send("Tutto ok");
        }    
    } catch (error: any) {
        console.error("Errore nella funzione di follow", error);
        res.status(500).send("Server error.");
    }
};