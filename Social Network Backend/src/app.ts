// importa express e l'interfaccia Express dal pacchetto express
import express, { Express, NextFunction, Request, Response } from "express"

// permette di gestire la ricarica della pagina in caso in cui l'utente si trovi già in una pagina di tipo 404
import history from "connect-history-api-fallback"

// permette di lavorare con i cookie
import cookieParser from "cookie-parser"

import bodyParser from "body-parser"

import cors from "cors"

// Per socket.io
import http from "http"
import { Server } from "socket.io"

// importazione dei vari router
import usersRouter from "./routes/users-router"
import postsRouter from "./routes/posts-router"
import authRouter from "./routes/auth-router"
import interactionRouter from "./routes/interaction-router"
import accountRouter from "./routes/account-router"
import messagesRouter from "./routes/messages-router"
import ioConnection from "./utils/io-connection"


// crea una variabile app di tipo Express quindi implementa l'intefaccia Express con i relativi campi e metodi
const app: Express = express();

// crea una variabile port di tipo number
const port: number = 3000;

// socket.io server
const server: http.Server = http.createServer(app);
export const io: Server = new Server(server, {
    cors: { origin: 'http://localhost:5173', // Inserisci qui l'origine del tuo frontend 
    methods: ['GET', 'POST']    
    }
});

// permette di leggere i dati di una chiamata POST
app.use(bodyParser.json());

// permette di usare il cookie-parser
app.use(cookieParser());

// middleware di express che permette di gestire file statici come css e img
app.use(express.static("public"));

// permette di usare le pagine del front-end
app.use(express.static("dist-frontend"));

// middelware per permettere di leggere il corpo del post
app.use(express.urlencoded({ extended: true }));

// permette di usare il router per gestire gli utenti
app.use(usersRouter);
app.use(postsRouter);
app.use(authRouter);
app.use(interactionRouter);
app.use(accountRouter);
app.use(messagesRouter);


/* SOLO PROVA. POI ELEMINARE */
// metodo di express per definire il comportamento di express quando viene visitata la pagina "/" con il metodo GET
app.get("/",
    // arrow function di callback che riceve 2 parametri req e res che sono gli oggetti richiesta e risposta
    (req: Request, res: Response) => {

        // metodo di Express che permette di inviare al client la risposta "Hello world"
        res.send("Hello world");
    });

// Socket connection
ioConnection(io);


// use history fall back
app.use(history());

app.use(cors({
    origin: 'http://localhost:5173' // Inserisci qui l'origine che desideri autorizzare
  }));

// Gestione delle rotte non esistenti
app.use(
    (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Content-Type", "text/plain")
        res.status(404).send("Ops... Pagina non trovata")
    }
)


// Avvia il server sulla porta scelta
server.listen(port,
    // arrow function di callback che viene eseguita all'avvio del server
    () => {
        // scrittura di un log sul terminale d'avvio del server
        console.log(`In ascolto all'indirizzo: http://localhost:${port}`)
    })