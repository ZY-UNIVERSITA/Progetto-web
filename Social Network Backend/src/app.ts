// importa express e l'interfaccia Express dal pacchetto express
import express, { Express, NextFunction, Request, Response } from "express"

// permette di gestire la ricarica della pagina in caso in cui l'utente si trovi già in una pagina di tipo 404
import history from "connect-history-api-fallback"

// importazione dei vari router
// es. import usersRouter from "./routes/users-route"

// crea una variabile app di tipo Express quindi implementa l'intefaccia Express con i relativi campi e metodi
const app: Express = express();

// crea una variabile port di tipo number
const port: number = 3000;


// use history fall back
app.use(history())

// middleware di express che permette di gestire file statici come css e img
app.use(express.static("public"));

// middelware per permettere di leggere il corpo del post
app.use(express.urlencoded({ extended: true }));

// permette di usare le pagine del front-end
app.use(express.static("dist-frontend"))


// permette di usare il router per gestire gli utenti
// es. app.use(usersRouter);


/* SOLO PROVA. POI ELEMINARE */
// metodo di express per definire il comportamento di express quando viene visitata la pagina "/" con il metodo GET
app.get("/", 
    // arrow function di callback che riceve 2 parametri req e res che sono gli oggetti richiesta e risposta
    (req: Request, res: Response) => {

    // metodo di Express che permette di inviare al client la risposta "Hello world"
    res.send("Hello world");
});


// Gestione delle rotte non esistenti
app.use(function(req: Request, res: Response, next: NextFunction) {
    res.setHeader("Content-Type", "text/plain")
    res.status(404).send("Ops... Pagina non trovata")
  })

// Avvia il server sulla porta scelta
app.listen(port, 
    // arrow function di callback che viene eseguita all'avvio del server
    () => {
    // scrittura di un log sul terminale d'avvio del server
    console.log(`In ascolto all'indirizzo: http://localhost:${port}`)
})