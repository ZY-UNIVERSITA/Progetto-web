import { Request, Response } from "express"
import executeQuerySQL from "../utils/querySQL";

// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    const username: string = req.params.username;

    // Diventerà una stringa di valore dinamico
    const visibility: string = "public";

    // Viene eseguito una query SQL
    const querySQL: string =
        `
        SELECT u.username, u.full_name, u.bio, u.birth_date, u.profile_picture, u.banner_picture
        FROM users as u
        WHERE u.username = ? AND u.visibility LIKE ?
    `;

    await executeQuerySQL(req, res, querySQL, username, visibility);
}
