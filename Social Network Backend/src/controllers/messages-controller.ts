import { Request, Response } from "express";
import executeQuerySQL from "../utils/querySQL";
import { Follower, Post, User, userSearch } from "../utils/types";
import { getUser } from "../utils/auth";


export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User | null = getUser(req, res);

        if (user === null) {
            console.error("Non puoi ottenere i messaggi.");
            res.status(401).send("You don't have the permissions to do that.");
            return;
        } else {
            const querySQL: string =`
                SELECT m.sender_id, m.receiver_id, m.content, m.timestamp, m.status, sender.username AS sender_username, receiver.username AS receiver_username
                FROM messages AS m LEFT JOIN users as sender ON (m.sender_id = sender.user_id) LEFT JOIN users as receiver ON (m.receiver_id = receiver.user_id)
                WHERE m.receiver_id = ? OR m.sender_id = ?
                ORDER BY m.timestamp ASC
            `;

            const results = await executeQuerySQL(req, res, querySQL, false, user.user_id, user.user_id);
            
            // console.log(results);

            res.status(200).send(results);
        }    
    } catch (error: any) {
        console.error("Errore nell'ottenimento dei messaggi", error);
        res.status(500).send("Server error.");
    }
};