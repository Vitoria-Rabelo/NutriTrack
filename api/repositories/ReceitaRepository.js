const { collection, getDocs, addDoc, doc, updateDoc } = require("firebase/firestore");
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
    
    async atualizar(id, dadosAtualizados) {
        try {
            const docRef = doc(db, "receitas", id);
            await updateDoc(docRef, dadosAtualizados);
            return { id, ...dadosAtualizados };
        } catch (error) {
            console.error("Erro ao atualizar receita:", error);
            throw error;
        }
    }
}

module.exports = new ReceitaRepository();