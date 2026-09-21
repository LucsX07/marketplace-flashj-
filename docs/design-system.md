# Design System da FlashJá

Isto não propõe nada novo: é a descrição do que já está no código, pra que
a próxima tela saia parecida com as que existem sem precisar garimpar
arquivo por arquivo.

Onde cada coisa mora:

| O quê | Arquivo |
| --- | --- |
| Cores, sombras, animações | `app/globals.css` |
| Classes prontas de botão, campo, cartão | `lib/ui.js` |
| Variants do Framer Motion | `lib/motion.js` |
| Componentes reaproveitáveis | `components/` |

---

## 1. Identidade

Minimalista, com um toque discreto de acid wave / synthwave — **discreto**
é a palavra: um corte diagonal no canto do botão principal, uma textura de
grade quase invisível em áreas vazias. Sem neon, sem glow, sem gradiente
chamativo. A cor da marca é o verde Pantone 347C (`#009b48`).

## 2. Cor

Nenhuma cor é escrita direto no componente. Tudo passa por token, porque
cada token tem um valor no claro e outro no escuro — cor fixa quebraria
num dos dois.

**Fundos**
- `bg` — fundo da página
- `surface` — fundo de cartão, campo, cabeçalho
- `surface-2` — fundo de apoio (aviso discreto, skeleton, estado neutro)

**Texto**
- `ink` — texto principal
- `ink-muted` — apoio, descrição
- `ink-faint` — o que quase não deve chamar atenção

**Linhas**
- `line` — borda padrão
- `line-strong` — borda em hover

**Marca e alerta**
- `brand`, `brand-hover`, `brand-tint`, `on-brand`
- `warn`, `warn-tint`, `on-warn`

**Grafite** — `graphite`, `on-graphite`, `on-graphite-muted`

O bloco escuro que ancora a página. Sem ele tudo flutuava no bege claro e a
tela ficava sem peso. Tem dois usos, e só esses dois:

1. A faixa do topo da home, onde ficam a cidade e a busca.
2. O lugar de uma foto que ainda não existe — ver "Quando não há imagem".

Texto secundário sobre grafite é tingido do próprio tom (`on-graphite-muted`),
nunca cinza puro.

### Os tokens `on-*` existem por causa de contraste

`on-brand` e `on-warn` são a cor do texto **em cima** dessas cores, e os
dois invertem no tema escuro. O motivo é concreto: no escuro o vermelho de
alerta clareia pra `#e2604a`, e texto branco em cima dele dá 3,5:1 —
abaixo do mínimo legível (4,5:1). Com o tom escuro, sobe pra 5,3:1.

**Regra:** nunca escreva `text-white` sobre um fundo colorido. Use
`text-on-brand` ou `text-on-warn`, e confira o contraste nos dois temas.

## 3. Profundidade

**Elevação se declara uma vez: ou borda, ou sombra. Nunca as duas.**

Uma linha de 1px por baixo de uma sombra larga lê como cartão fantasma, não
como profundidade. Por isso são duas peças diferentes:

- `CARTAO` — objeto (produto, loja, pedido): superfície + sombra, sem borda
- `CARTAO_PLANO` — painel que agrupa (formulário, bloco de dados): borda, sem sombra

Os três níveis de sombra:

- `--shadow-card` — cartão em repouso
- `--shadow-card-hover` — cartão clicável sob o cursor
- `--shadow-modal` — o que flutua sobre o resto

No escuro a sombra preta quase não aparece, e quem separa é o degrau entre
`surface` e `bg`. Por isso o `CARTAO` funciona nos dois temas sem borda.

## 4. Classes prontas (`lib/ui.js`)

| Constante | Quando usar |
| --- | --- |
| `BOTAO_PRIMARIO` | a ação principal da tela (uma por tela) |
| `BOTAO_SECUNDARIO` | ação alternativa, cancelar |
| `BOTAO_DESTRUTIVO` | confirmar algo que não dá pra desfazer |
| `LINK_MARCA` | link em verde dentro de texto |
| `CAMPO` | qualquer input ou select |
| `CARTAO` | objeto numa lista ou grade — sombra, sem borda |
| `CARTAO_PLANO` | painel que agrupa conteúdo — borda, sem sombra |
| `CARTAO_INTERATIVO` | cartão que é link ou botão (levanta no hover) |
| `BLOCO_GRAFITE` | faixa escura que ancora a página |

Precisou de um botão? Use a constante. Se ela não serve, o certo é
melhorar a constante — não escrever classes soltas no componente, senão em
um mês existem cinco botões levemente diferentes.

## 5. Tipografia

- `font-display` (Archivo) — títulos, em `font-extrabold tracking-tight`
- `font-sans` (Public Sans) — todo o resto

Escala usada nas telas: `text-2xl` em título de página, `text-lg`/`text-base`
em título de seção, `text-sm` em apoio, `text-xs` em legenda.

## 6. Movimento

Rápido e discreto. Quem pediu "reduzir movimento" no sistema não vê nada
disso: o CSS tem um `@media (prefers-reduced-motion: reduce)` que zera as
durações, e o Framer Motion está com `reducedMotion="user"` no layout.

- `.animate-entrada` — entrada padrão (320ms, sobe 6px)
- `.stagger` — numa `<ul>`, escalona os filhos em cascata
- `.skeleton` — carregando
- `.animate-pulso-status` — chama atenção pra algo que acabou de mudar
- `lib/motion.js` — mesmo timing, via Framer Motion, pra saída de item e
  transição de página (coisas que CSS puro não faz bem)

Toque: `active:scale-[0.97]` em botão, `TOQUE_CARTAO` em cartão. Num
celular esse retorno é o que diz "recebi seu toque" antes da tela mudar.

## 7. Estados

Toda tela que busca dado tem os quatro. Já existem no projeto e devem
continuar existindo em telas novas:

- **Carregando** — `loading.js` com `.skeleton` no formato do conteúdo
  real, não um "Carregando..." solto
- **Vazio** — explica o que fazer pra sair do vazio, não só "nada aqui"
- **Erro** — `error.js` com linguagem de gente e um "Tentar de novo";
  detalhe técnico vai pro log (ver `lib/registrar-erro.js`), nunca pra tela
- **Cheio** — o conteúdo

## 8. Escrita

Português do dia a dia, sem jargão. "Tirar a loja do ar", não "desativar
estabelecimento". Erro diz o que aconteceu e o que fazer. Ação que não dá
pra desfazer avisa antes, em dois toques — o primeiro revela o aviso, o
segundo confirma. Num celular, botão destrutivo de um toque só é toque
errado esperando pra acontecer.

## 9. Mobile primeiro

A maior parte do uso é no celular. Layout começa em uma coluna e cresce com
`sm:`/`md:`. Alvo de toque confortável, nada de ação importante encostada
na borda inferior (a barra de navegação mora lá).

## 10. Quando não há imagem

Um marketplace é carregado por foto. Enquanto as fotos não chegam, o espaço
**não** vira uma caixa cinza com um logo no meio: vira um bloco de grafite com
a inicial do nome em tipo grande (`components/ImagemComPlaceholder.js`).

A diferença não é estética, é de leitura. Tela após tela de retângulo cinza
idêntico faz o app parecer inacabado — era a maior causa isolada da sensação
de "simples demais". A inicial muda a cada loja e a cada produto, então a
grade ganha ritmo, e a ausência de foto lê como escolha em vez de buraco.

## 11. O que não se faz aqui

Regras que já custaram caro uma vez:

- **Nada de rótulo em maiúsculo acima de um título.** O título carrega o
  próprio peso; o rótulo atrasa a informação que importa e faz todo card
  começar igual. A categoria da loja é metadado, e vive depois do nome.
- **Nada de grade ou textura decorativa de fundo.** Grade pede uma tela de
  desenho, um mapa ou uma planta por baixo. Em estado vazio era só enfeite.
- **Nada de glifo unicode no lugar de ícone.** `✓` herda a fonte do sistema:
  muda de forma conforme o aparelho e nunca alinha. Ícone é desenhado.
- **Nada de seção que não enche uma linha.** Agrupar por categoria numa
  cidade com uma loja por ramo produzia um título seguido de um card
  solitário. Quando houver volume, a resposta é filtro, não seção.
- **Raio de card fica em 12–16px.** Abaixo disso a peça lê como caixa de
  formulário, não como objeto.

## 12. As superfícies que o navegador desenha

Seleção de texto, cursor, anel de foco e barra de rolagem vêm com o padrão do
sistema e não pertencem a design system nenhum. Todas saem da paleta, em
`app/globals.css`. É barato e é o que separa uma tela construída de uma tela
montada.

Preço e quantidade usam a classe `.numerico` (numerais tabulares), senão os
valores dançam no eixo vertical dentro de uma lista.
