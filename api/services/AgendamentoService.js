const agendamentoRepository = require('../repositories/AgendamentoRepository');
const AgendamentoModel = require('../models/AgendamentoModel');

class Agendamento{
    async adicionar(dadosRecebidos) {
        if (!dadosRecebidos.pacienteId || dadosRecebidos.pacienteId.trim() === "") {
            throw new Error("O ID do paciente é obrigatório para o agendamento.");
        }
        if (!dadosRecebidos.pacienteNome || dadosRecebidos.pacienteNome.trim() === "") {
            throw new Error("O nome do paciente é obrigatório para o agendamento.");
        }
        if (!dadosRecebidos.data || dadosRecebidos.data.trim() === "") 
        {
            throw new Error("A data do agendamento é obrigatória.");
        }
        if (!dadosRecebidos.hora || dadosRecebidos.hora.trim() === "") {
            throw new Error("A hora do agendamento é obrigatória.");
        }
        if (!dadosRecebidos.tipoConsulta || dadosRecebidos.tipoConsulta.trim() === "") {
            throw new Error("O tipo de consulta é obrigatório para o agendamento.");
        }

        const novoAgendamento = new AgendamentoModel(
            dadosRecebidos.pacienteId,
            dadosRecebidos.pacienteNome,
            dadosRecebidos.data,
            dadosRecebidos.hora,
            dadosRecebidos.tipoConsulta,
            dadosRecebidos.status
        );

        const agendamentoParaSalvar = { ...novoAgendamento };
        const idGerado = await agendamentoRepository.salvar(agendamentoParaSalvar);
        return idGerado;
    }

    async listarTodos() {
        const agendamentos = await agendamentoRepository.listarTodos();
        return agendamentos;
    }

    async atualizar(id, dadosRecebidos) {
        if (!id || id.trim() === "") {
            throw new Error("O ID do agendamento é obrigatório.");
        }
        if (!dadosRecebidos.pacienteId || dadosRecebidos.pacienteId.trim() === "") {
            throw new Error("O ID do paciente é obrigatório para o agendamento.");
        }
        if (!dadosRecebidos.pacienteNome || dadosRecebidos.pacienteNome.trim() === "") {
            throw new Error("O nome do paciente é obrigatório para o agendamento.");
        }
        if (!dadosRecebidos.data || dadosRecebidos.data.trim() === "") {
            throw new Error("A data do agendamento é obrigatória.");
        }
        if (!dadosRecebidos.hora || dadosRecebidos.hora.trim() === "") {
            throw new Error("A hora do agendamento é obrigatória.");
        }
        if (!dadosRecebidos.tipoConsulta || dadosRecebidos.tipoConsulta.trim() === "") {
            throw new Error("O tipo de consulta é obrigatório para o agendamento.");
        }

        const agendamentoAtualizado = new AgendamentoModel(
            dadosRecebidos.pacienteId,
            dadosRecebidos.pacienteNome,
            dadosRecebidos.data,
            dadosRecebidos.hora,
            dadosRecebidos.tipoConsulta,
            dadosRecebidos.status
        );

        await agendamentoRepository.atualizar(id, { ...agendamentoAtualizado });
    }

    async remover(id) {
        if (!id || id.trim() === "") {
            throw new Error("O ID do agendamento é obrigatório.");
        }

        await agendamentoRepository.remover(id);
    }
}

module.exports = new Agendamento();
