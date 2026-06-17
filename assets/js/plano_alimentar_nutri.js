document.addEventListener('DOMContentLoaded', () => {
    const selectPaciente = document.getElementById('pacientes');
    const formContainer = document.getElementById('form-container');
    const nomeDisplay = document.getElementById('nome-paciente-display');
    const btnCancelar = document.getElementById('btn-cancelar');
    const formPlano = document.getElementById('form-plano-alimentar');

    let pacientesGlobais = [];

    async function carregarPacientes() {
        try {
            const resposta = await fetch('http://localhost:3000/api/pacientes');
            pacientesGlobais = await resposta.json();

            // Opção padrão
            selectPaciente.innerHTML = '<option value="default">Escolha um paciente</option>';

            // Popula o select
            pacientesGlobais.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = paciente.nome;
                selectPaciente.appendChild(option);
            });
        } catch (erro) {
            console.error("Erro ao carregar os pacientes:", erro);
            alert("Falha ao carregar a lista de pacientes.");
        }
    }

    carregarPacientes();

    selectPaciente.addEventListener('change', (e) => {
        const selectedId = e.target.value;

        if (selectedId !== 'default') {
            const pacienteSelecionado = pacientesGlobais.find(p => p.id === selectedId);

            nomeDisplay.textContent = `Plano para: ${pacienteSelecionado.nome}`;
            formContainer.style.display = 'block';

            const plano = pacienteSelecionado.planoAlimentar || {};

            document.querySelector('[name="cafe_manha"]').value = plano.cafeManha || '';
            document.querySelector('[name="lanche_manha"]').value = plano.lancheManha || '';
            document.querySelector('[name="almoco"]').value = plano.almoco || '';
            document.querySelector('[name="lanche_tarde"]').value = plano.lancheTarde || '';
            document.querySelector('[name="jantar"]').value = plano.jantar || '';
            document.querySelector('[name="ceia"]').value = plano.ceia || '';

        } else {
            formContainer.style.display = 'none';
            formPlano.reset();
        }
    });

    formPlano.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const pacienteId = selectPaciente.value;

        const planoAtualizado = {
            cafeManha: document.querySelector('[name="cafe_manha"]').value,
            lancheManha: document.querySelector('[name="lanche_manha"]').value,
            almoco: document.querySelector('[name="almoco"]').value,
            lancheTarde: document.querySelector('[name="lanche_tarde"]').value,
            jantar: document.querySelector('[name="jantar"]').value,
            ceia: document.querySelector('[name="ceia"]').value
        };

        const btnSalvar = document.querySelector('.btn-save');
        btnSalvar.textContent = "Salvando...";
        btnSalvar.disabled = true;

        try {
            const resposta = await fetch(`http://localhost:3000/api/pacientes/${pacienteId}/plano`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(planoAtualizado)
            });

            if (resposta.ok) {
                alert("Plano alimentar salvo com sucesso!");
                carregarPacientes(); 
            } else {
                const erro = await resposta.json();
                alert("Erro ao salvar: " + erro.erro);
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Erro de conexão, a API está ligada?");
        } finally {
            btnSalvar.textContent = "Salvar Plano";
            btnSalvar.disabled = false;
        }
    });

    // Botão de cancelar
    btnCancelar.addEventListener('click', () => {
        selectPaciente.value = 'default';
        formContainer.style.display = 'none';
        formPlano.reset();
    });
});