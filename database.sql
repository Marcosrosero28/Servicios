DROP TABLE IF EXISTS Usuarios; 

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    cedula VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS Asignatura_Materia;

CREATE TABLE Asignatura_Materia (
    codigo VARCHAR(10) PRIMARY KEY,
    nombre_materia VARCHAR(100) NOT NULL
);

INSERT INTO Asignatura_Materia (codigo, nombre_materia) 
VALUES ('MAT-101', 'Matemáticas Básicas'), ('HIST-200', 'Historia del Arte');

