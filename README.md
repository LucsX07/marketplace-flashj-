# FlashJá

Marketplace de comércio local que conecta consumidores a estabelecimentos
(começando por alimentação, com plano de expansão para mercados, farmácias
e outras lojas).

## Tipos de usuário

- **Consumidor** — navega estabelecimentos, monta carrinho, faz pedido e acompanha o status.
- **Comerciante** — gerencia seus produtos e os pedidos recebidos.
- **Administrador** — visão geral da plataforma (fora do escopo do MVP atual).

## Fluxos

**Consumidor:** ver estabelecimentos → escolher um → ver produtos → carrinho → checkout (login) → acompanhar pedido

**Comerciante:** cadastro/login → cadastrar estabelecimento → dashboard → ver pedidos recebidos → aceitar/recusar → atualizar status → gerenciar produtos

## Escopo do MVP

Estabelecimentos, produtos, carrinho, checkout, criação de pedido, painel do
comerciante e atualização de status. Pagamento é feito na retirada (sem
gateway ainda) — a tabela `pagamentos` já existe pronta pra receber o Stripe
depois, sem precisar redesenhar `pedidos`. Sem IA e sem entregadores nesta
fase.

## Tecnologias

- [Next.js](https://nextjs.org/) (React, App Router) — frontend e backend
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- [Supabase](https://supabase.com/) — banco de dados (Postgres), autenticação e Row Level Security
- Stripe (pagamentos online) — a integrar numa próxima etapa

## Configurar o Supabase (obrigatório pra rodar o app)

1. Crie uma conta e um projeto gratuito em [supabase.com](https://supabase.com).
2. No painel do projeto, abra **SQL Editor** → **New query**, cole todo o
   conteúdo de [`supabase/schema.sql`](./supabase/schema.sql) e clique em
   **Run**. Isso cria as tabelas, as regras de acesso (RLS) e as categorias
   iniciais.
3. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public**.
4. Copie `.env.example` para `.env.local` e cole os dois valores:
   ```bash
   cp .env.example .env.local
   ```
5. (Opcional, pra testar mais rápido) Em **Authentication → Providers →
   Email**, desative a confirmação de e-mail — assim uma conta nova já
   entra direto, sem precisar clicar num link recebido por e-mail.

Sem esses passos, o app mostra uma tela explicando que o Supabase ainda não
foi configurado em vez de quebrar.

## Estrutura de pastas

```
app/
├── (loja)/                     # área pública do consumidor
│   ├── page.js                 # lista de estabelecimentos (home)
│   ├── estabelecimentos/[id]/  # produtos de um estabelecimento
│   ├── carrinho/                # carrinho de compras
│   ├── checkout/                 # finalização do pedido (exige login)
│   ├── pedidos/[id]/            # acompanhamento do pedido
│   ├── entrar/                   # login
│   └── cadastro/                 # criação de conta (consumidor ou comerciante)
├── (painel)/painel/            # área do comerciante (protegida no proxy.js)
│   ├── page.js                  # dashboard / cadastro do estabelecimento
│   ├── pedidos/                  # aceitar/recusar/atualizar status
│   └── produtos/                 # cadastro e disponibilidade de produtos
└── auth/callback/              # confirmação de e-mail do Supabase
components/
├── EstabelecimentoCard.js
├── ProdutoCard.js
└── carrinho/CarrinhoContext.js  # estado do carrinho (React Context, em memória)
lib/
├── supabase/server.js           # cliente Supabase para Server Components/Actions
├── actions/                     # Server Actions (auth, pedidos, produtos, estabelecimentos)
├── estabelecimentos.js, produtos.js, pedidos.js, categorias.js  # consultas ao banco
├── status-pedido.js             # status do pedido (constantes)
└── formatar.js                  # formatação de preço
supabase/
└── schema.sql                   # tabelas, RLS e categorias iniciais
proxy.js                          # renova sessão + protege /painel (comerciante)
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse http://localhost:3000 (veja "Configurar o Supabase" acima —
sem isso o app mostra uma tela de aviso em vez das páginas reais).
