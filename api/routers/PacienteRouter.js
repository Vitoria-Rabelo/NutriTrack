// routers/PacienteRouter.js

const express = require("express");
const pacienteService = require("../services/PacienteService");

const router = express.Router();

router.use(
    (request, response, next) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    }
);

router.get(
    "/",
    async (request, response) => {
        try {
            const pacientes = await pacienteService.listarTodos();
            response.json(pacientes);
        } catch (error) {
            response.status(500).json({ erro: "Erro interno ao buscar pacientes." });
        }
    }
);

router.post(
    "/",
    express.json(), 
    async (request, response) => {
        try {
            const novoId = await pacienteService.adicionar(request.body);
            
            response.status(201).json({ 
                msg: "Paciente adicionado com sucesso!", 
                id: novoId 
            });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);


module.exports = router;