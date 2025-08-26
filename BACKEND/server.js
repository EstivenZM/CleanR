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

// Endpoint: obtener ubicaciones. / Endpoint: obtain locations.
app.get('/locations', async (req, res) => {
  try {
    let connection = await connectionDB();
    let [locations] = await connection.execute(`SELECT * FROM locations`);
    await connection.end();
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Rutas personalizadas. / Customized routes.
import tasksRouter from '../BACKEND/src/routes/tasks.routes.js';
app.use(tasksRouter);

import alertRouter from '../BACKEND/src/routes/alerts.routes.js';
app.use(alertRouter);

// Endpoint: inicio de sesión. / Endpoint: login.
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });

  try {
    const [rows] = await connectionDB().then(db =>
      db.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password]
      )
    );



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

