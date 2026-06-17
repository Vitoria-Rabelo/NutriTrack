const receitaRepository = require("../repositories/ReceitaRepository");
const { ReceitaModel } = require("../models/ReceitaModel");

class ReceitaService {
    async buscarTodasAsReceitas() {
        try {
            const receitas = await ReceitaRepository.listarTodas();
            return receitas;
        } catch (error) {
            console.error("Erro no serviço ao buscar receitas:", error);
            throw error;
        }
    }
}

module.exports = new ReceitaService();