const express = require('express');
const agendamentoService = require('../services/AgendamentoService');
const router = express.Router();

router.use(
    (request, response, next) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    }

);

router.get(
    "/",
    async (request, response) => {
        try {
            const agendamentos = await agendamentoService.listarTodos();
            response.json(agendamentos);
        } catch (error) {
            response.status(500).json({ erro: "Erro interno ao buscar agendamentos." });
        }
    }
);

router.post(

    "/",
    express.json(),
    async (request, response) => {
        try {
            const novoId = await agendamentoService.adicionar(request.body);
            response.status(201).json({
                msg: "Agendamento adicionado com sucesso!",
                id: novoId
            });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);

router.put(
    "/:id",
    express.json(),
    async (request, response) => {
        try {
            await agendamentoService.atualizar(request.params.id, request.body);
            response.json({ msg: "Agendamento atualizado com sucesso!" });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);

router.delete(
    "/:id",
    async (request, response) => {
        try {
            await agendamentoService.remover(request.params.id);
            response.json({ msg: "Agendamento removido com sucesso!" });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);

module.exports = router;