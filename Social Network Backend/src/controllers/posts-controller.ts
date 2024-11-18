import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { postID_interface, User } from "../utils/types";
import { getUser } from "../utils/auth";


const publicVisibility: string = "public";
const friendVisibility: string = "friends";


// First class function con funzione anonima di ts che ritorna una promise di tipo void


// LAVORARCI PENSANDO CHE SI DEBBA FARE TUTTE LE CHIAMATE AXIOS
/*
export const postID = async (req: Request, res: Response): Promise<void> => {
    const { user_id, username, visibility }: postID_interface = req.body;
    const post_id = req.params.id;

    const user: User | null = getUser(req, res);

    if (visibility === "friends") {
        if (user === null) {
            res.status(400).send("Not found or not friend");
            return;
        } 

        const confirmIfFriendQuerySQL: string = 
        `
            SELECT *
            FROM follower as f
            WHERE f.following_user_id = ? AND f.follower_user_id = ?
        `
        const result: any[] = await executeQuerySQL(req, res, confirmIfFriendQuerySQL, false, user_id, user.user_id);

        if (result.length === 0) {
            res.status(400).send("Not found or not friend");
            return;
        }
        }
    }

    const querySQL: string = 
    `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, u.username, u.full_name, u.visibility
        FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
        WHERE p.post_id = ? AND p.visibility LIKE ?
    `;

    

    await executeQuerySQL(req, res, querySQL, true, post_id, publicVisibility);
};*/


export const postsUser = async (req: Request, res: Response): Promise<void> => {
    const userID: string = req.params.id;

    const user: User | null = getUser(req, res);


    const querySQL: string = 
    `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.visibility, p.likes, p.comments, p.shares
        FROM posts as p
        WHERE p.user_id = ? AND p.visibility LIKE ?
    `;

    await executeQuerySQL(req, res, querySQL, true, userID, publicVisibility);
};


export const popularPosts = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);

    if (!user) {
        const querySQL: string = 
        `
            SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, u.username, u.full_name, u.visibility
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id)

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE u.visibility LIKE ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

            -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
            -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
            -- Il punteggio di un post diminuisce nel tempo
            ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, created_at, NOW())) DESC
            LIMIT 20
        `;
        await executeQuerySQL(req, res, querySQL, true, publicVisibility)
    } else {
        const querySQL: string = 
        `
            SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, u.username, u.full_name, u.visibility
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id) LEFT JOIN follower as f ON p.user_id = f.following_user_id

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE (u.visibility LIKE ? OR (u.visibility LIKE ? AND f.follower_user_id LIKE ?)) AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

            -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
            -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
            -- Il punteggio di un post diminuisce nel tempo
            ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, created_at, NOW())) DESC
            LIMIT 20
        `;

        await executeQuerySQL(req, res, querySQL, true, publicVisibility, friendVisibility, user.user_id)
    }
}
