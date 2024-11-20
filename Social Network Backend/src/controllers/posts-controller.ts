import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Post, postID_interface, User } from "../utils/types";
import { getUser } from "../utils/auth";


const publicVisibility: string = "public";
const privateVisibility: string = "private";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const postID = async (req: Request, res: Response): Promise<void> => {
    const post_id = req.params.id;

    const user: User | null = getUser(req, res);

    const querySQL: string = 
    `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, p.visibility as post_visibility, u.username, u.full_name, u.visibility as user_visibility
        FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
        WHERE p.post_id = ?
    `;

    const [ result ]: Post[] = await executeQuerySQL(req, res, querySQL, false, post_id);

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

    if (result.user_visibility === privateVisibility) {
        userIsPublic = !userIsPublic;
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
        SELECT *
        FROM users as u
        WHERE u.username LIKE ?
    `;

    const [ result ]: any = await executeQuerySQL(req, res, userQuerySQL, false, username);

    // Controlla che l'utente esista
    if (result === undefined) {
        console.log("L'utente non esiste.")
        res.status(404).send("L'utente non esiste.");
        return;
    }

    let userIsPublic: boolean = true;
    let clientIsOwner: boolean = false;

    if (result.visibility === privateVisibility) {
        userIsPublic = !userIsPublic;
    }

    if (user !== null) {
        if (user.user_id === result.user_id) {
            clientIsOwner = !clientIsOwner;
        }
    }


    // SE IL PROFILO è PRIVATO
    if (!userIsPublic) {

        // L'UTENTE NON è LOGGATO
        if (user === null) {
            console.log("Il profilo è privato e l'utente non è registrato.");
            res.status(404).send("Errore");
            return;
        } else {

            // L'UTENTE IL PROPRIETARIO DEL PROFILO
            if (clientIsOwner) {
                console.log("Il profilo è privato e l'utente ne è il proprietario.");

                const userPostsQuerySQL: string = 
                `
                    SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, p.visibility as post_visibility, u.username, u.full_name, u.visibility as user_visibility
                    FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
                    WHERE u.username LIKE ?
                `;

                const postsResults: any = await executeQuerySQL(req, res, userPostsQuerySQL, false, username);

                res.send(postsResults);
                return;
            } 


            // CONTROLLA SE CLIENT E UTENTE SONO AMICI
            const confirmIfFriendQuerySQL: string = 
                    `
                        SELECT *
                        FROM follower as f
                        WHERE f.follower_user_id = ? AND f.following_user_id = ?
                    `;
                
            const resultFriend: any[] = await executeQuerySQL(req, res, confirmIfFriendQuerySQL, false, user.user_id, result.user_id);
            

            // SE IL CLIENT E L'UTENTE SONO AMICI
            if (resultFriend.length > 0) {
                console.log("Il client è amico con l'utente.");
                const userPostsQuerySQL: string = 
                `
                    SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, p.visibility as post_visibility, u.username, u.full_name, u.visibility as user_visibility
                    FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
                    WHERE u.username LIKE ? AND p.visibility LIKE ?
                `;

                const postsResults: any = await executeQuerySQL(req, res, userPostsQuerySQL, false, username, publicVisibility);

                res.send(postsResults);
                return;

            // SE NON SONO AMICI
            } else {
                console.log("Il profilo è privato e l'utente non è amico con il proprietario.");
                res.status(404).send("Errore");
                return;
            }
        }
    }


    // MOSTRA I POST PUBBLICI DELL'ACCOUNT PUBBLICO
    const userPostsQuerySQL: string = 
    `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, p.visibility as post_visibility, u.username, u.full_name, u.visibility as user_visibility
        FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
        WHERE u.username LIKE ? AND p.visibility LIKE ?
    `;

    const postsResults: any = await executeQuerySQL(req, res, userPostsQuerySQL, false, username, publicVisibility);


    res.send(postsResults);
};

//  
export const popularPosts = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);
    // L'UTENTE NON è REGISTRATO
    if (!user) {
        const querySQL: string = 
        `
            SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, u.username, u.full_name, p.visibility as post_visibility, u.visibility as user_visibility
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id)

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE p.visibility LIKE ? AND u.visibility LIKE ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

            -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
            -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
            -- Il punteggio di un post diminuisce nel tempo
            ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, created_at, NOW())) DESC
            LIMIT 20
        `;
        await executeQuerySQL(req, res, querySQL, true, publicVisibility, publicVisibility);

    // L'UTENTE è REGISTRATO
    } else {
        console.log("Utente è registrato");
        
        const querySQL: string = 
        `
            SELECT p.post_id, p.user_id, p.content, p.created_at, p.likes, p.comments, p.shares, u.username, u.full_name, p.visibility as post_visibility, u.visibility as user_visibility
            FROM posts as p JOIN users as u ON (p.user_id = u.user_id) LEFT JOIN follower as f ON p.user_id = f.following_user_id

            -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
            WHERE ((p.visibility LIKE ? AND u.visibility LIKE ?)
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND (f.follower_user_id LIKE ? OR p.user_id LIKE ?))
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND p.user_id LIKE ?)
            OR (p.visibility LIKE ? AND u.visibility LIKE ? AND p.user_id LIKE ?))
            AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

            -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
            -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
            -- Il punteggio di un post diminuisce nel tempo
            ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, created_at, NOW())) DESC
            LIMIT 20
        `;

        await executeQuerySQL(req, res, querySQL, true, publicVisibility, publicVisibility, 
                                                        publicVisibility, privateVisibility, user.user_id, user.user_id,
                                                        privateVisibility, publicVisibility, user.user_id,
                                                        privateVisibility, privateVisibility, user.user_id)
    }
}