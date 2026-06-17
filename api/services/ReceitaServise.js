const ReceitaRepository = require('../repositories/ReceitaRepository');

class ReceitaService {

    async buscarTodas(categoria = null) {
        try {
            const todasReceitas = await ReceitaRepository.listarTodas();
            
            if (!categoria || categoria === 'Todas') {
                return todasReceitas;
            }

            const receitasFiltradas = todasReceitas.filter(receita => {
                return receita.categoria === categoria;
            });
            return receitasFiltradas;
        } catch (error) {
            console.error("Erro no serviço ao filtrar receitas:", error);
            throw error;
        }
    }
}

module.exports = new ReceitaService();