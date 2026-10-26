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
- `script.js`: traduções para português, japonês e inglês; seletor de idioma; constelação procedural. A forma acompanha as seções: percurso com marcos na trajetória, pessoas/engrenagem/código nas áreas de atuação e balões de fala na conversa. Triângulos maiores e mais espaçados são projetados em camadas de profundidade, desenhadas de trás para frente; as figuras avançam e recuam lentamente e recebem só uma ondulação discreta do cursor. A constelação permanece visível durante a rolagem; a animação para quando a página sai de vista ou a preferência por movimento reduzido está ativa. A escolha de idioma fica somente no armazenamento local do navegador.
- `site-config.js`: contatos públicos confirmados.
- `favicon.svg`: símbolo geométrico próprio.

## Antes de publicar

1. Revisar os textos pessoais e as três traduções com Fabio.
2. A referência visual foi lida de `~/Downloads/DESIGN.md`, sem alterar esse arquivo. O site usa a paleta e o ritmo visual como inspiração, sem copiar marca ou textos.
3. Decidir a URL de publicação. O repositório permanece privado até essa decisão.

O email e o WhatsApp confirmados por Fabio estão em `site-config.js` e aparecem como links na página. Os arquivos já estão na raiz do repositório privado. Para publicar depois, configure o GitHub Pages somente após revisar conteúdo e visibilidade. Não é necessário processo de build.

O site não inclui foto pessoal, conforme a decisão mais recente de Fabio. A grafia do nome em japonês é `平田 ファビオ`.

## GitHub e trabalho local

Os arquivos desta versão estão no repositório privado `FabioHirata/fabio-hirata-site`, branch `main`. Esta pasta está aberta no VS Code, mas o Git local do Mac ainda precisa de autenticação na conta pessoal para funcionar como checkout sincronizado. Após autenticar o Git, clone o repositório privado e continue as edições nessa cópia. Não use force push para conectar históricos diferentes.
