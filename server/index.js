const express = require('express');
const app = express();
const mysql= require('mysql');
const cors= require('cors');

app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: '',
    database: 'empleados_crud'
});
 
// Consultas BD
app.post('/create', (req,res)=>{
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;  
    const ocupacion = req.body.ocupacion;
    const anios = req.body.anios;

    const consulta='INSERT INTO empleados (nombres, edad, pais, ocupacion, anios) VALUES (?, ?, ?, ?, ?)';
    db.query(consulta, [nombre, edad, pais, ocupacion, anios], 
    (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

//eliminar
app.delete('/empleados/:id', (req, res) => {
    const { id } = req.params;

    const consulta = 'DELETE FROM empleados WHERE id = ?';
    db.query(consulta, [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: "Error al eliminar el empleado" });
        } else {
            res.send({ message: "Empleado eliminado correctamente", result });
        }
    });
});


//Actualizar empleado
// Consultas BD
app.put('/update', (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const ocupacion = req.body.ocupacion;
    const anios = req.body.anios;
    if (!id || !nombre || !edad || !pais || !ocupacion || !anios) {
        return res.status(400).send('Todos los campos son obligatorios');
    }
    const consulta = 'UPDATE empleados SET nombres = ?, edad = ?, pais = ?, ocupacion = ?, anios = ? WHERE id = ?';
    db.query(consulta, [nombre, edad, pais, ocupacion, anios, id], (err, results) => {
        if (err) {
        console.error('Error al actualizar:', err);
        res.status(500).send('Error al actualizar en la base de datos');
        } else {
        res.send(results);
        }
    }
    );
});

// Ruta para listar empleados
app.get('/empleados', (req, res) => {
    const consulta = 'SELECT * FROM empleados';
    db.query(consulta, (err, results) => {
        if (err) {
            console.error('Error al obtener empleados:', err);
            res.status(500).send('Error al obtener empleados');
        } else {
            res.json(results);
        }
    });
});

app.listen(3001, () =>{
  console.log('Corriendo en el puerto 3001');
})