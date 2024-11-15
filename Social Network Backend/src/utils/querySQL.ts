import connection from "../utils/db"
import { Request, Response } from "express";

const executeQuerySQL = async (req: Request, res: Response, querySQL: string, ...strings: string[]): Promise<void> => {
    // Effettua una query in modalità async/await
    const [ results ]: any = await (await connection).execute(querySQL, strings)

    res.json(results);
};

export default executeQuerySQL;