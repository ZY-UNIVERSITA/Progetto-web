import connection from "../utils/db"
import { Request, Response } from "express";

/*
    Permette di effettuare una querySQL che accetta:
    req
    res
    querySQL
    sendJSON: true, manda il json. false lo restituisce
    eventuali argomenti da passare alla querySQL
*/
const executeQuerySQL = async (req: Request, res: Response, querySQL: string, sendJSON: boolean, ...strings: string[]): Promise<any> => {
    // Effettua una query in modalità async/await
    const [ results ]: any = await (await connection).execute(querySQL, strings);

    if (sendJSON) {
        res.json(results);
    } else {
        return results;
    }
};

export default executeQuerySQL;