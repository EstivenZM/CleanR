import { Router } from "express";
import { con } from '../../server.js';


const router = Router();


router.get("/allUsers", async (req, res) => {
    try {
        con.query("select * from users where fullname != 'Sin usuario';", (er, results) => {
            if (er) throw er;

            res.status(200).json({
                "OK": true,
                "body": results
            });
        });


    } catch (er) {
        console.error(`Error in the database\n${er}`);
        res.status(500).json({
            message: "Internal server error"
        });
    }
    console.log("GET".blue, "/users/allUsers");
});

router.post("/insertUser", (req, res) => {
    const { fullname, email, password, rol } = req.body;

    con.query(
        "insert into users(fullname, email, password, rol) values(?, ?, ?, ?)",
        [fullname, email, password, rol],
        (er, result) => {
            if (er) {
                console.error(er);
                return res.status(500).json({
                    OK: false,
                    message: "Internal server error"
                });
            }
            res.status(201).json({
                OK: true,
                message: "User created"
            });
        }
    );
    console.log("POST".blue, "users/insertUser");
});

//validations
router.get("/user", (req, res) => {
    const key = Object.keys(req.query)[0]
    const value = Object.values(req.query)[0]

    con.query(`select * from users where \`${key}\` = ?`, [value], (er, results) => {

        if(er) {
            console.error(er);
            res.status(500).json({
                OK:false,
                message:"Internal server error"
            });
        } else {

            if (results.length) {
                res.status(200).json({
                    "OK": true,
                });
            } else {
                res.status(200).json({
                    "OK": false
                });
            }
        }

    });
    console.log("GET".blue, `/user?${key}=${value}`);
});


export default router;