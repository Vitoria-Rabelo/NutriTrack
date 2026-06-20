const containerReceitas = document.getElementById("cards-container");
const API_URL = "http://localhost:3000/api/receitas";

async function buscarReceitas(categoria = null) {
    try {
        let url = API_URL;
        if (categoria && categoria !== 'Todas') {
            url = `${API_URL}?categoria=${categoria}`;
        }
        const resposta = await fetch(url);
        
        if (!resposta.ok) {
            throw new Error("Erro ao carregar as receitas.");
        }
        const receitas = await resposta.json();
        renderizarCards(receitas);

    } catch (error) {
        console.error("Erro ao consumir a API:", error);
        containerReceitas.innerHTML = `<p class="erro-mensagem">Erro ao carregar as receitas.</p>`;
    }
}
function renderizarCards(listaDeReceitas) {
    const containerReceitas = document.getElementById("card-container");
    containerReceitas.innerHTML = "";

    if (!listaDeReceitas || listaDeReceitas.length === 0) {
        containerReceitas.innerHTML = `<p style="text-align: center; width: 100%; color: #666; grid-column: 1/-1;">Nenhuma receita encontrada para esta categoria.</p>`;
        return;
    }

    listaDeReceitas.forEach(receita => {
        const cardHTML = `
            <div class="card-hover">
                <div class="card-hover-content">
                    <h3 class="card-hover-title">
                        ${receita.titulo || receita.nome || 'Receita Saudável'}
                    </h3>
                    <p class="card-hover-text">
                        ${receita.descricao || 'Sem descrição disponível.'}
                    </p>
                    <a href="#" class="card-hover-link">
                        <span>Ver Detalhes</span>
                        <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </a>
                </div>
                <div class="card-hover-extra">
                    <h4>Preparo rápido em apenas ${receita.tempoPreparo || receita.tempo_preparo || '30 min'}!</h4>
                </div>
                <img src="${receita.imagem || '../assets/image/logo.png'}" alt="${receita.titulo || receita.nome}">
            </div>
        `;
        containerReceitas.innerHTML += cardHTML;
    });
}

function configurarFiltros() {
    const botoes = document.querySelectorAll(".filter-btn, .filter-btn-active");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => {
                b.classList.remove("filter-btn-active");
                b.classList.add("filter-btn");
            });
            
            botao.classList.remove("filter-btn");
            botao.classList.add("filter-btn-active");

            const categoriaSelecionada = botao.innerText.trim();
            buscarReceitas(categoriaSelecionada);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    buscarReceitas();    
    configurarFiltros();  
});