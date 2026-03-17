# 🗺️ Mapa da Estrutura Jira CS

Visão visual e em texto de como tudo está organizado no sistema.

---

## **Estrutura Hierárquica**

```
JIRA CS
│
├── 🏢 CLIENTE (Issue Central)
│   │
│   ├── 💬 INTERAÇÃO (Linked Issue)
│   │   └─ Tipo: Reunião, Suporte, Feedback, Treinamento, Evento
│   │   └─ Data e Resumo
│   │
│   ├── 📋 PLANO DE SUCESSO (Linked Issue)
│   │   └─ Objetivos e Atividades
│   │   └─ Responsáveis e Datas
│   │
│   ├── ⚠️ RISCO (Linked Issue)
│   │   └─ Descrição do Risco
│   │   └─ Probabilidade e Impacto
│   │
│   ├── 🚀 OPORTUNIDADE (Linked Issue)
│   │   └─ Descrição da Oportunidade
│   │   └─ Valor Estimado
│   │
│   └── 🔄 RENOVAÇÃO (Linked Issue)
│       └─ Data de Vencimento
│       └─ Status (Em negociação, Renovado, Perdido)
│
├── 📊 BOARD OPERACIONAL
│   │
│   └── 8 COLUNAS (Pipeline):
│       ├─ 1️⃣ Análise de Perfil
│       ├─ 2️⃣ Implantação
│       ├─ 3️⃣ Lançamento
│       ├─ 4️⃣ Acompanhamento 1
│       ├─ 5️⃣ Acompanhamento 2
│       ├─ 6️⃣ Expansão
│       ├─ 7️⃣ Renovação
│       └─ 8️⃣ Cancelamento
│
├── 📈 CAMPO: CICLO DA CONTA
│   │
│   └── 10 ESTÁGIOS ESTRATÉGICOS:
│       ├─ Onboarding (Início)
│       ├─ Ativo (Usando regularmente)
│       ├─ Adoção (Em estrutura de adoção)
│       ├─ Engajamento (Muito engajado)
│       ├─ Expansão (Crescendo)
│       ├─ Advocacy (Promotor)
│       ├─ Renovação (Contrato vencendo)
│       ├─ Renovado (Já renovou)
│       ├─ Risco (Em risco de churn)
│       └─ Churn (Cancelou)
│
└── 📊 DASHBOARDS (Visualizações Analíticas)
    │
    ├─ 🏥 SAÚDE DA BASE
    │  └─ Clientes em risco
    │  └─ Health score baixo
    │  └─ Sem contato há 60 dias
    │  └─ Engajamento baixo
    │
    ├─ 👥 RELACIONAMENTO
    │  └─ Interações por mês
    │  └─ Tipos de interação
    │  └─ Participação em eventos
    │  └─ Engajamento da plataforma
    │
    └─ 📈 CRESCIMENTO
       └─ Oportunidades abertas
       └─ Renovações próximas
       └─ Indicações recebidas
       └─ Clientes em advocacy
```

---

## **Fluxo de um Cliente**

```
                    ACME Corp (Cliente)
                            │
                ┌───────────┼───────────┐
                │           │           │
            🏢 DADOS      💬 INTERAÇÃO  📋 PLANO
        (Segmento,      (Reunião 1)   (Objetivos
         MRR, NPS)      (Reunião 2)    Q2)
                │           │           │
                ├───────────┼───────────┤
                │
            ⚠️ RISCO
        (Desengajamento)
                │
                └─> BOARD: Análise → Implantação → Lançamento → ...
                    CICLO: Onboarding → Ativo → Adoção → Engajamento → ...
```

---

## **Camadas da Solução**

### **Camada 1: Entidades** 🏢💬📋
**O que:** 6 tipos de issues (Cliente + 5 vinculadas)  
**Para quê:** Capturar toda a informação sobre contas e relacionamentos  
**Quem usa:** Todos os CSMs

```
Cliente ────┬──→ Interação
            ├──→ Plano de Sucesso
            ├──→ Risco
            ├──→ Oportunidade
            └──→ Renovação
```

---

### **Camada 2: Board Operacional** 📊
**O que:** 8 colunas com pipeline operacional  
**Para quê:** Visualizar andamento operacional do cliente  
**Quando usar:** Todos os dias

```
Análise → Implantação → Lançamento → Acompanhamento 1 → Acompanhamento 2 → Expansão → Renovação → Cancelamento
```

**Objetivo:** Arraste clientes conforme progridem nas etapas.

---

### **Camada 3: Ciclo da Conta** 📈
**O que:** Campo estratégico com 10 estágios  
**Para quê:** Marcar o estágio estratégico do cliente (separado da operação)  
**Quando usar:** Semanal (ou quando há mudança real)

```
Onboarding → Ativo → Adoção → Engajamento → Expansão → Advocacy → Renovação → Renovado
                                                                          ↓
                                                                      Risco (qualquer momento)
                                                                          ↓
                                                                        Churn
```

**Objetivo:** Entender a saúde estratégica do cliente.

---

### **Camada 4: Dashboards** 📊
**O que:** 3 visualizações analíticas (Saúde, Relacionamento, Crescimento)  
**Para quê:** Tomar decisões baseadas em dados  
**Quando usar:** Semanal (reuniões) e mensal (reports)

```
Saúde da Base  ←──────┐
                       │
Relacionamento ←──────┼──→ Decisões de CS
                       │
Crescimento    ←──────┘
```

---

## **Mapeamento de Campos por Issue Type**

```
CLIENTE:
├─ Informações da Conta
│  ├─ Segmento
│  ├─ MRR
│  ├─ Health Score
│  ├─ NPS
│  ├─ Engagement
│  ├─ Contagem de Usuários
│  └─ Data de Renovação
│
├─ Contato Principal
│  ├─ Nome
│  ├─ Email
│  ├─ Telefone
│  └─ Cargo
│
├─ Operacional
│  ├─ Data de Início
│  ├─ Data de Lançamento
│  ├─ Data de Treinamento
│  └─ CICLO DA CONTA ⭐
│
└─ Programa
   ├─ Produto
   ├─ Advocacy
   └─ Duração do Contrato

INTERAÇÃO:
├─ Tipo (Reunião, Suporte, Feedback, Treinamento, Evento)
├─ Data
├─ Resumo
└─ Vinculado a: Cliente

PLANO DE SUCESSO:
├─ Objetivos
├─ Atividades
├─ Responsáveis
├─ Data de Conclusão
└─ Vinculado a: Cliente

RISCO:
├─ Descrição
├─ Probabilidade
├─ Impacto
├─ Ações para Mitigar
└─ Vinculado a: Cliente

OPORTUNIDADE:
├─ Descrição
├─ Valor Estimado
├─ Probabilidade
├─ Próximas Etapas
└─ Vinculado a: Cliente

RENOVAÇÃO:
├─ Data de Vencimento
├─ Valor
├─ Status
├─ Observações
└─ Vinculado a: Cliente
```

---

## **Diferenças Importantes**

### **Board ≠ Ciclo da Conta**

| Aspecto | Board | Ciclo da Conta |
|---------|-------|----------------|
| **O quê** | Etapas operacionais | Estágios estratégicos |
| **Colunas** | 8 etapas | 10 estágios |
| **Atualização** | Quando cliente avança/recua | Quando situação estratégica muda |
| **Propósito** | Operação do dia a dia | Saúde de longo prazo |
| **Exemplo** | Cliente move para "Implantação" | Cliente marcado como "Risco" |

---

### **Cliente ≠ Interação/Risco/etc**

| Aspecto | Cliente | Outras Issues |
|---------|---------|--------------|
| **Tipo** | Central | Vinculadas |
| **Quantas** | 1 por conta | Múltiplas (várias reuniões, vários riscos) |
| **Ciclo** | Longo (1-3 anos) | Curto (dias/semanas) |
| **No Board** | Aparecem os cards | Aparecem como linked issues |

---

## **Como Navegar Visualmente**

### **Quero ver todos os meus clientes:**
→ Vá em **Board** (à esquerda)

### **Quero saber quais clientes estão em risco:**
→ Vá em **Dashboards** → **Saúde da Base**

### **Quero ver todas as interações do mês:**
→ Vá em **Dashboards** → **Relacionamento**

### **Quero ver oportunidades abertas:**
→ Vá em **Dashboards** → **Crescimento**

### **Quero abrir um cliente específico:**
→ **Board** → Clique no card Cliente → Detalhes aparecem

### **Quero ver as issues vinculadas de um cliente:**
→ Abra o Cliente → Procure "Linked Issues" → Veja Interações, Riscos, Oportunidades, etc

---

## **Checklist: Como Entender a Estrutura**

- [ ] Sei que Cliente é a issue central
- [ ] Sei que há 5 tipos de issues vinculadas (Interação, Plano, Risco, Oportunidade, Renovação)
- [ ] Entendo as 8 colunas do board operacional
- [ ] Entendo os 10 estágios do Ciclo da Conta
- [ ] Sei diferenciar Board de Ciclo da Conta
- [ ] Sei onde ficam os 3 dashboards
- [ ] Entendo o propósito de cada dashboard
- [ ] Sei criar um novo Cliente
- [ ] Sei vincular uma Interação a um Cliente
- [ ] Sei mover um Cliente no board
- [ ] Sei atualizar o Ciclo da Conta

**Quando conseguir marcar tudo, você está pronto para usar! ✅**
