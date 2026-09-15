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

### Os tokens `on-*` existem por causa de contraste

`on-brand` e `on-warn` são a cor do texto **em cima** dessas cores, e os
dois invertem no tema escuro. O motivo é concreto: no escuro o vermelho de
alerta clareia pra `#e2604a`, e texto branco em cima dele dá 3,5:1 —
abaixo do mínimo legível (4,5:1). Com o tom escuro, sobe pra 5,3:1.

**Regra:** nunca escreva `text-white` sobre um fundo colorido. Use
`text-on-brand` ou `text-on-warn`, e confira o contraste nos dois temas.

## 3. Profundidade

Três níveis, só de sombra — nunca de brilho:

- `--shadow-card` — todo cartão em repouso
- `--shadow-card-hover` — cartão clicável sob o cursor
- `--shadow-modal` — o que flutua sobre o resto

No escuro as sombras são quase imperceptíveis de propósito: sombra preta
sobre fundo escuro não aparece. Lá a profundidade vem do contraste entre
`surface` e `surface-2`.

## 4. Classes prontas (`lib/ui.js`)

| Constante | Quando usar |
| --- | --- |
| `BOTAO_PRIMARIO` | a ação principal da tela (uma por tela) |
| `BOTAO_SECUNDARIO` | ação alternativa, cancelar |
| `BOTAO_DESTRUTIVO` | confirmar algo que não dá pra desfazer |
| `LINK_MARCA` | link em verde dentro de texto |
| `CAMPO` | qualquer input ou select |
| `CARTAO` | bloco de conteúdo |
| `CARTAO_INTERATIVO` | cartão que é link ou botão (levanta no hover) |

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
