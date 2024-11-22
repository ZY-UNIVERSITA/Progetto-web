import { Request, Response } from "express"
import executeQuerySQL from "../utils/querySQL";


const publicVisibility: string = "public";
const friendVisibility: string = "friends";


// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    const username: string = req.params.username;

    // Viene eseguito una query SQL
    const querySQL: string =
        `
        SELECT u.user_id, u.username, u.full_name, u.bio, u.birth_date, u.profile_picture, u.banner_picture, u.visibility
        FROM users as u
        WHERE u.username = ?
    `;

    await executeQuerySQL(req, res, querySQL, true, username);
}
