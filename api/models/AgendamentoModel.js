class AgendamentoModel {

    constructor(pacienteId, pacienteNome, data, hora, tipoConsulta, status) {
        this.pacienteId = pacienteId;
        this.pacienteNome = pacienteNome;
        this.data = data;
        this.hora = hora;
        this.tipoConsulta = tipoConsulta;
        this.status = status || "Aguardando";
    }

}

module.exports = AgendamentoModel;
