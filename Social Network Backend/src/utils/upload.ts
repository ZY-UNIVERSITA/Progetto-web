import multer from "multer";
import path from "path";
import fs from "fs";
import { getUser } from "./auth";
import { User } from "./types";
import { Request, Response } from "express";
import crypto from "crypto"

// Piccolo controllo della presenza dell'utente loggato
export const authBeforeUpload = async (req: Request, res: Response, next: any): Promise<void> => {
    const user: User | null = getUser(req, res);

    // Simula un upload che ci mette 5 secondi
    setTimeout(() => {
        if (user != null) {
            // Se l'utente è loggato allora ritorna il prossimo middleware ovveroq quello di caricamento
            console.log("ok");
            next();
        } else {
            res.status(401).send("Only registered user can upload their file");
        }
    }, 5000);
};

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb): void => {
        // Cartella di upload
        let uploadPath = path.join(__dirname, "../../public/usersUploads");
    
        console.log(file);

        if (file.fieldname === "profile_picture") {
            uploadPath = path.join(__dirname, "../../public/siteUpload/profile_photo");
        } else if (file.fieldname === "banner_picture") {
            uploadPath = path.join(__dirname, "../../public/siteUpload/profile_banner");
        }

        // Se la cartella non esiste, viene creata
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Setta la cartella di upload
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb): void => {
        // crea un file name tramite una funzione di hash
        const timeStamp: Number = Date.now();
        const fileName: string = file.originalname;
        // la funzione di hash usa sha512 come metodo di hash usando filename e timestamp
        const hashCode = crypto.createHash("sha512").update(fileName + timeStamp).digest("hex");
        // invia il file al server come "hash.png"
        cb(null, `${hashCode}.png`);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: any): void => {
    // Consenti solo file con estensioni jpg, jpeg o png
    const allowedTypes: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

    // controlla che il mimetype corrisponda a quello del jpg e png.
    // non è in realtà sicurissimo perchè può essere manipolato. forse meeglio cambiare in una libreria
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accetta il file
    } else {
        cb(new Error('Solo file JPG e PNG sono permessi!')); // Rifiuta il file
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 10,
        fileSize: 5 * 1024 * 1024, // Max 5 MB per file
    },
});