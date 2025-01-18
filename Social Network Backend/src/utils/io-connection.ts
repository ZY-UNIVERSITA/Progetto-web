import { Server, Socket } from "socket.io";
import { Request, Response } from "express";
import { socket_message } from "./types";
import { executeQuerySQLSemplified } from "./querySQL";


const users: socket_message[] = []

const handleIoConnection = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`Nuovo client connesso: ${socket.id}`)

        socket.on('register', (userId) => {
            if (!users.includes(userId)) {
                users.push({
                    user_id: userId,
                    socket_id: socket.id
                })
            }
            console.log(userId)
            console.log(users)
        })

        socket.on('private message', async ({ sender_id, sender_username, receiver_id, receiver_username, message, timestamp, status }) => {
            console.log(users)
            console.log(sender_id, receiver_id, message)

            const recipientSocketId = users.find(sockets => 
                sockets.user_id == receiver_id
            )

            const querySQL: string =`
                INSERT INTO messages (sender_id, receiver_id, content)
                VALUES (?, ?, ?)
            `;

            if ((sender_id !== null || receiver_id !== null || message !== null) && (sender_id !== receiver_id)) {
                const result = await executeQuerySQLSemplified(querySQL, sender_id, receiver_id, message);
            }

            console.log(recipientSocketId)

            console.log("utenti connessi", users);

            if (recipientSocketId) {
                io.to(recipientSocketId.socket_id).emit('private message', {
                    sender_id: sender_id,
                    sender_username: sender_username,
                    receiver_id: receiver_id,
                    receiver_username: receiver_username,
                    message: message, 
                    timestamp: timestamp,
                    status: status
                })
            }
        })

        socket.on('disconnect', () => {
            console.log('Un utente si è disconnesso')
        })
    })

}

export default handleIoConnection;