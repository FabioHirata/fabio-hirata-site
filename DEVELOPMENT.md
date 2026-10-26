# Desenvolvimento do site pessoal de Fabio Hirata

Site estático em português, japonês e inglês, publicado no GitHub Pages. Sem backend, dependências de produção, analytics, fontes externas, formulário ou chamadas a APIs.

## Preview local

Nesta pasta, execute:

```sh
python3 -m http.server 8765
```

Abra `http://127.0.0.1:8765/`. Os caminhos são relativos, inclusive para GitHub Pages de projeto. Não há etapa de build.

## Arquivos

- `README.md`: apresentação pessoal concisa, alinhada ao site.
- `DEVELOPMENT.md`: instruções locais, decisões e verificações.
- `index.html`: estrutura semântica e texto base em português.
- `styles.css`: composição responsiva, tipografia e cores.
- `script.js`: traduções, contatos e quatro cenas em canvas.
- `motion.js`: inclinação, chacoalhada e toque opcionais, com ciclo de vida e permissões.
- `site-config.js`: email, WhatsApp e LinkedIn confirmados por Fabio.
- `favicon.svg`: monograma exato **FH.**, com ponto, desenhado em vetor sem fonte externa.
- `tests/`: testes executáveis com Node, sem bibliotecas adicionais.

O site não contém fotos pessoais. O nome japonês é exatamente `平田 ファビオ`. Os textos incluem Japão desde 2007, Fukui desde 2012, gestão de pessoas e coordenação de operações desde 2016, Ciência da Computação — UNIP, JLPT N3 com preparação para N2 e TOEIC 905. Não afirmam conclusão de graduação, obtenção de N2 ou fluência.

## Animação

1. **Início:** campo geométrico abstrato, girando e respirando em profundidade.
2. **Trajetória:** túnel aberto com curvas suaves e partículas que se aproximam da câmera. O horizonte permanece estável. Profundidades e velocidades distintas evitam anéis repetitivos; o reaparecimento é suavizado nas extremidades.
3. **Onde me envolvo:** superfície cerebral própria em três quartos, com hemisférios, fissura central, sulcos curvos, lobo temporal e cerebelo/base curta. Pulsação discreta. A anatomia é uma aproximação procedural, sujeita à avaliação visual de Fabio.
4. **Conversa:** dois balões volumétricos assimétricos → mistura → lâmpada com bulbo, pescoço e base roscada → recomposição dos balões. Ciclo de 30 segundos, com pausas legíveis. A transição tem dispersão quase explosiva, com lançamento escalonado, direções e velocidades variadas, deriva curva e atração para a nova forma. O retorno usa percursos diferentes. Esse impacto é restrito ao morph; cursor e câmera permanecem delicados, sem flashes ou tremores. Um brilho suave acompanha a ideia. Dentro da lâmpada há um filamento helicoidal âmbar com dois suportes discretos: todos são pontos/segmentos em 3D, projetados com a mesma posição, rotação, perspectiva e inclinação do bulbo. O filamento entra na ordenação de profundidade junto às partículas, de modo que as da frente passam sobre ele. Acende gradualmente no fim da formação, fica estável durante a ideia e apaga antes da dispersão; o halo fica restrito ao fio. Movimento reduzido conserva os dois balões estáticos, sem luz animada.

As cores são estáveis por partícula e bem misturadas; a iluminação varia pela orientação e profundidade. O desenho usa perspectiva, normais de superfície e atenuação das faces posteriores. Não há sorteio por quadro nem fade global com a rolagem.

O orçamento total é de 4.980 partículas no desktop e 1.552 no celular. O cérebro conserva 4.736/1.472 partículas; os balões/lâmpada usam 3.408/1.058. Parte das partículas dos balões foi redistribuída para o entorno: a conversa tem 524/150 fragmentos livres, contando a camada ambiente. No cérebro, 180/52 novos fragmentos livres convivem com a superfície original. Tamanhos, trajetórias e profundidades variam, com formas aproximando e afastando.

Os rótulos 01/02/03 são transparentes e não recebem máscara do canvas. Linhas de texto recebem proteção local de contraste. No celular há espaço para as figuras antes dos títulos. O cursor mantém uma ondulação de aproximadamente um pixel na amostra testada.

## Movimento no celular

- **Inclinação:** botão explícito para ativar/desativar. A primeira leitura calibra a posição neutra; o sinal é limitado, suavizado e recalibrado quando a orientação da tela muda.
- **Chacoalhada leve:** exige dois picos separados, mantendo o limiar de detecção original; dispersa um quarto das partículas em até 28 px, com saída suave e recomposição completa em 2 segundos. Intervalo mínimo de 2,6 segundos impede acumular impulsos.
- **Toque:** onda de até 9 px por toque, mais ampla, que avança pelo fundo por 1,8 segundo, disponível sem sensores. No máximo duas ondas coexistem; a combinação com chacoalhada é limitada a 42 px. Eventos passivos não bloqueiam a rolagem. Arrastar, selecionar texto, tocar em links ou controles não dispara o efeito. Inclinação e mouse conservam a intensidade anterior.

As permissões de orientação/movimento são solicitadas somente no clique do visitante. Há estados localizados para permissão negada, sensores ausentes, conexão inadequada e espera por dados. A negação não provoca pedidos automáticos repetidos. Nenhum dado de sensor é enviado ou gravado. Somente a preferência de idioma usa armazenamento local.

Ao ocultar a página, os sensores são desconectados e os efeitos transitórios são limpos. Movimento reduzido desliga sensores, ondulações, profundidade animada e fusão, mantendo duas formas estáticas reconhecíveis. Voltar dessa preferência não reativa sensores automaticamente.

Sensores reais dependem do navegador, do aparelho e de contexto seguro; o preview HTTP no Mac não valida o funcionamento em um iPhone. Nenhuma permissão real foi aceita durante os testes. Referências técnicas: [DeviceOrientationEvent.requestPermission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static) e [DeviceMotionEvent.requestPermission](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static).

## Testes

```sh
node --check script.js
node --check motion.js
node tests/motion.test.cjs
node tests/animation.test.cjs
```

Verificações realizadas em 26/10/2026:

- Preview real no Chrome; capturas desktop e celular inspecionadas. Lâmpada comparada com o vídeo Refero em aproximadamente 20,98 s. O código e a geometria são originais; nenhum asset do vídeo foi incorporado. Não se afirma equivalência exata.
- Teclado: link de apresentação → controle de movimento → email → WhatsApp → LinkedIn; foco visível e nenhuma ativação dos contatos ou de permissões reais. Console sem erros observados.
- PT/JA/EN em 320, 390 e 1280 px: sem overflow horizontal, textos vazios ou fotos; nome japonês, contatos e rótulos transparentes conferidos. Largura de 768 px havia sido verificada na rodada anterior.
- Favicon renderizado e inspecionado em 16 e 32 px. O navegador de automação pode sobrepor seu próprio indicador à aba.
- Testes de sensores com mocks: permitir, negar, indisponível, contexto inseguro, calibração, limite/suavização, mudança de orientação, chacoalhada/debounce/cooldown, fallback com gravidade, toque, links, rolagem, seleção, ativações repetidas, página oculta, movimento reduzido e teardown, inclusive permissão pendente cancelada por movimento reduzido ou descarte do controlador.
- Testes de canvas em VM: projeções finitas, DPR máximo 2, volume real no cérebro/balões, cursor estável após saída, zero RAF com movimento reduzido e nenhum reinício de RAF enquanto oculto.
- Dois ciclos simulados de conversa em 320/390/1280 px: formas completas dentro do viewport durante as pausas, troca de destino sem salto, dispersão limitada e reversões de rolagem sem alterar a geometria final.
- Hero e superfície cerebral comparados com a versão anterior à redistribuição: preservados. Partículas livres observadas em ambas as direções de profundidade.

A renderização é limitada a 30 quadros/s. Não houve benchmark em aparelho físico, teste real de sensores de iPhone ou alteração da preferência de movimento do sistema; esses casos foram validados com mocks/VM. 

## Referência visual

A paleta e o ritmo visual seguem o DESIGN.md fornecido por Fabio e o vídeo Refero. O código e as geometrias foram construídos para este site, sem incorporar assets da referência.

## GitHub e publicação

Site: [https://fabiohirata.github.io/fabio-hirata-site/](https://fabiohirata.github.io/fabio-hirata-site/). Publicação HTTPS verificada em 26/10/2026.

Repositório: `FabioHirata/fabio-hirata-site`, branch `main`, público por autorização de Fabio. O histórico foi preservado. A publicação utiliza o GitHub Pages gratuito, sem domínio personalizado ou plano pago.

O workflow `.github/workflows/pages.yml` executa os testes e publica um artefato com somente `index.html`, `styles.css`, `script.js`, `motion.js`, `site-config.js` e `favicon.svg`. Documentação técnica, testes, capturas de QA e arquivos temporários não fazem parte do site servido. Não há fotos ou segredos no projeto.

Alterações nos seis arquivos do site ou no workflow iniciam uma publicação pela branch `main`. Também é possível executar o workflow manualmente na aba Actions. Mudanças apenas na documentação não publicam uma nova versão do site.

A pasta local permanece acessível no VS Code. Ela não é um checkout Git autenticado; a sincronização utiliza a conexão pessoal já autorizada do GitHub. Não foram criadas credenciais nem alterada a confiança da pasta no editor.

Verificação após o deploy: raiz e seis arquivos do site retornaram HTTP 200 e bytes idênticos aos locais; documentação e testes retornaram 404 no Pages. PT/JA/EN, nome japonês, contatos, favicon, navegação interna e layout desktop/mobile conferidos no endereço público, sem erros de console. Os sensores ainda precisam de teste em aparelho físico; os testes automatizados cobrem os estados de permissão e o comportamento do controlador.

### Filamento interno

Testes adicionais verificam geometria contida no bulbo, projeção finita e enquadrada em 320/390/1280 px, profundidade real, resposta à inclinação, retorno após mudança de seção e curva de incandescência sem saltos. Movimento reduzido não cria o filamento animado.

Inspeção visual do filamento realizada no Chrome em 1479×1065 e 390×844, com captura determinística do mesmo renderizador no instante de 12 segundos. A página temporária de inspeção foi removida após a captura. O preview normal permanece animado; sem overflow no celular. 

Ajuste final do filamento: núcleo mais espesso (3 px desktop / 2,2 px celular antes da perspectiva), centro luminoso e halo âmbar localizado. Geometria, curva de acendimento, duração do ciclo e demais cenas preservadas. Inspeção em desktop/celular sem overflow ou erros de console; testes de ciclos e movimento reduzido passaram.
