import { Router } from "express";
import { con } from '../../server.js';
const router = Router()


router.get("/locations", (req, res) => {
    con.query("select * from locations", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
})

export default router