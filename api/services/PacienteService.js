const pacienteRepository = require("../repositories/PacienteRepository");
const { PacienteModel } = require("../models/PacienteModel");

class PacienteService {
    
    async adicionar(dadosRecebidos) {
        if (!dadosRecebidos.nome || dadosRecebidos.nome.trim() === "") {
            throw new Error("O nome do paciente é obrigatório para o cadastro.");
        }

        const novoPaciente = new PacienteModel(
            dadosRecebidos.nome, 
            dadosRecebidos.planoAlimentar
        );

        const pacienteParaSalvar = { ...novoPaciente };

        const idGerado = await pacienteRepository.salvar(pacienteParaSalvar);
        
        return idGerado; 
    }

    async listarTodos() {
        const pacientes = await pacienteRepository.listarTodos();
        return pacientes;
    }
}

module.exports = new PacienteService();