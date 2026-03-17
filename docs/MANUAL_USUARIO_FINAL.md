# 📖 Manual do Usuário Final: Jira CS Completo

Bem-vindo ao manual completo do sistema de Customer Success no Jira. Este é o guia que você consulta quando tem dúvidas sobre como usar a estrutura.

---

## **Sumário**
1. [Visão Geral](#visão-geral)
2. [As 6 Entidades](#as-6-entidades)
3. [O Board Operacional](#o-board-operacional)
4. [O Campo Ciclo da Conta](#o-campo-ciclo-da-conta)
5. [Os Dashboards](#os-dashboards)
6. [Fluxo Completo de Uso](#fluxo-completo-de-uso)
7. [Erros Comuns](#erros-comuns)
8. [FAQ](#faq)

---

## **Visão Geral**

A estrutura Jira CS é organizada em **4 camadas**:

### **Camada 1: Entidades**
6 tipos de registros que você usa:
- Cliente (principal)
- Interação, Plano de Sucesso, Risco, Oportunidade, Renovação (vinculadas)

### **Camada 2: Board Operacional**
8 colunas que mostram as etapas do ciclo de vida:
- Análise → Implantação → Lançamento → Acompanhamento → Expansão → Renovação → Cancelamento

### **Camada 3: Campo Estratégico**
"Ciclo da Conta" = campo que marca o estágio estratégico (Onboarding, Ativo, Risco, Churn, etc)

### **Camada 4: Visualizações Analíticas**
3 dashboards que mostram indicadores:
- Saúde da Base
- Relacionamento
- Crescimento

---

## **As 6 Entidades**

### **1. Cliente** 🏢
É a **issue central** — representa uma conta/empresa cliente.

**O que está dentro:**
- Informações da conta (MRR, usuários, Health Score, NPS)
- Contato principal (nome, email, telefone, cargo)
- Datas importantes (início, renovação, treinamento)
- Ciclo da Conta (estágio estratégico)
- Produtos/serviços contratados

**Quando criar:**
- Novo cliente entra na carteira
- Cliente novo começa a ser acompanhado

**Exemplo:**
```
Cliente: ACME Corp
Segmento: Enterprise
MRR: R$ 50.000
Health Score: 85
Ciclo da Conta: Ativo
```

---

### **2. Interação** 💬
Registro de cada contato com o cliente (reunião, e-mail, ligação, feedback).

**Vinculada a:** Um Cliente específico

**O que está dentro:**
- Tipo (Reunião, Suporte, Feedback, Treinamento, Evento)
- Data da interação
- Resumo do que foi discutido

**Quando criar:**
- Você teve uma reunião com o cliente
- Respondeu a um suporte importante
- Recebeu feedback
- Cliente participou de evento/treinamento

**Exemplo:**
```
Interação: Reunião de alinhamento Q2
Tipo: Reunião
Data: 10/03/2026
Cliente: ACME Corp
Resumo: Alinhamos os OKRs para o Q2. Cliente quer expandir em 3 novos departamentos.
```

---

### **3. Plano de Sucesso** 📋
Plano definido para ajudar o cliente a atingir seus objetivos.

**Vinculada a:** Um Cliente específico

**O que está dentro:**
- Objetivos do cliente
- Atividades planejadas
- Entregas esperadas
- Responsáveis
- Datas

**Quando criar:**
- Você definiu um plano para o cliente atingir um objetivo
- Cliente entrou em fase de expansão e precisa de plano
- Começou um novo engagement

**Exemplo:**
```
Plano de Sucesso: Expansão ACME - 3 novos departamentos
Cliente: ACME Corp
Objetivo: Adotar em Sales, Marketing e Operações
Atividades: Treinamento, Customização, Change Management
Data de conclusão esperada: 30/06/2026
```

---

### **4. Risco** ⚠️
Problema identificado que pode virar churn ou redução de receita.

**Vinculada a:** Um Cliente específico

**O que está dentro:**
- Descrição do risco
- Probabilidade (Alta, Média, Baixa)
- Impacto (Alto, Médio, Baixo)
- Ações para mitigar

**Quando criar:**
- Cliente está desengajado
- Health Score está caindo
- Cliente não renovará se nada mudar
- Há reclamações sobre o produto

**Exemplo:**
```
Risco: ACME engajamento caindo
Cliente: ACME Corp
Descrição: Sem contato há 45 dias. Health Score caiu de 85 para 60.
Probabilidade: Alta
Impacto: Renovação em risco
Ações: Agendar reunião executiva, revisar utilização
```

---

### **5. Oportunidade** 🚀
Chance de expandir a relação com o cliente (vender mais, aumentar contratos, novos produtos).

**Vinculada a:** Um Cliente específico

**O que está dentro:**
- Descrição da oportunidade
- Valor estimado
- Probabilidade de fechar
- Próximas etapas

**Quando criar:**
- Cliente mencionou interesse em novo produto
- Há chance de expandir para novos departamentos
- Cliente pode indicar outros clientes
- Há renovação com chance de upsell

**Exemplo:**
```
Oportunidade: Upsell ACME - Platform Enterprise
Cliente: ACME Corp
Valor: R$ 30.000/mês
Probabilidade: 60%
Descrição: Cliente quer recursos avançados. Estamos customizando demo.
```

---

### **6. Renovação** 🔄
Processo de renovar o contrato do cliente.

**Vinculada a:** Um Cliente específico

**O que está dentro:**
- Data de vencimento do contrato
- Valor da renovação
- Status (Em negociação, Aprovado, Renovado, Perdido)
- Observações

**Quando criar:**
- Contrato vai vencer em 90 dias (ou antes)
- Começou negociação de renovação
- Cliente renovou ou perdeu

**Exemplo:**
```
Renovação: ACME 2026
Cliente: ACME Corp
Data de vencimento: 30/06/2026
Valor: R$ 600.000/ano
Status: Em negociação
```

---

## **O Board Operacional**

O **Board** mostra as **8 colunas do pipeline operacional**. É a visão do dia a dia.

### **As 8 Colunas:**

| Coluna | O Que Significa | Quando Mover |
|--------|-----------------|--------------|
| **Análise de Perfil** | Cliente novo, fazendo análise inicial | Acabou análise, pronto para começar implementação |
| **Implantação** | Implementação em progresso | Terminou implementação, pronto para lançar |
| **Lançamento** | Lançando na produção | Lançou, vamos acompanhar adoção |
| **Acompanhamento 1** | Acompanhando primeiras semanas/meses | Cliente ativo, passando para acompanhamento contínuo |
| **Acompanhamento 2** | Acompanhamento contínuo | Cliente estável, vamos focar em crescimento |
| **Expansão** | Oportunidades de crescimento | Expandiu, voltando para acompanhamento 2 |
| **Renovação** | Contrato próximo de vencer | Renovou? Para renovado. Perdeu? Para cancelamento. |
| **Cancelamento** | Cliente cancelou/churned | Fim do acompanhamento |

### **Como Usar:**

1. **Arraste o card** de um Cliente de uma coluna para outra
2. **Status atualiza automaticamente**
3. **Isso reflete no ciclo da conta** (em alguns casos)

### **Exemplo de Fluxo:**

```
ACME Corp passa assim:
Análise de Perfil (1 mês)
    ↓
Implantação (2 meses)
    ↓
Lançamento (1 semana)
    ↓
Acompanhamento 1 (3 meses)
    ↓
Acompanhamento 2 (contínuo)
    ↓
Expansão (quando há oportunidade)
    ↓
Renovação (90 dias antes de vencer)
```

---

## **O Campo Ciclo da Conta**

**NÃO confunda com o Board!**

- **Board** = onde o cliente está operacionalmente (hoje)
- **Ciclo da Conta** = em que estágio estratégico o cliente está

### **Os 10 Estágios:**

| Estágio | O Que Significa | Exemplo |
|---------|-----------------|---------|
| **Onboarding** | Cliente acabou de assinar, começando adoção | Dia 1 até 90 dias |
| **Ativo** | Cliente usando regularmente | Cliente com uso consistente |
| **Adoção** | Cliente passando por adoção estruturada | Treinamento, customização em andamento |
| **Engajamento** | Cliente muito engajado com a plataforma | Usando diariamente, feedback positivo |
| **Expansão** | Cliente comprando mais / expandindo uso | Adicionando usuários, novos módulos |
| **Advocacy** | Cliente é promotor, faz indicações | Participa de eventos, faz case studies |
| **Renovação** | Contrato próximo de vencer, em negociação | 90 dias antes |
| **Renovado** | Contrato renovado com sucesso | Após renovação aprovada |
| **Risco** | Cliente em risco de churn | Health score baixo, desengajado |
| **Churn** | Cliente deixou de ser cliente | Cancelou ou se recusou a renovar |

### **Quando Atualizar:**

Você atualiza quando a **situação estratégica** muda.

**Exemplos:**
- Cliente move de Onboarding para Ativo = 90 dias
- Cliente tem risco detectado = muda para Risco
- Contrato venceu e não renovou = muda para Churn
- Cliente indicou 3 outros = muda para Advocacy

### **Como Atualizar:**

1. Abra o Cliente no Jira
2. Procure o campo **"Ciclo da Conta"**
3. Clique e selecione o novo estágio
4. Salve

---

## **Os Dashboards**

Existem **3 dashboards** com visualizações diferentes.

### **1. Saúde da Base** 📊
**Para**: Entender quais clientes você precisa de atenção.

**Mostra:**
- Clientes em risco
- Health score baixo
- Sem contato há 60 dias
- Engajamento baixo

**Quando usar:**
- Toda segunda-feira (reunião de início de semana)
- Quando você tem tempo livre
- Antes de férias (para repassar alertas)

**Ações decorrentes:**
- Agendar reunião com clientes em risco
- Criar plano para recuperar cliente

---

### **2. Relacionamento** 👥
**Para**: Entender o relacionamento e interações.

**Mostra:**
- Total de interações do mês
- Tipos de interação (reunião, suporte, feedback, etc)
- Clientes com menos interações
- Participação em eventos

**Quando usar:**
- No meio da semana (revisar engajamento)
- Antes de reunião com gestor
- Para validar que está tendo contato regular

**Ações decorrentes:**
- Se baixo de interações: agendar mais contatos
- Se muito suporte: pode indicar problema no produto

---

### **3. Crescimento** 📈
**Para**: Acompanhar oportunidades e renovações.

**Mostra:**
- Oportunidades abertas
- Renovações próximas
- Indicações recebidas
- Casos de sucesso

**Quando usar:**
- Final de mês (revisar pipeline)
- Antes de reunião de negócios
- Quando precisa de números para diretoria

**Ações decorrentes:**
- Identificar oportunidades para fechar
- Priorizar renovações em risco

---

## **Fluxo Completo de Uso**

### **Exemplo: ACME Corp — Do Início ao Fim**

#### **Semana 1: Cliente Novo**
1. Cria um novo **Cliente** com os dados de ACME Corp
2. Coloca no board na coluna **Análise de Perfil**
3. Define **Ciclo da Conta** como **Onboarding**
4. Cria um **Plano de Sucesso** com objetivos dos primeiros 90 dias

#### **Semana 2-4: Implementação**
1. Cria **Interações** quando tem reuniões com ACME
2. Arrasta o Cliente para coluna **Implantação** no board
3. Atualiza **Plano de Sucesso** conforme progride

#### **Semana 5: Lançamento**
1. Arrasta Cliente para coluna **Lançamento**
2. Acompanha adoção com **Interações** semanais
3. Se vê problema: cria um **Risco**

#### **Mês 2-3: Acompanhamento 1**
1. Arrasta Cliente para coluna **Acompanhamento 1**
2. Continua registrando **Interações**
3. Se cliente está muito engajado, muda **Ciclo da Conta** para **Ativo**

#### **Mês 4+: Acompanhamento 2**
1. Arrasta Cliente para coluna **Acompanhamento 2**
2. Registra **Interações** menos frequentes (mensal)

#### **Mês 6: Oportunidade**
1. Cliente pede novo módulo
2. Cria uma **Oportunidade** para expansão
3. Se confirmar: cria Interação, arrasta para coluna **Expansão**
4. Muda **Ciclo da Conta** para **Expansão**

#### **Mês 11: Renovação**
1. Contrato vence em 30 dias
2. Cria uma **Renovação** com data de vencimento
3. Arrasta Cliente para coluna **Renovação**
4. Muda **Ciclo da Conta** para **Renovação**

#### **Mês 12: Renovou**
1. Cliente renovou com sucesso
2. Muda **Ciclo da Conta** para **Renovado**
3. Volta para coluna **Acompanhamento 2** (ciclo recomeça)

---

## **Erros Comuns**

### ❌ **Erro 1: Criar Interação solta**
**O que é:** Criar uma Interação sem vincular a nenhum Cliente.

**Por que é erro:** Fica sem contexto, fica órfã no sistema.

**Como evitar:** Sempre vinculem a um Cliente específico. Você faz isso na hora de criar.

---

### ❌ **Erro 2: Confundir Board com Ciclo da Conta**
**O que é:** Pensar que Board e Ciclo da Conta são a mesma coisa.

**Por que é erro:** São layers diferentes:
- Board = operação do dia a dia (8 etapas)
- Ciclo da Conta = estratégia de longo prazo (10 estágios)

**Como evitar:** Lembre-se que ambos existem, ambos precisam ser atualizados, mas servem propósitos diferentes.

---

### ❌ **Erro 3: Deixar Ciclo da Conta desatualizado**
**O que é:** Cliente mudou, mas você não atualizou o Ciclo da Conta.

**Por que é erro:** Dashboards ficam imprecisos, não sabe realmente quem está em risco.

**Como evitar:** Toda semana, revise os Ciclos. Use a lista de clientes e marque as mudanças.

---

### ❌ **Erro 4: Criar Risco ou Oportunidade sem descrição**
**O que é:** Criar mas deixar em branco.

**Por que é erro:** Quando você voltar, não vai lembrar por quê.

**Como evitar:** Sempre preencha:
- O que viu/ouviu?
- Por quê é risco/oportunidade?
- O que fazer a respeito?

---

### ❌ **Erro 5: Esquecer de vincular Issues**
**O que é:** Criar uma Renovação, Risco ou Oportunidade, mas não vincular ao Cliente.

**Por que é erro:** Fica órfão, não aparece na visão do Cliente.

**Como evitar:** No formulário de criação, SEMPRE há um campo "Vincular a Cliente". Preencha sempre.

---

## **FAQ**

### **P: Quantos Clientes devem estar no Board?**
A: Todos os Clientes ativos (não cancelados/churned). Se está em Cancelamento, é possível remover depois que confirmar.

---

### **P: Posso criar uma Interação sem Cliente?**
A: Tecnicamente sim, mas não faça. Sempre vinculem a um Cliente específico.

---

### **P: O que fazer com Cliente antigo que churn?**
A: 
1. Muda **Ciclo da Conta** para **Churn**
2. Arrasta para coluna **Cancelamento** no board
3. (Opcional) Remove do board se não precisa mais acompanhar

---

### **P: Ciclo da Conta deve ser atualizado toda semana?**
A: Não precisa ser toda semana. Atualize quando há mudança real:
- Cliente moveu de Onboarding para Ativo
- Cliente em risco
- Contrato vai renovar

---

### **P: Como reportar para meu chefe?**
A: Use os **Dashboards**:
- **Saúde da Base**: Quantos em risco, health score médio
- **Relacionamento**: Interações do mês, engajamento
- **Crescimento**: Pipeline de oportunidades, renovações próximas

---

### **P: Posso editar uma Interação depois de criar?**
A: Sim! Clique na Interação e mude o que precisar. Clique Salvar.

---

### **P: E se Cliente não se encaixa em nenhum Board?**
A: Todos os Clientes têm um estágio no board. Se não sabe onde colocar, comece em **Análise de Perfil**.

---

### **P: Diferença entre "Ativo" e "Engajamento"?**
A: 
- **Ativo** = Cliente usando regularmente
- **Engajamento** = Cliente muito engajado, dando feedback, participando de reuniões

---

**Dúvidas? Pergunte ao seu gestor de CS ou à área de Implementação Jira. 🙂**
