// Librerías que se utilizarán. / Libraries to be used
import express from 'express';
import cors from 'cors';
import colors from 'colors';
import { createConnection } from 'mysql2/promise';
import env from 'dotenv';

// Modularize the environment variables
env.config();
const dot = process.env;

// Add dependencies to express
const app = express();
app.use(cors());
app.use(express.json());

// Crear la conexión utilizando variables de entorno. / Create the connection using environment variables.
async function connectionDB() {
    return await createConnection({
        host: dot.HOST,
        port: dot.PORT_DB,
        user: dot.USER_DB,
        password: dot.USER_PASS,
        database: dot.DB
    });
}

// Endpoint general. / General endpoint.
app.get("/", (req, res) => {
    res.send(`<h1>Endpoint General</h1>`);
    console.log("GET".blue, "/");
});


// Rutas personalizadas. / Customized routes.
import tasksRouter from '../BACKEND/src/routes/tasks.routes.js';
app.use(tasksRouter);

import alertRouter from '../BACKEND/src/routes/alerts.routes.js';
app.use(alertRouter);




//Open local server in port 3000 and verify the credentials of the database
const server = app.listen(dot.PORT, async (er) => {
    try {
        await con.connect();

        console.log("\nThe credentials of the database it's right.green");


    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
});

//callbacks function for close connection
function onServer() {
    server.close(() => {
        console.log("\nShutdown server...".yellow);

        con.end((er) => {
            if (er) {
                console.error(er);
            } else {
                console.log("Closed connection with the database".yellow);
            }
            process.exit(0);
        });
    });
}

process.on("SIGINT", onServer);
process.on("SIGTERM", onServer);

