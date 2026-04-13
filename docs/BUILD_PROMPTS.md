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
| 02 | Home do Cardápio | ✅ feito |
| 03 | Tela de Produto | ✅ feito |
| 04 | Carrinho | ✅ feito |
| 05 | Login / Auth | ✅ feito (CPF only, sem social login) |
| 06 | Conta da Mesa | ✅ feito |
| 07 | Pagamento | ✅ parcial (falta: dividir por igual, toggle serviço, loading, erros) |
| 08 | Sucesso + Loyalty + Avaliação | ✅ parcial (falta: pesquisa de satisfação, Google Review) |
| 09 | Multi-vendor | ⬜ |
| 10 | i18n (PT/EN/ES/FR) | ⬜ |
| 11 | KDS / Acompanhamento real-time | ✅ parcial (mock com MockSwitcher, sem polling automático) |
| 12 | QR Routing + Splash de entrada | ⬜ |
| 13 | Banner de programação / propaganda | ⬜ |
| 14 | Vinculação CPF↔Pedido (CRM layer) | ✅ parcial (CPF vincula pedido, sem onboarding) |

---

## ANÁLISE DE GAPS — Jornada Figma vs. Implementado

> Baseado na jornada completa do Figma (5 seções: Entrada, Cardápio, Pedido, Conta/Pagamento, Pós)

### Gaps prioritários (frontend implementável)

| # | Gap | Seção da jornada | Onde implementar |
|---|-----|-------------------|------------------|
| G1 | **Dividir por igual** — terceira opção de pagamento (divide por pessoas logadas na mesa) | Conta/Pagamento | `TableAccount.tsx` + `Payment.tsx` |
| G2 | **Toggle de serviço** — poder desligar os 10% no pagamento | Conta/Pagamento | `Payment.tsx` |
| G3 | **Preview de cashback no carrinho** — estimativa antes de enviar pedido | Pedido | `CartSheet.tsx` |
| G4 | **Processamento de pagamento** — tela de loading entre "Pagar" e "Sucesso" | Conta/Pagamento | `Payment.tsx` → nova tela ou estado inline |
| G5 | **Estados de erro** — PIX expirado, cartão falhou, com retry | Conta/Pagamento | `Payment.tsx` |
| G6 | **Pesquisa de satisfação** — rating + dimensões + redirect Google Review | Pós | `Success.tsx` ou nova tela |
| G7 | **Aguarda demais pagamentos** — estado de pendência quando mesa não está 100% paga | Pós | `Success.tsx` |

### Gaps secundários (escopo maior / infra)

| # | Gap | Seção da jornada |
|---|-----|-------------------|
| G8 | Multi-vendor / Seleção de loja | Cardápio |
| G9 | QR Scan routing + "Cardápio ativo?" decision | Entrada |
| G10 | Info nutricional no produto | Cardápio |
| G11 | Sugestão de produtos no ProductDetail | Cardápio |
| G12 | Social login (Google/Apple) | Pedido |
| G13 | Programação do local no banner de entrada | Entrada |
| G14 | Mesa fecha automático (conceito backend) | Pós |

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

4. Avaliação interna Zig (sempre exibir):
   - Rating 1–5 estrelas
   - Nota ≤ 3: campo de texto "O que podemos melhorar?"
   - Nota ≥ 4: campo opcional "O que você mais gostou?"
   - Dimensões colapsáveis: Produto, Serviço, Limpeza, Música

5. Google Review (condicional — SÓ nota geral ≥ 4):
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

---

## DETALHES PENDENTES

### Consistência de botões (design debt)

O app tem uma variedade grande de estilos de botão sem padronização clara:
- Diferentes border-radius: `rounded-pill` (500px), `rounded-xl` (12px), `rounded-2xl` (16px)
- Tamanhos inconsistentes: `py-2`, `py-2.5`, `py-3`, `py-3.5`
- Pesos de fonte misturados: `font-medium` vs `font-bold` vs `font-semibold`
- Cores de fundo: brand-fill, surface-low, white, rgba overlays, cinzas variados
- Borders: alguns com borda, outros sem, espessuras diferentes

**Ação necessária:** definir um sistema de botões com 3 variantes claras:
1. **Primary** — brand-fill, text-on-brand, rounded-pill, font-bold (1 por tela no máximo)
2. **Secondary** — outline (border-brand-fill, text-brand-text, bg-transparent), rounded-pill
3. **Ghost/Text** — sem fundo, sem borda, text-brand-text ou text-txt-tertiary

Revisar todas as telas e unificar. Isso não é urgente, mas está criando ruído visual nas telas com múltiplos CTAs (ex: Success, Payment, Cart).
