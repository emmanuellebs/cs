# DIAGNÓSTICO: MODELAGEM ATUAL vs PLANILHA

## BLOCO 1: DIVERGÊNCIAS ENCONTRADAS

### ❌ Divergência 1: Confusão entre CAMADAS
**O que está implementado:**
- Misturei "8 etapas de pipeline" com "ciclo da conta"
- Tratei tudo como se fosse a mesma coisa
- Sugeri renomear colunas do board para as 8 etapas do pipeline

**O que a planilha realmente diz:**
- **CAMADA 2 (Pipeline CS)**: 8 etapas operacionais de PROJETO/IMPLEMENTAÇÃO
  1. Análise de Perfil
  2. Implantação
  3. Lançamento
  4. Acompanhamento 1
  5. Acompanhamento 2
  6. Expansão
  7. Renovação
  8. Cancelamento

- **CAMADA 3 (Jira CS / Ciclo da Conta)**: 9 estados DISTINTOS de CICLO DE VIDA
  1. Onboarding
  2. Ativo
  3. Adoção
  4. Engajamento
  5. Expansão
  6. Advocacy
  7. Renovação
  8. Renovado
  9. Risco
  10. Churn

**PROBLEMA**: São coisas diferentes!
- Pipeline = fluxo de PROJETO (o que fazer em cada fase da implementação)
- Ciclo da Conta = status de RELACIONAMENTO (onde o cliente está no seu ciclo de vida)
- Exemplo: Um cliente pode estar na etapa "Expansão" do PIPELINE mas no ciclo "Advocacy" da CONTA

**Decisão necessária**: Qual será o BOARD?
- Opção A: Board = Pipeline (8 etapas operacionais)
- Opção B: Board = Ciclo da Conta (9 estados de relacionamento)
- Opção C: Dois boards separados

---

### ❌ Divergência 2: Issue Types e Relacionamentos
**O que está implementado:**
- Criei 6 issue types: Cliente, Interação, Plano de Sucesso, Risco, Oportunidade, Renovação
- Sugeri que fossem "subtasks" do Cliente (SEM JUSTIFICAR)
- Não defini como elas relacionam entre si

**O que a planilha realmente diz:**
- ABA "Considerações": quer visualizar tudo em um ÚNICO LUGAR
  - Cliente = conta principal
  - Interação = histórico de relacionamento
  - Plano de Sucesso = estratégia do cliente
  - Risco = prevenção de churn
  - Oportunidade = expansão
  - Renovação = gestão contratual

**PROBLEMA**: A planilha NÃO especifica se são subtasks, linked issues, ou outra estrutura!

**Decisão necessária**:
- Subtasks? Rápido de criar, mas limita hierarquia a 1 nível
- Linked Issues? Mais flexível, permite múltiplos relacionamentos
- Campos no Cliente? Não capta histórico, inadequado para "Interação"

---

### ❌ Divergência 3: Campos / Estrutura de dados
**O que está implementado:**
- Criei 38 campos genéricos baseados no anterior

**O que a planilha REALMENTE exige:**
ABA "Campos" define:

**GRUPO 1: Conta/Cliente**
- Descrição da empresa (Texto)
- Segmento (Lista)
- Cidade (Texto)
- Estado (Texto)
- Valor do negócio (Valor)
- Quantidade de usuários (Número)
- Usuários renovados (Número)
- Mensalidade Renovação (Valor)
- Data de Inicio do Contrato (Data)
- Data de Renovação (Data)
- Índice Financeiro (Lista)
- Tipo de Renovação (Lista)
- Produto (Lista)
- Observações do Contrato (Texto)
- Responsável (Usuário)
- Aviso Prévio (Lista)
- Data de Treinamento (Data)

**GRUPO 2: Contato Principal**
- Nome (Texto)
- Email (Texto)
- Telefone (Número)
- Cargo (Texto)
- Área (Texto)

**GRUPO 3: CS (Atributos da Conta)**
- CSM responsável (Usuário)
- Health Score (Número)
- NPS (Número)
- Status da conta (Lista) → Ativo / Risco / Expansão / Churn
- Engajamento da plataforma (Lista) → Alto / Médio / Baixo
- Último contato CS (Data)
- Possibilidade de expansão (Sim/Não)
- Participa da comunidade (Sim/Não)
- Participa do programa de indicação (Sim/Não)

**DIFERENÇA**: Não incluí todos, nem estruturei por grupos

---

### ❌ Divergência 4: Dashboards
**O que a planilha exige:**

**Dashboard 1: Saúde da base**
- Clientes por Health Score
- Clientes em risco
- Clientes com baixa atividade
- Clientes sem contato há 60 dias

**Dashboard 2: Relacionamento**
- Interações por mês
- Clientes sem reunião
- Engajamento da comunidade
- Reuniões realizadas
- Participação em eventos

**Dashboard 3: Crescimento**
- Expansões em andamento
- Indicações recebidas
- Clientes potenciais para case
- Contratos renovandos

**O que implementei**: Apenas nomeei sem detalhar as consultas/gadgets

---

## BLOCO 2: ESTRUTURA CORRETA RECOMENDADA

### ✅ CAMADA 1: Entidades Jira (Issue Types + Relacionamentos)

#### Opção recomendada: **Linked Issues (não subtasks)**

**Razão técnica**: 
- Cada "Interação" pode estar relacionada a múltiplos "Clientes" (raro, mas possível)
- Subtasks não permitem isso
- Linked Issues permite múltiplos vínculos: "relacionado a", "bloqueado por", "necessário para", etc.

**Estrutura:**
```
Issue Type: Cliente
├─ Campos: Segmento, Cidade, Estado, Valor, Qty Usuários, etc.
├─ Status: Onboarding, Ativo, Adoção, Engajamento, Expansão, Advocacy, Renovação, Renovado, Risco, Churn
└─ Relacionamentos:
   ├─ VINCULA-SE A → Interação (Tipo: "related to")
   ├─ VINCULA-SE A → Plano de Sucesso (Tipo: "related to")
   ├─ VINCULA-SE A → Risco (Tipo: "blocks" ou "related to")
   ├─ VINCULA-SE A → Oportunidade (Tipo: "related to")
   └─ VINCULA-SE A → Renovação (Tipo: "related to")

Issue Type: Interação
├─ Campos: tipo, data, resumo, insight
├─ Status: Padrão (Open, In Progress, Done)
└─ Vinculada a: Cliente

Issue Type: Plano de Sucesso
├─ Campos: objetivos, marcos, timeline
├─ Status: Padrão
└─ Vinculada a: Cliente

Issue Type: Risco
├─ Campos: tipo de risco, severidade, mitigação
├─ Status: Padrão ou (Identificado, Monitorado, Resolvido, Mitigado)
└─ Vinculada a: Cliente

Issue Type: Oportunidade
├─ Campos: tipo de oportunidade, valor
├─ Status: Padrão ou (Identificada, Proposta, Ganho, Perdido)
└─ Vinculada a: Cliente

Issue Type: Renovação
├─ Campos: data de renovação, valor, termos
├─ Status: Padrão ou (Planejada, Proposta, Negociação, Ganho, Perdido)
└─ Vinculada a: Cliente
```

---

### ✅ CAMADA 2: Board Operacional / Pipeline

**Questão crítica**: Qual é o board principal?

**Recomendação**: **O board = CICLO DA CONTA (9 colunas)**, não o Pipeline

**Razão**:
- O pipeline (8 etapas) é TEMPORÁRIO (6-12 meses)
- O ciclo da conta (9 estados) é PERMANENTE (duração da relação com cliente)
- A operação diária acompanha: onde o cliente ESTÁ (Onboarding, Ativo, Risco, etc.)
- Não acompanha: qual etapa de implementação

**Colunas do Board:**
1. Onboarding (novos clientes em setup)
2. Ativo (usando a solução normalmente)
3. Adoção (aumentando uso)
4. Engajamento (cliente engajado e participativo)
5. Expansão (oportunidades de upsell/cross-sell)
6. Advocacy (cliente recomendando / cases)
7. Renovação (em processo de renovação)
8. Renovado ✓ (renovação concluída com sucesso)
9. Risco (sinais de churn)
10. Churn ✗ (cliente cancelou)

---

### ✅ CAMADA 3: Pipeline como Campo/Context

**O que fazer com as 8 etapas do Pipeline?**

**Recomendação**: Criar um campo "Etapa de Implementação" na issue Cliente
- Tipo: Lista
- Valores: Análise de Perfil, Implantação, Lançamento, Acompanhamento 1, Acompanhamento 2, Expansão, Renovação, Cancelamento
- Uso: Rastrear onde está a implementação de forma PARALELA ao ciclo da conta

**Exemplo:**
```
Cliente: Empresa XYZ
├─ Ciclo da Conta: "Engajamento" (coluna do board)
├─ Etapa de Implementação: "Acompanhamento 2" (campo auxiliar)
├─ Última Interação: 10 dias atrás
├─ Health Score: 8/10
└─ Status: Ativo
```

---

### ✅ Dashboards: Especificações Exatas

**Dashboard 1: Saúde da Base**
```
Gadgets:
1. Clientes por Health Score (gráfico em barras)
   - JQL: project = CSM AND type = Cliente
   - Grupo: Health Score
   
2. Clientes em Risco (lista/contagem)
   - JQL: project = CSM AND type = Cliente AND "Status da conta" = Risco
   
3. Clientes com Baixa Atividade
   - JQL: project = CSM AND type = Cliente AND "Último contato CS" <= -60d
   
4. Segmentação (gráfico pizza)
   - JQL: project = CSM AND type = Cliente
   - Grupo: Segmento
```

**Dashboard 2: Relacionamento**
```
Gadgets:
1. Interações por Mês (gráfico linha)
   - JQL: project = CSM AND type = Interação
   - Grupo: Data (agrupado por mês)
   
2. Clientes sem Reunião (contagem)
   - JQL: project = CSM AND type = Cliente AND issuekey NOT IN (issue.client.issuekey)
   
3. Engajamento da Comunidade (contagem)
   - JQL: project = CSM AND type = Cliente AND "Participa da comunidade" = Sim
   
4. Reuniões Realizadas (contagem)
   - JQL: project = CSM AND type = Interação AND tipo = "Reunião"
```

**Dashboard 3: Crescimento**
```
Gadgets:
1. Expansões em Andamento (contagem)
   - JQL: project = CSM AND type = Oportunidade AND status = Aberto
   
2. Indicações Recebidas (contagem)
   - JQL: project = CSM AND type = Cliente AND "Participa do programa de indicação" = Sim
   
3. Contratos Renovados (contagem)
   - JQL: project = CSM AND type = Renovação AND status = Ganho
   
4. MRR por Etapa (gráfico)
   - JQL: project = CSM AND type = Cliente
   - Grupo: Etapa de Implementação, Soma: "Valor do negócio"
```

---

## BLOCO 3: Arquivos que Precisam ser Ajustados

### 1. `src/config/boardConfig.ts`
**Mudança:**
```typescript
// ERRADO:
hierarchy: {
  parent: 'Cliente',
  children: ['Interacao', 'Plano de Sucesso', 'Risco', 'Oportunidade', 'Renovacao']
}

// CORRETO:
{
  name: 'WH - Customer Success',
  description: '...',
  columns: [
    'Onboarding',
    'Ativo',
    'Adoção',
    'Engajamento',
    'Expansão',
    'Advocacy',
    'Renovação',
    'Renovado',
    'Risco',
    'Churn'
  ],
  auxiliaryField: {
    name: 'Etapa de Implementação',
    type: 'select',
    values: [...]
  }
}
```

### 2. `src/config/issueTypesConfig.ts` (novo arquivo necessário)
```typescript
// Definir explicitamente cada issue type com seus campos
export const issueTypesConfig = {
  Cliente: { ... },
  Interacao: { ... },
  'Plano de Sucesso': { ... },
  Risco: { ... },
  Oportunidade: { ... },
  Renovacao: { ... }
}
```

### 3. `src/config/fieldsConfig.ts`
**Mudança**: Reorganizar por grupos EXATOS da planilha
- Grupo: Conta/Cliente (17 campos)
- Grupo: Contato Principal (5 campos)
- Grupo: CS (9 campos)

### 4. `src/config/dashboardsConfig.ts` (novo arquivo)
**Mudança**: Especificar JQL exato para cada gadget

### 5. `docs/ESTRUTURA_FINAL.md`
**Mudança**: Descrever a nova arquitetura com as 3 camadas corretas

### 6. `src/validation/checks/` (possível novo check)
**Novo arquivo**: Validar relacionamentos entre issue types

---

## RESUMO EXECUTIVO

| Aspecto | Implementado | Correto | Status |
|---------|-------------|---------|--------|
| Pipeline vs Ciclo da Conta | Confundido | Separado em 2 camadas | ❌ ERRADO |
| Issue Types | 6 corretos | 6 corretos | ✅ OK |
| Relacionamentos | Subtasks | Linked Issues | ❌ ERRADO |
| Board | 8 etapas + Ciclo | Só Ciclo (9 colunas) | ❌ ERRADO |
| Campos | 38 genéricos | 31 específicos + grupos | ⚠️ PARCIAL |
| Dashboards | Nomeados | Especificados JQL | ❌ ERRADO |

**Decisão**: Preciso da sua aprovação ANTES de corrigir o código.

