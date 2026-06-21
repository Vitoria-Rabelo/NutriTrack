let pacientes = [];
let idPacienteSendoEditado = null; 

function removerAcentos(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


function atualizarCard(idElemento, valor) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.innerText = valor;
    }
}

async function carregarConsultasHoje() {
    try {
        const resposta = await fetch('http://localhost:3000/api/agendamentos');
        if (!resposta.ok) throw new Error(`Erro: ${resposta.status}`);

        const agendamentos = await resposta.json();
        
        const hoje = new Date().toISOString().split('T')[0]; 
        const consultasHoje = agendamentos.filter(agendamento => {
            return agendamento.data && agendamento.data.includes(hoje);
        });

        atualizarCard('card-consultas-hoje', consultasHoje.length);

    } catch (erro) {
        console.error("Erro ao carregar as consultas de hoje:", erro);
        atualizarCard('card-consultas-hoje', "0");
    }
}

async function carregarPacientes() {
    try {
        const resposta = await fetch('http://localhost:3000/api/pacientes');
        if (!resposta.ok) throw new Error(`Erro na requisição: ${resposta.status}`);

        pacientes = await resposta.json();
        inicializarDashboard();
    } catch (erro) {
        console.error("Erro ao carregar os pacientes da API:", erro);
        renderizarTabela([]);
    }
}

function renderizarTabela(listaPacientes) {
    const tabelaConsultas = document.getElementById('tabela-consultas');
    if (!tabelaConsultas) return;

    tabelaConsultas.innerHTML = "";

    if (listaPacientes.length === 0) {
        tabelaConsultas.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Nenhum paciente encontrado.</td></tr>`;
        return;
    }

    listaPacientes.forEach(paciente => {
        const idPaciente = String(paciente.id || paciente._id);
        const primeiraLetra = paciente.nome ? paciente.nome.charAt(0) : "P";
        const linha = document.createElement('tr');

        linha.innerHTML = `
            <td>
                <div class="user-cell">
                    <div class="user-avatar">${primeiraLetra}</div>
                    <strong>${paciente.nome}</strong>
                </div>
            </td>
            <td>${paciente.idade || 0} anos</td>
            <td>${paciente.telefone || 'Não informado'}</td>
            <td>${paciente.email || 'Não informado'}</td>
            <td><span class="status upcoming">${paciente.objetivo || 'Saúde'}</span></td>
            <td class="actions">
                <button onclick="editarPaciente('${idPaciente}')" style="pointer-events: auto;">
                    <i class="fa-regular fa-pen-to-square edit" style="pointer-events: none;"></i>
                </button>
                <button onclick="deletarPaciente('${idPaciente}')" style="pointer-events: auto;">
                    <i class="fa-regular fa-trash" style="pointer-events: none;"></i>
                </button>
            </td>
        `;
        tabelaConsultas.appendChild(linha);
    });
}

function configurarBusca() {
    const inputBusca = document.getElementById('input-busca');
    if (!inputBusca) return;

    inputBusca.addEventListener('input', (e) => {
        const termoBusca = removerAcentos(e.target.value);
        
        const pacientesFiltrados = pacientes.filter(paciente => {
            const nomeFiltrado = removerAcentos(paciente.nome || "");
            const objetivoFiltrado = removerAcentos(paciente.objetivo || "");
            return nomeFiltrado.includes(termoBusca) || objetivoFiltrado.includes(termoBusca);
        });

        renderizarTabela(pacientesFiltrados);
    });
}

function configurarModal() {
    const modal = document.getElementById('modal-paciente');
    const btnAbrir = document.querySelector('.btn-add');
    const btnFechar = document.getElementById('btn-fechar-modal');
    const formPaciente = document.getElementById('form-paciente');
    const modalTitulo = modal.querySelector('.modal-header h2');

    if (!modal || !btnAbrir || !btnFechar || !formPaciente) {
        console.error("Erro: Verifique se os elementos do formulário existem no HTML.");
        return;
    }

    btnAbrir.addEventListener('click', (e) => {
        e.preventDefault();
        idPacienteSendoEditado = null; 
        if (modalTitulo) modalTitulo.innerText = "Cadastrar Novo Paciente";
        formPaciente.reset();
        modal.classList.add('active');
    });

    const fecharModal = () => {
        modal.classList.remove('active');
        formPaciente.reset();
        idPacienteSendoEditado = null;
    };

    btnFechar.addEventListener('click', (e) => { e.preventDefault(); fecharModal(); });
    window.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    formPaciente.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dadosPaciente = {
            nome: document.getElementById('nome').value,
            idade: parseInt(document.getElementById('idade').value) || 0,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            objetivo: document.getElementById('objetivo').value
        };

        const url = idPacienteSendoEditado 
            ? `http://localhost:3000/api/pacientes/${idPacienteSendoEditado}`
            : 'http://localhost:3000/api/pacientes';
            
        const metodo = idPacienteSendoEditado ? 'PUT' : 'POST';

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosPaciente)
            });

            if (resposta.ok) {
                fecharModal();
                alert(idPacienteSendoEditado ? "Paciente atualizado com sucesso!" : "Paciente adicionado com sucesso!");
                carregarPacientes(); 
            } else {
                const erroServidor = await resposta.json();
                alert("Erro ao salvar no servidor: " + (erroServidor.erro || "Verifique a API"));
            }
        } catch (erro) {
            console.error(`Erro na requisição ${metodo}:`, erro);
            alert("Erro de conexão com o backend.");
        }
    });
}

async function deletarPaciente(id) {
    if (confirm("Tem certeza que deseja remover este paciente?")) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/pacientes/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                carregarPacientes();
            } else {
                alert("Não foi possível deletar o paciente no servidor.");
            }
        } catch (erro) {
            console.error("Erro ao deletar:", erro);
        }
    }
}

function editarPaciente(id) {
    const paciente = pacientes.find(p => String(p.id || p._id) === id);
    if (!paciente) return;

    idPacienteSendoEditado = id;

    document.getElementById('nome').value = paciente.nome || "";
    document.getElementById('idade').value = paciente.idade || "";
    document.getElementById('telefone').value = paciente.telefone || "";
    document.getElementById('email').value = paciente.email || "";
    document.getElementById('objetivo').value = paciente.objetivo || "Saúde";

    const modal = document.getElementById('modal-paciente');
    const modalTitulo = modal.querySelector('.modal-header h2');
    if (modalTitulo) modalTitulo.innerText = "Editar Paciente";

    modal.classList.add('active');
}

function inicializarDashboard() {
    renderizarTabela(pacientes);
    atualizarCard('card-total-pacientes', pacientes.length);
}


document.addEventListener('DOMContentLoaded', () => {
    configurarBusca();
    configurarModal(); 
    carregarPacientes(); 
    carregarConsultasHoje(); 
});

window.deletarPaciente = deletarPaciente;
window.editarPaciente = editarPaciente;