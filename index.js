const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Asegúrate de que el cuerpo de las solicitudes se pueda analizar como JSON

// Crear una conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port:'3306',
  password: '1802',
  database: 'Universidadcursos'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para verificar la conexión
app.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(`La solución es: ${results[0].solution}`);
  });
});

// Obtener todos los tipos de usuario
app.get('/tipos_usuario', (req, res) => {
  connection.query('SELECT * FROM Tipos_Usuario', (err, results) => {
    if (err) {
      console.error('Error al obtener los tipos de usuario:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Crear un usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correo, contraseña, id_tipo } = req.body;
  const query = 'INSERT INTO Usuarios (nombre, correo, contraseña, id_tipo) VALUES (?, ?, ?, ?)';
  connection.query(query, [nombre, correo, contraseña, id_tipo], (err, results) => {
    if (err) {
      console.error('Error al crear usuario:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(201).send('Usuario creado exitosamente');
    }
  });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Obtener todos los cursos
app.get('/cursos', (req, res) => {
  const query = `
    SELECT Cursos.id_curso, Materias.nombre_materia, Usuarios.nombre AS profesor, Cursos.precio, Cursos.fecha_inicio, Cursos.fecha_fin, Cursos.descripcion
    FROM Cursos
    INNER JOIN Materias ON Cursos.id_materia = Materias.id_materia
    INNER JOIN Usuarios ON Cursos.id_profesor = Usuarios.id_usuario`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los cursos:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Crear un curso
app.post('/cursos', (req, res) => {
  const { id_materia, id_profesor, precio, fecha_inicio, fecha_fin, descripcion } = req.body;
  const query = 'INSERT INTO Cursos (id_materia, id_profesor, precio, fecha_inicio, fecha_fin, descripcion) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [id_materia, id_profesor, precio, fecha_inicio, fecha_fin, descripcion], (err, results) => {
    if (err) {
      console.error('Error al crear curso:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(201).send('Curso creado exitosamente');
    }
  });
});

// Actualizar un curso
app.put('/cursos/:id', (req, res) => {
  const { id } = req.params;
  const { id_materia, id_profesor, precio, fecha_inicio, fecha_fin, descripcion } = req.body;
  const query = 'UPDATE Cursos SET id_materia = ?, id_profesor = ?, precio = ?, fecha_inicio = ?, fecha_fin = ?, descripcion = ? WHERE id_curso = ?';
  connection.query(query, [id_materia, id_profesor, precio, fecha_inicio, fecha_fin, descripcion, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar curso:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.send('Curso actualizado exitosamente');
    }
  });
});

// Eliminar un curso
app.delete('/cursos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Cursos WHERE id_curso = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar curso:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.send('Curso eliminado exitosamente');
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
