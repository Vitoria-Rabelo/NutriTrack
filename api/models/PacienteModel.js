class PacienteModel {
    
    constructor(nome, idade, telefone, email, objetivo, planoAlimentar = null) {

        // propriedades úteis ao usuário final
        this.nome = nome;
        this.idade = idade;
        this.telefone = telefone;
        this.email = email;
        this.objetivo = objetivo;
        this.planoAlimentar = planoAlimentar;

        // propriedades úteis ao sistema interno
        this.ativo = true;
        this.criadoEm = new Date().toISOString();
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

module.exports = { PacienteModel, PlanoAlimentarModel };