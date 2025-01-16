import connection from "../utils/db"
import { Request, Response } from "express";

/**
 * Permette di effettuare una querySQL che accetta:
 * @param req Richiesta
 * @param res Risposta
 * @param querySQL QuerySQL
 * @param sendJSON true, manda il json al client. false lo restituisce
 * @param strings Eventuali argomenti da passare alla querySQL
 * @returns Ritorna una promise
 */
const executeQuerySQL = async (req: Request, res: Response, querySQL: string, sendJSON: boolean, ...strings: string[]): Promise<any> => {
    // Effettua una query in modalità async/await
    const [results]: any = await (await connection).execute(querySQL, strings);

    if (sendJSON) {
        res.json(results);
    } else {
        return results;
    }
};

export const executeQuerySQLSemplified = async (querySQL: string, ...strings: string[]): Promise<any> => {
    const [results]: any = await (await connection).execute(querySQL, strings);

    return results;
};


export default executeQuerySQL;