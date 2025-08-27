import { Router } from "express";
import { con } from '../../server.js';

const router = Router();

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Todos los campos son requeridos."
        });
    }

    con.query(
        "SELECT id_user, fullname, email, rol FROM users WHERE email = ? AND password = ?",
        [email, password],

        (err, results) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.status(500).json({
                    success: false,
                    message: "Error en el servidor."
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "Credenciales incorrectas."
                });
            }

            const user = results[0];

            return res.status(200).json({
                success: true,
                message: "Login exitoso.",
                user
            });
        }
    );
});

export default router;