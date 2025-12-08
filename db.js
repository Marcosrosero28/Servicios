import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",       // ⚠️ Reemplaza con tu usuario de PostgreSQL
  host: "localhost",
  database: "BasedatosMarcos",   // ⚠️ Reemplaza con el nombre de tu base de datos
  password: "RamonAyala12",   // ⚠️ Reemplaza con tu contraseña
  port: 5433,
});

console.log("Conexión a PostgreSQL establecida.");