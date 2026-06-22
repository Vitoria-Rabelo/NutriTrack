// routers/PacienteRouter.js

const express = require("express");
const pacienteService = require("../services/PacienteService");

const router = express.Router();

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

router.post("/:id/historico", express.json(), async (request, response) => {
    try {
        const pacienteId = request.params.id;
        const dadosMedicao = request.body;

        await pacienteService.adicionarHistorico(pacienteId, dadosMedicao);

        response.status(201).json({ msg: "Medição adicionada ao histórico com sucesso!" });
    } catch (error) {
        response.status(400).json({ erro: error.message });
    }
});

router.put("/:id/plano", async (request, response) => {
    try {
        const pacienteId = request.params.id; 
        const dadosDoPlano = request.body;   

        await pacienteService.atualizarPlano(pacienteId, dadosDoPlano);
        
        response.status(200).json({ msg: "Plano alimentar salvo com sucesso!" });
    } catch (error) {
        response.status(400).json({ erro: error.message });
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const pacienteId = request.params.id;
        
        await pacienteService.deletar(pacienteId);
        
        response.status(200).json({ msg: "Paciente excluído com sucesso!" });
    } catch (error) {
        response.status(400).json({ erro: error.message });
    }
});

router.put("/:id", async (request, response) => {
    try {
        const pacienteId = request.params.id; 
        const dadosAtualizados = request.body;

        await pacienteService.atualizar(pacienteId, dadosAtualizados);
        
        response.status(200).json({ msg: "Dados do paciente atualizados com sucesso!" });
    } catch (error) {
        response.status(400).json({ erro: error.message });
    }
});


module.exports = router;