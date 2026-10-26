# Site pessoal — Fabio Hirata

Primeira versão local de um site estático, preparada para futura hospedagem no GitHub Pages. Não há backend, dependências, analytics, fontes externas, formulário ou chamadas a APIs.

## Visualização local

Na pasta do projeto:

```sh
python3 -m http.server 8765
```

Acesse `http://localhost:8765/`. Os caminhos dos arquivos são relativos, para funcionar também em GitHub Pages de projeto.

## Estrutura

- `index.html`: conteúdo base em português e estrutura semântica.
- `styles.css`: layout responsivo e cores.
- `script.js`: traduções para português, japonês e inglês; seletor de idioma; constelação procedural. Os triângulos delineados mudam de formação ao rolar a página e reagem de forma sutil ao cursor. A animação para quando a página sai de vista ou quando a preferência por movimento reduzido está ativa. A escolha de idioma fica somente no armazenamento local do navegador.
- `favicon.svg`: símbolo geométrico próprio.

## Antes de publicar

1. Escolher e confirmar um canal público de contato. Por enquanto a página informa que ele está em revisão e não contém link de contato.
2. Revisar os textos pessoais e as três traduções com Fabio.
3. A referência visual foi lida de `~/Downloads/DESIGN.md`, sem alterar esse arquivo. O site usa a paleta e o ritmo visual como inspiração, sem copiar marca ou textos.
4. Decidir a URL de publicação. O repositório permanece privado até essa decisão.

Os arquivos já estão na raiz do repositório privado. Para publicar depois, configure o GitHub Pages somente após revisar conteúdo, contato e visibilidade. Não é necessário processo de build.

## GitHub e trabalho local

Os arquivos desta versão estão no repositório privado `FabioHirata/fabio-hirata-site`, branch `main`. Esta pasta está aberta no VS Code, mas o Git local do Mac ainda precisa de autenticação na conta pessoal para funcionar como checkout sincronizado. Após autenticar o Git, clone o repositório privado e continue as edições nessa cópia. Não use force push para conectar históricos diferentes.
