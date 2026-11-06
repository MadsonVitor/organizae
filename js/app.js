// ==========================================================================
// Organizaê — Lógica da aplicação
// ==========================================================================

// ---------- Estado da aplicação ----------
let tarefas = [];
let proximoId = 1;
let filtroAtual = 'todas';
const CHAVE_STORAGE = 'organizae.tarefas';


// ---------- Referências do DOM ----------
const formTarefa = document.getElementById('form-tarefa');
const campoTarefa = document.getElementById('campo-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const estadoVazio = document.getElementById('estado-vazio');
const feedback = document.getElementById('feedback');
const botoesFiltro = document.querySelectorAll('.filtro');
const contadorTodas = document.getElementById('contador-todas');
const contadorPendentes = document.getElementById('contador-pendentes');
const contadorConcluidas = document.getElementById('contador-concluidas');
const botaoLimparConcluidas = document.getElementById('botao-limpar-concluidas');
const anoAtual = document.getElementById('ano-atual');

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
  if (tarefa.concluida) item.classList.add('tarefa--concluida');
  item.dataset.id = tarefa.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'tarefa__checkbox';
  checkbox.checked = tarefa.concluida;
  checkbox.setAttribute('aria-label',
    tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída');
  checkbox.addEventListener('change', () => concluirTarefa(tarefa.id));

  const texto = document.createElement('span');
  texto.className = 'tarefa__texto';
  texto.textContent = tarefa.texto;
  texto.title = 'Clique duas vezes para editar';
  texto.addEventListener('dblclick', () => ativarEdicao(texto, tarefa.id));

  const acoes = document.createElement('div');
  acoes.className = 'tarefa__acoes';

  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.className = 'tarefa__botao tarefa__botao--editar';
  btnEditar.textContent = '✏️';
  btnEditar.title = 'Editar';
  btnEditar.setAttribute('aria-label', 'Editar tarefa');
  btnEditar.addEventListener('click', () => ativarEdicao(texto, tarefa.id));

  const btnExcluir = document.createElement('button');
  btnExcluir.type = 'button';
  btnExcluir.className = 'tarefa__botao tarefa__botao--excluir';
  btnExcluir.textContent = '🗑️';
  btnExcluir.title = 'Excluir';
  btnExcluir.setAttribute('aria-label', 'Excluir tarefa');
  btnExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));

  acoes.append(btnEditar, btnExcluir);
  item.append(checkbox, texto, acoes);
  return item;
}

// ---------- Renderização ----------
function renderizarTarefas() {
  listaTarefas.innerHTML = '';

  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  const pendentes = total - concluidas;

  contadorTodas.textContent = total;
  contadorPendentes.textContent = pendentes;
  contadorConcluidas.textContent = concluidas;

  const visiveis = tarefas.filter(t => {
    if (filtroAtual === 'pendentes') return !t.concluida;
    if (filtroAtual === 'concluidas') return t.concluida;
    return true;
  });

  if (visiveis.length === 0) {
    estadoVazio.hidden = false;
    const titulo = estadoVazio.querySelector('.estado-vazio__titulo');
    const descricao = estadoVazio.querySelector('.estado-vazio__texto');

    if (filtroAtual === 'todas') {
      titulo.textContent = 'Nada por aqui ainda';
      descricao.textContent = 'Adicione uma tarefa acima para começar a organizar seu dia.';
    } else if (filtroAtual === 'pendentes') {
      titulo.textContent = 'Nenhuma tarefa pendente';
      descricao.textContent = 'Tudo em dia! Que tal adicionar mais alguma coisa?';
    } else {
      titulo.textContent = 'Nenhuma tarefa concluída';
      descricao.textContent = 'Marque uma tarefa como concluída para vê-la aqui.';
    }
    return;
  }

  estadoVazio.hidden = true;

  visiveis.forEach(tarefa => {
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
  salvarTarefas();
  mostrarFeedback('Tarefa adicionada.');
}


// ---------- Persistência ----------
function salvarTarefas() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
  } catch (erro) {
    console.error('Não foi possível salvar as tarefas:', erro);
  }
}

function carregarTarefas() {
  try {
    const dados = localStorage.getItem(CHAVE_STORAGE);
    if (!dados) return;

    const carregadas = JSON.parse(dados);
    if (!Array.isArray(carregadas)) return;

    tarefas = carregadas;

    // Garante que o próximo id não colida com os já existentes
    proximoId = tarefas.reduce((maior, t) => Math.max(maior, t.id), 0) + 1;
  } catch (erro) {
    console.error('Não foi possível carregar as tarefas:', erro);
    tarefas = [];
  }
}

// ---------- Eventos ----------
formTarefa.addEventListener('submit', evento => {
  evento.preventDefault();
  adicionarTarefa(campoTarefa.value);
  campoTarefa.value = '';
  campoTarefa.focus();
});

function concluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  tarefa.concluida = !tarefa.concluida;
  renderizarTarefas();
  salvarTarefas();
  mostrarFeedback(tarefa.concluida ? 'Tarefa concluída.' : 'Tarefa reaberta.');
}

function excluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const confirmar = confirm(`Excluir a tarefa "${tarefa.texto}"?`);
  if (!confirmar) return;

  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
  salvarTarefas();
  mostrarFeedback('Tarefa excluída.');
}

function ativarEdicao(elementoTexto, id) {
  // Se já está em edição, não faz nada
  if (elementoTexto.isContentEditable) return;

  const textoOriginal = elementoTexto.textContent;
  elementoTexto.contentEditable = 'true';
  elementoTexto.focus();

  // Coloca o cursor no final do texto
  const range = document.createRange();
  range.selectNodeContents(elementoTexto);
  range.collapse(false);
  const selecao = window.getSelection();
  selecao.removeAllRanges();
  selecao.addRange(range);

  function finalizarEdicao(salvar) {
    elementoTexto.contentEditable = 'false';
  
    if (!salvar) {
      elementoTexto.textContent = textoOriginal;
      return;
    }

    const novoTexto = elementoTexto.textContent.trim();

    if (novoTexto === '') {
      elementoTexto.textContent = textoOriginal;
      mostrarFeedback('O texto não pode ficar vazio.', 'erro');
      return;
    }

    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) tarefa.texto = novoTexto;

    renderizarTarefas();
    salvarTarefas();
    mostrarFeedback('Tarefa atualizada.');
  }

  elementoTexto.addEventListener('blur', () => finalizarEdicao(true), { once: true });

  elementoTexto.addEventListener('keydown', function aoTeclar(evento) {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      elementoTexto.removeEventListener('keydown', aoTeclar);
      elementoTexto.blur();
    }
    if (evento.key === 'Escape') {
      evento.preventDefault();
      elementoTexto.removeEventListener('keydown', aoTeclar);
      finalizarEdicao(false);
    }
  });
}
// ---------- Eventos de filtros ----------
botoesFiltro.forEach(botao => {
  botao.addEventListener('click', () => {
    filtroAtual = botao.dataset.filtro;

    botoesFiltro.forEach(b => {
      b.classList.toggle('filtro--ativo', b === botao);
      b.setAttribute('aria-selected', b === botao ? 'true' : 'false');
    });

    renderizarTarefas();
  });
});

botaoLimparConcluidas.addEventListener('click', () => {
  const quantidade = tarefas.filter(t => t.concluida).length;

  if (quantidade === 0) {
    mostrarFeedback('Não há tarefas concluídas para limpar.', 'erro');
    return;
  }

  const confirmar = confirm(`Remover ${quantidade} tarefa(s) concluída(s)?`);
  if (!confirmar) return;

  tarefas = tarefas.filter(t => !t.concluida);
  renderizarTarefas();
  salvarTarefas();
  mostrarFeedback('Tarefas concluídas removidas.');
});

// ---------- Inicialização ----------
carregarTarefas();
renderizarTarefas();
anoAtual.textContent = new Date().getFullYear();
campoTarefa.focus();

renderizarTarefas();