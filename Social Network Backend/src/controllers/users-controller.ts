import { Request, Response } from "express"
import executeQuerySQL from "../utils/querySQL";
import { User } from "../utils/types";
import { getUser } from "../utils/auth";


const publicVisibility: string = "public";
const friendVisibility: string = "friends";


// First class function con funzione anonima di ts che ritorna una promise di tipo void
export const userProfile = async (req: Request, res: Response): Promise<void> => {
    const username: string = req.params.username;

    // Viene eseguito una query SQL
    const querySQL: string =
        `
        SELECT u.user_id, u.username, u.full_name, u.bio, u.birth_date, u.profile_picture, u.banner_picture, u.visibility, u.follower, u.following
        FROM users as u
        WHERE u.username = ?
    `;

    await executeQuerySQL(req, res, querySQL, true, username);
}

export const isFriend = async (req: Request, res: Response): Promise<void> => {
    const user: User | null = getUser(req, res);
    
    const username: string = req.params.username;

    console.log(username, user);

    const userIDQuerySQL: string =`
        SELECT u.user_id
        FROM users AS u
        WHERE u.username = ?
    `;

    let [ userid ]: any = await executeQuerySQL(req, res, userIDQuerySQL, false, username);

    console.log(userid)

    if (user !== null && userid !== undefined) {
        console.log("si tutto ok");
        const querySQL: string =`
            SELECT follower_user_id
            FROM follower AS f
            WHERE f.follower_user_id = ? AND f.following_user_id = ?
        `;

        await executeQuerySQL(req, res, querySQL, true, user.user_id, userid.user_id);
    } else {
        res.status(404).send("Not found.");
    }
    
}

export const getFriendsList = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        if (user === null) {
            console.error("Non puoi ottenere la lista degli amici.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
                SELECT f.following_user_id AS user_id, u.username
                FROM follower AS f LEFT JOIN users AS u ON (f.following_user_id = u.user_id)
                WHERE f.follower_user_id = ?
            `;

            await executeQuerySQL(req, res, querySQL, true, user.user_id);
        }
    } catch (e: any) {
        res.status(500).send("Errore interno del sever.");
        console.error("Errore", e)
    }
}