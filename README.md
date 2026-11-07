## Organizaê

Aplicação web de gerenciamento de tarefas que funciona 100% no navegador, sem backend e sem dependências externas. Desenvolvida como trabalho prático individual da disciplina, aplicando HTML5 semântico, CSS3 moderno e JavaScript puro.

### Funcionalidades

- **Cadastrar tarefas** com validação de entrada (não permite tarefas vazias)
- **Listar tarefas** com animação suave de entrada
- **Editar tarefas** por duplo clique no texto ou pelo botão ✏️ (Enter salva, Esc cancela, clique fora também salva)
- **Concluir / reabrir tarefas** pelo checkbox customizado
- **Excluir tarefas** com confirmação antes da remoção
- **Filtrar** por status: todas, pendentes, concluídas
- **Contadores** em tempo real de tarefas por status
- **Limpar concluídas** em massa, também com confirmação
- **Persistência** no `localStorage`, mantendo os dados após recarregar a página
- **Estado vazio contextual** com mensagem diferente para cada filtro
- **Feedback visual** em todas as ações (mensagens temporárias)
- **Responsivo** — mobile-first, adaptando o layout a partir de 560px
- **Acessível** — `aria-label`, `aria-live`, `aria-selected`, `visually-hidden` e respeito a `prefers-reduced-motion`

### Como executar

Não há build, instalação nem dependências. Duas formas:

**1. Abrir direto no navegador**

1. Clonar o repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/organizae.git