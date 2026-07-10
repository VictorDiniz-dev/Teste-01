# Explicação do protótipo FluxoCRM — Documento legado

> **Status: legado.** Este guia descreve a estrutura navegável herdada do protótipo e não define os módulos ou a visão atual do produto. Consulte `DOCUMENTO_MESTRE.md` e `ARQUITETURA.md`. O conteúdo abaixo foi preservado como referência histórica da implementação.

Este documento explica a versao navegavel do prototipo do FluxoCRM.

O objetivo atual e visualizar as telas principais do MVP usando apenas HTML, CSS e JavaScript puro. Ainda nao ha backend, banco de dados ou login real.

## Arquivos criados

- `index.html`: tela de Dashboard.
- `clientes.html`: tela de Clientes.
- `atendimentos.html`: tela de Atendimentos.
- `agendamentos.html`: tela de Agendamentos.
- `mensagens.html`: tela de Mensagens prontas.
- `css/style.css`: estilos visuais de todas as telas.
- `js/app.js`: dados ficticios, renderizacao e comportamento do prototipo.
- `assets/`: pasta reservada para imagens, icones ou outros arquivos visuais no futuro.
- `docs/EXPLICACAO_PROTOTIPO.md`: este guia de explicacao.

## Papel de cada arquivo

### Paginas HTML

As paginas HTML definem a estrutura do conteudo:

- menu lateral;
- cabecalho da tela;
- paineis;
- tabelas;
- formularios;
- areas onde o JavaScript insere dados ficticios.

Cada pagina usa o atributo `data-page` no elemento `body`.

Exemplo:

```html
<body data-page="clientes">
```

Esse atributo ajuda o JavaScript a saber qual tela deve ser preenchida.

### CSS

O arquivo `css/style.css` cuida da aparencia:

- cores;
- espacamentos;
- menu lateral;
- cards;
- tabelas;
- formularios;
- status visuais;
- layout responsivo para desktop e celular.

O CSS esta dividido por secoes comentadas para facilitar o estudo.

### JavaScript

O arquivo `js/app.js` tem algumas responsabilidades:

- guardar dados ficticios;
- preencher as telas com esses dados;
- controlar o menu no mobile;
- validar e salvar clientes em `localStorage`.

## Como alterar textos

Textos fixos, como titulos, descricoes e botoes, ficam diretamente nos arquivos HTML.

## Como alterar cores

As cores principais ficam no inicio do arquivo `css/style.css`, dentro do bloco `:root`.

## Como alterar cards

Os cards de resumo do Dashboard sao criados no arquivo `js/app.js`, dentro da funcao `preencherDashboard`.

## Onde ficam os dados ficticios

Os dados ficticios ficam no topo do arquivo `js/app.js`.

Os principais arrays sao:

- `clientes`;
- `atendimentos`;
- `agendamentos`;
- `mensagens`.

Os clientes carregam primeiro do `localStorage`. Se nao houver dados salvos, o prototipo usa os clientes iniciais como base.

## Como adicionar uma nova tela

1. Copie uma pagina existente.
2. Renomeie o arquivo.
3. Altere o `title`, o `h1` e os textos.
4. Troque o atributo `data-page`.
5. Adicione o link no menu.
6. Crie a funcao de renderizacao no `js/app.js`, se precisar.

## O que estudar primeiro

1. Comece pelo `index.html`.
2. Depois leia `css/style.css`.
3. Em seguida leia o topo de `js/app.js`.
4. Depois estude `preencherClientes`.
5. Por fim compare as outras funcoes de preenchimento.

## Limites atuais do prototipo

O prototipo ainda nao:

- faz login;
- conecta com APIs;
- usa banco de dados externo;
- envia mensagens reais;
- cria agendamentos reais.

## Mudanca importante ja concluida

O cadastro de clientes agora tem:

- validacao basica;
- mascara de telefone;
- armazenamento local;
- re-renderizacao da tabela;
- feedback visual de sucesso e erro.
