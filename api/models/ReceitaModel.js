
class ReceitaModel {
    constructor(id, titulo, descricao, tempoPreparo, imagem, categoria, linkExterno){
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.tempoPreparo = tempoPreparo;
        this.imagem = imagem;
        this.categoria = categoria;
        this.linkExterno = linkExterno;
    }
}

module.exports = ReceitaModel;