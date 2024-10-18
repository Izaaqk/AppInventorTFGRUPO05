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

// Iniciar el servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor API escuchando en el puerto ${port}`);
});
