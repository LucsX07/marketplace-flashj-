# FlashJá

Marketplace de comércio local que conecta consumidores a estabelecimentos
(começando por alimentação, com plano de expansão para mercados, farmácias
e outras lojas).

## Tipos de usuário

- **Consumidor** — navega estabelecimentos, monta carrinho, faz pedido e acompanha o status.
- **Comerciante** — gerencia seus produtos e os pedidos recebidos.
- **Administrador** — visão geral da plataforma (fora do escopo do MVP atual).

## Fluxos

**Consumidor:** ver estabelecimentos → escolher um → ver produtos → carrinho → checkout → acompanhar pedido

**Comerciante:** login → dashboard → ver pedidos recebidos → aceitar/recusar → atualizar status → gerenciar produtos

## Escopo do MVP

Estabelecimentos, produtos, carrinho, checkout, criação de pedido, painel do
comerciante e atualização de status. Sem IA, sem entregadores e sem
assinatura nesta fase.

## Tecnologias

- [Next.js](https://nextjs.org/) (React) — frontend e backend
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- Supabase (banco de dados + autenticação) — a integrar
- Stripe (pagamentos) — a integrar

## Estrutura de pastas

```
app/
├── (loja)/                     # área pública do consumidor
│   ├── page.js                 # lista de estabelecimentos (home)
│   ├── estabelecimentos/[id]/  # produtos de um estabelecimento
│   ├── carrinho/                # carrinho de compras
│   ├── checkout/                 # finalização do pedido
│   └── pedidos/[id]/            # acompanhamento do pedido
├── (painel)/painel/            # área do comerciante
│   ├── page.js                  # dashboard
│   ├── pedidos/                  # aceitar/recusar/atualizar status
│   └── produtos/                 # gestão de produtos
└── api/                        # rotas de backend
components/
├── EstabelecimentoCard.js
├── ProdutoCard.js
└── carrinho/CarrinhoContext.js  # estado do carrinho (React Context)
lib/
├── estabelecimentos.js
├── produtos.js                  # produtos vinculados a um estabelecimento
└── pedidos.js                   # status do pedido e persistência temporária
```

Os dados hoje são mocados em `lib/` (produtos e estabelecimentos fixos no
código; pedidos guardados no `localStorage` do navegador) só para validar o
fluxo completo. Isso será substituído pela integração com Supabase.

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse http://localhost:3000

Copie `.env.example` para `.env.local` e preencha as chaves quando formos
integrar Supabase e Stripe.
