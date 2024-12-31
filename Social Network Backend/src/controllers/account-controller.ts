import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Follower, Post, User, userSearch } from "../utils/types";
import { getUser, unsetUser } from "../utils/auth";
import bcrypt from "bcrypt"

const PUBLIC_VISIBILITY: string = "public";
const PRIVATE_VISIBILITY: string = "private";

export const changeInformation = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        const full_name = req.query.full_name as string;
        const bio = req.query.bio as string;
        const birth_date = req.query.birth_date as string;
        const visibility = req.query.visibility as string;

        if (user === null) {
            console.error("Non si può modificare l'account.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
                UPDATE users
                SET full_name = ?, bio = ?, births_date = ?, visibility = ?
                WHERE users.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, full_name, bio, birth_date, visibility, user.user_id);

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
        const oldPassword = req.query.oldPassword as string;
        const newPassword = req.query.newPassword as string;

        if (user === null) {
            console.error("Non si può cambiare la password.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
                SELECT a.password_hash
                FROM accounts AS a
                WHERE a.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, user.user_id);

            // Conta il numero di righe eliminate.
            if (result.length > 0) {
                const passwordComparison: boolean = await bcrypt.compare(oldPassword, result[0]);
                
                if (passwordComparison) {
                    const passwordHash: string = await bcrypt.hash(newPassword, 10);

                    const querySQL: string =`
                        UPDATE accounts
                        SET password_hash = ?
                        WHERE users.user_id = ?
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
            const querySQL: string =`
                DELETE FROM accounts
                WHERE users.user_id = ?
            `;

            const result = await executeQuerySQL(req, res, querySQL, false, user.user_id);

            // Conta il numero di righe eliminate.
            if (result.affectedRows > 0) {
                unsetUser(req, res);
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