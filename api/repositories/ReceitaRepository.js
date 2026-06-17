const { collection, getDocs } = require("firebase/firestore");const db = require("./firebaseConfig");
const db = require("./firebaseConfig");

class ReceitaRepository {
    constructor() {
        this.collectionRef = collection(db, "receita");
    }

    async listarTodas(categoria = null) {
        try {
            const snapshot = await getDocs(this.collectionRef);
            const receitas = [];
            snapshot.forEach((doc) => {
                receitas.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return receitas;

        } catch (error) {
            console.log("Erro ao listar receitas:", error);
            throw error;
        }
    }
}



module.exports = new ReceitaRepository();