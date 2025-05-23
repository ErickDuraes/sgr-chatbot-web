const express = require('express');
const cors = require('cors');
const chatRoutes = require('./chat');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', chatRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Erro interno do servidor',
        details: err.message
    });
});

module.exports = app; 