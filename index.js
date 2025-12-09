import express from "express";
import cors from "cors";
import { pool } from "./db.js"; 

const app = express();
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el cuerpo de las peticiones
app.get("/", (req, res) => {
    res.json({
        message: "API REST en funcionamiento. Utiliza las rutas /usuarios o /asignaturas.",
        status: "OK",
        version: "1.0"
    });
});
// ==========================================================
// RUTAS PARA LA TABLA USUARIOS
// ==========================================================

// 1. CREAR USUARIO (POST /usuarios)
app.post("/usuarios", async (req, res) => {
  try {
    const { cedula, nombre, clave } = req.body;
    if (!cedula || !nombre || !clave) {
      return res.status(400).json({ msg: "Faltan campos obligatorios (cedula, nombre, clave)" });
    }

    const query = `
      INSERT INTO Usuarios (cedula, nombre, clave)
      VALUES ($1, $2, $3)
      RETURNING id, cedula, nombre;
    `;

    const result = await pool.query(query, [cedula, nombre, clave]);
    res.status(201).json({ msg: "Usuario registrado exitosamente", data: result.rows[0] });

  } catch (error) {
    if (error.code === '23505') { // Código de error de PostgreSQL para violación de UNIQUE
        return res.status(409).json({ error: "La cédula ya está registrada." });
    }
    res.status(500).json({ error: error.message });
  }
});

// 2. CONSULTAR TODOS LOS USUARIOS (GET /usuarios)
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, cedula, nombre, creado_en FROM Usuarios ORDER BY id ASC");
    res.json({ count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CONSULTAR USUARIO POR ID (GET /usuarios/:id)
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT id, cedula, nombre, creado_en FROM Usuarios WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. EDITAR USUARIO (PUT /usuarios/:id)
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, clave } = req.body; // No permitiremos cambiar la cédula por simplicidad

    if (!nombre && !clave) {
        return res.status(400).json({ msg: "Debe proporcionar al menos 'nombre' o 'clave' para actualizar." });
    }

    // Construcción dinámica de la consulta UPDATE
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (nombre) {
      updates.push(`nombre = $${paramIndex++}`);
      values.push(nombre);
    }
    if (clave) {
      updates.push(`clave = $${paramIndex++}`);
      values.push(clave);
    }

    values.push(id); // El ID será el último parámetro

    const query = `
      UPDATE Usuarios
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, cedula, nombre;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado para actualizar" });
    }

    res.json({ msg: "Usuario actualizado", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. ELIMINAR USUARIO (DELETE /usuarios/:id)
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM Usuarios WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado para eliminar" });
    }

    res.json({ msg: "Usuario eliminado exitosamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================================
// RUTAS PARA LA TABLA ASIGNATURA/MATERIA
// ==========================================================

// 1. CREAR ASIGNATURA (POST /asignaturas)
app.post("/asignaturas", async (req, res) => {
    try {
        const { codigo, nombre_materia } = req.body;
        if (!codigo || !nombre_materia) {
            return res.status(400).json({ msg: "El código y el nombre de la asignatura son obligatorios" });
        }

        const query = `
            INSERT INTO Asignatura_Materia (codigo, nombre_materia)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const result = await pool.query(query, [codigo, nombre_materia]);
        res.status(201).json({ msg: "Asignatura registrada", data: result.rows[0] });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: "El código de la asignatura ya existe." });
        }
        res.status(500).json({ error: error.message });
    }
});

// 2. CONSULTAR TODAS LAS ASIGNATURAS (GET /asignaturas)
app.get("/asignaturas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM Asignatura_Materia ORDER BY codigo ASC");
        res.json({ count: result.rows.length, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. CONSULTAR ASIGNATURA POR CÓDIGO (GET /asignaturas/:codigo)
app.get("/asignaturas/:codigo", async (req, res) => {
    try {
        const { codigo } = req.params;
        const result = await pool.query("SELECT * FROM Asignatura_Materia WHERE codigo = $1", [codigo]);

        if (result.rows.length === 0) {
            return res.status(404).json({ msg: "Asignatura no encontrada" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. EDITAR ASIGNATURA (PUT /asignaturas/:codigo)
app.put("/asignaturas/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nombre_materia } = req.body;

    if (!nombre_materia) {
        return res.status(400).json({ msg: "Se requiere 'nombre_materia' para actualizar." });
    }

    const query = `
        UPDATE Asignatura_Materia
        SET nombre_materia = $1
        WHERE codigo = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [nombre_materia, codigo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Asignatura no encontrada" });
    }

    res.json({ msg: "Asignatura actualizada correctamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ------------------------
// SERVIDOR
// ------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));