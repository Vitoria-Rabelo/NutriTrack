class PacienteModel {
    
    constructor(
        nome, 
        idade, 
        telefone, 
        email, 
        objetivo,
        meta = 0,
        pesoInicial = 0,
        pesoAtual = 0,
        historico = [], 
        planoAlimentar = null
    ) {

        // propriedades de cadastro
        this.nome = nome;
        this.idade = idade;
        this.telefone = telefone;
        this.email = email;
        this.objetivo = objetivo;

        // propriedades de evoluçao
        this.meta = meta;
        this.pesoInicial = pesoInicial;
        this.pesoAtual = pesoAtual;
        this.historico = historico;

        this.planoAlimentar = planoAlimentar;

        // propriedades úteis ao sistema interno
        this.ativo = true;
        this.criadoEm = new Date().toISOString();
    }

}

class HistoricoModel {
    constructor(data, peso, cintura, quadril, variacao) {
        this.data = data;
        this.peso = peso;
        this.cintura = cintura;
        this.quadril = quadril;
        this.variacao = variacao;
    }
}

class PlanoAlimentarModel {
    constructor(cafeManha, lancheManha, almoco, lancheTarde, jantar, ceia) {
        this.cafeManha = cafeManha || "";
        this.lancheManha = lancheManha || "";
        this.almoco = almoco || "";
        this.lancheTarde = lancheTarde || "";
        this.jantar = jantar || "";
        this.ceia = ceia || "";
        this.atualizadoEm = new Date().toISOString();
    }
}

module.exports = { PacienteModel, PlanoAlimentarModel, HistoricoModel };