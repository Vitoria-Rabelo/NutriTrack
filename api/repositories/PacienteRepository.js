const { collection, addDoc, getDocs } = require("firebase/firestore");
const db = require("./firebaseConfig");

class PacienteRepository {

    constructor() {
        this.collectionRef = collection(db, "pacientes");
    }

    async salvar(pacienteData) {
        try {
            const docRef = await addDoc(this.collectionRef, pacienteData);
            return docRef.id;
        } catch (error) {
            console.error("Erro ao salvar o paciente:", error);
            throw error;
        }
    }

    async listarTodos() {
        try {
            const snapshot = await getDocs(this.collectionRef);
            const pacientes = [];

            snapshot.forEach((doc) => {
                pacientes.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            return pacientes;

        } catch (error) {
            console.log("Erro ao listar pacientes:", error)
            throw error;
        }
    }
}

module.exports = new PacienteRepository();