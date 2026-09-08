-- ============================================================
-- FlashJá — schema inicial
-- Rode este script inteiro no SQL Editor do seu projeto Supabase
-- (Supabase Dashboard > SQL Editor > New query > colar > Run).
-- ============================================================

-- Tipos controlados ---------------------------------------------------
create type tipo_usuario as enum ('consumidor', 'comerciante', 'administrador');
create type status_pedido as enum ('pendente', 'aceito', 'recusado', 'em_preparo', 'pronto', 'concluido');
create type metodo_pagamento as enum ('retirada', 'stripe');
create type status_pagamento as enum ('pendente', 'aprovado', 'recusado', 'estornado');
create type tipo_opcao_produto as enum ('unica', 'multipla');

-- usuarios: dados de negócio ligados ao login do Supabase (auth.users) --
create table public.usuarios (
  id uuid primary key references auth.users (id) on delete cascade,
  tipo tipo_usuario not null default 'consumidor',
  nome text not null,
  telefone text,
  criado_em timestamptz not null default now()
);

-- categorias -----------------------------------------------------------
create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  ativo boolean not null default true
);

-- estabelecimentos -------------------------------------------------------
create table public.estabelecimentos (
  id uuid primary key default gen_random_uuid(),
  dono_id uuid not null references public.usuarios (id) on delete cascade,
  categoria_id uuid not null references public.categorias (id),
  nome text not null,
  descricao text,
  endereco text,
  cidade text,
  ativo boolean not null default true,
  capa_url text,
  aberto_agora boolean not null default true,
  criado_em timestamptz not null default now()
);

-- produtos ------------------------------------------------------------------
create table public.produtos (
  id uuid primary key default gen_random_uuid(),
  estabelecimento_id uuid not null references public.estabelecimentos (id) on delete cascade,
  nome text not null,
  descricao text,
  preco numeric(10, 2) not null check (preco >= 0),
  preco_promocional numeric(10, 2) check (preco_promocional is null or preco_promocional >= 0),
  em_destaque boolean not null default false,
  categoria_produto text,
  imagem_url text,
  disponivel boolean not null default true,
  criado_em timestamptz not null default now()
);

-- produto_atributos: informação livre que não afeta preço nem é escolhida
-- pelo consumidor (ex.: marca, peso, voltagem) — tanto sugerida por
-- categoria quanto digitada do zero pelo comerciante são a mesma linha. ----
create table public.produto_atributos (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos (id) on delete cascade,
  nome text not null,
  valor text not null,
  criado_em timestamptz not null default now()
);

-- produto_opcoes / produto_opcao_valores: o que o consumidor ESCOLHE antes
-- de adicionar ao carrinho, podendo alterar o preço (ex.: Tamanho, Adicionais). --
create table public.produto_opcoes (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references public.produtos (id) on delete cascade,
  nome text not null,
  tipo tipo_opcao_produto not null default 'unica',
  obrigatoria boolean not null default false,
  ordem integer not null default 0
);

create table public.produto_opcao_valores (
  id uuid primary key default gen_random_uuid(),
  opcao_id uuid not null references public.produto_opcoes (id) on delete cascade,
  nome text not null,
  ajuste_preco numeric(10, 2) not null default 0,
  ordem integer not null default 0
);

-- pedidos ---------------------------------------------------------------------
create table public.pedidos (
  id uuid primary key default gen_random_uuid(),
  consumidor_id uuid not null references public.usuarios (id),
  estabelecimento_id uuid not null references public.estabelecimentos (id),
  status status_pedido not null default 'pendente',
  total numeric(10, 2) not null check (total >= 0),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- itens_pedido -------------------------------------------------------------------
create table public.itens_pedido (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  produto_id uuid not null references public.produtos (id),
  quantidade integer not null check (quantidade > 0),
  preco_unitario numeric(10, 2) not null check (preco_unitario >= 0),
  subtotal numeric(10, 2) not null check (subtotal >= 0)
);

-- item_pedido_opcoes: fotografia das opções escolhidas naquele item —
-- mesmo raciocínio de itens_pedido.preco_unitario: se a opção do produto
-- mudar ou for apagada depois, o pedido antigo não pode mudar de descrição. --
create table public.item_pedido_opcoes (
  id uuid primary key default gen_random_uuid(),
  item_pedido_id uuid not null references public.itens_pedido (id) on delete cascade,
  nome_opcao text not null,
  nome_valor text not null,
  ajuste_preco numeric(10, 2) not null default 0
);

-- pagamentos: hoje só "retirada"; gateway_id/gateway_payload ficam nulos
-- até o Stripe entrar (ver documento de arquitetura). ------------------------
create table public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references public.pedidos (id) on delete cascade,
  metodo metodo_pagamento not null default 'retirada',
  status status_pagamento not null default 'pendente',
  valor numeric(10, 2) not null check (valor >= 0),
  gateway_id text,
  gateway_payload jsonb,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Cria automaticamente uma linha em usuarios quando alguém se cadastra -------
-- (o tipo e o nome vêm dos metadados passados no signUp, ver lib/auth.js)
create function public.lidar_novo_usuario()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios (id, tipo, nome, telefone)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'tipo')::tipo_usuario, 'consumidor'),
    coalesce(new.raw_user_meta_data ->> 'nome', new.email),
    new.raw_user_meta_data ->> 'telefone'
  );
  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.lidar_novo_usuario();

-- ============================================================
-- Permissões básicas de tabela para os roles anon/authenticated.
-- Sem isso, mesmo com RLS liberando as linhas certas, o Postgres nega
-- tudo antes de chequar qualquer política (erro 42501). Quem decide o
-- que cada um pode ver/alterar de fato são as policies acima/abaixo —
-- aqui só destravamos a porta de entrada.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all routines in schema public to anon, authenticated;

alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on routines to anon, authenticated;

-- ============================================================
-- Row Level Security — o próprio banco decide quem vê/altera o quê.
-- ============================================================
alter table public.usuarios enable row level security;
alter table public.categorias enable row level security;
alter table public.estabelecimentos enable row level security;
alter table public.produtos enable row level security;
alter table public.produto_atributos enable row level security;
alter table public.produto_opcoes enable row level security;
alter table public.produto_opcao_valores enable row level security;
alter table public.pedidos enable row level security;
alter table public.itens_pedido enable row level security;
alter table public.item_pedido_opcoes enable row level security;
alter table public.pagamentos enable row level security;

-- Função auxiliar: tipo do usuário logado (security definer evita
-- recursão infinita ao consultar a própria tabela usuarios numa policy).
create function public.meu_tipo()
returns tipo_usuario
language sql stable
security definer set search_path = public
as $$
  select tipo from public.usuarios where id = auth.uid();
$$;

-- usuarios: cada um vê e edita o próprio perfil; admin vê todos --------------
create policy "usuarios: ver o proprio perfil" on public.usuarios
  for select using (id = auth.uid() or public.meu_tipo() = 'administrador');
create policy "usuarios: editar o proprio perfil" on public.usuarios
  for update using (id = auth.uid());

-- categorias: leitura pública; só admin gerencia -----------------------------
create policy "categorias: leitura publica" on public.categorias
  for select using (true);
create policy "categorias: admin gerencia" on public.categorias
  for all using (public.meu_tipo() = 'administrador');

-- estabelecimentos: leitura pública; dono cria e edita o seu -----------------
create policy "estabelecimentos: leitura publica" on public.estabelecimentos
  for select using (true);
create policy "estabelecimentos: dono cria" on public.estabelecimentos
  for insert with check (dono_id = auth.uid());
create policy "estabelecimentos: dono ou admin edita" on public.estabelecimentos
  for update using (dono_id = auth.uid() or public.meu_tipo() = 'administrador');

-- produtos: leitura pública; dono do estabelecimento gerencia -----------------
create policy "produtos: leitura publica" on public.produtos
  for select using (true);
create policy "produtos: dono gerencia" on public.produtos
  for all using (
    exists (
      select 1 from public.estabelecimentos e
      where e.id = estabelecimento_id
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );

-- produto_atributos: leitura pública; dono do estabelecimento gerencia -------
create policy "produto_atributos: leitura publica" on public.produto_atributos
  for select using (true);
create policy "produto_atributos: dono gerencia" on public.produto_atributos
  for all using (
    exists (
      select 1 from public.produtos p
      join public.estabelecimentos e on e.id = p.estabelecimento_id
      where p.id = produto_id
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );

-- produto_opcoes: leitura pública; dono do estabelecimento gerencia ----------
create policy "produto_opcoes: leitura publica" on public.produto_opcoes
  for select using (true);
create policy "produto_opcoes: dono gerencia" on public.produto_opcoes
  for all using (
    exists (
      select 1 from public.produtos p
      join public.estabelecimentos e on e.id = p.estabelecimento_id
      where p.id = produto_id
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );

-- produto_opcao_valores: leitura pública; dono do estabelecimento gerencia ---
create policy "produto_opcao_valores: leitura publica" on public.produto_opcao_valores
  for select using (true);
create policy "produto_opcao_valores: dono gerencia" on public.produto_opcao_valores
  for all using (
    exists (
      select 1 from public.produto_opcoes o
      join public.produtos p on p.id = o.produto_id
      join public.estabelecimentos e on e.id = p.estabelecimento_id
      where o.id = opcao_id
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );

-- pedidos: consumidor vê/cria os seus; comerciante vê/atualiza os da loja ----
create policy "pedidos: dono do pedido ou da loja ve" on public.pedidos
  for select using (
    consumidor_id = auth.uid()
    or exists (select 1 from public.estabelecimentos e where e.id = estabelecimento_id and e.dono_id = auth.uid())
    or public.meu_tipo() = 'administrador'
  );
-- NÃO existe policy de insert para consumidor aqui de propósito: pedido só
-- nasce pela função public.criar_pedido (ver no fim do arquivo), que calcula
-- o preço no banco. Sem isso, dava pra inserir um pedido com preço forjado
-- chamando a API direto, sem passar pela tela.
create policy "pedidos: comerciante atualiza status" on public.pedidos
  for update using (
    exists (select 1 from public.estabelecimentos e where e.id = estabelecimento_id and e.dono_id = auth.uid())
    or public.meu_tipo() = 'administrador'
  );

-- itens_pedido: segue a visibilidade do pedido ao qual pertence --------------
create policy "itens_pedido: segue o pedido" on public.itens_pedido
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.consumidor_id = auth.uid()
          or exists (select 1 from public.estabelecimentos e where e.id = p.estabelecimento_id and e.dono_id = auth.uid())
          or public.meu_tipo() = 'administrador'
        )
    )
  );
-- (sem insert direto — ver public.criar_pedido)

-- item_pedido_opcoes: segue a visibilidade do item_pedido ao qual pertence ---
create policy "item_pedido_opcoes: segue o pedido" on public.item_pedido_opcoes
  for select using (
    exists (
      select 1 from public.itens_pedido ip
      join public.pedidos pe on pe.id = ip.pedido_id
      where ip.id = item_pedido_id
        and (
          pe.consumidor_id = auth.uid()
          or exists (select 1 from public.estabelecimentos e where e.id = pe.estabelecimento_id and e.dono_id = auth.uid())
          or public.meu_tipo() = 'administrador'
        )
    )
  );
-- (sem insert direto — ver public.criar_pedido)

-- pagamentos: mesma visibilidade do pedido. gateway_id/gateway_payload
-- não são pedidos pelo app fora do papel administrador (ver lib/pedidos.js) --
create policy "pagamentos: segue o pedido" on public.pagamentos
  for select using (
    exists (
      select 1 from public.pedidos p
      where p.id = pedido_id
        and (
          p.consumidor_id = auth.uid()
          or exists (select 1 from public.estabelecimentos e where e.id = p.estabelecimento_id and e.dono_id = auth.uid())
          or public.meu_tipo() = 'administrador'
        )
    )
  );
-- (sem insert direto — ver public.criar_pedido; sem isso dava pra gravar
--  um pagamento já com status 'aprovado' sem nunca ter pago)
create policy "pagamentos: comerciante confirma retirada" on public.pagamentos
  for update using (
    exists (
      select 1 from public.pedidos p
      join public.estabelecimentos e on e.id = p.estabelecimento_id
      where p.id = pedido_id and e.dono_id = auth.uid()
    )
    or public.meu_tipo() = 'administrador'
  );

-- Categorias iniciais ---------------------------------------------------------
insert into public.categorias (nome) values
  ('Alimentação'),
  ('Mercado'),
  ('Farmácia'),
  ('Loja');

-- ============================================================
-- Storage: imagens de capa (estabelecimento) e de produto.
-- Buckets públicos pra leitura (a URL pública funciona sem autenticação,
-- direto no <img>/next-image); escrita restrita ao dono, mesmo raciocínio
-- de RLS já usado em todas as tabelas acima. Caminho do arquivo sempre
-- começa com o id do dono do recurso (ex.: "{estabelecimento_id}/capa.jpg"),
-- é isso que a policy usa pra confirmar a posse.
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('capas-estabelecimentos', 'capas-estabelecimentos', true),
  ('imagens-produtos', 'imagens-produtos', true)
on conflict (id) do nothing;

create policy "capas-estabelecimentos: leitura publica" on storage.objects
  for select using (bucket_id = 'capas-estabelecimentos');
create policy "capas-estabelecimentos: dono gerencia" on storage.objects
  for all using (
    bucket_id = 'capas-estabelecimentos'
    and exists (
      select 1 from public.estabelecimentos e
      where e.id::text = (storage.foldername(name))[1]
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );

create policy "imagens-produtos: leitura publica" on storage.objects
  for select using (bucket_id = 'imagens-produtos');
create policy "imagens-produtos: dono gerencia" on storage.objects
  for all using (
    bucket_id = 'imagens-produtos'
    and exists (
      select 1 from public.produtos p
      join public.estabelecimentos e on e.id = p.estabelecimento_id
      where p.id::text = (storage.foldername(name))[1]
        and (e.dono_id = auth.uid() or public.meu_tipo() = 'administrador')
    )
  );
-- ============================================================
-- Fase 1 da auditoria — item crítico #1 e #2
-- Cria o pedido inteiro dentro do banco, numa única transação,
-- calculando o preço a partir das tabelas. O cliente passa a mandar
-- apenas O QUE quer comprar (produto + quantidade + opções escolhidas);
-- QUANTO custa é decidido aqui, nunca aceito de fora.
-- ============================================================

create or replace function public.criar_pedido(
  p_estabelecimento_id uuid,
  p_itens jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_consumidor uuid := auth.uid();
  v_pedido_id uuid;
  v_item jsonb;
  v_produto record;
  v_obrigatoria record;
  v_valor_ids uuid[];
  v_preco_base numeric(10, 2);
  v_ajuste numeric(10, 2);
  v_preco_unitario numeric(10, 2);
  v_quantidade integer;
  v_subtotal numeric(10, 2);
  v_total numeric(10, 2) := 0;
  v_item_pedido_id uuid;
begin
  if v_consumidor is null then
    raise exception 'Você precisa entrar na sua conta para finalizar o pedido.';
  end if;

  if p_itens is null or jsonb_array_length(p_itens) = 0 then
    raise exception 'O pedido não tem nenhum item.';
  end if;

  -- A loja precisa existir, estar ativa e aberta agora.
  perform 1 from public.estabelecimentos
   where id = p_estabelecimento_id and ativo and aberto_agora;
  if not found then
    raise exception 'Esta loja não está aceitando pedidos no momento.';
  end if;

  insert into public.pedidos (consumidor_id, estabelecimento_id, total)
  values (v_consumidor, p_estabelecimento_id, 0)
  returning id into v_pedido_id;

  for v_item in select value from jsonb_array_elements(p_itens)
  loop
    v_quantidade := coalesce((v_item ->> 'quantidade')::integer, 0);
    if v_quantidade <= 0 then
      raise exception 'Quantidade inválida em um dos itens.';
    end if;

    -- O produto precisa ser desta loja e estar disponível.
    select p.id, p.preco, p.preco_promocional
      into v_produto
      from public.produtos p
     where p.id = (v_item ->> 'produto_id')::uuid
       and p.estabelecimento_id = p_estabelecimento_id
       and p.disponivel;
    if not found then
      raise exception 'Um dos produtos não está mais disponível.';
    end if;

    v_preco_base := coalesce(v_produto.preco_promocional, v_produto.preco);

    select coalesce(array_agg(elem::uuid), '{}'::uuid[])
      into v_valor_ids
      from jsonb_array_elements_text(coalesce(v_item -> 'valor_ids', '[]'::jsonb)) as elem;

    -- Soma só os ajustes de valores que realmente pertencem a este produto —
    -- id de opção de outro produto é simplesmente ignorado.
    select coalesce(sum(v.ajuste_preco), 0)
      into v_ajuste
      from public.produto_opcao_valores v
      join public.produto_opcoes o on o.id = v.opcao_id
     where v.id = any(v_valor_ids)
       and o.produto_id = v_produto.id;

    -- Toda opção obrigatória precisa ter pelo menos um valor escolhido.
    for v_obrigatoria in
      select o.id from public.produto_opcoes o
       where o.produto_id = v_produto.id and o.obrigatoria
    loop
      perform 1 from public.produto_opcao_valores v
       where v.opcao_id = v_obrigatoria.id and v.id = any(v_valor_ids);
      if not found then
        raise exception 'Faltou escolher uma opção obrigatória de um dos produtos.';
      end if;
    end loop;

    v_preco_unitario := v_preco_base + v_ajuste;
    v_subtotal := v_preco_unitario * v_quantidade;
    v_total := v_total + v_subtotal;

    insert into public.itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, subtotal)
    values (v_pedido_id, v_produto.id, v_quantidade, v_preco_unitario, v_subtotal)
    returning id into v_item_pedido_id;

    -- Congela nome e ajuste das opções escolhidas (mesmo raciocínio do preco_unitario).
    insert into public.item_pedido_opcoes (item_pedido_id, nome_opcao, nome_valor, ajuste_preco)
    select v_item_pedido_id, o.nome, v.nome, v.ajuste_preco
      from public.produto_opcao_valores v
      join public.produto_opcoes o on o.id = v.opcao_id
     where v.id = any(v_valor_ids)
       and o.produto_id = v_produto.id;
  end loop;

  update public.pedidos set total = v_total where id = v_pedido_id;

  insert into public.pagamentos (pedido_id, metodo, status, valor)
  values (v_pedido_id, 'retirada', 'pendente', v_total);

  return v_pedido_id;
end;
$$;

revoke all on function public.criar_pedido(uuid, jsonb) from public, anon;
grant execute on function public.criar_pedido(uuid, jsonb) to authenticated;

-- Funções de gatilho: rodam sozinhas quando algo acontece no banco, ninguém
-- deveria chamá-las pela API. O Postgres confere a permissão na hora de criar
-- o gatilho, não na hora que ele dispara, então revogar aqui não quebra nada.
revoke execute on function public.lidar_novo_usuario() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- ============================================================
-- Fecha a porta antiga: sem estas policies, ninguém consegue mais
-- inserir pedido/item/opção/pagamento direto pela API — só através da
-- função acima, que calcula o preço sozinha.
-- ============================================================
drop policy if exists "pedidos: consumidor cria" on public.pedidos;
drop policy if exists "itens_pedido: consumidor cria junto do pedido" on public.itens_pedido;
drop policy if exists "item_pedido_opcoes: consumidor cria junto do pedido" on public.item_pedido_opcoes;
drop policy if exists "pagamentos: consumidor cria junto do pedido" on public.pagamentos;

-- ============================================================
-- Realtime: o painel do comerciante precisa saber na hora que
-- chegou pedido novo, sem recarregar a página.
-- ============================================================
alter publication supabase_realtime add table public.pedidos;
