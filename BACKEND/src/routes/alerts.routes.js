import { Router } from "express";
import { con } from '../../server.js';
const router = Router();

// See that they are in process
router.get("/alerts", (req, res) => {
    con.query("select * from alerts WHERE status = 'en proceso' ", (er, result) => {
        if (er) {
            console.error(er);  
            res.status(500).send("fallo")
        }

        res.status(200).json({ result })
    })
})

// first check if there is already such an alert and then if not, create it
router.post("/alerts", (req, res) => {
  const { message, id_location, id_user } = req.body;

  const alertCheck = `
    SELECT * FROM alerts 
    WHERE id_user = ? 
    AND message = ? 
    AND created_at >= NOW() - INTERVAL 5 MINUTE;
  `;

  con.query(alertCheck, [id_user, message], (err, results) => {
    if (err) {
      console.error("Error en consulta:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya hiciste esta alerta recientemente, espera 5 minutos."
      });
    }

    const alertInsert = `
      INSERT INTO alerts (message, id_location, id_user, status, created_at)
      VALUES (?, ?, ?, 'en proceso', NOW())
    `;

    con.query(alertInsert, [message, id_location, id_user], (err, result) => {
      if (err) {
        console.error("Error insertando:", err);
        return res.status(500).json({ error: "Error al crear alerta" });
      }

      res.status(201).json({
        id_alert: result.insertId,
        message,
        id_location,
        id_user,
        status: "en proceso"
      });
    });
  });
});

//When you click on "the ready button" it goes from in process to ready
router.put("/alerts/:id/status", (req, res) => {
  const id = parseInt(req.params.id);

  const change = "UPDATE alerts SET status = 'listo' WHERE id_alert = ?";

  con.query(change, [id], (err, result) => {
    if (err) {
      console.error("Error al actualizar alerta:", err);
      return res.status(500).json({ error: "Error al actualizar alerta" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alerta no encontrada" });
    }

    res.json({ message: "Alerta completada" });
  });
});

// verification alerts ready
router.get("/alerts/verification", (req, res) => {
  const renderAlerts = "SELECT * FROM alerts WHERE status = 'verification'";
  con.query(renderAlerts, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json({ result });
  });
});

// View alerts for a tutor
router.get("/alerts/tutor/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM alerts WHERE id_user = ? ORDER BY created_at DESC";
  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener alertas del tutor:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }
    res.json({ result });
  });
});


export default router
