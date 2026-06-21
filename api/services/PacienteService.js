const pacienteRepository = require("../repositories/PacienteRepository");
const { PacienteModel, HistoricoModel } = require("../models/PacienteModel");
const { updateDoc } = require("firebase/firestore");

class PacienteService {
    
    async adicionar(dadosRecebidos) {
        if (!dadosRecebidos.nome || dadosRecebidos.nome.trim() === "") {
            throw new Error("O nome do paciente é obrigatório para o cadastro.");
        }

        const novoPaciente = new PacienteModel(
            dadosRecebidos.nome,
            dadosRecebidos.idade,
            dadosRecebidos.telefone,
            dadosRecebidos.email,
            dadosRecebidos.objetivo,
            dadosRecebidos.meta,         
            dadosRecebidos.pesoInicial,  
            dadosRecebidos.pesoAtual,   
            dadosRecebidos.historico,
            dadosRecebidos.planoAlimentar
        );

        const pacienteParaSalvar = { ...novoPaciente };

        const idGerado = await pacienteRepository.salvar(pacienteParaSalvar);
        
        return idGerado; 
    }

    async adicionarHistorico(id, dadosMedicao) {
        if (!id) {
            throw new Error("O ID do paciente é obrigatório.");
        }

        const novaMedicao = new HistoricoModel(
            dadosMedicao.data,
            dadosMedicao.peso,
            dadosMedicao.cintura,
            dadosMedicao.quadril,
            dadosMedicao.variacao
        );

        await pacienteRepository.adicionarHistorico(id, { ...novaMedicao });
        return true;
    }

    async deletar(id) {
        if (!id) {
            throw new Error("O ID do paciente é obrigatório para a exclusão.");
        }
        await pacienteRepository.deletar(id);
        return true;
    }

    async atualizar(id, dadosAtualizados) {
        if (!id) {
            throw new Error("O ID do paciente é obrigatório para a atualização.");
        }
        await pacienteRepository.atualizar(id, dadosAtualizados);
        return true;
    }

    async atualizarPlano(id, planoAlimentar) {
        if (!id) {
            throw new Error("O Id é obrigatório para atualizar o plano.");
        }
        await pacienteRepository.atualizarPlano(id, planoAlimentar);
        return true;
    }

    async listarTodos() {
        const pacientes = await pacienteRepository.listarTodos();
        return pacientes;
    }

}

module.exports = new PacienteService();