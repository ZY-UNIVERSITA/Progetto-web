import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Follower, modificableInfo, newOldPassword, Post, User, userSearch } from "../utils/types";
import { getUser, unsetUser } from "../utils/auth";
import bcrypt from "bcrypt"
import { profile } from "console";

const PUBLIC_VISIBILITY: string = "public";
const PRIVATE_VISIBILITY: string = "private";

export const changeInformation = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        const { full_name, bio, visibility } = req.body as modificableInfo;

        console.log(full_name, bio, visibility)

        if (user === null) {
            console.error("Non si può modificare l'account.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string = `
                UPDATE users
                SET full_name = ?, bio = ?, visibility = ?
                WHERE users.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, full_name, bio, visibility, user.user_id);

            // Conta il numero di righe eliminate.
            if (result.affectedRows > 0) {
                console.log("Le informazioni sono state aggiorante.");
                res.status(200).send("Tutto ok");
                return;
            }

            console.error("Errore nella modifica dell'account.");
            res.status(404).send("Account error.")
            return;
        }
    } catch (error: any) {
        console.error(`Errore nella modifica dell'account ${req.params.user_id}`, error);
        res.status(500).send("Server error.");
    }
};


/**
 * Modifica della password
 * @param req Richiesta: usa un form per inviare nel corpo del messaggio la vecchia password e la nuova password.
 * @param res Risposta.
 * @returns Una promise.
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);
        const { oldPassword, newPassword } = req.body as newOldPassword;

        console.log(oldPassword, newPassword);

        if (user === null) {
            console.error("Non si può cambiare la password.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string = `
                SELECT a.password_hash
                FROM accounts AS a
                WHERE a.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, user.user_id);

            console.log(result[0]);

            // Conta il numero di righe eliminate.
            if (result.length > 0) {
                const passwordComparison: boolean = await bcrypt.compare(oldPassword, result[0].password_hash);

                if (passwordComparison) {
                    const passwordHash: string = await bcrypt.hash(newPassword, 10);

                    const querySQL: string = `
                        UPDATE accounts
                        SET password_hash = ?
                        WHERE accounts.user_id = ?
                    `;

                    const result = await executeQuerySQL(req, res, querySQL, false, passwordHash, user.user_id);

                    // Conta il numero di righe eliminate.
                    if (result.affectedRows > 0) {
                        console.log("Le informazioni sono state aggiorante.");
                        res.status(200).send("Tutto ok");
                        return;
                    } else {
                        console.error("Errore nella modifica della password.");
                        res.status(404).send("Error with the password. Check you input.");
                        return;
                    }
                } else {
                    console.error("Errore nella modifica della password.");
                    res.status(404).send("Error with the password. Check you input.");
                    return;
                }
            } else {
                console.error("Errore nella modifica della password.");
                res.status(404).send("Account error.")
                return;
            }
        }
    } catch (error: any) {
        console.error(`Errore nella modifica della password ${req.params.user_id}`, error);
        res.status(500).send("Server error.");
    }
};


// Delete account
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        if (user == null) {
            console.error("Non si può eliminare l'account.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string = `
                DELETE FROM accounts
                WHERE accounts.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, user.user_id);

            // Conta il numero di righe eliminate.
            if (result.affectedRows > 0) {
                unsetUser(req, res);

                const deleteAllPostQuerySQL: string = `
                    DELETE FROM posts
                    WHERE posts.user_id = ?
                `;

                await executeQuerySQL(req, res, deleteAllPostQuerySQL, false, user.user_id);

                console.log("Account eliminato.");
                res.status(200).send("Tutto ok");
                return;
            } else {
                console.error("Errore nella eliminazione dell'account.");
                res.status(404).send("Error with the account. Check you input.");
                return;
            }
        }
    } catch (error: any) {
        console.error(`Errore nell'eliminazione dell'account ${req.params.user_id}`, error);
        res.status(500).send("Server error.");
    }
}

export const uploadProfileBanner = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        if (user === null) {
            res.status(401).send("Errore nell'invio dei file.");
        } else {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            console.log(req.files);

            const profilePicture = files["profile_picture"]?.[0]?.filename || null;
            const bannerPicture = files["banner_picture"]?.[0]?.filename || null;

            console.log(profilePicture, bannerPicture);

            if (profilePicture !== null) {
                const insertImageIntoDatabase: string =
                    `
                    UPDATE users
                    SET profile_picture = ?
                    WHERE user_id = ?
                `;

                await executeQuerySQL(req, res, insertImageIntoDatabase, false, profilePicture, user.user_id);   
            }

            if (bannerPicture !== null) {
                const insertImageIntoDatabase: string =
                    `
                    UPDATE users
                    SET banner_picture = ?
                    WHERE user_id = ?
                `;

                await executeQuerySQL(req, res, insertImageIntoDatabase, false, bannerPicture, user.user_id);   
            }

            res.status(200).send("Tutto ok.");            
        }

    } catch (error: any) {
        console.error("Errore nel salvataggio delle immagini", error);
        res.status(500).send("Server error.");
    }
}