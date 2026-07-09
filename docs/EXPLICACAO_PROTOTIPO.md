  # Explicacao do prototipo FluxoCRM

  Este documento explica a primeira versao navegavel do prototipo do FluxoCRM.

  O objetivo desta fase e visualizar as telas principais do MVP usando apenas HTML, CSS e JavaScript puro. Nao existe backend, banco de dados, login real ou salvamento de informacoes.

  ## Arquivos criados

  - `index.html`: tela de Dashboard.
  - `clientes.html`: tela de Clientes.
  - `atendimentos.html`: tela de Atendimentos.
  - `agendamentos.html`: tela de Agendamentos.
  - `mensagens.html`: tela de Mensagens prontas.
  - `css/style.css`: estilos visuais de todas as telas.
  - `js/app.js`: dados ficticios e pequenos comportamentos do prototipo.
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

  O arquivo `js/app.js` tem duas responsabilidades simples:

  - guardar dados ficticios;
  - preencher as telas com esses dados.

  Ele tambem controla a abertura e o fechamento do menu no mobile.

  ## Como alterar textos

  Textos fixos, como titulos, descricoes e botoes, ficam diretamente nos arquivos HTML.

  Exemplo no `index.html`:

  ```html
  <h1>Dashboard</h1>
  <p>Acompanhe clientes, atendimentos pendentes e compromissos do dia.</p>
  ```

  Para alterar esses textos, edite o arquivo HTML da tela correspondente.

  ## Como alterar cores

  As cores principais ficam no inicio do arquivo `css/style.css`, dentro do bloco `:root`.

  Exemplo:

  ```css
  :root {
    --primary: #176b54;
    --text: #1d2b24;
    --bg: #f4f7f5;
  }
  ```

  Para trocar a cor principal do sistema, altere o valor de `--primary`.

  ## Como alterar cards

  Os cards de resumo do Dashboard sao criados no arquivo `js/app.js`, dentro da funcao `preencherDashboard`.

  Procure por:

  ```js
  const cards = [
    { rotulo: "Total de clientes", valor: clientes.length }
  ];
  ```

  Para mudar um card, altere o `rotulo` ou o `valor`.

  ## Onde ficam os dados ficticios

  Todos os dados ficticios ficam no topo do arquivo `js/app.js`.

  Os principais arrays sao:

  - `clientes`;
  - `atendimentos`;
  - `agendamentos`;
  - `mensagens`.

  Exemplo:

  ```js
  const clientes = [
    {
      nome: "Ana Souza",
      telefone: "(11) 99999-0101",
      origem: "WhatsApp",
      observacoes: "Quer agendar corte e hidratacao."
    }
  ];
  ```

  Para adicionar um cliente ficticio, copie um bloco de cliente e altere os valores.

  ## Como adicionar uma nova tela

  Um caminho simples para criar uma nova tela:

  1. Copie uma pagina existente, por exemplo `clientes.html`.
  2. Renomeie o arquivo, por exemplo `relatorios.html`.
  3. Altere o `title`, o `h1` e os textos da nova pagina.
  4. Troque o atributo `data-page` para o nome da nova tela.
  5. Adicione um novo link no menu de todas as paginas.
  6. Se precisar de dados dinamicos, crie uma nova funcao no `js/app.js`.
  7. Chame essa funcao dentro de `iniciarPaginaAtual`.

  Exemplo:

  ```js
  if (pagina === "relatorios") preencherRelatorios();
  ```

  ## O que estudar primeiro

  Recomendacao de estudo:

  1. Comece pelo `index.html` para entender a estrutura basica de uma tela.
  2. Depois leia `css/style.css` ate a parte de layout e cards.
  3. Em seguida leia o topo do `js/app.js`, onde ficam os dados ficticios.
  4. Depois estude a funcao `preencherDashboard`.
  5. Por ultimo, compare as outras funcoes de preenchimento das telas.

  Essa ordem ajuda a entender primeiro a estrutura, depois o visual e por fim o comportamento.

  ## Limites atuais do prototipo

  Este prototipo ainda nao:

  - salva dados;
  - valida formularios;
  - faz login;
  - conecta com APIs;
  - usa banco de dados;
  - envia mensagens reais;
  - cria agendamentos reais.

  Esses pontos devem ser tratados apenas depois que as telas e o fluxo do MVP forem validados.  