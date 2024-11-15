import { Request, Response } from "express"
import connection from "../utils/db"

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const postID = async (req: Request, res: Response): Promise<void> => {
    const postID: string = req.params.id;

    // Diventerà una stringa di valore dinamico
    const visibility: string = "public";

    connection.execute(
        `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.visibility, p.likes, p.comments, p.shares, u.username, u.full_name
        FROM posts as p JOIN users as u ON (p.user_id = u.user_id)
        WHERE p.post_id = ? AND p.visibility LIKE ?
        `,
        [ postID, visibility ],
        function(err, results, fields) {
            console.log(results)
            res.json(results)
        }
    )
};

export const postsUser = async (req: Request, res: Response): Promise<void> => {
    const userID: string = req.params.id;

    // Diventerà una stringa di valore dinamico
    const visibility: string = "public";

    connection.execute(
        `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.visibility, p.likes, p.comments, p.shares
        FROM posts as p
        WHERE p.user_id = ? AND p.visibility LIKE ?
        `,
        [ userID, visibility ],
        function(err, results, fields) {
            res.json(results)
        }
    )
};

export const popularPosts = async (req: Request, res: Response): Promise<void> => {
    // Diventerà una stringa di valore dinamico
    const visibility: string = "public";

    connection.execute(
        `
        SELECT p.post_id, p.user_id, p.content, p.created_at, p.visibility, p.likes, p.comments, p.shares, u.username, u.full_name
        FROM posts as p JOIN users as u ON (p.user_id = u.user_id)

        -- Permette di selezionare solo i post non più vecchi di 30 giorni rispetto al momento in cui si effettua la query
        WHERE p.visibility LIKE ? AND p.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)

        -- Permette di ordinare i valori tramite un algoritmo di ranking basato su un punteggio ponderato
        -- Il numero di likes, commenti e shares permette di ottenere un punteggio elevato
        -- Il punteggio di un post diminuisce nel tempo
        ORDER BY (p.likes * 0.5 + p.comments * 0.3 + p.shares * 0.2 - 0.1 * TIMESTAMPDIFF(HOUR, created_at, NOW())) DESC
        LIMIT 20
        `,
        [ visibility ],
        function(err, results, fields) {
            res.json(results)
        }
    )
};