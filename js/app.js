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

function concluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  tarefa.concluida = !tarefa.concluida;
  renderizarTarefas();
  mostrarFeedback(tarefa.concluida ? 'Tarefa concluída.' : 'Tarefa reaberta.');
}

function excluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const confirmar = confirm(`Excluir a tarefa "${tarefa.texto}"?`);
  if (!confirmar) return;

  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
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
// ---------- Inicialização ----------
renderizarTarefas();