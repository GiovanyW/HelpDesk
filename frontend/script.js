const API_URL = 'http://localhost:3000/api/chamados';

//MAPEAR OS ELEMENTOS PARA MANIPULAÇÃO
//Formulário de cadastro/edição
const chamadoForm = document.getElementById('chamado-form');

//Campos do formulário
const tituloInput = document.getElementById('titulo-input');
const setorInput = document.getElementById('setor-input');
const prioridadeInput = document.getElementById('prioridade-input');
const statusInput = document.getElementById('status-input');
const statusGroup = document.getElementById('status-group');

//Título do modal ("Novo chamado" ou "Editar chamado")
const modalFormTitle = document.getElementById('modal-form-title');

//Onde a lista de chamados vai ser adicionada
const chamadoList = document.getElementById('chamado-list');

//Pesquisa e filtros
const searchInput = document.getElementById('search-input');
const filterSetor = document.getElementById('filter-setor');
const filterPrioridade = document.getElementById('filter-prioridade');
const filterStatus = document.getElementById('filter-status');

//Contadores do dashboard
const countTotal = document.getElementById('count-total');
const countAbertos = document.getElementById('count-abertos');
const countAtendimento = document.getElementById('count-atendimento');
const countResolvidos = document.getElementById('count-resolvidos');

//Variáveis globais
let chamados = []; // lista de chamados recebidos da api
let editingChamadoId = null; // variável para identificar se está editando
let deletingChamadoId = null; // variável com o chamado que aguarda confirmação de exclusão

async function fetchChamados() {
    try {
        const response = await axios.get(API_URL);
        chamados = response.data;
        renderChamados();

    } catch (error) {
        console.error("Erro ao buscar chamados", error);
        alert("Falha de conexão com a API.")
    }
};

//Transforma "Em atendimento" em "em-atendimento" para usar como classe do CSS
function classeDe(valor) {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ /g, '-');
}

function renderDashboard() {
    countTotal.innerText = chamados.length;
    countAbertos.innerText = chamados.filter(c => c.status === 'Aberto').length;
    countAtendimento.innerText = chamados.filter(c => c.status === 'Em atendimento').length;
    countResolvidos.innerText = chamados.filter(c => c.status === 'Resolvido').length;
}

function renderChamados() {
    renderDashboard();
    chamadoList.innerHTML = '';

    //Pesquisa por título + filtros (podem ser usados juntos)
    const busca = searchInput.value.trim().toLowerCase();

    const filtrados = chamados.filter(chamado => {
        if (busca && !chamado.titulo.toLowerCase().includes(busca)) return false;
        if (filterSetor.value && chamado.setor !== filterSetor.value) return false;
        if (filterPrioridade.value && chamado.prioridade !== filterPrioridade.value) return false;
        if (filterStatus.value && chamado.status !== filterStatus.value) return false;
        return true;
    });

    if (filtrados.length === 0) {
        chamadoList.innerHTML = '<li class="empty">Nenhum chamado encontrado.</li>';
        return;
    }

    filtrados.forEach(chamado => {
        const li = document.createElement('li');
        li.className = 'chamado-item';

        li.innerHTML = `
        <div class="chamado-info">
                    <span class="chamado-titulo">#${chamado.id} - ${chamado.titulo}</span>
                    <div class="chamado-tags">
                        <span class="tag">${chamado.setor}</span>
                        <span class="tag prioridade-${classeDe(chamado.prioridade)}">${chamado.prioridade}</span>
                        <span class="tag status-${classeDe(chamado.status)}">${chamado.status}</span>
                    </div>
                </div>
                <div class="chamado-actions">
                    <button class="view-btn" onclick="viewChamado(${chamado.id})" title="Visualizar"><i class="fa-regular fa-eye"></i></button>
                    <button class="edit-btn" onclick="prepareEdit(${chamado.id})" title="Editar"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="delete-btn" onclick="deleteChamado(${chamado.id})" title="Excluir"><i class="fa-regular fa-trash-can"></i></button>
                </div>
        `;
        chamadoList.appendChild(li);
    });
};

async function saveChamado(e) {
    e.preventDefault();
    const titulo = tituloInput.value.trim();
    const setor = setorInput.value;
    const prioridade = prioridadeInput.value;

    if (!titulo || !setor || !prioridade) return;

    try {
        if (editingChamadoId) {
            await axios.put(`${API_URL}/${editingChamadoId}`, {
                titulo : titulo,
                setor : setor,
                prioridade : prioridade,
                status : statusInput.value
            });
            editingChamadoId = null;
            alert("Chamado atualizado com sucesso!");
        } else {

            await axios.post(API_URL, {
                titulo: titulo,
                setor: setor,
                prioridade: prioridade
            });
            alert("Chamado criado com sucesso!");
        }

        closeModals();
        fetchChamados();

    } catch (error) {
        console.error("Erro ao salvar o chamado ", error);
        alert("Não foi possível realizar a operação.");
    }

}

//Abre o modal para cadastrar um novo chamado
function openNewModal() {
    editingChamadoId = null;
    chamadoForm.reset();
    modalFormTitle.innerText = "Novo chamado";
    statusGroup.classList.add('hidden');
    document.getElementById('modal-form').classList.remove('hidden');
    tituloInput.focus();
}

function prepareEdit(id) {
    const chamadoAtual = chamados.find(c => c.id === id);
    if (!chamadoAtual) return;

    editingChamadoId = id;
    tituloInput.value = chamadoAtual.titulo;
    setorInput.value = chamadoAtual.setor;
    prioridadeInput.value = chamadoAtual.prioridade;
    statusInput.value = chamadoAtual.status;
    modalFormTitle.innerText = "Editar chamado";
    statusGroup.classList.remove('hidden');
    document.getElementById('modal-form').classList.remove('hidden');
    tituloInput.focus();

}

async function viewChamado(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        const chamado = response.data;

        document.getElementById('view-numero').innerText = `Chamado #${chamado.id}`;
        document.getElementById('view-titulo').innerText = chamado.titulo;
        document.getElementById('view-setor').innerText = chamado.setor;
        document.getElementById('view-prioridade').innerText = chamado.prioridade;
        document.getElementById('view-status').innerText = chamado.status;
        document.getElementById('modal-view').classList.remove('hidden');

    } catch (error) {
        console.error("Erro ao buscar o chamado", error);
        alert("Não foi possível realizar a operação.");
    }
}

//Abre o modal de confirmação (a requisição só é feita em confirmDelete)
function deleteChamado(id) {
    deletingChamadoId = id;
    document.getElementById('modal-delete').classList.remove('hidden');
}

async function confirmDelete() {
    try {
        await axios.delete(`${API_URL}/${deletingChamadoId}`);
        deletingChamadoId = null;
        closeModals();
        alert("Chamado excluído com sucesso!");
        fetchChamados();

    } catch (error) {
        console.error("Erro ao deletar chamado", error);
        alert("Não foi possível realizar a operação.");
    }
}

function closeModals() {
    document.getElementById('modal-form').classList.add('hidden');
    document.getElementById('modal-view').classList.add('hidden');
    document.getElementById('modal-delete').classList.add('hidden');
    editingChamadoId = null;
    deletingChamadoId = null;
}

chamadoForm.addEventListener('submit', saveChamado);
searchInput.addEventListener('input', renderChamados);
filterSetor.addEventListener('change', renderChamados);
filterPrioridade.addEventListener('change', renderChamados);
filterStatus.addEventListener('change', renderChamados);
fetchChamados();
