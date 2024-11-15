import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { getUser, setUser, unsetUser } from "../utils/auth";
import { RegisterRequest, User, UserUsernameEmail } from "../utils/types";
import executeQuerySQL from "../utils/querySQL";
import { randomInt } from "crypto";

export const register = async (req: Request, res: Response): Promise<void> => {
    /* CONTROLLA SE IL LOGIN è GIà EFFETTUATO */
    // Verifica se l'utente ha già effettuato il login
    const user = getUser(req, res);

    if (user) {
        res.status(400).send("Already logged");
        return;
    }
    

    /* CONTROLLA SE L'UTENTE E/O EMAIL è GIà PRESENTE */
    // se l'utente non è loggato allora assegna a 2 variabili i valori delle chiavi con lo stesso nome situati nell'oggetto req.body
    const { username, email, password, birthDate }: RegisterRequest = req.body

    const querySQL: string = 
    `
        SELECT u.username, a.email
        FROM users as u JOIN accounts as a ON (u.user_id = a.user_id)
        WHERE u.username LIKE ? OR a.email LIKE ?
    `;

    // esegue una querysql per vedere se la query ha un utente con lo stesso username
    const usersWithSameUsernameOrEmail: UserUsernameEmail[] = await executeQuerySQL(req, res, querySQL, false, username, email);

    // se la query ha trovato qualcosa allora significa che l'utente è già presente
    if (usersWithSameUsernameOrEmail.length > 0) {
        res.status(400).send("Username/email are already in use.")
        return; 
    }


    /* CREA UNA PASSWORD HASH E LO INSERISCE NEL DATABASE */
    /*
        se lo username non è presente allora genera una hash della password costittuito da diverse parti separate da $:
        versione 
        il cost factor
        il salt
        la password in foormato hash
    */
    const passwordHash: string = await bcrypt.hash(password, 10);

    const querySQLInsertIntoUser: string =
    `
        INSERT INTO users (username, birth_date)
        VALUES (?, ?)
    `;

    const insertUsername: any = await executeQuerySQL(req, res, querySQLInsertIntoUser, false, username, birthDate);

    const user_id: string = insertUsername.insertId;

    const querySQLInsertIntoAccount: string = 
    `
        INSERT INTO accounts (user_id, email, password_hash)
        VALUES (?, ?, ?)
    `;

    await executeQuerySQL(req, res, querySQLInsertIntoAccount, false, user_id, email, passwordHash);

    const userInfo: User = { user_id, username };


    /* CREA UN TOKEN E INSERISCILO IN UN COOKIE */
    setUser(req, res, userInfo);
 
    res.json({
        message: "Tutto ok"
    })
};

export const login = () => {};
export const logout = () => {};
export const profile = () => {};