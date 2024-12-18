import bcrypt from "bcrypt"
import { Request, Response } from "express";
import { getUser, setUser, unsetUser } from "../utils/auth";
import { RegisterRequest, LoginRequest, User, UserUsernameEmail, LoginVerify } from "../utils/types";
import executeQuerySQL from "../utils/querySQL";

/* REGISTER A NEW ACCOUNT */
export const register = async (req: Request, res: Response): Promise<void> => {
    /* CONTROLLA SE IL LOGIN è GIà EFFETTUATO */
    // Verifica se l'utente ha già effettuato il login
    const user: User | null = getUser(req, res);

    if (user) {
        res.status(400).send("You are already logged");
        return;
    }
    

    /* CONTROLLA SE L'UTENTE E/O EMAIL è GIà PRESENTE */
    // se l'utente non è loggato allora assegna a 2 variabili i valori delle chiavi con lo stesso nome situati nell'oggetto req.body
    const { username, email, password, birthDate }: RegisterRequest = req.body;

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
        res.status(400).send("Username/email is already in use. Choose another one.");
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
        message: "Registration ok."
    })
};


/* LOGIN CONTROLLER */
export const login = async (req: Request, res: Response): Promise<void> => {
    /* CONTROLLA SE IL LOGIN è GIà EFFETTUATO */
    // Verifica se l'utente ha già effettuato il login
    const user: User | null = getUser(req, res);

    if (user) {
        res.status(400).send("Already logged");
        return;
    }


    /* CONTROLLA SE L'UTENTE E/O EMAIL è GIà PRESENTE */
    // se l'utente non è loggato allora assegna a 2 variabili i valori delle chiavi con lo stesso nome situati nell'oggetto req.body
    const { usernameOrEmail, password }: LoginRequest = req.body;

    const querySQL: string = 
    `
        SELECT u.username, u.user_id, a.password_hash
        FROM users as u JOIN accounts as a ON (u.user_id = a.user_id)
        WHERE u.username LIKE ? OR a.email LIKE ?
    `;

    // esegue una querysql per vedere se la query ha un utente con lo stesso username
    const usersWithSameUsernameOrEmail: LoginVerify[] = await executeQuerySQL(req, res, querySQL, false, usernameOrEmail, usernameOrEmail );

    // se la query ha trovato qualcosa allora significa che l'utente non è presente nel sito
    if (usersWithSameUsernameOrEmail.length === 0) {
        res.status(400).send("Username/email is wrong. Check you input.");
        return; 
    }
    

    /* CONFRONTA LA PASSWORD INSERITA E QUELLA PRESENTE NEL DATABASE */
    const userLoginInfo: LoginVerify = usersWithSameUsernameOrEmail[0];
    const user_id = userLoginInfo.user_id;
    const username = userLoginInfo.username;
    const passwordHash = userLoginInfo.password_hash;
    const passwordComparison: boolean = await bcrypt.compare(password, passwordHash);

    if (!passwordComparison) {
        res.status(400).send("Username/Email/Password is wrong. Check you input.")
        return;
    }


    /* CREA UN TOKEN E INSERISCILO IN UN COOKIE */
    const userInfo: User = { user_id, username };
    setUser(req, res, userInfo);
 
    res.json({
        message: "Login ok." 
    })
};


/* LOGOUT */
export const logout = async (req: Request, res: Response): Promise<void> => {
    /* CONTROLLA SE IL LOGIN è GIà EFFETTUATO */
    // Verifica se l'utente ha già effettuato il login
    const user: User | null = getUser(req, res);

    if (!user) {
        res.status(400).send("No login found.");
        return;
    }

    unsetUser(req, res);

    res.json({
        message: "Logout ok."
    })
};


/* DECODIFICA IL TOKEN E INVIA UNA RISPOSTA*/
export const profile =  async (req: Request, res: Response): Promise<void> => {
    // Decodifica i valori user_id e username dal token
    const user: User | null = getUser(req, res);

    res.json(user);
};