import colors from 'colors';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import env from 'dotenv';
import cron from 'node-cron';

//Modularize the enviroments variables
env.config();
const dot = process.env;

//Add dependencies to express
const app = express();
app.use(cors());
app.use(express.json());

//Create conection
export const con = mysql.createConnection({
  host: dot.HOST,
  port:dot.PORT_DB,
  user: dot.USER_DB,
  password: dot.USER_PASS,
  database: dot.DB
});

app.get("/", (req, res) => {
    res.send(`
        <h1>Endpoint General</h1>`);

    console.log("GET".blue , "/");
})



import UsersRoutes from './src/routes/users.routes.js';
app.use("/users", UsersRoutes)

import taskRoutes from './src/routes/tasks.routes.js'
app.use("/tasks", taskRoutes)

import locationRoutes from './src/routes/locations.routes.js'
app.use("/", locationRoutes)


import alertsRoutes from './src/routes/alerts.routes.js';
app.use ("/alerts", alertsRoutes)

import registerTasksRoutes from './src/routes/registerTasks.js';
app.use("/registerTasks", registerTasksRoutes);

//Open local server in port 3000 and verify the credentials of the database
const server = app.listen(dot.PORT, async (er) => {
    try {
        await con.connect();                                                    

        console.log(`\nThe credentials of the database it's right`.green);

        
        if (er) {
            console.error(`\nError in the port of the localserver\n${er}`.red);
        } else {
            console.log(`\nLocal server started in...\nhttp://localhost:${dot.PORT}`.green);
        }

        
    } catch (er) {
        console.error(`Error when connnect to the database\n${er}`.red);
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


