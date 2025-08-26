// Librerías que se utilizaran. / Libraries to be used
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import env from 'dotenv';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Modularize the enviroments variables
env.config();

const dot = process.env;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Add dependencies to express
const app = express();
app.use(cors());
app.use(express.json());


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Crear la conexión utilizando variables de entorno. / Create the connection using environment variables.
async function connectionDB() {
  return await createConnection({
    host: dot.HOST,
    port:dot.PORT_DB,
    user: dot.USER_DB,
    password: dot.USER_PASS,
    database: dot.DB
  })
}

app.listen(dot.PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${dot.PORT}`);
});

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




// // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// /* Código para el inicio de sesión. / Login code. */

// app.post("/login", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   if (!email || !password) return res.status(400).json({ success:false, message:"Todos los campos son obligatorios." });

//   try {
//     const [rows] = await db.execute(
//         "SELECT * FROM users WHERE name = ? AND email = ? AND password = ? AND role = ?",
//         [name, email, password, role]
//     );

//     if (rows.length === 0) return res.status(401).json({ success:false, message:"Credenciales incorrectas." }); 
//     const user = rows[0];
    
//     return res.json({ success:true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success:false, message: "Ha ocurrido un error imprevisto con el servidor." });
//   }
// });

