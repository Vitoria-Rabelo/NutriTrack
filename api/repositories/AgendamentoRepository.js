const { collection, getDocs, addDoc } = require("firebase/firestore");
const db = require("./firebaseConfig");

class Agendamento {
    constructor() {
        this.collectionRef = collection(db, "agendamentos");
    }

    async listarTodos() {
        try {
            const snapshot = await getDocs(this.collectionRef);
            const agendamentos = [];
            snapshot.forEach((doc) => {
                agendamentos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return agendamentos;
        } catch (error) {
            console.error("Error listing agendamentos: ", error);
            throw error;
        }
    }

    async salvar(agendamentoData) {
        try {
            const docRef = await addDoc(this.collectionRef, agendamentoData);
            return docRef.id;
        } catch (error) {
            console.error("Error adding agendamento: ", error);
            throw error;

        }
    }
}

module.exports = new Agendamento();