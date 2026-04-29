# Mudanças Pendentes

Anotações de ajustes que precisam ser implementados.
Ordenadas por prioridade sugerida para o refinamento.

---

## P1 — Implementação rápida, corrige inconsistência

### 1. Extrato pré-pago: mostrar apenas itens do usuário

**Onde**: Conta da Mesa (`src/pages/TableAccount.tsx`) + Sucesso (`src/pages/Success.tsx`)

**Problema**: No modo pré-pago, o extrato mostra todos os pedidos de todas as pessoas da mesa (tab "Toda a mesa", avatares de Ana, Pedro, etc.). Isso não faz sentido porque no pré-pago o usuário paga antes de enviar — é uma experiência individual.

**Mudança**: Quando `isPrepaid === true`, o extrato deve mostrar apenas os itens do próprio usuário. Esconder a tab "Toda a mesa" ou mostrar somente "Meus itens". Remover referências a outras pessoas.

### 2. Aviso "Imagem meramente ilustrativa" nos produtos

**Onde**: Tela de produto (`src/pages/ProductDetail.tsx`) e possivelmente nos cards do cardápio.

**Mudança**: Adicionar texto discreto "Imagem meramente ilustrativa" abaixo da foto do produto. Provavelmente um `text-[10px] text-txt-tertiary` alinhado ao centro, logo abaixo da imagem hero.

### 3. Pesquisa de satisfação mais visível

**Onde**: Sucesso (`src/pages/Success.tsx`) / `src/components/SatisfactionSurvey.tsx`

**Problema**: Hoje a pesquisa aparece após 1.5s na tela de sucesso, mas fica abaixo do fold — o usuário precisa rolar pra ver. Fácil de perder.

**Mudança**: Subir a pesquisa de satisfação na hierarquia da página. Colocar em posição mais proeminente para garantir que o usuário veja e responda. Definir se vira um modal/sheet ou se fica inline mas acima dos cards de extrato.

---

## P2 — Funcionalidade nova, impacto direto na experiência de pagamento

### 4. Pagamento com valor custom

**Onde**: Conta da Mesa (`src/pages/TableAccount.tsx`) / Pagamento (`src/pages/Payment.tsx`)

**Problema**: Hoje as opções são "Pagar minha parte", "Dividir" e "Pagar tudo". Não existe opção de digitar um valor livre. Exemplo: a conta é R$500, o usuário quer pagar R$200.

**Mudança**: Adicionar uma quarta opção (ex: "Pagar outro valor") que abre um campo de input numérico onde o usuário digita o valor desejado. Validar que o valor é > 0 e <= saldo em aberto. O restante continua em aberto na mesa.

### 5. Categorias e subcategorias no cardápio

**Contexto**: Alguns clientes têm cardápio com categoria e subcategoria (ex: "Pratos" → "Fit", "Gratinados"). O modelo de dados já suporta isso (`categories[].subcategories`), mas a interface ainda não expõe subcategorias de forma navegável.

**Pendência**: Implementar navegação por subcategoria na UI. Definir como fica visualmente — chips abaixo da categoria selecionada? Accordion? Segundo nível de tabs?

---

## P3 — Definição de produto/negócio necessária antes de implementar

### 6. Desconto, promoção e couvert — como ficam na jornada?

**Pendência de definição com o time. Pontos em aberto:**

- **Desconto**: Onde aparece? No carrinho? No pagamento? É aplicado por item ou no total? Quem configura (garçom, sistema, cupom)?
- **Cupom / código promocional**: Existe campo pra digitar cupom? Em qual etapa (carrinho, pagamento)? Como valida?
- **Promoções do cardápio**: Hoje já tem badge de "10% OFF" em alguns itens. O desconto é aplicado automaticamente no carrinho ou é só visual?
- **Couvert artístico**: É adicionado automaticamente à conta? Aparece como item no extrato? O cliente pode recusar? Onde na UI isso fica visível (conta da mesa, pagamento)?
- **Combinação de descontos**: Pode acumular cupom + promoção + giftback? Qual a regra de precedência?

### 7. Jornada de estrangeiros (sem CPF)

**Problema**: Hoje o login tem um botão "Sou estrangeiro" que troca o campo de CPF por telefone. Mas a jornada completa não foi pensada pra esse caso. Pontos em aberto:

- **Identificação**: Telefone é suficiente? Precisa de passaporte/documento? Qual formato de telefone aceitar (código de país)?
- **Nota fiscal**: CPF na nota é prática brasileira. Estrangeiro não tem. Pula? Oferece NF sem CPF? Usa passaporte?
- **Giftback / cashback**: O programa de fidelidade funciona sem CPF? Vincula ao telefone? Ao email? Estrangeiro provavelmente não volta — faz sentido oferecer?
- **Pagamento**: Cartão internacional funciona no gateway? Pix não é opção pra estrangeiro sem conta brasileira. Quais métodos ficam disponíveis?
- **Reserva**: O formulário de reserva pede CPF. Estrangeiro preenche o quê? Precisa do toggle "Sou estrangeiro" lá também?
- **Idioma**: Nada no app está em inglês. Precisa de i18n ou pelo menos uma versão EN simplificada?

### 8. Proteção contra abuso de QR code / link compartilhado

**Problema**: O usuário pode tirar foto do QR ou copiar o link e fazer pedidos remotamente sem estar no local — de sacanagem ou por engano. Nada impede hoje.

**Possíveis abordagens (a definir com o time)**:
- **Geofencing**: verificar localização do dispositivo antes de permitir pedido. Exigir proximidade com o restaurante (ex: raio de 200m). Problema: nem todo dispositivo libera localização.
- **TTL no QR**: o link/QR expira após X minutos. Garçom gera um novo periodicamente. Impede reuso de fotos antigas.
- **Vinculação por sessão**: o QR abre uma sessão única no device. Segundo acesso no mesmo QR de outro device pede confirmação ao primeiro (ou ao garçom).
- **Limite de pedidos por sessão**: cap de itens ou valor sem aprovação do estabelecimento.
- **Validação pelo garçom**: pedidos acima de X reais ou Y itens precisam de aprovação no PDV antes de ir pra cozinha.
- **Captcha / verificação humana**: antes do primeiro pedido, uma verificação leve (tipo "toque no prato correto") pra dificultar automação.

**Recomendação**: combinar TTL no QR + geofencing opcional + limite por sessão. É o equilíbrio entre segurança e fricção.
