# Jornada B2C Zig — Features & Prompts de Build

> Stack: React + TypeScript + Tailwind + shadcn/ui + Framer Motion
> Figma: https://www.figma.com/design/LJfDWBbxEA0zgWPjorwWQA/Jornada-Completa-B2C-%7C-Mesas
> Restaurante piloto: **Mana** (sem acento) · Salvador, BA

---

## CONVENÇÃO GERAL (vale para todos os prompts)

> **Sempre siga os padrões já estabelecidos no projeto:**
> - Tipografia: use as famílias e escalas já definidas no design system do projeto
> - Cores de texto, superfície e borda: use os tokens CSS já existentes (`--color-text-*`, `--color-surface-*`, `--color-border-*`)
> - Cores da marca do restaurante: use exclusivamente os tokens `--color-brand-*` gerados pelo `colorSystem.ts`
> - Loyalty gold: use o token já definido em `colorSystem.ts`
> - Espaçamentos e border-radius: use os tokens já definidos
> - `getTextOnBackground()`: use sempre que um texto aparecer sobre fundo colorido dinâmico
> - Nunca hardcode hex, nunca hardcode família tipográfica — sempre tok DAS FEATURES

| # | Feature | Status |
|---|---|---|
| 01 | Sistema de cores | ✅ feito |
| 02 | Home do Cardápio | ✅ feito (+ hero landing com scroll morph, busca full-screen, header glass) |
| 03 | Tela de Produto | ✅ feito (+ sugestões de produtos relacionados, nutrição redesenhada) |
| 04 | Carrinho | ✅ feito (cashback preview, shimmer no CTA, badge qtd+valor) |
| 05 | Login / Auth | ✅ feito (CPF + social login mockado; Apple simula falha OAuth com tela de erro dedicada) |
| 06 | Conta da Mesa | ✅ feito (botões de pagamento com valores, lógica solo/múltiplos, extrato com pagamentos) |
| 07 | Pagamento | ✅ feito (dividir por igual, toggle serviço, loading, estados de erro) |
| 08 | Sucesso + Loyalty + Avaliação | ✅ feito (survey, Google Review, accordion extrato, hierarquia de CTAs) |
| 09 | Multi-vendor | ✅ feito (food hall com 4 vendors, VendorBar, VendorGrid, navegação por âncoras) |
| 10 | i18n (PT/EN/ES/FR) | ⬜ |
| 11 | KDS / Acompanhamento real-time | ✅ suficiente p/ demo (mock manual via MockSwitcher; polling automático = escopo produção) |
| 12 | QR Routing + Splash de entrada | ⏭️ escopo produção (não necessário para demo) |
| 13 | Banner de programação / propaganda | ✅ feito (4 tipos: dish, event, loyalty 3 estados, ad; carousel interativo com drag) |
| 14 | Vinculação CPF↔Pedido (CRM layer) | ✅ suficiente p/ demo (CPF vincula pedido; onboarding "bem-vindo de volta" = escopo produção) |
| 15 | Modo pré-pago | ✅ feito (toggle no MockSwitcher, CTA "Pagar e enviar", Success "Pago e enviado!") |
| 16 | Visibilidade de todos os pedidos na mesa | ✅ feito (tab "Toda a mesa" com avatares por pessoa, extrato completo) |
| 17 | Pesquisa de satisfação — redesign Zig | ✅ feito |
| 18 | Nota fiscal por email pós-pagamento | ✅ feito (campo inline no Success, "Pular" disponível) |
| 19 | Enriquecimento de dados do cliente (CPF) | ✅ feito (campo inline no Payment quando !hasCpf) |
| 20 | Divisão dinâmica de conta | ✅ feito |
| 21 | Fechamento automático de mesa + aviso re-scan | ✅ feito (empty state "Mesa encerrada" + aviso QR) |
| 22 | Modos de jornada (full / menuOnly / paymentOnly) | ✅ feito (toggle no MockSwitcher, rotas condicionais, tela Identify para paymentOnly) |
| 23 | Tela de erro de login (OAuth) | ✅ feito (Apple simula falha, tela dedicada com retry) |
| 24 | Layout responsivo desktop | ✅ feito (modais centralizados, grid de produtos, header full-width, max-w-5xl) |

---

## ANÁLISE DE GAPS — Jornada Figma vs. Implementado

> Baseado na jornada completa do Figma (5 seções: Entrada, Cardápio, Pedido, Conta/Pagamento, Pós)

### Gaps prioritários (frontend implementável)

| # | Gap | Status | Onde implementar |
|---|-----|--------|------------------|
| G1 | **Dividir por igual** | ✅ feito | `TableAccount.tsx` + `Payment.tsx` |
| G2 | **Toggle de serviço** | ✅ feito | `Payment.tsx` |
| G3 | **Preview de cashback no carrinho** | ✅ feito | `CartSheet.tsx` |
| G4 | **Processamento de pagamento** (loading) | ✅ feito | `Payment.tsx` |
| G5 | **Estados de erro** (PIX expirado, cartão falhou) | ✅ feito | `Payment.tsx` |
| G6 | **Pesquisa de satisfação** + Google Review | ✅ feito | `SatisfactionSurvey.tsx` + `Success.tsx` |
| G7 | **Aguarda demais pagamentos** | ✅ feito | `Success.tsx` (accordion extrato) |
| G11 | **Sugestão de produtos no ProductDetail** | ✅ feito | `UpsellSheet.tsx` + `ProductDetail.tsx` |

### Gaps restantes

| # | Gap | Seção da jornada | Prioridade |
|---|-----|-------------------|------------|
| G11 | ~~Sugestão de produtos no ProductDetail~~ | Cardápio | ✅ feito |
| G8 | ~~Multi-vendor / Food Hall~~ | Cardápio | ✅ feito |
| G13 | ~~Programação do local / banners contextuais~~ | Entrada | ✅ feito |
| G17 | ~~Consistência de botões~~ (design debt) | Transversal | ✅ feito |
| G15 | ~~KDS polling automático~~ | Acompanhamento | ⏭️ escopo produção |
| G9 | ~~QR Scan routing + Splash de entrada~~ | Entrada | ⏭️ escopo produção |
| G12 | ~~Social login (Google/Apple)~~ | Pedido | ⏭️ escopo produção |
| G14 | ~~Mesa fecha automático~~ | Pós | ⏭️ escopo produção |
| G16 | ~~Onboarding CPF novo / "bem-vindo de volta"~~ | Login | ⏭️ escopo produção |

---

## FEATURE 01 — Sistema de Cores
**Status: ✅ feito**

`src/lib/colorSystem.ts` com geração de escala 50→900, tokens semânticos, `getTextOnBackground()`, `applyBrandToDOM()` com transition suave. BrandSwitcher dentro do menu sanduíche com presets de cor.

---

## FEATURE 02 — Home do Cardápio
**Status: ✅ feito (em ajustes)**

Header · Banner Carousel 3D · Navegação de categorias (2 níveis) · Seção "Sugesoção destacado · Bottom bar sticky.

---

## FEATURE 03 — Tela de Produto

**Prompt 03-A — Produto simples:**
```
Use o Figma MCP para ler a referência visual antes de começar:
https://www.figma.com/design/LJfDWBbxEA0zgWPjorwWQA/Jornada-Completa-B2C-%7C-Mesas
Node: 36:2822

Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente a tela de produto simples (/cardapio/produto/:id).

Layout:
- Foto hero fullbleed no topo (~50vh), sem header sobre ela
- Back button flutuante (glassmorphism, canto superior esquerdo)
- Badge de categoria: pill com --color-brand-subtle e --color-brand-text
- Nome do prato: display size bold, token de texto heading do projeto
- Descrição completa: token de texto body, line-height padrão do projeto
- Bloco de informações nutricionais colapsável (accordeon):
  calorias, proteína, carboidrato, gordura — exibe só se o restaurante cadastrou
- Alergênicos em chips (glúten, lactose, etc.) — exibe só se cadastrado
- Sticky footeng) + botão "Adicionar"
  Botão: fundo --color-brand-fill, texto via getTextOnBackground()
  border-radius: pill
- Animação de entrada: foto slide de cima, conteúdo slide de baixo, 400ms
- Ao adicionar: item voa para ícone do carrinho (bottom bar), 300ms
```

**Prompt 03-B — Produto montável:**
```
Adicione suporte a produto montável na tela de produto (/cardapio/produto/:id).
Siga todos os padrões já definidos no projeto.

Produto montável tem steps de personalização antes de ir ao carrinho.
Exemplos: escolha de proteína, acompanhamento, ponto da carne, extras pagos.

Comportamento:
- Steps em sequência vertical (não modal, não wizard separado)
- Cada step: título bold (token heading) + opções em lista (radio ou checkbox conforme config)
- Step obrigatório incompleto: borda --color-brand-border
- Step completo: check em --color-brand-fill
- Preço total atualiza em tempo real conforme seleção de extras
- Botão "Adicionar" fica disabled até todos os obrigatórios preenchidos
  Disdesabilitado já definido no projeto
- Ao adicionar: mesmo voo para o carrinho do produto simples
```

---

## FEATURE 04 — Carrinho

**Prompt 04:**
```
Use o Figma MCP para referência visual:
https://www.figma.com/design/LJfDWBbxEA0zgWPjorwWQA/Jornada-Completa-B2C-%7C-Mesas

Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente a tela de carrinho (/carrinho).

Header: "Seu pedido" + mesa badge (componente reutilizado do header da home)

Lista de itens:
- Foto 48×48, border-radius sm do projeto
- Nome do produto: token heading bold
- Personalizações selecionadas: token caption
- Separador: token border divider entre itens
- Controles de quantidade: − e + com animação de scale, mínimo 1
- Remover item: swipe left ou ícone lixeira com confirmação inline (não modal)

Resumo (sticky no rodapé):
- Subtotal: label (token caption) + valor (token heading)
- Taxa de serviço (% configurável pelo restaurante, default 10%)
- Total: bold, maior, token heading

B- Fundo --color-brand-fill, texto via getTextOnBackground()
- Se não está logado → navega para /login com returnTo=/carrinho
- Se está logado → bottom sheet de confirmação simples antes de enviar

Empty state: ilustração + "Seu carrinho está vazio" + CTA "Explorar cardápio"
```

---

## FEATURE 05 — Login / Auth

**Prompt 05:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente o fluxo de login (/login).

Regra principal: login só acontece no momento de enviar pedido ou iniciar pagamento.
Nunca bloqueie antes de explorar o cardápio.

UI (bottom sheet fullscreen no mobile):
- Logo do restaurante centralizado
- Título: "Para continuar, entre na sua conta" — token heading
- Botão "Entrar com Google" (ícone SVG + label)
- Botão "Entrar com Apple" (ícone SVG + label)
- Divisor "ou" em token caption
- Campo CPF com máscara (000.000.000-00):
  CPF é para vinculação ao ecossistema Zig (base de 30M+ CPFs)
  Não é obrigatório para quem usairo" → substitui CPF por campo de telefone com DDI
- Após autenticação: retorna automaticamente para returnTo
- Persistência: sessão em localStorage
- Após login: exibir avatar (iniciais) no header
- Animação: bottom sheet slide up 400ms ease-out
```

---

## FEATURE 06 — Conta da Mesa

**Prompt 06:**
```
Use o Figma MCP para referência visual:
https://www.figma.com/design/LJfDWBbxEA0zgWPjorwWQA/Jornada-Completa-B2C-%7C-Mesas

Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente a tela de conta da mesa (/conta).

Contexto: múltiplos usuários na mesma mesa. Cada pedido vinculado ao CPF de quem pediu.

Header: "Mesa 12" + status pill (Aberta / Fechada)

Toggle no topo:
- "Meus itens": só o que o usuário logado pediu
- "Toda a mesa": tudo sem breakdown por pessoa (privacidade)

Lista de itens (somente leitura):
- Nome, personalizações, preço — tokens do projeto
- Status em tempo real por item (ver Feature 11)

Bloco de resumo:
- Total da mesa
- J�al)
- Ainda em aberto

Estados especiais:
- Mesa parcialmente paga: exibe os dois totais sem breakdown por pessoa
- Após pagamento parcial: CTAs "Ver conta" e "Continuar pedindo" (já logado, sem novo login)
- Mesa totalmente paga: fecha automaticamente, empty state com resumo do consumo

CTAs principais:
- "Pagar minha parte" → /pagamento
- "Pagar conta toda" → /pagamento?mode=total
```

---

## FEATURE 07 — Pagamento

**Prompt 07-A — Estrutura e modalidades:**
```
Use o Figma MCP para referência visual:
https://www.figma.com/design/LJfDWBbxEA0zgWPjorwWQA/Jornada-Completa-B2C-%7C-Mesas
Referência de mercado: Sunday (sunday.co) — melhor digital bill do mundo.

Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente a tela de pagamento (/pagamento).

Tabs no topo para seleção de modalidade:
- Tab ativa: fundo --color-brand-fill, texto via getTextOnBackground()
- Tab inativa: tokens de estado inativo do projeto

Modalidade 1 — Pagar valor total:
- Resumo Gorjeta opcional: chips de valor fixo + campo livre
- Formulário: nome + CPF (pré-preenchido se logado)
- Checkbox de aceite de termos inline

Modalidade 2 — Dividir em partes iguais:
- Stepper "Somos X pessoas"
- Valor por pessoa atualiza em tempo real
- Avatares de quem já pagou (iniciais + check com token de sucesso do projeto)
- "Pagar outro valor" → editar a própria parte

Modalidade 3 — Selecionar meus itens:
- Checklist de todos os itens da mesa (os do usuário pré-selecionados)
- Taxa de serviço proporcional à seleção
- Edição de valor parcial por item: chips 25% / 50% / valor livre
- Resumo pessoal separado do total da mesa
```

**Prompt 07-B — Formas de pagamento + loyalty + estados:**
```
Siga todos os padrões já definidos no projeto.

Adicione formas de pagamento, loyalty e todos os estados de erro/sucesso ao /pagamento.

Formas de pagamento:
- Pix: QR Code + botão copiar código + timer 10min regressivo
  Expirado: botão "Gerar novo código" inline, sem sair da tela
- Apo nativo
- Cartão: formulário com máscara (número, validade, CVV)

Toggle de Giftback/Loyalty (exibir SÓ se usuário tem saldo disponível):
- Switch "Usar meu giftback — R$ X disponível"
- Ao ativar: desconto reflete no total em tempo real
- Informar cashback estimado ANTES de confirmar usando o token loyalty gold do projeto

Estados obrigatórios (todos inline, sem modal bloqueante):
- Processando: skeleton usando os tokens do projeto
- Pix expirado: banner inline + botão de regeneração
- Erro no pagamento: mensagem + retry CTA
- CPF inválido: feedback inline no campo
- Campo obrigatório vazio: highlight de borda + mensagem
- Casa offline: banner de aviso + orientação
- Estorno: tela dedicada com explicação clara

Todos os estados com CTA claro.
```

---

## FEATURE 08 — Sucesso + Loyalty + Avaliação

**Prompt 08:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente a tela de sucesso pós-pagamento (/sucesso).

Sequência de estados em o   - Animação de partículas ou confetti em --color-brand-fill
   - "Pagamento confirmado!" em display size bold
   - Valor pago em destaque

2. Cashback earned:
   - Ícone e texto usando o token loyalty gold do projeto
   - "Você ganhou R$ X de giftback nesta visita"
   - Saldo total acumulado em token caption

3. Estado da mesa:
   Se ainda há débito: "A conta ainda tem R$ X em aberto"
     CTAs: "Ver conta" | "Continuar pedindo"
   Se totalmente paga: "Mesa fechada! Obrigado pela visita" com animação de conclusão

4. Pesquisa de satisfação Zig (sempre exibir após pagamento):
   Tudo num card único, sem etapas — scroll contínuo.

   4a. Avaliação por dimensão (6 dimensões, 1–5 estrelas cada):
       - Produto: "Não estava na temperatura ideal", "Não estava saboroso", "Não foi bem servido"
       - Variedade: "Faltou o meu favorito", "Poucas opções"
       - Serviço: "Atendimento ruim", "Atendimento lento"
       - Preço: "Muito caro", "Custo benefício ruim"
       - Música: "O som não estava bom", "Não gosto do gênero", "Não gostei da banda/DJ"
       - Limpeza: "Banheiro sujo", "Ambiente sujo", "Talheres, pratos ou copos sujos"
       Regra: nota ≤ 3 abre checkboxes com os motivos da dimensão. Nota 4–5 segue sem justificativa.

   4b. NPS (1–10):
       "De 1 a 10, qual a probabilidade de recomendar este local?"
       Chips numéricos em linha. brand-fill no selecionado.

   4c. Feedback aberto:
       Textarea sempre visível ("Quer contar mais?"). Opcional.

   4d. Submit:
       CTA "Enviar respostas" — habilitado quando ≥ 1 dimensão tem rating.

5. Google Review (condicional — média das dimensões ≥ 4 E NPS ≥ 9):
   "Que ótimo! Quer compartilhar no Google?"
   Botão "Avaliar no Google" (link externo) + "Agora não"
   Notas ≤ 3: sem redirecionamento — feedback fica interno.

Animaçcima 500ms.
```

---

## FEATURE 09 — Multi-vendor (Food Hall)

**Prompt 09:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Adicione suporte a multi-vendor no cardápio.

Contexto: food halls com múltiplos vendors (ex: Mana numa arena com várias operações).
Ativado via config: restaurant.isMultiVendor = true.

Quando ativo:
- Tab bar principal vira seletor de vendor (nome/logo de cada vendor)
- "Todos" como primeira tab
- Ao selecionar vendor: categorias e produtos filtram para aquele vendor
- Card de produto exibe nome do vendor em token caption
- Carrinho agrupa itens por vendor com separador e subtotal por vendor
- Payload do pedido agrupa por vendor (para roteamento no KDS)

Quando inativo: comportamento atual sem tab de vendor.

Mock:
{
  isMultiVendor: true,
  vendors: [
    { id: 'mana', name: 'Mana', logo: 'M' },
    { id: 'acai', name: 'AçaíBar', logo: 'A' },
    { id: 'cafe', name: 'Café da Barra', logo: 'C' }
  ]
}
```

---

## FEATURE 10 — Inão (i18n)

**Prompt 10:**
```
Siga todos os padrões já definidos no projeto.

Adicione suporte a múltiplos idiomas com react-i18next.
Idiomas obrigatórios: PT-BR, EN, ES, FR. Desejável: IT.

Seletor de idioma: no menu sanduíche, abaixo do BrandSwitcher.
Detecção automática pelo browser language na primeira visita.
Persistência em localStorage.

Strings a traduzir:
- Toda a UI: labels, botões, mensagens de erro, empty states
- Nomes e descrições de produtos: { name_pt, name_en, name_es, name_fr }
- Instruções do Pix, tela de pagamento, tela de sucesso

Nunca traduzir: preços (sempre formato BR), nome do restaurante.

Foco especial:
- Tela de produto: descrição completa
- Pagamento: instruções do Pix
- Sucesso: mensagem de cashback e avaliação
- Botão "Sou estrangeiro" no login → campo DDI
```

---

## FEATURE 11 — KDS / Acompanhamento em tempo real

**Prompt 11:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente o acompanhamento dee conta (/conta).

Contexto: diferencial mais valorizado pelo Thiago no sistema anterior do Mana.
O dono monitorava remotamente. A cozinha atualizava o status do pedido.

Status por item: recebido → em preparo → pronto → entregue

UI por item:
- Recebido:   indicador usando token de estado neutro do projeto
- Em preparo: indicador usando token warning/amber com pulse animation
- Pronto:     indicador usando token de sucesso do projeto
- Entregue:   check usando token de sucesso do projeto

Notificação inline ao mudar para "pronto":
- Banner sutil no topo: "Seu [item] está pronto!" com auto-dismiss em 4s

Simulação com polling mock a cada 5s:
- t+0s:   recebido
- t+30s:  em preparo
- t+90s:  pronto
- t+120s: entregue
Usar setInterval para simular evolução automática durante demo.
```

---

## FEATURE 12 — QR Routing + Splash de entrada

**Prompt 12:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Implemente o routing inteligente de entrada via QR Codeada.

URL do QR: /?restaurantId=mana&tableId=12&features=menu,payment,loyalty

Routing:
- features inclui "menu" → entra em /cardapio
- features NÃO inclui "menu" mas inclui "payment" → entra direto em /conta
- tableId persiste em contexto global e aparece em todas as telas
- restaurantId carrega a config do restaurante e chama applyBrandToDOM()

Splash de entrada:
- Logo do restaurante com fade in (300ms)
- Reveal de baixo para cima para a primeira tela (500ms ease-out)

Mock de configs:
{
  mana: {
    name: 'Mana',
    brandColor: '#446A81',
    logo: 'M',
    features: ['menu', 'payment', 'loyalty'],
    isMultiVendor: false,
    serviceCharge: 0.10
  }
}

URL de teste: /?restaurantId=mana&tableId=12
```

---

## FEATURE 13 — Banner de programação / propaganda

**Prompt 13:**
```
Siga todos os padrões de tipografia, cor e espaçamento já definidos no projeto.

Adicione suporte a banners contextuais no carousel do header do cardápio.

O carousel já existe — adicione suporte a 4 tipos de caato/Destaque (já existe):
  Foto + badge + label

Tipo 2 — Programação/Evento:
  Fundo com --color-brand-fill
  Ícone de calendário + título do evento + data/hora
  Ex: "Happy Hour toda sexta a partir das 18h"
  Texto via getTextOnBackground()

Tipo 3 — Loyalty (condicional — só se usuário logado com saldo):
  Fundo --color-brand-subtle
  Ícone usando token loyalty gold do projeto
  "Você tem R$ X de giftback disponível aqui"
  CTA "Usar no pagamento" → /pagamento com toggle loyalty ativo

Tipo 4 — Propaganda (condicional — só se restaurante configurou):
  Imagem do parceiro + label "Patrocinado" em token caption
  Tap abre link externo

Config mock:
{
  banners: [
    { type: 'dish', dishId: '...' },
    { type: 'event', title: 'Happy Hour', time: 'Sextas 18h' },
    { type: 'loyalty' },
    { type: 'ad', imageUrl: '...', linkUrl: '...' }
  ]
}
```

---

## FEATURE 14 — Vinculação CPF↔Pedido (CRM Layer)

**Prompt 14:**
```
Siga todos os padrões de tipografia, cor e espaçamenlemente a vinculação de CPF ao pedido para rastreabilidade e CRM.

Contexto: hoje pedidos em mesa não são vinculados a CPF — perda total de rastreabilidade.
O objetivo é saber exatamente quem pediu o quê para CRM, loyalty e histórico.

Payload do pedido deve incluir userId:
{
  tableId: '12',
  restaurantId: 'mana',
  userId: 'cpf_ou_id_social',
  items: [...],
  timestamp: ISO8601
}

Comportamentos vinculados ao userId:
- /conta toggle "Meus itens" filtra por userId
- /pagamento "Selecionar meus itens" pré-seleciona por userId
- /sucesso cashback é creditado ao userId

Mock de base Zig (simular que userId pode já existir):
- CPF na base: exibir "Bem-vindo de volta, [nome]!" no login
- CPF novo: onboarding mínimo (só nome)

Dados mockados por userId para demo:
{
  cpf: '123.456.789-00',
  name: 'Victor',
  giftbackBalance: 12.50,
  visitCount: 7,
  lastVisit: '2026-03-15'
}
```

---

## ROTAS E TELAS

| Rota | Tela | Feature |
|---|---|---|
| `/` | Splash + QR entry | 12 |
| `/cardapio` | Home 02 |
| `/cardapio/produto/:id` | Produto | 03-A + 03-B |
| `/carrinho` | Carrinho | 04 |
| `/login` | Login / Auth | 05 |
| `/conta` | Conta da mesa | 06 |
| `/pagamento` | Pagamento | 07-A + 07-B |
| `/sucesso` | Sucesso + loyalty | 08 |

## FEATURES TRANSVERSAIS

| Feature | Descrição |
|---|---|
| 01 | Sistema de cores white-label |
| 09 | Multi-vendor (food hall) |
| 10 | i18n PT/EN/ES/FR |
| 11 | KDS / status em tempo real |
| 12 | QR routing + splash |
| 13 | Banner de programação e propaganda |
| 14 | CPF↔pedido (CRM layer) |
| 15–21 | Stakeholder features — todas implementadas |
| 22–24 | Modos de jornada, erro OAuth, desktop responsive |

---

## DETALHES PENDENTES

### Consistência de botões (design debt)
**Status: ✅ resolvido**

Sistema de 3 variantes aplicado em todas as telas:
1. **Primary** — `rounded-pill py-3 text-sm font-bold bg-brand-fill text-on-brand hover:bg-brand-fill-hover active:scale-95`
2. **Secondary** — `rounded-pill py-3 text-sm font-bold border border-brand-border text-brand-text hover:bg-brand-subtle active:scale-95`
3. **Ghost** — `py-2 text-sm font-medium text-brand-text`

Botões compostos (com badge de qtd + valor) mantêm a mesma base + `flex justify-between px-4/px-5`.

---

## BACKLOG — Notas de stakeholder (2026-04-16)

> Itens levantados em conversa com stakeholder. Organizar em features/prompts quando forem priorizados.

### 15. Modo pré-pago

Fluxo alternativo ao pós-pago atual. Usuário escolhe produto → paga → só então o pedido é enviado à cozinha.

- Impacta: Carrinho (Feature 04), Pagamento (Feature 07), KDS (Feature 11)
- Decisão necessária: toggle por restaurante? Ou é um modo global?
- UX: o carrinho vira um "checkout" — o CTA muda de "Enviar pedido" para "Pagar e enviar"
- Pós-pagamento: redireciona para acompanhamento (KDS) em vez de /conta

### 16. Visibilidade de todos os pedidos na mesa

Tela da mesa (/conta) deve mostrar todas as pessoas que pediram, não apenas o usuário logado.

- Hoje: toggle "Meus itens" / "Toda a mesa" — mas "Toda a mesa" não mostra breakdown por pessoa
- Novo: listar cada pessoa (nome/iniciais) com seus itens, mantendo privacidade de valores individuais
- Considerar: avatar de cada pessoa, status dos itens por pessoa

### 17. Pesquisa de satisfação — redesign Zig
**Status: ✅ feito**

Reescrito `SatisfactionSurvey.tsx` para capturar os mesmos dados do sistema Zig existente.

Estrutura (card único, sem etapas):
1. **6 dimensões** (Produto, Variedade, Serviço, Preço, Música, Limpeza) — 1-5 estrelas cada
   - Nota ≤ 3 → checkboxes "O que aconteceu?" com motivos específicos por dimensão
   - Nota 4-5 → sem justificativa
2. **NPS 1-10** — chips numéricos ("Recomendaria para amigos?")
3. **Feedback aberto** — textarea sempre visível, opcional
4. **Google Review** — pós-submit, aparece se média dimensões ≥ 4 E NPS ≥ 9

Arquivo: `SatisfactionSurvey.tsx`

### 18. Nota fiscal por email pós-pagamento

Após pagamento confirmado, informar ao cliente que a NF será enviada por email.

- Tela de sucesso (/sucesso): adicionar aviso "Sua nota fiscal será enviada para seu email"
- Se não temos o email: pedir nesse momento (campo inline, não bloqueante)
- Considerar: integração futura com sistema de NF-e

### 19. Enriquecimento de dados do cliente

Capturar CPF quando não temos — momento ideal: durante o pagamento ou pós-pagamento.

- Se usuário logou com social (Google/Apple) e não tem CPF vinculado: pedir CPF antes de confirmar pagamento
- UX: campo inline com explicação "Precisamos do CPF para a nota fiscal"
- Não bloqueante para o fluxo — mas incentivado
- Relacionado com Feature 14 (CRM layer)

### 20. Divisão dinâmica de conta
**Status: ✅ feito**

Regras de negócio implementadas:

1. **O split sempre divide o saldo restante** (`remaining = total - paidAmount`), nunca o total bruto
2. **O stepper "Somos quantas pessoas?" inicializa com o número real de pessoas na mesa** (via `uniquePeopleCount`), não hardcoded 2
3. **Após cada pagamento parcial, `recordPayment()` atualiza o `paidAmount`** no MockContext — ao voltar no TableAccount, `remaining` reflete o novo saldo e todos os valores recalculam
4. **No split view com conta parcialmente paga, exibe "Falta pagar R$X"** acima do valor por pessoa, dando contexto
5. **Payment mode `split`**: calcula `remaining / people`
6. **Payment mode `total`**: calcula `remaining` direto
7. **Payment mode `mine`**: calcula o total dos meus itens + serviço (independente do que já foi pago pela mesa — é "minha parte")

Fluxo exemplo:
- Conta R$300 (c/ serviço), 3 pessoas → split R$100 cada
- Pessoa 1 paga R$100 → `paidAmount = 10000`, remaining = R$200
- Pessoa 2 abre split → vê "Falta pagar R$200", stepper em 3, ajusta pra 2 → R$100 cada
- Pessoa 2 paga → remaining = R$100 → Pessoa 3 paga o restante

Arquivos: `TableAccount.tsx`, `Payment.tsx`, `MockContext.tsx` (`recordPayment`)

### 21. Fechamento automático de mesa + aviso de re-scan

Quando a conta é 100% paga, a mesa fecha automaticamente.

- Já existe parcialmente (estado `fully_paid`)
- Adicionar: tela/modal claro de "Mesa encerrada"
- Aviso importante: "Se quiser pedir algo a mais, escaneie o QR code novamente"
- Esse aviso é crítico — sem ele o usuário fica perdido tentando pedir na mesa fechada
- UX sugerida: tela de sucesso final com ícone de check + mensagem de encerramento + botão "Escanear QR" ou "Novo pedido"
- Considerar: timer de expiração da sessão após mesa fechada
