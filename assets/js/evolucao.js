document.addEventListener('DOMContentLoaded', () => {
    const selectPaciente = document.getElementById('pacientes');
    const cardPesoInicial = document.getElementById('card-peso-inicial');
    const cardPesoAtual = document.getElementById('card-peso-atual');
    const cardPesoPerdido = document.getElementById('card-peso-perdido');
    const cardMeta = document.getElementById('card-meta');
    const txtPorcentagem = document.getElementById('txt-porcentagem');
    const txtFaltaMeta = document.getElementById('txt-falta-meta');
    const barraProgresso = document.getElementById('barra-progresso');
    const tabelaCorpo = document.querySelector('.history-table tbody');
    const cardsResumoContainer = document.getElementById('cards-resumo-container');

    const btnAdicionar = document.querySelector('.btn-adicionar-tabela');
    const modalMedicao = document.getElementById('modal-medicao');
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const formMedicao = document.getElementById('form-nova-medicao');

    let listaPacientes = [];
    let pacienteSelecionadoId = null;

    async function carregarPacientes() {
        try {
            const resposta = await fetch('http://localhost:3000/api/pacientes');
            if (!resposta.ok) throw new Error('Erro na requisição');
            
            listaPacientes = await resposta.json();

            selectPaciente.innerHTML = '<option value="">Escolha um paciente</option>';
            listaPacientes.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.id;
                option.textContent = paciente.nome;
                selectPaciente.appendChild(option);
            });

            renderizarCardsResumo(listaPacientes);

            if (pacienteSelecionadoId) {
                selectPaciente.value = pacienteSelecionadoId;
                atualizarDashboard(pacienteSelecionadoId);
            }

        } catch (erro) {
            console.error("Erro ao carregar pacientes na evolução:", erro);
            if (selectPaciente) {
                selectPaciente.innerHTML = '<option value="">Erro ao carregar pacientes</option>';
            }
        }
    }

    function atualizarDashboard(pacienteId) {
        if (!pacienteId) {
            limparDashboard();
            return;
        }

        const paciente = listaPacientes.find(p => p.id === pacienteId);
        if (!paciente) return;

        const pesoInicial = parseFloat(paciente.pesoInicial) || 0;
        const pesoAtual = parseFloat(paciente.pesoAtual) || pesoInicial;
        const meta = parseFloat(paciente.meta) || 0;

        const ehGanhoMassa = meta > pesoInicial;

        let variacaoPeso = 0;
        let porcentagem = 0;
        let faltaParaMeta = 0;
        let metaAlcancada = false;
        let labelVariacao = "Peso Perdido";

        if (ehGanhoMassa) {
            labelVariacao = "Peso Ganho";
            variacaoPeso = pesoAtual - pesoInicial; 
            const totalParaGanhar = meta - pesoInicial;
            
            if (totalParaGanhar > 0) {
                porcentagem = Math.round((variacaoPeso / totalParaGanhar) * 100);
            }
            faltaParaMeta = meta - pesoAtual;
            metaAlcancada = pesoAtual >= meta;
        } else {
            labelVariacao = "Peso Perdido";
            variacaoPeso = pesoInicial - pesoAtual; 
            const totalParaPerder = pesoInicial - meta;
            
            if (totalParaPerder > 0) {
                porcentagem = Math.round((variacaoPeso / totalParaPerder) * 100);
            }
            faltaParaMeta = pesoAtual - meta;
            metaAlcancada = pesoAtual <= meta;
        }

        porcentagem = Math.max(0, Math.min(100, porcentagem));

        if (cardPesoPerdido) {
            const containerCard = cardPesoPerdido.parentElement;
            const labelCardVariacao = containerCard.querySelector('span:not(#card-peso-perdido)');
            if (labelCardVariacao) {
                labelCardVariacao.textContent = labelVariacao;
            }
        }

        if(cardPesoInicial) cardPesoInicial.textContent = `${pesoInicial.toFixed(1)} kg`;
        if(cardPesoAtual) cardPesoAtual.textContent = `${pesoAtual.toFixed(1)} kg`;
        if(cardPesoPerdido) cardPesoPerdido.textContent = `${variacaoPeso > 0 ? variacaoPeso.toFixed(1) : 0} kg`;
        if(cardMeta) cardMeta.textContent = `${meta.toFixed(1)} kg`;

        if(txtPorcentagem) txtPorcentagem.textContent = `${porcentagem}% concluído`;
        if(barraProgresso) barraProgresso.style.width = `${porcentagem}%`;

        if(txtFaltaMeta) {
            if (!metaAlcancada) {
                txtFaltaMeta.textContent = `Falta ${Math.abs(faltaParaMeta).toFixed(1)} kg para atingir a meta`;
            } else {
                txtFaltaMeta.textContent = "🏆 Parabéns! Meta alcançada!";
            }
        }

        renderizarTabela(paciente.historico || []);
    }

    function renderizarTabela(historico) {
        if (!tabelaCorpo) return;

        if (historico.length === 0) {
            tabelaCorpo.innerHTML = `
                <tr class="row-vazia">
                    <td colspan="5">Nenhuma medição registrada para este paciente.</td>
                </tr>`;
            return;
        }

        tabelaCorpo.innerHTML = '';
        historico.forEach(medicao => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${medicao.data || '---'}</td>
                <td><strong>${medicao.peso ? medicao.peso + ' kg' : '---'}</strong></td>
                <td>${medicao.cintura ? medicao.cintura + ' cm' : '---'}</td>
                <td>${medicao.quadril ? medicao.quadril + ' cm' : '---'}</td>
                <td class="${medicao.variacao && medicao.variacao.includes('↓') ? 'txt-green' : 'txt-gray'}">
                    ${medicao.variacao || '---'}
                </td>
            `;
            tabelaCorpo.appendChild(tr);
        });
    }

    function renderizarCardsResumo(pacientes) {
        if (!cardsResumoContainer) return;
        cardsResumoContainer.innerHTML = '';

        pacientes.forEach(p => {
            const pesoIni = parseFloat(p.pesoInicial) || 0;
            const pesoAtu = parseFloat(p.pesoAtual) || pesoIni;
            const meta = parseFloat(p.meta) || 0;
            const inicialNome = p.nome ? p.nome.charAt(0).toUpperCase() : '?';

            const ehGanhoMassa = meta > pesoIni;
            let variacao = 0;
            let labelVariacao = "Perdeu";
            let classeCor = "txt-green";

            if (ehGanhoMassa) {
                labelVariacao = "Ganhou";
                variacao = pesoAtu - pesoIni;
                classeCor = "txt-blue"; 
            } else {
                labelVariacao = "Perdeu";
                variacao = pesoIni - pesoAtu;
                classeCor = "txt-green";
            }

            const div = document.createElement('div');
            div.className = 'mini-patient-card';
            div.innerHTML = `
                <div class="mini-card-header">
                    <div class="mini-avatar">${inicialNome}</div>
                    <div>
                        <h4>${p.nome || 'Sem Nome'}</h4>
                        <span>Meta: ${meta ? meta + ' kg' : '---'}</span>
                    </div>
                </div>
                <div class="mini-card-stats">
                    <div class="stat-box-mini bg-green-light">
                        <label>${labelVariacao}</label>
                        <span class="${classeCor}">${variacao > 0 ? variacao.toFixed(1) + ' kg' : '0 kg'}</span>
                    </div>
                    <div class="stat-box-mini bg-blue-light">
                        <label>Atual</label>
                        <span class="txt-blue">${pesoAtu.toFixed(1)} kg</span>
                    </div>
                </div>
            `;
            cardsResumoContainer.appendChild(div);
        });
    }

    function limparDashboard() {
        if(cardPesoInicial) cardPesoInicial.textContent = '-- kg';
        if(cardPesoAtual) cardPesoAtual.textContent = '-- kg';
        if(cardPesoPerdido) cardPesoPerdido.textContent = '-- kg';
        if(cardMeta) cardMeta.textContent = '-- kg';
        if(txtPorcentagem) txtPorcentagem.textContent = '0% concluído';
        if(barraProgresso) barraProgresso.style.width = '0%';
        if(txtFaltaMeta) txtFaltaMeta.textContent = 'Selecione um paciente para calcular';
        if(tabelaCorpo) {
            tabelaCorpo.innerHTML = `
                <tr class="row-vazia">
                    <td colspan="5">Selecione um paciente para ver o histórico.</td>
                </tr>`;
        }
    }

    if (selectPaciente) {
        selectPaciente.addEventListener('change', (e) => {
            pacienteSelecionadoId = e.target.value;
            atualizarDashboard(pacienteSelecionadoId);
        });
    }

    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', () => {
            if (!pacienteSelecionadoId) {
                alert("Por favor, selecione um paciente primeiro!");
                return;
            }
            if (modalMedicao) modalMedicao.style.display = 'flex'; 
        });
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', () => {
            if (modalMedicao) modalMedicao.style.display = 'none';
            if (formMedicao) formMedicao.reset();
        });
    }

    if (formMedicao) {
        formMedicao.addEventListener('submit', async (e) => {
            e.preventDefault();

            const campoData = document.getElementById('input-data');
            const dataMedicao = campoData ? campoData.value : new Date().toISOString().split('T')[0];

            const novaMedicao = {
                data: dataMedicao,
                peso: parseFloat(document.getElementById('input-peso').value),
                cintura: parseInt(document.getElementById('input-cintura').value),
                quadril: parseInt(document.getElementById('input-quadril').value),
                variacao: String(document.getElementById('input-variacao').value)
            };

            try {
                const resposta = await fetch(`http://localhost:3000/api/pacientes/${pacienteSelecionadoId}/historico`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novaMedicao)
                });

                if (!resposta.ok) throw new Error('Erro ao salvar medição.');

                modalMedicao.style.display = 'none';
                formMedicao.reset();

                await carregarPacientes();

            } catch (erro) {
                console.error("Erro ao salvar medição:", erro);
                alert("Não foi possível salvar os dados. Verifique se o seu servidor backend está rodando!");
            }
        });
    }

    carregarPacientes();
});