import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { createNewPost, Post, User, UserVisibility } from "../utils/types";
import { getUser } from "../utils/auth";
import { isFriend, isPostOwner } from "../utils/utils";

const publicVisibility: string = "public";
const privateVisibility: string = "private";

// Funzione per trovare i dati di un singolo post, dato l'ID del post
export const postID = async (req: Request, res: Response): Promise<void> => {
    const post_id: string = req.params.id;

    const user: User | null = getUser(req, res); // Funzione per ottenere l'utente loggato
    const userId: string = user ? user.user_id : "NULL";

    // Query SQL per ottenere il post
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
        FROM posts AS p
        JOIN users AS u ON p.user_id = u.user_id
        LEFT JOIN posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)
        WHERE p.post_id = ?
    `;

    // Esecuzione query: teoricamente dovrebbe ritornare un array di post con 1 singolo risultato. L'unico risultato viene inserito in una variabile
    const [ result ]: Post[] = await executeQuerySQL(
        req,
        res,
        querySQL,
        false,
        userId,
        userId,
        post_id
    );

    // Controllaa se il post esiste
    if (!result) {
        console.log(`Il post con id: ${post_id} non esiste.`);
        res.status(404).send("Not found or this user is not in your friends list.");
        return;
    }

    const postIsPublic: boolean = result.post_visibility === publicVisibility;
    const userIsPublic: boolean = result.user_visibility === publicVisibility;
    const clientOwnsPost: boolean = isPostOwner(user, result.user_id);

    // Post privato: solo l'utente può vederlo
    if (!postIsPublic) {
        // L'utente non è registrato
        if (!user) {
            console.log("Il post è privato e l'utente non è registrato.");
            res.status(404).send("Error trying to get the post.");
            // l'utente è il proprietario del post
        } else if (!clientOwnsPost) {
            console.log("Il post è privato e l'utente non è l'autore del post.");
            res.status(404).send("Error trying to get the post.");
            // l'utente è il proprietario del post
        } else {
            console.log("Il post è privato e l'utente ne è l'autore.");
            res.send(result);
        }
        return;
    }

    // Post pubblico ma profilo privato: solo l'autore e gli amici possono vederlo
    if (!userIsPublic) {
        // L'utente non è registrato
        if (!user) {
            console.log("Il profilo è privato e l'utente non è registrato.");
            res.status(404).send("Error trying to get the post.");
        // L'utente è l'autore del post
        } else if (clientOwnsPost) {
            console.log("Il profilo è privato e l'utente ne è il proprietario.");
            res.send(result);
        // Controlla se l'utente è amico o meno dell'autore
        } else {
            const userIsFriend: boolean = await isFriend(req, res, user.user_id, result.user_id);

            // Amico dell'autore del post
            if (userIsFriend) {
                console.log("Il profilo è privato e l'utente è amico con il proprietario.");
                res.send(result);

            // Non amico con l'autore del post
            } else {
                console.log("Il profilo è privato e l'utente non è amico con il proprietario.");
                res.status(404).send("Errore");
            }
        }
        return;
    }

    // Post pubblico e profilo pubblico
    res.send(result);
};


// Funzione principale per ottenere i post di un utente
export const postsUser = async (req: Request, res: Response): Promise<void> => {
    const username: string = req.params.username;

    const user: User | null = getUser(req, res);

    // Query per ottenere l'utente cercato
    const userQuerySQL = `
        SELECT u.username, u.user_id, u.visibility
        FROM users AS u
        WHERE u.username LIKE ?
    `;

    const [ searchedUserResult ]: UserVisibility[] = await executeQuerySQL(req, res, userQuerySQL, false, username);

    // Controlla che l'utente esista
    if (!searchedUserResult) {
        console.log("L'utente non esiste.");
        res.status(404).send("L'utente non esiste.");
        return;
    }

    const searchedUserIsPublic: boolean = searchedUserResult.visibility === publicVisibility;
    const clientIsOwner: boolean = isPostOwner(user, searchedUserResult.user_id);

    const baseQuery = `
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
                WHEN ? IS NULL THEN 0
                WHEN pl.user_id IS NOT NULL THEN 1 
                ELSE 0
            END AS post_liked
        FROM posts AS p
        JOIN users AS u ON p.user_id = u.user_id
        LEFT JOIN posts_likes AS pl ON (p.post_id = pl.post_id AND pl.user_id = ?)
    `;

    const orderBy = `ORDER BY p.created_at DESC`;

    // Caso 1: Utente non loggato
    if (!user) {
        // Profilo pubblico
        if (searchedUserIsPublic) {
            console.log("L'utente non è registrato però l'utente cercato è pubblico.");

            const query = `${baseQuery} 
                            WHERE u.username LIKE ? AND p.visibility LIKE ? 
                            ${orderBy}`;

            await executeQuerySQL(req, res, query, true, "", "", username, publicVisibility);

        // Profilo privato
        } else {
            console.log("L'utente non è registrato e l'utente cercato è privato.");
            res.status(401).send("Searched user is private. You must login to continue.");
        }
        return;
    }

    // Caso 2: Utente loggato
    let queryParams: any[] = [user.user_id, user.user_id, username];
    let queryConditions: string = "";

    // Utente e profilo coincidono
    if (clientIsOwner) {
        console.log("L'utente è loggato ed è il proprietario dell'account.");
        queryConditions = `WHERE u.username LIKE ?`;
    
    // Il profilo è pubblico
    } else if (searchedUserIsPublic) {
        console.log("L'utente è loggato e l'utente cercato è pubblico.");
        queryConditions = `WHERE u.username LIKE ? AND p.visibility LIKE ?`;
        queryParams.push(publicVisibility);
    } else {
        // Il profilo è privato quindi si verifica se l'utente è amico con il profilo
        const friend: boolean = await isFriend(req, res, user.user_id, searchedUserResult.user_id);

        // Sono amici
        if (friend) {
            console.log("L'utente è loggato e amico con il proprietario del profilo privato.");
            queryConditions = `WHERE u.username LIKE ? AND p.visibility LIKE ?`;
            queryParams.push(publicVisibility);

        // Non sono amici
        } else {
            console.log("L'utente è loggato ma il profilo è privato e non sono amici.");
            res.status(401).send("Searched user is private. You must login to continue.");
            return;
        }
    }

    const finalQuery = `${baseQuery} ${queryConditions} ${orderBy}`;

    // Operatore spread di js che permette di espandere l'array da passare come singoli elementi
    // esempioArray = [ a, b, c ] -> funzione(...esempioArray) -> funzione(a , b, c)
    await executeQuerySQL(req, res, finalQuery, true, ...queryParams);
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

    // console.log(user.user_id);
    // console.log(postContent);
    // console.log(visibility);
    // console.log(files);

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


// Postare immagine
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
        console.log("Non ci sono immagini.");
    } else {
        console.log(result);
    }

    res.send(result);
}


// Eliminare post
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);
    const post_id = req.params.id as string;

    console.log(req.params);

    if (user === null) {
        console.error("Non si può eliminare il post.");
        res.status(401).send("You don't have the permissions to do that.");
        return;
    } else {
        const querySQL: string =`
        DELETE FROM posts
        WHERE posts.post_id = ? AND posts.user_id = ?
        `;

        const result = await executeQuerySQL(req, res, querySQL, false, post_id, user.user_id);

        // Conta il numero di righe eliminate.
        if (result.affectedRows > 0) {
            console.log("Il commento è stato eliminato con successo.");
            res.status(200).send("Tutto ok");
            return;
        }

        console.error("Errore nell'eliminazione del post.");
        res.status(404).send("Post not found.")
    }    
}