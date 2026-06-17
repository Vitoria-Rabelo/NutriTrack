const { collection, getDocs, addDoc } = require("firebase/firestore");
const db = require("./firebaseConfig");

class ReceitaRepository {
    constructor() {
        this.collectionRef = collection(db, "receitas");
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

    async adicionar(receitaData) {
        try {
            const docRef = await addDoc(this.collectionRef, receitaData);
            return docRef.id;
        } catch (error) {
            console.error("Erro ao inserir receita:", error)
            throw error;
        }
    }
}



module.exports = new ReceitaRepository();