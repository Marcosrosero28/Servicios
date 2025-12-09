import pkg from 'pg';
import dotenv from 'dotenv'; // 1. Importar dotenv

dotenv.config(); // 2. Cargar las variables del archivo .env

const { Pool } = pkg;

export const pool = new Pool({
  // 3. Usar process.env para acceder a las variables
  user: process.env.DB_USER,      
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log(`Conectando a la base de datos ${process.env.DB_NAME} en ${process.env.DB_HOST}...`);