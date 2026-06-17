
class ReceitaModel {
    constructor(id, titulo, descricao, tempoPreparo, imagem, categoria){
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tempoPreparo = tempoPreparo;
        this.imagem = imagem;
        this.categoria = categoria;
    }
}

module.exports = ReceitaModel;