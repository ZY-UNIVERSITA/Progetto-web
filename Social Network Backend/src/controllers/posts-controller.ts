import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { createNewPost, Post, postID_interface, User } from "../utils/types";
import { getUser } from "../utils/auth";
import { upload } from "../utils/upload";


const publicVisibility: string = "public";
const privateVisibility: string = "private";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const postID = async (req: Request, res: Response): Promise<void> => {
    const post_id = req.params.id;

    const user: User | null = getUser(req, res);

    const querySQL: string = `
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
            u.visibility AS user_visibility,
            CASE
                 -- Se l'utente non è loggato, post_liked = 0
                WHEN ? IS NULL THEN 0
                -- Se c'è un like da parte dell'utente loggato, post_liked = 1
                WHEN pl.user_id IS NOT NULL THEN 1 
                -- Se l'utente è loggato ma non ha messo like, post_liked = 0
                ELSE 0
            END AS post_liked
        FROM 
            posts AS p
        JOIN 
            users AS u ON (p.user_id = u.user_id)
        LEFT JOIN 
            posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)
        WHERE 
            p.post_id = ?;
    `;

    let userId: string = "NULL";

    if (user !== null) {
        userId = user.user_id;
    }

    const [ result ]: Post[] = await executeQuerySQL(req, res, querySQL, false, userId, userId, post_id);

    // Controlla se il post esiste
    if (result === undefined) {
        console.log("Il post con id: " + post_id + " non esiste.");
        res.status(404).send("Not found or this user is not in your friends list.");
        return;
    }

    let postIsPublic: boolean = true;
    let userIsPublic: boolean = true;
    let clientIsOwner: boolean = false;

    if (result.post_visibility === privateVisibility) {
        postIsPublic = !postIsPublic;
    }

    if (user !== null) {
        if (user.user_id === result.user_id) {
            clientIsOwner = !clientIsOwner;
        }
    }

    // IL POST è NASCOSTO A TUTTI TRANNE AL PROPRIETARIO
    if (!postIsPublic) {

        // L'UTENTE NON è LOGGATO
        if (user === null) {
            console.log("Il post è privato e l'utente non è registrato.");
            res.status(404).send("Errore");
            return;
        } else {
            
            // L'UTENTE LOGGATO è L'AUTORE DEL POST NASCOSTO
            if (clientIsOwner) {
                console.log("Il post è privato e l'utente ne è l'autore.");
                res.send(result);
                return;

            // L'UTENTE LOGATO NON è L'AUTORE DEL POST NASCOSTO
            } else {
                console.log("Il post è privato e l'utente non è l'autore del post.")
                res.status(404).send("Errore");
                return;
            }
        }
    }

    // IL POST NON è NASCOSTO
    if (postIsPublic) {

        // IL POST NON NASCOSTO MA L'AUTORE è PRIVATO
        if (!userIsPublic) {

            // CONTROLLA CHE L'UTENTE SIA LOGGATO
            if (user === null) {
                console.log("Il profilo è privato e l'utente non è registrato.");
                res.status(404).send("Errore");
                return;
            } else {

                // CONTROLLA CHE IL CLIENT SIA ANCHE L'AUTORE DEL POST
                if (clientIsOwner) {
                    console.log("Il profilo è privato e l'utente ne è il proprietario.");
                    res.send(result);
                    return;
                } else {
                    const confirmIfFriendQuerySQL: string = 
                    `
                        SELECT *
                        FROM follower as f
                        WHERE f.follower_user_id = ? AND f.following_user_id = ?
                    `;
                
                    const resultFriend: any[] = await executeQuerySQL(req, res, confirmIfFriendQuerySQL, false, user.user_id, result.user_id);

                    // CONTROLLA CHE IL CLIENT SIA UN AMICO DELL'UTENTE PRIVATO
                    if (resultFriend.length > 0) {
                        console.log("Il profilo è privato e l'utente è amico con il proprietario.");
                        res.send(result);
                        return;

                    // SE L'UTENTE è PRIVATO E IL CLIENT NON è SUO AMICO
                    } else {
                        console.log("Il profilo è privato e l'utente non è amico con il proprietario.");
                        res.status(404).send("Errore");
                        return;
                    }
                 }
            }
        }
    }

    // SE IL POST è PUBBLICO E IL PROFILO è PUBBLICO
    res.send(result);
};


export const postsUser = async (req: Request, res: Response): Promise<void> => {
    const username: string = req.params.username;

    const user: User | null = getUser(req, res);

    const userQuerySQL: string = 
    `
        SELECT u.username, u.user_id, u.visibility
        FROM users as u
        WHERE u.username LIKE ?
    `;

    const [ searchedUserResult ]: postID_interface[] = await executeQuerySQL(req, res, userQuerySQL, false, username);

    // Controlla che l'utente esista
    if (searchedUserResult === undefined) {
        console.log("L'utente non esiste.")
        res.status(404).send("L'utente non esiste.");
        return;
    }

    let searchedUserIsPublic: boolean = true;
    let clientIsOwner: boolean = false;
    let userIsLogged: boolean = false;

    if (searchedUserResult.visibility === privateVisibility) {
        searchedUserIsPublic = !searchedUserIsPublic;
    }

    if (user !== null) {
        if (user.user_id === searchedUserResult.user_id) {
            clientIsOwner = !clientIsOwner;
        }
        
        userIsLogged = true;
    }

    const orderBy = 
    `
        ORDER BY p.created_at DESC
    `;


    // UTENTE NON LOGGATO
    if (!userIsLogged) {
        // UTENTE NON LOGGATO MA ACCOUNT PUBBLICO
        if (searchedUserIsPublic) {
            console.log("L'utente non è registrato però l'utente cercato è pubblico.");

            let querySQL: string = 
            `
                SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, p.visibility as post_visibility, u.username, u.full_name, u.visibility as user_visibility
                FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
                WHERE u.username LIKE ? AND p.visibility LIKE ? 
            `;

            querySQL += orderBy;
            
            await executeQuerySQL(req, res, querySQL, true, username, publicVisibility);
            return;
        
        // UTENTE NON LOGGATO MA ACCOUNT PRIVATO
        } else {
            console.log("L'utente non è registrato e l'utente cercato non è pubblico");
            res.status(401).send("Searched user is private. You must login to continue.");
            return;
        }
    }


    // UTENTE LOGGATO
    if (user !== null) {
        let querySQL: string = 
                `SELECT DISTINCT 
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
                    u.visibility AS user_visibility,
                    CASE
                        -- Se l'utente non è loggato, post_liked = 0
                        WHEN ? IS NULL THEN 0
                        -- Se c'è un like da parte dell'utente loggato, post_liked = 1
                        WHEN pl.user_id IS NOT NULL THEN 1 
                        -- Se l'utente è loggato ma non ha messo like, post_liked = 0
                        ELSE 0
                    END AS post_liked
                FROM 
                    posts AS p
                JOIN 
                    users AS u ON (p.user_id = u.user_id)
                LEFT JOIN 
                    posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)
            `;


        // UTENTE LOGGATO E PROPRIETARIO DELL'ACCOUNT
        if (user.user_id === searchedUserResult.user_id) {
            console.log("L'utente è loggato ed è il proprietario dell'account");

            querySQL += `
                WHERE u.username LIKE ?
            `;

            querySQL += orderBy;

            await executeQuerySQL(req, res, querySQL, true, searchedUserResult.user_id, searchedUserResult.user_id, username);
            return;
        }

        // UTENTE LOGGATO E PROFILO PUBBLICO
        if (searchedUserIsPublic) {
            console.log("L'utente è loggato e l'utente cercato è pubblico.");

            querySQL += 
            `
                WHERE u.username LIKE ? AND p.visibility LIKE ?
            `;

            querySQL += orderBy;

            await executeQuerySQL(req, res, querySQL, true, searchedUserResult.user_id, searchedUserResult.user_id, username, publicVisibility);
            return;
        }

        // UTENTE LOGGATO E PROFILE PRIVATO
        if (!searchedUserIsPublic) {

            // CONTROLLA SE CLIENT E UTENTE SONO AMICI
            const confirmIfFriendQuerySQL: string = 
            `
                SELECT *
                FROM follower as f
                WHERE f.follower_user_id = ? AND f.following_user_id = ?
            `;
                
            const resultFriend: any[] = await executeQuerySQL(req, res, confirmIfFriendQuerySQL, false, user.user_id, searchedUserResult.user_id);
            
            // UTENTE LOGGATO E AMICO DEL PROFILO PRIVATO
            if (resultFriend.length > 0) {
                    
                console.log("L'utente è loggato e l'utente cercato è privato ma i 2 utenti sono amici.");

                querySQL += 
                `
                    WHERE u.username LIKE ? AND p.visibility LIKE ?
                `;

                querySQL += orderBy;

                await executeQuerySQL(req, res, querySQL, true, searchedUserResult.user_id, searchedUserResult.user_id, username, publicVisibility);
                return;
            } else {
                console.log("L'utente non è registrato e l'utente cercato non è pubblico");
                res.status(401).send("Searched user is private. You must login to continue.");
                return;
            }
        }
    }
};


/* GET POPULAR POST */ 
export const popularPosts = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);

    let userId: string = "NULL";

    if (user !== null) {
        userId = user.user_id;
    }

    let querySQL: string = `
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
            u.visibility AS user_visibility,
            CASE
                -- Se l'utente non è loggato, post_liked = 0
                WHEN ? IS NULL THEN 0
                -- Se c'è un like da parte dell'utente loggato, post_liked = 1
                WHEN pl.user_id IS NOT NULL THEN 1 
                -- Se l'utente è loggato ma non ha messo like, post_liked = 0
                ELSE 0
            END AS post_liked
    `;          

    const orderingQuerySQL: string = 
    `
        -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
        -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
        -- Il punteggio di un post diminuisce nel tempo
        ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, p.created_at, NOW())) DESC
        LIMIT 20
    `;

    // L'UTENTE NON è REGISTRATO
    if (!user) {
        console.log("Post popolari: l'utente non è registrato");
        querySQL += 
        `
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id) LEFT JOIN posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE p.visibility LIKE ? AND u.visibility LIKE ? 
            AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;

        querySQL += orderingQuerySQL;

        await executeQuerySQL(req, res, querySQL, true, userId, userId, publicVisibility, publicVisibility);

    // L'UTENTE è REGISTRATO
    } else {
        console.log("Post popolari: l'utente è registrato");
        
        querySQL += 
        `
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id) LEFT JOIN follower as f ON p.user_id = f.following_user_id LEFT JOIN posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE ((p.visibility LIKE ? AND u.visibility LIKE ?)
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND (f.follower_user_id LIKE ? OR p.user_id LIKE ?))
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND p.user_id LIKE ?)
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND p.user_id LIKE ?))
            AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `;
        
        querySQL += orderingQuerySQL;

        await executeQuerySQL(req, res, querySQL, true, userId, userId,
                                                        publicVisibility, publicVisibility, 
                                                        publicVisibility, privateVisibility, user.user_id, user.user_id,
                                                        privateVisibility, publicVisibility, user.user_id,
                                                        privateVisibility, privateVisibility, user.user_id)
    }
}

export const newPost = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);

    if (user === null) {
        console.log("User tried to create a new post but is not logged.");
        res.status(401).send("You must login to continue");
        return;
    }

    let { postContent, visibility }: createNewPost = req.body;

    let files = req.files as Express.Multer.File[];

    if (visibility === "public" || visibility === "private") {
    } else {
        visibility = publicVisibility;
    }

    console.log(user.user_id);
    console.log(postContent);
    console.log(visibility);
    console.log(files);

    const querySQL: string = 
    `
        INSERT INTO posts (user_id, content, visibility)
        VALUES (?, ?, ?)
    `;

    const result = await executeQuerySQL(req, res, querySQL, false, user.user_id, postContent, visibility);

    const insertImageIntoDatabase: string = 
    `
        INSERT INTO posts_images (post_id, url)
        VALUES (?, ?)
    `;


    if (files !== undefined) {
        for (let i = 0; i < files.length; i++) {
            await executeQuerySQL(req, res, insertImageIntoDatabase, false, result.insertId, files[i].filename);
        }
    }


    res.status(200).send("Tutto ok");
}

export const postImages = async (req: Request, res: Response): Promise<void> => {
    const post_id = req.query.post_id as string;

    const querySQL: string = 
    `
        SELECT pi.url
        FROM posts_images as pi
        WHERE pi.post_id LIKE ?
    `;

    const result = await executeQuerySQL(req, res, querySQL, false, post_id);

    if (result.length === 0) {
        console.log("vuoto");
    } else {
        console.log(result);
    }

    res.send(result);
}