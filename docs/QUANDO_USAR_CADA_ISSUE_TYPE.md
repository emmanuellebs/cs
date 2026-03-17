# 🎯 Quando Usar Cada Issue Type

Um guia prático para você saber QUANDO e POR QUÊ criar cada tipo de issue.

---

## **1. CLIENTE** 🏢

### **O que é:**
A representação de uma conta/empresa cliente. É o **centro de tudo**.

### **Quando criar:**
- ✅ Novo cliente assinou contrato
- ✅ Cliente novo vai ser acompanhado pelo CS
- ✅ Cliente fez upgrade/novo contrato

### **Quando NÃO criar:**
- ❌ Não criar múltiplos clientes para a mesma conta
- ❌ Não criar para leads que ainda não assinaram
- ❌ Não criar teste/POC (cria mas não contamina pipeline real)

### **Exemplo:**

**CORRETO:**
```
Cliente: ACME Corp
Segmento: Enterprise
MRR: R$ 50.000
Data de Início: 01/01/2026
```

**INCORRETO:**
```
Cliente: ACME Dept 1
Cliente: ACME Dept 2
Cliente: ACME Dept 3
(NÃO! É tudo ACME Corp, um único Cliente com múltiplos departamentos)
```

### **O que preencher:**
1. **Nome do Cliente** (obrigatório)
2. **Segmento** (Enterprise, Mid-Market, SMB)
3. **MRR** (receita mensal)
4. **Health Score** (0-100)
5. **Data de Início**
6. **Data de Renovação**
7. **Contato Principal** (nome, email, telefone, cargo)
8. **Produtos contratados**
9. **Ciclo da Conta** (Onboarding, Ativo, Risco, Churn, etc)

### **Frequência:**
- **Criar:** Quando novo cliente entra
- **Atualizar:** Conforme cliente evolui (MRR muda, Health Score, Ciclo da Conta)
- **Arquivar:** Quando churn (nunca deletar)

---

## **2. INTERAÇÃO** 💬

### **O que é:**
Um registro de contato com o cliente (reunião, e-mail, ligação, feedback).

### **Quando criar:**

**SEMPRE que você:**
- ✅ Tem uma reunião com o cliente
- ✅ Recebe feedback importante
- ✅ Fornece suporte crítico
- ✅ Oferece treinamento
- ✅ Cliente participa de evento

**FREQUÊNCIA:** Ideal: 1-2 por semana por cliente ativo

### **Quando NÃO criar:**
- ❌ E-mail simples de agendamento
- ❌ Slack/Teams casual
- ❌ Comunicações muito triviais

### **Exemplos:**

**CORRETO:**
```
Interação: Reunião de Alinhamento Q2
Cliente: ACME Corp
Tipo: Reunião
Data: 10/03/2026
Resumo: Alinhamos OKRs para Q2. Cliente quer expandir em 3 departamentos.
Ação: Enviar proposta de expansão até 15/03.
```

```
Interação: Feedback Sobre UI
Cliente: ACME Corp
Tipo: Feedback
Data: 08/03/2026
Resumo: Cliente comentou que interface poderia ter atalhos. Enviaram print.
Ação: Passar para product team.
```

**INCORRETO:**
```
Interação: Oi
Cliente: ACME Corp
(Muito vago, não há contexto)
```

### **O que preencher:**
1. **Tipo** (Reunião, Suporte, Feedback, Treinamento, Evento)
2. **Data**
3. **Resumo** (o que foi discutido/feedback/problema)
4. **Ações** (o que vai fazer a respeito)
5. **Participantes** (quem estava na reunião)
6. **Vinculado a:** Cliente (OBRIGATÓRIO!)

### **Frequência:**
- **Criar:** 1-2 por semana por cliente ativo
- **Atualizar:** Raro (se precisar adicionar informação, melhor criar nova)
- **Arquivar:** Nunca (mantém histórico)

---

## **3. PLANO DE SUCESSO** 📋

### **O que é:**
Um plano estruturado para ajudar o cliente a alcançar seus objetivos.

### **Quando criar:**

**QUANDO:**
- ✅ Cliente novo entrou (fazer plano onboarding)
- ✅ Cliente quer atingir novo objetivo
- ✅ Cliente vai expandir (novo departamento, novo módulo)
- ✅ Cliente em risco (fazer plano de recuperação)
- ✅ Cliente quer melhorar adoção

### **Quando NÃO criar:**
- ❌ Para cada conversa (use Interação)
- ❌ Para coisas triviais
- ❌ Se não há comprometimento do cliente

### **Exemplos:**

**CORRETO:**
```
Plano de Sucesso: Onboarding ACME - 90 dias
Cliente: ACME Corp
Período: 01/01/2026 até 30/03/2026

Objetivo 1: Go-live em 30 dias
  Atividades: Setup inicial, testes, treinamento
  Responsáveis: CSM (você), Implementação, Produto
  Status: Em progresso

Objetivo 2: Adoção de 80% de usuários até 90 dias
  Atividades: Treinamento avançado, suporte, comunicação
  Status: Planejado

Objetivo 3: Feedback estruturado em 60 dias
  Atividades: Reunião de revisão, coleta de insights
  Status: Planejado
```

**INCORRETO:**
```
Plano de Sucesso: Qualquer coisa
(Sem estrutura, sem objetivos, sem prazos)
```

### **O que preencher:**
1. **Nome/Título** (ex: "Onboarding ACME", "Expansão 2026", etc)
2. **Cliente** (vinculado)
3. **Período** (data de início e fim)
4. **Objetivos** (2-5 objetivos principais)
5. **Atividades** (para cada objetivo)
6. **Responsáveis** (quem faz quê)
7. **Datas de conclusão** (para cada fase)

### **Frequência:**
- **Criar:** 1 vez por fase importante do cliente (Onboarding, Expansão, Renovação)
- **Atualizar:** Semanal (status, próximas atividades)
- **Arquivar:** Quando concluir

---

## **4. RISCO** ⚠️

### **O que é:**
Um problema ou situação identificado que pode virar churn ou perda de receita.

### **Quando criar:**

**IMEDIATAMENTE quando:**
- ✅ Health Score caiu
- ✅ Cliente desengajado por 30+ dias
- ✅ Cliente reclamou de problema crítico
- ✅ Churn detectado (vendedor fez deal com concorrente, etc)
- ✅ NPS muito negativo
- ✅ Cliente quer cancelar

### **Quando NÃO criar:**
- ❌ Para problema trivial de suporte
- ❌ Para feedback simples
- ❌ Para coisas que não são risco real

### **Exemplos:**

**CORRETO:**
```
Risco: ACME Desengajada
Cliente: ACME Corp
Descrição: Sem contato há 45 dias. Health Score caiu de 85 para 60. 
           Último acesso na plataforma foi 30 dias atrás.
Probabilidade: Alta (70%)
Impacto: Renovação em risco (pode perder R$ 50k/ano)
Ações: 
  1. Agendar reunião executiva
  2. Revisar utilização com product
  3. Oferecer treinamento avançado
Data de revisão: 15/03/2026
```

```
Risco: Bug Critical - ACME
Cliente: ACME Corp
Descrição: Cliente reportou que relatório trava com 100k registros.
           Impacta workflow deles.
Probabilidade: Alta (90%)
Impacto: Alto (risco de cancelamento se não resolve)
Ações:
  1. Passar para product team como crítico
  2. Encontrar workaround
  3. Comunicar prazo de fix
```

**INCORRETO:**
```
Risco: Cliente não gostou da cor do botão
(Não é risco, é feedback. Crie uma Interação.)
```

### **O que preencher:**
1. **Descrição** (o que é o risco?)
2. **Probabilidade** (Alta, Média, Baixa - qual chance disso virar churn?)
3. **Impacto** (Alto, Médio, Baixo - quanto vai custar se virar churn?)
4. **Ações** (o que você vai fazer?)
5. **Responsáveis** (quem cuida de cada ação?)
6. **Data de revisão** (quando vai revisar se melhorou)
7. **Vinculado a:** Cliente (OBRIGATÓRIO!)

### **Frequência:**
- **Criar:** Sempre que detectar risco real
- **Atualizar:** Semanal (status das ações)
- **Encerrar:** Quando risco passou ou cliente churned
- **Revisar:** Semanalmente no dashboard "Saúde da Base"

---

## **5. OPORTUNIDADE** 🚀

### **O que é:**
Uma chance de expandir a relação com o cliente (mais receita, novos produtos, indicações).

### **Quando criar:**

**QUANDO HÁ:**
- ✅ Cliente interessado em novo produto/módulo
- ✅ Cliente quer adicionar usuários
- ✅ Cliente indicou outro cliente
- ✅ Cliente quer fazer referência/case study
- ✅ Renovação com chance de upsell
- ✅ Cliente em fase de advocacy

### **Quando NÃO criar:**
- ❌ Para feedback (use Interação)
- ❌ Para sugestão vaga ("acho que dá pra expandir")
- ❌ Para coisas que não são reais

### **Exemplos:**

**CORRETO:**
```
Oportunidade: Upsell ACME - Platform Enterprise
Cliente: ACME Corp
Descrição: Cliente solicitou recursos avançados de relatório.
           Demos que Platform Enterprise tem isso.
           Cliente interesse: "MUITO INTERESSADO"
Valor: R$ 30.000/mês (novo MRR)
Probabilidade: 60%
Próximas etapas:
  1. Enviar proposta comercial
  2. Demo com cliente e finance
  3. Legal revisar contrato
Data target: 30/04/2026
```

```
Oportunidade: Indicação ACME - TechCorp
Cliente: ACME Corp
Descrição: Cliente indicou TechCorp (concorrente deles). 
           Disse que pode fazer introdução.
Valor: Potencial (depende se TechCorp quer)
Probabilidade: 40%
Próximas etapas:
  1. Agendar intro call
  2. Preparar pitch para TechCorp
```

**INCORRETO:**
```
Oportunidade: Talvez expansão
(Muito vago, sem valor, sem probabilidade)
```

### **O que preencher:**
1. **Descrição** (qual é a oportunidade?)
2. **Valor** (quanto em receita?)
3. **Probabilidade** (Alta, Média, Baixa - qual chance de fechar?)
4. **Próximas etapas** (o que precisa fazer?)
5. **Data target** (quando espera fechar?)
6. **Responsáveis** (vendas, product, você?)
7. **Vinculado a:** Cliente (OBRIGATÓRIO!)

### **Frequência:**
- **Criar:** Sempre que vira real (cliente expressou interesse)
- **Atualizar:** 2x por semana (status, próximas etapas)
- **Encerrar:** Quando ganhar ou perder
- **Revisar:** Semanal no dashboard "Crescimento"

---

## **6. RENOVAÇÃO** 🔄

### **O que é:**
O processo de renovar o contrato do cliente.

### **Quando criar:**

**QUANDO:**
- ✅ Contrato vai vencer em 90 dias (ou menos)
- ✅ Começou negociação de renovação
- ✅ Cliente renovarou ou recusou renovar

### **Quando NÃO criar:**
- ❌ Contrato com 1 ano de vida (espere)
- ❌ Para cada discussão sobre renovação (crie uma Interação)

### **Exemplos:**

**CORRETO:**
```
Renovação: ACME 2026
Cliente: ACME Corp
Data de Vencimento: 30/06/2026 (90 dias)
Valor: R$ 600.000/ano
Status: Em negociação

Tarefas:
  [ ] Revisar health score com produto (status: feito)
  [ ] Preparar proposta comercial (status: em progresso)
  [ ] Enviar para cliente (status: pendente)
  [ ] Reunião de alinhamento (status: pendente)

Próximas etapas:
  1. Enviar proposta até 15/03
  2. Reunião com finance cliente até 20/03
  3. Contrato assinado até 30/03
```

```
Renovação: TechCorp 2026 (PERDIDA)
Cliente: TechCorp
Data de Vencimento: 28/02/2026
Valor: R$ 100.000/ano
Status: Perdida (Cliente escolheu concorrente)

Razão: Concorrente ofereceu 30% de desconto + features que pedimos.
Aprendizado: Precisávamos de roadmap mais claro.
```

**INCORRETO:**
```
Renovação: Talvez renova
(Sem data, sem valor, sem status claro)
```

### **O que preencher:**
1. **Cliente** (vinculado)
2. **Data de Vencimento** (quando contrato vence?)
3. **Valor** (quanto em receita?)
4. **Status** (Em negociação, Renovado, Perdido)
5. **Tarefas** (o que precisa fazer?)
6. **Razão** (se perdeu: por quê?)
7. **Aprendizados** (o que aprender?)

### **Frequência:**
- **Criar:** 90 dias antes do vencimento
- **Atualizar:** Semanal (status, tarefas)
- **Encerrar:** Após renovação ou churn
- **Revisar:** Semanal no dashboard "Crescimento"

---

## **Resumo: Quando Criar Cada Um**

| Issue | Frequência | Vinculado? | Quando |
|-------|-----------|-----------|--------|
| **Cliente** | Raro (novo cliente) | - | Novo cliente assina |
| **Interação** | 1-2 por semana | SIM | Toda reunião/feedback |
| **Plano** | 1-2 por fase | SIM | Onboarding/Expansão |
| **Risco** | Conforme aparecer | SIM | Problema detectado |
| **Oportunidade** | Conforme aparecer | SIM | Chance real de expansão |
| **Renovação** | 1 por cliente/ano | SIM | 90 dias antes |

---

## **Checklist: Antes de Criar**

Antes de criar qualquer issue, pergunte:

- [ ] Sei exatamente qual é?
- [ ] Tenho informações suficientes para preencher?
- [ ] É vinculado a um Cliente? (se aplicável)
- [ ] Já existe algo parecido que eu possa atualizar?
- [ ] Vou mexer nisto regularmente ou é info que vira arquivo?

**Se sim para tudo, cria! 👍**
