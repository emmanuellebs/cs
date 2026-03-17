# DIAGNÓSTICO PRÉ-IMPLEMENTAÇÃO

## 1. DIAGNÓSTICO DO ESTADO ATUAL

### boardConfig.ts
**Estado atual:**
```typescript
hierarchy: {
  parent: 'Cliente',
  children: ['Interacao', 'Plano de Sucesso', 'Risco', 'Oportunidade', 'Renovacao']
}
```

**Problemas:**
- ❌ NÃO define colunas do board
- ❌ Usa "hierarchy" que não existe na interface
- ❌ Não reflete as 8 colunas do pipeline (Análise de Perfil, Implantação, etc.)
- ❌ Confunde relacionamento de issue types com estrutura de board

**Divergência:** Pipeline operacional não está modelado; confunde entidades com board

---

### fieldsConfig.ts
**Estado atual:**
- Define 38+ campos com 6 grupos: account, primaryContact, interaction, successPlan, riskOpportunity, lifecycle
- Group "account.status" contém: Onboarding, Ativo, Engajamento, Expansão, Advocacy, Renovação, Renovado, Risco, Churn
- Agrupa campos de forma genérica

**Problemas:**
- ⚠️ PARCIALMENTE correto: tem campos, mas grupo "lifecycle" usa o campo "Status da conta" (que é o Ciclo da Conta)
- ❌ Campo "account.status" está misturando Ciclo da Conta com campos de Cliente
- ❌ Não há separação clara: qual campo é de Cliente, qual é de Interação, qual é de Plano de Sucesso, etc.
- ❌ Não há um campo explícito "Ciclo da Conta" como estratégico

**Divergência:** Ciclo da Conta existe, mas está chamado de "Status da conta" e não está claramente separado do pipeline

---

### issueTypesConfig.ts
**Estado atual:**
```
- 'account' → 'Conta Cliente'
- 'interaction' → 'Interação'
- 'successPlan' → 'Plano de Sucesso'
- 'risk' → 'Risco'
- 'opportunity' → 'Oportunidade'
- 'renewal' → 'Renovação'
- 'onboardingTask' → extra (não conforme especificação)
```

**Problemas:**
- ⚠️ Tem os 6 tipos corretos
- ❌ Tem 1 extra: 'onboardingTask' (não está na especificação)
- ❌ Não define relacionamentos entre types
- ❌ Não especifica que devem usar linked issues, não subtasks

**Divergência:** Issue types estão corretos, mas faltam related types e relacionamentos

---

### dashboardsConfig.ts
**Estado atual:**
- 3 dashboards: health, relationship, growth
- Cada um tem gadgets listados
- Gadgets apontam para filterName mas sem JQL explícito

**Problemas:**
- ⚠️ NOMEAÇÃO correta, mas IMPLEMENTAÇÃO vaga
- ❌ Gadgets não têm JQL específico, apenas nomes de filtros
- ❌ Não detalha quais indicadores/gadgets cada dashboard deve ter
- ❌ Não especifica o que cada gadget deve mostrar

**Divergência:** Dashboards existem, mas sem definição concreta de JQL/indicadores

---

### filtersConfig.ts
**Estado atual:**
- 9 filtros JQL já definidos
- Alguns apontam para "Status da conta = Risco", etc.

**Problemas:**
- ⚠️ Filtros estão OK, mas podem precisar ajuste
- ⚠️ Usam "Status da conta" (campo current) que precisa ser "Ciclo da Conta"
- ✓ Estrutura está boa

**Divergência**: Menor, apenas renomear campo

---

### Documentação
**Estado atual:**
- ESTRUTURA_FINAL.md: Descreve arquitetura proposta (boa!)
- FIELD_MAPPING.md: Genérico
- JQL_FILTERS.md: Listagem de filtros
- DASHBOARD_SETUP.md: Nomes de dashboards
- PROJECT_ARCHITECTURE.md: Visão geral
- AUTOMATION_BLUEPRINT.md: Automações sugeridas

**Problemas:**
- ❌ Documentação não reflete a especificação final corretamente
- ❌ Não detalha blocos de campos por entidade
- ❌ Não especifica linked issues vs subtasks

**Divergência**: Documentação precisa atualização completa

---

## 2. PROPOSTA DE CORREÇÃO POR ARQUIVO

### ✏️ boardConfig.ts

**Mudança necessária:**

```typescript
// REMOVER:
hierarchy?: {
  parent: string;
  children: string[];
};

// ADICIONAR:
interface BoardColumnConfig {
  name: string;
}

interface BoardProvisionConfig {
  name: string;
  description?: string;
  columns: BoardColumnConfig[];
}

// NOVA IMPLEMENTAÇÃO:
export function loadBoardProvisionConfig(): BoardProvisionConfig {
  return {
    name: 'WH - Customer Success',
    description: 'Board Kanban - Pipeline operacional de CS',
    columns: [
      { name: 'Análise de Perfil' },
      { name: 'Implantação' },
      { name: 'Lançamento' },
      { name: 'Acompanhamento 1' },
      { name: 'Acompanhamento 2' },
      { name: 'Expansão' },
      { name: 'Renovação' },
      { name: 'Cancelamento' },
    ],
  };
}
```

**Justificativa:** Define explicitamente as 8 colunas do pipeline operacional, separando do Ciclo da Conta

---

### ✏️ fieldsConfig.ts

**Mudança necessária:**

1. **Reorganizar grupos:**
   - `account` → manter (Cliente/Conta)
   - `primaryContact` → manter (Contato)
   - `csOperation` → NOVO (CS/Operação)
   - `interaction` → NOVO (Interação com Cliente)
   - `successPlan` → NOVO (Ação/Plano de Sucesso)
   - `riskOpportunity` → NOVO (Risco/Oportunidade)

2. **Criar campo explícito "Ciclo da Conta":**
   ```typescript
   {
     key: 'account.cycleStage',
     name: 'Ciclo da Conta',
     description: 'Estágio estratégico do cliente no seu ciclo de vida',
     group: 'csOperation',
     kind: 'select',
     options: [
       { value: 'Onboarding' },
       { value: 'Ativo' },
       { value: 'Adoção' },
       { value: 'Engajamento' },
       { value: 'Expansão' },
       { value: 'Advocacy' },
       { value: 'Renovação' },
       { value: 'Renovado' },
       { value: 'Risco' },
       { value: 'Churn' },
     ],
   }
   ```

3. **Remover "Status da conta" do grupo account, mover para csOperation**

4. **Reorganizar campos por grupo funcional:**
   - Grupo "account": Descrição, Segmento, Cidade, Estado, Valor, Qty Usuários, Data Inicio, Data Renovação, etc.
   - Grupo "primaryContact": Nome, Email, Telefone, Cargo, Área
   - Grupo "csOperation": CSM responsável, Health Score, NPS, Ciclo da Conta (novo), Engajamento, Último contato, Possibilidade expansão, etc.
   - Grupo "interaction": tipo, data, resumo, insight (para issue type Interação)
   - Grupo "successPlan": objetivos, marcos, timeline (para issue type Plano de Sucesso)
   - Grupo "riskOpportunity": tipo de risco, severidade, mitigação, tipo de oportunidade, valor (para issue types Risco e Oportunidade)

**Justificativa:** Alinha com blocos funcionais da planilha; separa Ciclo da Conta como estratégico

---

### ✏️ issueTypesConfig.ts

**Mudança necessária:**

1. **Remover 'onboardingTask'** (não está na especificação)

2. **Criar novo arquivo relationshipConfig.ts** (não existe atualmente):

```typescript
export interface IssueRelationshipConfig {
  source: string;
  target: string;
  relationship: 'links' | 'relates to' | 'blocks' | 'is blocked by';
}

export interface RelationshipsProvisionConfig {
  relationships: IssueRelationshipConfig[];
}

export function loadRelationshipsProvisionConfig(): RelationshipsProvisionConfig {
  return {
    relationships: [
      {
        source: 'Cliente',
        target: 'Interação',
        relationship: 'links',
      },
      {
        source: 'Cliente',
        target: 'Plano de Sucesso',
        relationship: 'links',
      },
      {
        source: 'Cliente',
        target: 'Risco',
        relationship: 'relates to',
      },
      {
        source: 'Cliente',
        target: 'Oportunidade',
        relationship: 'relates to',
      },
      {
        source: 'Cliente',
        target: 'Renovação',
        relationship: 'relates to',
      },
    ],
  };
}
```

**Justificativa:** Explícita os relacionamentos via linked issues, não subtasks

---

### ✏️ dashboardsConfig.ts

**Mudança necessária:**

1. **Dashboard 1 - Saúde da Base:**
```typescript
{
  key: 'health',
  name: 'Saúde da Base',
  description: 'Acompanhar saúde dos clientes, riscos e atividade',
  gadgets: [
    {
      name: 'Clientes em risco',
      filterName: 'CSM - Clientes em risco',
      jql: 'project = CSM AND type = Cliente AND "Ciclo da Conta" = Risco',
      gadgetTypeHint: 'Issue Statistics',
    },
    {
      name: 'Clientes com baixa atividade',
      filterName: 'CSM - Clientes sem interação recente',
      jql: 'project = CSM AND type = Cliente AND "Último contato CS" <= -30d',
      gadgetTypeHint: 'Filter Results',
    },
    {
      name: 'Clientes sem contato há 60 dias',
      filterName: 'CSM - Clientes sem contato 60d',
      jql: 'project = CSM AND type = Cliente AND "Último contato CS" <= -60d',
      gadgetTypeHint: 'Filter Results',
    },
    {
      name: 'Distribuição por Health Score',
      filterName: null,
      jql: 'project = CSM AND type = Cliente',
      gadgetTypeHint: 'Two Dimensional Statistics (Health Score)',
    },
  ],
}
```

2. **Dashboard 2 - Relacionamento:**
```typescript
{
  key: 'relationship',
  name: 'Relacionamento',
  description: 'Acompanhar interações e relacionamento com clientes',
  gadgets: [
    {
      name: 'Interações por período',
      filterName: null,
      jql: 'project = CSM AND type = Interação',
      gadgetTypeHint: 'Created vs Resolved Chart',
    },
    {
      name: 'Clientes sem reunião recente',
      filterName: null,
      jql: 'project = CSM AND type = Cliente AND "Último contato CS" <= -30d',
      gadgetTypeHint: 'Filter Results',
    },
    {
      name: 'Reuniões realizadas',
      filterName: null,
      jql: 'project = CSM AND type = Interação AND "Tipo" = Reunião',
      gadgetTypeHint: 'Issue Statistics',
    },
  ],
}
```

3. **Dashboard 3 - Crescimento:**
```typescript
{
  key: 'growth',
  name: 'Crescimento',
  description: 'Acompanhar oportunidades, renovações e expansões',
  gadgets: [
    {
      name: 'Oportunidades em aberto',
      filterName: null,
      jql: 'project = CSM AND type = Oportunidade AND status = Aberto',
      gadgetTypeHint: 'Issue Statistics',
    },
    {
      name: 'Renovações próximas (30 dias)',
      filterName: null,
      jql: 'project = CSM AND type = Renovação AND "Data de Renovação" >= -30d AND status = Planejada',
      gadgetTypeHint: 'Filter Results',
    },
    {
      name: 'Renovações concluídas',
      filterName: null,
      jql: 'project = CSM AND type = Renovação AND status = Ganho',
      gadgetTypeHint: 'Issue Statistics',
    },
  ],
}
```

**Justificativa:** Gadgets com JQL específico, refletindo a especificação

---

### ✏️ filtersConfig.ts

**Mudança necessária:**

Adicionar filtro para "Ciclo da Conta" e renomear "Status da conta" → "Ciclo da Conta" nos JQL existentes

**Justificativa:** Alinha com novo naming

---

### ✏️ Documentação

**Arquivos a atualizar:**

1. **PROJECT_ARCHITECTURE.md**: Descrever 4 camadas explicitamente
2. **FIELD_MAPPING.md**: Reorganizar por blocos funcionais/entidades
3. **JQL_FILTERS.md**: Atualizar com novo campo names
4. **DASHBOARD_SETUP.md**: Especificar gadgets com JQL
5. **AUTOMATION_BLUEPRINT.md**: Descrever automações sobre linked issues
6. **DELETE**: ESTRUTURA_FINAL.md (redundante)

---

## 3. IMPACTO DA CORREÇÃO

| Aspecto | Antes | Depois | Impacto |
|---------|-------|--------|--------|
| **Board** | Indefinido | 8 colunas do pipeline | ✅ Clareza operacional |
| **Ciclo da Conta** | "Status da conta" confuso | Campo explícito "Ciclo da Conta" | ✅ Semantica correta |
| **Issue Types** | 7 types (inclui Onboarding Task) | 6 types corretos | ✅ Alinhado à especificação |
| **Relacionamentos** | Não modelados | Linked issues em relationshipConfig | ✅ Arquitetura clara |
| **Campos** | 38 genéricos em 6 grupos | 31+ específicos em 6 grupos funcionais | ✅ Organizados por entidade |
| **Dashboards** | Nomes + filtros vagos | JQL específico com gadgets | ✅ Operacional |
| **Documentação** | Genérica/incompleta | Alinhada à especificação | ✅ Referência correta |

---

## 4. PLANO DE IMPLEMENTAÇÃO

### Fase 1: Preparação (hoje)
✅ Leitura de arquivos atuais
✅ Diagnóstico completo (este documento)
✅ Proposta de mudanças (este documento)

### Fase 2: Codificação (próximo passo)
**Ordem de execução:**

1. **Criar relationshipConfig.ts** (novo arquivo, sem dependências)
2. **Atualizar issueTypesConfig.ts** (remover 'onboardingTask')
3. **Atualizar boardConfig.ts** (adicionar columns, remover hierarchy)
4. **Atualizar fieldsConfig.ts** (reorganizar grupos, adicionar "Ciclo da Conta")
5. **Atualizar filtersConfig.ts** (renomear campo)
6. **Atualizar dashboardsConfig.ts** (adicionar JQL specific)
7. **Atualizar documentação** (6 arquivos)

### Fase 3: Validação
**Após cada mudança:**
- ✓ Verificar que não há erros de TypeScript
- ✓ Confirmar que as mudanças não quebram imports
- ✓ Validar aderência à especificação

**Final:**
- ✓ Executar `npm run start -- --dryRun=false` para testar provisionamento
- ✓ Verificar que fields, issue types, dashboard, filters foram criados corretamente

### Fase 4: Verificação de Aderência
**Checklist final:**
- ✓ boardConfig.ts tem exatamente 8 colunas do pipeline
- ✓ fieldsConfig.ts tem campo "Ciclo da Conta" com 10 valores corretos
- ✓ issueTypesConfig.ts tem exatamente 6 types
- ✓ relationshipConfig.ts define linked issues (Cliente ↔ outros)
- ✓ dashboardsConfig.ts tem JQL específico para cada gadget
- ✓ Documentação reflete todas as mudanças

---

## 5. PRÓXIMO PASSO

**Aprovação necessária?**

Todos os pontos acima estão alinhados com a especificação final? Se SIM, procedo com a codificação.

Se NÃO, indique qual ponto precisa ajuste antes de começar.

