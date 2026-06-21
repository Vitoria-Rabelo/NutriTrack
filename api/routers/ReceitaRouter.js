const express = require("express");
const receitaService = require("../services/ReceitaService");
const router = express.Router();

router.use(
    (request, response, next) => {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS"); 
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
            response.status(500).json({ erro: "Erro ao buscar receitas." });
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
router.put(
    "/:id",
    express.json(),
    async (request, response) => {
        try {
            const { id } = request.params;
            const dadosNovos = request.body;
            const receitaAtualizada = await receitaService.atualizarReceita(id, dadosNovos);
            response.status(200).json({
                mensagem: "Receita atualizada.",
                receita: receitaAtualizada
            });
        } catch (error) {
            response.status(400).json({ erro: error.message });
        }
    }
);

module.exports = router;