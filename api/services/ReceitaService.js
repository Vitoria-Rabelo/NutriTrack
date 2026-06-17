const ReceitaRepository = require('../repositories/ReceitaRepository');
const ReceitaModel = require("../models/ReceitaModel");

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

    async adicionar(dadosRecebidos) {
        if (!dadosRecebidos.titulo || !dadosRecebidos.categoria) {
            throw new Error("O título e a categoria da receita são obrigatórios!");
        }

        const novaReceita = new ReceitaModel(
            null, 
            dadosRecebidos.titulo,
            dadosRecebidos.descricao,
            dadosRecebidos.tempoPreparo,
            dadosRecebidos.imagem,
            dadosRecebidos.categoria
        );

        const receitaParaSalvar = {
            titulo: novaReceita.titulo,
            descricao: novaReceita.descricao,
            tempoPreparo: novaReceita.tempoPreparo,
            imagem: novaReceita.imagem,
            categoria: novaReceita.categoria
        };



        const idGerado = await ReceitaRepository.adicionar(receitaParaSalvar);
        return idGerado;
    }
}

module.exports = new ReceitaService();