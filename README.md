# marketplace-flashj-

Plataforma de marketplace com e-commerce e gestão de pedidos.

## Tecnologias

- [Next.js](https://nextjs.org/) (React) — frontend e backend
- [Tailwind CSS](https://tailwindcss.com/) — estilização
- Supabase (banco de dados + autenticação) — a integrar
- Stripe (pagamentos) — a integrar

## Estrutura de pastas

```
app/
├── (loja)/       # páginas públicas: home, produto
├── (painel)/     # painel do vendedor/admin
└── api/          # rotas de backend
components/       # componentes reutilizáveis
lib/               # funções auxiliares e dados
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois acesse http://localhost:3000

Copie `.env.example` para `.env.local` e preencha as chaves quando formos integrar Supabase e Stripe.
