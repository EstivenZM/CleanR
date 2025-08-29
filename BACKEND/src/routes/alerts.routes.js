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

//traer el nombre del lugar en vez del id

router.get("/getAlerts", (req, res) => {
  const getAlertsQuery = `
SELECT a.*, l.name AS location_name
FROM alerts a
LEFT JOIN locations l ON a.id_location = l.id_location
WHERE a.status = 'en proceso';


`;

con.query(getAlertsQuery, (err, results) => {
  if (err) {
    console.error("Error al obtener alertas:", err.sqlMessage);
    return res.status(500).json({ error: "Error al obtener alertas" });
  }

  res.json(results); // cada alerta ahora tiene location_name
});
});

// first check if there is already such an alert and then if not, create it
router.post("/newAlerts", (req, res) => {
  const { alert_type, message, id_location, id_user } = req.body;

  const alertCheck = `
    SELECT * FROM alerts 
    WHERE id_user = ? 
      AND alert_type = ?
      AND message = ? 
      AND created_at >= NOW() - INTERVAL 5 MINUTE;
  `;

  con.query(alertCheck, [id_user, alert_type, message], (err, results) => {
    if (err) {
      console.error("Error en consulta:", err.sqlMessage);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya hiciste esta alerta recientemente, espera 5 minutos."
      });
    }

    const alertInsert = `
      INSERT INTO alerts (message, id_location, id_user, status, created_at, alert_type)
      VALUES (?, ?, ?, 'en proceso', NOW(), ?)
    `;

    con.query(alertInsert, [message, id_location, id_user, alert_type], (err, result) => {
      if (err) {
        console.error("Error insertando:", err.sqlMessage);
        return res.status(500).json({ error: "Error al crear alerta" });
      }

      res.status(201).json({
        id_alert: result.insertId,
        message,
        id_location,
        id_user,
        status: "en proceso",
        alert_type
      });
    });
  });
});

//_---------------ALERT FOR TUTOR-----------------//

// Backend usa la sesión o token para saber el usuario actual
router.get("/alerts/user", (req, res) => {
  const id_user = req.user.id;
  
  const query = "SELECT * FROM alerts WHERE id_user = ? ORDER BY created_at DESC";

  con.query(query, [id_user], (err, results) => {
    if (err) return res.status(500).json({ error: err.sqlMessage });
    res.json(results);
  });
});






export default router
