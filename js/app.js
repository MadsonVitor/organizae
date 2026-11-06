// ==========================================================================
// Organizaê — Lógica da aplicação
// ==========================================================================

// ---------- Estado da aplicação ----------
let tarefas = [];
let proximoId = 1;

// ---------- Referências do DOM ----------
const formTarefa = document.getElementById('form-tarefa');
const campoTarefa = document.getElementById('campo-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const estadoVazio = document.getElementById('estado-vazio');
const feedback = document.getElementById('feedback');

// ---------- Utilitários ----------

// Exibe uma mensagem de feedback por alguns segundos
let timerFeedback = null;
function mostrarFeedback(mensagem, tipo = 'sucesso') {
  feedback.textContent = mensagem;
  feedback.classList.add('feedback--visivel');
  feedback.classList.toggle('feedback--erro', tipo === 'erro');

  clearTimeout(timerFeedback);
  timerFeedback = setTimeout(() => {
    feedback.classList.remove('feedback--visivel');
  }, 2500);
}

// Cria o elemento <li> de uma tarefa
function criarElementoTarefa(tarefa) {
  const item = document.createElement('li');
  item.className = 'tarefa';
  item.dataset.id = tarefa.id;

  const texto = document.createElement('span');
  texto.className = 'tarefa__texto';
  texto.textContent = tarefa.texto;

  const acoes = document.createElement('div');
  acoes.className = 'tarefa__acoes';

  item.append(texto, acoes);
  return item;
}

// ---------- Renderização ----------
function renderizarTarefas() {
  listaTarefas.innerHTML = '';

  if (tarefas.length === 0) {
    estadoVazio.hidden = false;
    return;
  }

  estadoVazio.hidden = true;

  tarefas.forEach(tarefa => {
    listaTarefas.appendChild(criarElementoTarefa(tarefa));
  });
}

// ---------- Ações ----------
function adicionarTarefa(texto) {
  const textoLimpo = texto.trim();

  if (textoLimpo === '') {
    mostrarFeedback('Digite algo antes de adicionar.', 'erro');
    return;
  }

  const novaTarefa = {
    id: proximoId++,
    texto: textoLimpo,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  renderizarTarefas();
  mostrarFeedback('Tarefa adicionada.');
}

// ---------- Eventos ----------
formTarefa.addEventListener('submit', evento => {
  evento.preventDefault();
  adicionarTarefa(campoTarefa.value);
  campoTarefa.value = '';
  campoTarefa.focus();
});

// ---------- Inicialização ----------
renderizarTarefas();