# Roteiro de Demo — Zig Jornada B2C Restaurantes

> App: http://localhost:5173/
> Restaurante piloto: **Mana** (Salvador, BA)
> Duração estimada: ~20 min (versão completa) ou ~10 min (versão rápida — pular seções marcadas com ⏭️)

---

## Preparação (antes de começar)

1. Abrir o menu hambúrguer → **MockSwitcher**
2. Garantir que os toggles estejam:
   - Pré-pago: **OFF**
   - Food Hall: **OFF**
   - Logado: **OFF**
   - Tem CPF: **ON**
   - Tem email: **OFF**
3. Clicar **"Zerar mesa"** pra resetar tudo
4. A página vai recarregar com o hero landing limpo

---

## Parte 1 — Primeira impressão (não logado)

### 1.1 Hero Landing
- A tela abre com imagem fullscreen do restaurante
- Scrollar devagar pra mostrar o **morph animation**: a imagem encolhe e vira o carousel de banners
- O header aparece com efeito glass conforme scrolla

### 1.2 Banner Carousel
- Mostrar os diferentes tipos de banner arrastando:
  - **Dish**: foto do prato + badge + nome
  - **Cashback (deslogado)**: "Ganhe Cashback em cada pedido!" — é o convite pra se cadastrar
  - **Happy Hour**: imagem do evento com texto
  - **Ad**: imagem + label "Patrocinado" no canto
- Demonstrar o **drag interativo**: arrastar com o mouse/dedo, slide adjacente aparece do lado

### 1.3 Welcome Banner
- ~1 segundo após o scroll, aparece o banner de boas-vindas
- Mostrar os perks: cashback, promoções exclusivas
- Clicar "Continuar sem identificação" — banner desaparece

### 1.4 Navegação do cardápio
- Mostrar as **categorias** na nav sticky (Destaques, Açaí, Café da Manhã, Pratos, Bebidas)
- Clicar numa categoria → scrolla suave até a seção
- Mostrar a **seção de sugestões** (scroll horizontal)

### 1.5 Busca ⏭️
- Clicar no campo de busca → overlay fullscreen
- Mostrar: chips de categorias, itens populares
- Digitar "grat" → resultados filtrados em tempo real
- Clicar num resultado → vai pro produto

---

## Parte 2 — Produto + Carrinho

### 2.1 Produto simples
- Clicar em um produto (ex: Gratinado Mana)
- Mostrar: foto hero fullbleed, badge de categoria, nome, descrição
- Mostrar **informação nutricional** (calorias, proteína, carbs, gordura)
- Mostrar **alergênicos** (chips: Glúten, Lactose)
- Mostrar **produtos relacionados** (scroll horizontal embaixo)
- Clicar "Adicionar" → **animação de voo** pro ícone do carrinho

### 2.2 Produto montável ⏭️
- Clicar em "Monte seu Bowl" ou "Sanduíche Custom"
- Mostrar os steps de customização: base, tamanho, toppings
- Selecionar opções → preço atualiza em tempo real
- Botão "Adicionar" fica disabled até preencher os obrigatórios
- Preencher e adicionar

### 2.3 Upsell
- Após adicionar, aparece o **sheet de upsell**: "Que tal adicionar?"
- Mostrar quick-add: clicar no "+" → check verde (sem sair da tela)
- Itens com customização: clicar leva pro ProductDetail
- Clicar "Ver pedido" → abre o carrinho

### 2.4 Carrinho
- Mostrar lista de itens com foto, nome, customizações, preço
- Alterar quantidade: **+/−** com animação
- Quantidade 1 → minus vira **lixeira** (trash icon)
- Mostrar resumo: subtotal, serviço 10%, total
- CTA: "Enviar pedido" com badge de quantidade + valor + shimmer

---

## Parte 3 — Login + Envio (pós-pago)

### 3.1 Login
- Clicar "Enviar pedido" → redireciona pro **/login** (não está logado)
- Mostrar: botões Google/Apple (visuais), campo de nome + CPF
- Preencher nome + CPF → "Continuar"
- Volta automaticamente pro carrinho

### 3.2 Enviar pedido
- Agora logado: clicar "Enviar pedido"
- Tela de **sucesso**: "Pedido enviado!", número do pedido, previsão 15-20 min
- CTA: "Ver cardápio" → volta pro menu

### 3.3 Header atualizado
- Mostrar que o header agora tem o **avatar com iniciais** (no lugar do ícone de menu)
- Banner de cashback no carousel agora mostra **"Você tem Cashback! R$12,50"**

---

## Parte 4 — Conta da Mesa + Pagamento

### 4.1 Conta da mesa
- Clicar "Ver conta" no bottom bar (ou navegar via drawer)
- Tab **"Meus itens"**: só o que eu pedi
- Tab **"Toda a mesa"**: todos os pedidos (3 pessoas: Você, Ana, Pedro) com avatares
- Status por item: **Preparando** (amber), **Pronto** (verde), **Entregue** (cinza)

### 4.2 Avançar status dos pedidos ⏭️
- Abrir drawer → MockSwitcher → "Avançar status dos pedidos"
- Voltar pra conta → status mudou (preparando → pronto → entregue)

### 4.3 Extrato da mesa
- Na conta, clicar **"Extrato da mesa"** (accordion)
- Mostra: cada item com avatar de quem pediu + nome + valor
- Seção de pagamentos (vazia por enquanto)

### 4.4 Resumo financeiro
- Subtotal, serviço 10%, total
- Botões: "Pagar minha parte" (primary), "Dividir" (secondary), "Pagar tudo" (secondary)

### 4.5 Dividir a conta
- Clicar "Dividir" → stepper "Somos quantas pessoas?"
- Ajustar número → valor por pessoa recalcula em tempo real
- "Pagar minha parte" → vai pro pagamento com o valor dividido

### 4.6 Pagamento
- Mostrar: valor grande no topo, método de pagamento (Pix/Crédito/Débito)
- Toggle **giftback**: "Usar meu giftback" → desconto aplicado no total
- Toggle **serviço**: desligar taxa de 10%
- Summary collapsible com detalhes do pedido
- Cashback estimado: "Você ganha R$X de giftback nesta compra"
- Trust badge: "Pagamento seguro via Zig"
- Clicar **"Pagar R$XX"** → spinner de processamento (~2.5s)

### 4.7 Erro de pagamento ⏭️
- ~25% de chance de erro (demo)
- Se acontecer: mostrar overlay de erro com "Tentar novamente" + "Alterar forma de pagamento"

### 4.8 Sucesso + Pesquisa
- "Pagamento confirmado!" + valor + método
- Cashback ganho (gold): "+ R$X giftback"
- **NF por email**: campo pra informar email (toggle "Tem email" OFF) ou mensagem confirmando
- Se a conta ainda tem saldo: "Ainda faltam R$X em aberto" + accordion de extrato
- **Pesquisa de satisfação** (aparece após 1.5s):
  - 6 dimensões com estrelas: Produto, Variedade, Serviço, Preço, Música, Limpeza
  - Dar nota ≤ 3 em uma → checkboxes de motivos aparecem
  - NPS 1-10
  - Feedback aberto
  - "Enviar respostas"
- Se notas altas (média ≥ 4 + NPS ≥ 9): convite pro **Google Review**

---

## Parte 5 — Divisão dinâmica

### 5.1 Pagamento parcial
- Após o primeiro pagamento, mostrar que a conta ficou "Parcialmente paga"
- Voltar pra conta → "Já pago: R$X" + "Em aberto: R$X"
- Abrir extrato → pagamento registrado com nome + método + valor

### 5.2 Segundo pagamento (divisão recalculada)
- Clicar "Dividir" → valor agora é baseado no **restante**, não no total original
- Mostra "Falta pagar R$X" acima do valor por pessoa
- Pagar → saldo diminui

### 5.3 Mesa encerrada
- Quando conta chega a R$0:
  - Success: "Mesa encerrada!" + "Obrigado pela visita"
  - Aviso: **"Para fazer um novo pedido, escaneie o QR code da mesa novamente"**
  - CTA: "Fechar" (botão outline)
- Na conta: empty state com mesmo aviso de re-scan

---

## Parte 6 — Modo Pré-pago

### 6.1 Ativar pré-pago
- Drawer → MockSwitcher → toggle **"Pré-pago"** ON
- App reseta e volta pro cardápio limpo

### 6.2 Fluxo pré-pago
- Adicionar itens ao carrinho
- Abrir carrinho → CTA agora diz **"Pagar e enviar"** (em vez de "Enviar pedido")
- Clicar → vai direto pro **Pagamento** (não envia pedido ainda)
- Pagar → Success: **"Pago e enviado!"** + "Seu pedido foi enviado para a cozinha"
- Pedido aparece na conta da mesa com status "Preparando"

### 6.3 Desativar pré-pago
- Drawer → toggle "Pré-pago" OFF → reseta de volta ao fluxo normal

---

## Parte 7 — Food Hall (Multi-vendor) ⏭️

### 7.1 Ativar Food Hall
- Drawer → MockSwitcher → toggle **"Food Hall"** ON
- Home agora mostra **grid de vendors** (Mana, AcaíBar, Café da Barra, Grelhados do Porto)

### 7.2 Navegação por vendor
- Clicar num vendor → tela dedicada com header do vendor, categorias filtradas, produtos filtrados
- Adicionar itens de vendors diferentes

### 7.3 Carrinho multi-vendor
- Abrir carrinho → itens agrupados por vendor com header + logo

---

## Parte 8 — White-label / Brand ⏭️

### 8.1 Trocar cor da marca
- Drawer → **BrandSwitcher** (seção "Aparência")
- Clicar nos presets de cor → toda a UI muda em tempo real
- Mostrar: botões, header, badges, banners — tudo responde ao token
- Testar com cor escura e cor clara (texto se adapta automaticamente)

---

## Parte 9 — Enriquecimento de dados ⏭️

### 9.1 CPF no pagamento
- Drawer → toggle **"Tem CPF"** OFF
- Fazer um pagamento → campo "Informe seu CPF" aparece acima do CTA
- CPF não é obrigatório — pagamento funciona sem

### 9.2 Email na Success
- Toggle **"Tem email"** OFF
- Após pagamento → card "Nota fiscal" com campo de email
- Preencher → "Será enviada para email@exemplo.com"
- Ou "Pular" → card desaparece

---

## Checklist rápido de features (pra não esquecer nada)

- [ ] Hero morph animation
- [ ] Carousel interativo (4 tipos de banner)
- [ ] Banner cashback 3 estados (deslogado / sem saldo / com saldo)
- [ ] Welcome banner (não logado)
- [ ] Busca full-screen
- [ ] Produto simples + nutrição + alergênicos
- [ ] Produto montável (customizações)
- [ ] Upsell sheet (quick-add)
- [ ] Carrinho (qty controls + shimmer CTA)
- [ ] Login (CPF / estrangeiro toggle)
- [ ] Envio de pedido (pós-pago)
- [ ] Conta da mesa (meus itens / toda mesa)
- [ ] Extrato (pedidos + pagamentos por pessoa)
- [ ] Status dos pedidos (preparando → pronto → entregue)
- [ ] Divisão de conta (stepper + recálculo dinâmico)
- [ ] Pagamento (3 métodos + giftback + serviço toggle)
- [ ] Erro de pagamento + retry
- [ ] NF por email (campo inline)
- [ ] CPF enrichment (campo inline)
- [ ] Pesquisa de satisfação (6 dimensões + NPS + feedback)
- [ ] Google Review (condicional)
- [ ] Mesa encerrada + aviso re-scan
- [ ] Modo pré-pago
- [ ] Food Hall (multi-vendor)
- [ ] White-label (brand switcher)
