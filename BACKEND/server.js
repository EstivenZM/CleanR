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

