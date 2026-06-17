const express = require("express");
const receitaService = require("../services/ReceitaService");
const router = express.Router();

router.use(
    (request, response, next) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        next();
    }
);

router.get(
    "/",
    async (request, response) => {
        try {
            const { categoria } = request.query;
            const receitas = await receitaService.buscarTodas(categoria);
            response.json(receitas);
        } catch (error) {
            response.status(500).json({ erro: "Erro interno ao buscar receitas." });
        }
    }
);

router.post(
    "/",
    express.json(),
    async (request, response) => {
        try {
            const novoId = await receitaService.adicionar(request.body);
            response.status(201).json({ 
                msg: "Receita adicionada com sucesso!", 
                id: novoId 
            });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);

module.exports = router;