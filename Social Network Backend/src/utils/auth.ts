import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "./types"

const JWT_SECRET_KEY = "SECRET_JWT_CODE_CREATING_ACCESS_TOKEN"
const COOKIE_NAME = "socialNetworkAccessToken"

export const setUser = (req: Request, res: Response, user: any) => {
    // crea un access token per un certo utente e firmandolo con la secret-key e settando il tempo di scadenza ad 1 settimana dalla creazione
    const accessToken = jwt.sign(user, JWT_SECRET_KEY, { 
        expiresIn: "7d"
    });

    // Crea un cookie in cui salvare l'access Token 
    res.cookie(COOKIE_NAME, accessToken, { 
        // imposta il tempo massimo di utilizzo del cookie. Deve essere fatto in millisecondi.
        // In questo caso è 1 settimana
        maxAge: 604800000,
        // non può essere manipolato dal JS lato utente
        httpOnly: true,
        // la trasmissione del cookie avviene solo tramite HTTPS
        secure: true,
        // Il cookie viene allegato solo per il dominio del sito
        sameSite: true,
     })
}

export const getUser = (req: Request, res: Response) => {
    const accessToken = req.cookies[COOKIE_NAME];

    // ritorna null se l'accesstoken è mancante o non valido
    if (!accessToken) {
        return null;
    }

    // se l'access token è esistente allora si prova a verificare se l'access token è stato generato con la secret-key 
    // se l'access token è stato effettivamente generato dalla secret-key allora restituisce i dati utenti
    try {
        const user = jwt.verify(accessToken, JWT_SECRET_KEY) as User;
        return user;
    
    // altrimenti ritorna null se la chiave non è valida
    } catch {
        return null;
    }
}

// Effettua il logout andando ad eliminare il cookie
export const unsetUser = (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME);
};
  