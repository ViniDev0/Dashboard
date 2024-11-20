const openModalButton = document.querySelector(".open-modal");
const closeModalButton = document.querySelector("#close-modal");
const cancelButton = document.querySelector("#cancelar");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const openModal = () => {
    modal.classList.remove("hide");
    fade.classList.remove("hide");
};

const closeModal = () => {
    modal.classList.add("hide");
    fade.classList.add("hide");
    clearFields();
};

// Eventos para abrir e fechar o modal
openModalButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);
cancelButton.addEventListener('click', closeModal);
fade.addEventListener('click', closeModal);

// Função de acesso ao localStorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [];
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));

// CRUD: Função Create
const createClient = (client) => {
    const dbClient = getLocalStorage();
    dbClient.push(client);
    setLocalStorage(dbClient);
};

// CRUD: Função Read
const readClient = () => getLocalStorage();

// CRUD: Função Update
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

// CRUD: Função Delete
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

// Interação do CRUD com o layout

// Validando Campos
const isvalidFields = () => {
    return document.getElementById('form').reportValidity();
};

// Limpando Campos
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
};

// Salvando Informações
const saveClient = () => {
    if (isvalidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            celular: document.getElementById('contato').value,
            endereco: document.getElementById('endereco').value,
            nivel: document.getElementById('nivel').value
        };
        const index = document.getElementById('nome').dataset.index;
        if (index === 'new') {
            createClient(client);
        } else {
            updateClient(index, client);
        }
        updateTable();
        closeModal();
    }
};

document.getElementById('salvar').addEventListener('click', saveClient);

// Atualizando a tabela no layout

//alterei os buttons para imgs bia
       
const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.celular}</td>
        <td>${client.endereco}</td>
        <td>${client.nivel}</td>
        <td>  
             <img src="./imgs/icons8-lixeira.svg"  class="exclude" data-action="delete-${index}">
             <img src="./imgs/icons8-editar.svg" class="edit" data-action="edit-${index}">
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach((client, index) => createRow(client, index));
};

// Limpando a tabela após atualizar
const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

// Inicializando a tabela ao carregar
updateTable();

// Funções de Editar e Excluir

const EditClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    preencherCampos(client);
    openModal();
};

const preencherCampos = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('contato').value = client.celular;
    document.getElementById('endereco').value = client.endereco;
    document.getElementById('nivel').value = client.nivel;
    document.getElementById('nome').dataset.index = client.index;
};
 
// editDelete FOI ALTERADO A LOGICA PARA OS ICONES FUNCIONAREM
const editDelete = (event) => {
    const action = event.target.dataset.action; // Pegando o atributo data-action
    if (action) {
        const [type, index] = action.split('-');
        if (type === 'edit') {
            EditClient(index);
        } else if (type === 'delete') {
            deleteClient(index);
            updateTable();
        }
    }
};


document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);

// Captura o campo de pesquisa e a tabela
const pesquisaInput = document.getElementById('pesquisa');
const tabela = document.getElementById('tableClient');
const linhas = tabela.getElementsByTagName('tr');  // Pega todas as linhas da tabela

// Adiciona o evento de digitação no campo de pesquisa
pesquisaInput.addEventListener('input', function() {
    const termoDeBusca = pesquisaInput.value.toLowerCase();  // Converte para minúsculas
    for (let i = 1; i < linhas.length; i++) {  // Começa de 1 para ignorar o cabeçalho
        const celulas = linhas[i].getElementsByTagName('td');  // Pega todas as células da linha
        let linhaVisivel = false;  // Define um indicador para mostrar ou ocultar a linha 

// Itera sobre todas as células da linha
for (let j = 0; j < celulas.length; j++) {
    const textoCelula = celulas[j].textContent || celulas[j].innerText;  // Pega o texto da célula
    if (textoCelula.toLowerCase().includes(termoDeBusca)) {
        linhaVisivel = true;  // Se encontrar uma correspondência, torna a linha visível
    }
}

 // Exibe ou oculta a linha com base na pesquisa
 if (linhaVisivel) {
    linhas[i].style.display = '';  // Exibe a linha
} else {
    linhas[i].style.display = 'none';  // Oculta a linha
}
}
});