import { Router } from "express";
import { con } from '../../server.js';
const router = Router()


router.get("/tasks", (req, res) => {
    con.query("select * from tasks", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
})

router.get("/tasksArea", (req, res) => {
    con.query("SELECT tasks.id_task, tasks.name, locations.name AS location_name, tasks.status FROM tasks JOIN locations ON tasks.id_location = locations.id_location;", (er, result) => {
        if (er) {
            console.error(er);
            res.status(500).send("fallo")
        }
        console.log(result);
        
        res.status(200).json({ result })
    })
})

router.post("/sendTask", (req, res) => {
    const { name, id_location, status } = req.body;
    
    con.query("insert into tasks(name, id_location, status) values(?, ?, ?);", [name, id_location, status], (error, result) => {
        if (error) {
            console.log("ERROR".red, error);
            res.status(500).json({
              message:"inasdf"
            });
        }

        res.status(200).json({
            "OK":true,
            "message":"User created"
        });
    });
});



router.put("/tasks/:id", (req, res) => {
    const { id } = req.params
    const { name, id_location, status } = req.body
    con.query("UPDATE tasks SET name = ?, id_location = ?, status = ? WHERE id_task = ?",
        [name, id_location, status, id], (error, result) => {
            if (error) {
                console.log(error);
            }

            res.status(200).json({ result })
        })
})


router.delete("/tasks/:id", (req, res) => {
    const { id } = req.params
    con.query("DELETE FROM tasks WHERE id_task = ?", [id],
        (error, result) => {
            if (error) {
                console.log(error);
            }

            res.status(200).json({ result })
        })
})


export default router