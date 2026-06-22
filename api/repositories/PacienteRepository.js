const { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion } = require("firebase/firestore");
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

    async adicionarHistorico(id, novaMedicao) {
        try {
            const pacienteRef = doc(this.collectionRef, id);
            
            await updateDoc(pacienteRef, {
                historico: arrayUnion(novaMedicao),
                pesoAtual: novaMedicao.peso 
            });
            return true;
        } catch (error) {
            console.error("Erro ao adicionar histórico:", error);
            throw error;
        }
    }

    async deletar(id) {
        try {
            const pacienteRef = doc(this.collectionRef, id);

            await deleteDoc(pacienteRef);
            return true;
        } catch (error) {
            console.error("Não foi possível deletar o paciente.", error)
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

    async atualizar(id, dadosAtualizados) {
        try {
            const pacienteRef = doc(this.collectionRef, id);

            await updateDoc(pacienteRef, dadosAtualizados);
            return true;
        } catch (error) {
            console.error("Não foi possível editar os dados do paciente.", error);
            throw error;
        }
    }

    async atualizarPlano(id, planoAlimentar) {
        try {
            const pacienteRef = doc(this.collectionRef, id);

            await updateDoc(pacienteRef, { planoAlimentar: planoAlimentar });
            return true;
        } catch (error) {
            console.error("Nao foi possível atualizar o plano:", error);
            throw error;
        }
        
    }

}

module.exports = new PacienteRepository();