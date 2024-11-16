import mysql, { Connection } from "mysql2/promise";

// Restituisce una promise che promette di restituire un dato di tipo Connection
const connection: Promise<Connection> = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "social_network_project"
});

// Esporta la connessione per poter essere usato all'esterno
// default permette di esportarlo e usarlo come import senza specificare il componente da importare da un modulo
export default connection;