import colors from 'colors';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import env from 'dotenv';

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

import tasksRouter from '../BACKEND/src/routes/tasks.routes.js';
app.use(tasksRouter);

import alertRouter from '../BACKEND/src/routes/alerts.routes.js';
app.use(alertRouter);



//Open local server in port 3000 and verify the credentials of the database
app.listen(dot.PORT, async (er) => {
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

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
/* Código para el inicio de sesión. / Login code. */

app.post("/login", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!email || !password) return res.status(400).json({ success:false, message:"Todos los campos son obligatorios." });

  try {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE name = ? AND email = ? AND password = ? AND role = ?",
        [name, email, password, role]
    );

    if (rows.length === 0) return res.status(401).json({ success:false, message:"Credenciales incorrectas." }); 
    const user = rows[0];
    
    return res.json({ success:true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: "Ha ocurrido un error imprevisto con el servidor." });
  }
});
