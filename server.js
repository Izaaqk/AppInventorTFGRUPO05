const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodyParser.json());

// Configuración de conexión a Azure SQL Database
const dbConfig = {
    user: 'localhost', // El usuario de tu base de datos SQL
    password: 'Nicolas12345', // La contraseña
    server: 'srvdatabase2.database.windows.net', // La URL de tu servidor SQL
    database: 'bd_tfgrupo05', // El nombre de tu base de datos
    options: {
        encrypt: true // Esto es necesario para Azure SQL
    }
};

// Conectar a la base de datos
sql.connect(dbConfig).then(() => {
    console.log('Conectado a Azure SQL Database');
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

// Endpoint para guardar datos (POST)
app.post('/guardarConsulta', async (req, res) => {
    try {
        const { usuario, consulta } = req.body;
        const request = new sql.Request();
        await request.query(`INSERT INTO Consultas (Usuario, Consulta, FechaConsulta) VALUES ('${usuario}', '${consulta}', GETDATE())`);
        res.status(200).send('Consulta guardada correctamente');
    } catch (error) {
        res.status(500).send('Error al guardar la consulta');
    }
});

// Endpoint para obtener todas las consultas (GET)
app.get('/obtenerConsultas', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Consultas');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).send('Error al obtener las consultas');
    }
});

// Endpoint para actualizar el estado y respuesta de una consulta (PUT)
app.put('/actualizarConsulta/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, respuesta } = req.body;
        const request = new sql.Request();
        await request.query(`UPDATE Consultas SET Estado = '${estado}', Respuesta = '${respuesta}', FechaRespuesta = GETDATE() WHERE Id = ${id}`);
        res.status(200).send('Consulta actualizada correctamente');
    } catch (error) {
        res.status(500).send('Error al actualizar la consulta');
    }
});

// Endpoint para obtener el historial de consultas de un usuario (GET)
app.get('/historialConsultas/:usuario', async (req, res) => {
    try {
        const { usuario } = req.params;
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM Consultas WHERE Usuario = '${usuario}' ORDER BY FechaConsulta DESC`);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).send('Error al obtener el historial de consultas');
    }
});

// Endpoint para guardar una calificación (POST)
app.post('/guardarCalificacion', async (req, res) => {
    try {
        const { usuario, calificacion, comentario } = req.body;
        const request = new sql.Request();
        await request.query(`INSERT INTO Calificaciones (Usuario, Calificacion, Comentario, FechaCalificacion) VALUES ('${usuario}', ${calificacion}, '${comentario}', GETDATE())`);
        res.status(200).send('Calificación guardada correctamente');
    } catch (error) {
        res.status(500).send('Error al guardar la calificación');
    }
});

// Endpoint para obtener todas las calificaciones (GET)
app.get('/obtenerCalificaciones', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Calificaciones ORDER BY FechaCalificacion DESC');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).send('Error al obtener las calificaciones');
    }
});

// Endpoint para guardar una calificación (POST)
app.post('/guardarFeedback', async (req, res) => {
    try {
        const { usuario, feedback} = req.body;
        const request = new sql.Request();
        await request.query(`INSERT INTO Feedback (Usuario, Feedback, FechaFeedback) VALUES ('${usuario}', '${feedback}', GETDATE())`);
        res.status(200).send('Feedback guardado correctamente');
    } catch (error) {
        res.status(500).send('Error al guardar el feedback');
    }
});

// Endpoint para obtener todas las calificaciones (GET)
app.get('/obtenerFeedback', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query('SELECT * FROM Feedback ORDER BY FechaFeedback DESC');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).send('Error al obtener el Feedback');
    }
});


// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor API escuchando en el puerto ${port}`);
});
