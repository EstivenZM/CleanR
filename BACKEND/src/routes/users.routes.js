import { Router } from "express";
import { con } from '../../server.js';


const router = Router();


router.get("/allUsers", async (req, res) => {
    try {
        con.query("select * from users where name != 'Sin usuario';", (er, results) => {
            if (er) throw er;

            res.status(200).json({
                "OK":true,
                "body":results
            });
        } );
    

    } catch (er) {
        console.error(`Error in the database\n${er}`);
        res.status(500).json({
            message:"Internal server error"
        });
    }

    console.log("GET".blue, "/users/allUsers");
});

router.post("/insertUser", (req, res) => {
    const { name, email, password, rol } = req.body;
    console.log(name, email, password, rol);
    
    try {
        con.query("insert into users(name, email, password, rol) values(?, ?, ?, ?)", 
        [name, email, password, rol]);

        res.status(201).json({
            "OK":true,
            message:"User created"
        });

    } catch (er) {
        res.status(500).json({
            message:"Internal server error"
        });
    }
    console.log("POST".blue, "users/insertUser");
});


export default router;