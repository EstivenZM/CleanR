import { Router } from "express";
import { con } from '../../server.js';
const router = Router();


router.get("/testAlert", async (req, res) => {
    const [rows] = await con.query("select * from users");


    res.status(200).json(rows[0])

})
export default router