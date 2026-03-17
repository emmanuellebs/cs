# 🚀 Guia Rápido: Jira CS em 2 Minutos

Bem-vindo! Este é um guia super rápido para você começar a usar a estrutura de Customer Success no Jira.

---

## **O Essencial: 3 Conceitos**

### 1️⃣ **Cliente**
É o coração de tudo. Cada **Cliente** é uma conta de cliente que você acompanha.

Exemplo: `Cliente - ACME Corp`

### 2️⃣ **Issues Vinculadas**
São os registros que estão conectados a um Cliente.

- **Interação**: Reunião, e-mail, ligação com o cliente
- **Plano de Sucesso**: Plano criado para ajudar o cliente a ter sucesso
- **Risco**: Problema detectado que pode virar churn
- **Oportunidade**: Chance de vender mais / expandir
- **Renovação**: Processo de renovar o contrato

### 3️⃣ **Board + Ciclo da Conta**
- **Board**: Mostra as etapas de operação (8 etapas)
- **Ciclo da Conta**: Campo que marca o estágio estratégico do cliente (10 estágios)

---

## **Comece Assim**

### **Passo 1: Entrar no Jira**
1. Abra: [seu Jira] → Projeto **CSM**
2. Vá em **Board** (à esquerda)

### **Passo 2: Ver o Board**
Você verá 8 colunas:
```
Análise → Implantação → Lançamento → Acompanhamento 1 → Acompanhamento 2 → Expansão → Renovação → Cancelamento
```

Cada coluna é um estágio. Arraste os clientes entre as colunas conforme avançam.

### **Passo 3: Abrir um Cliente**
Clique em qualquer card Cliente no board.

Dentro do Cliente, você verá:
- **Informações da conta** (MRR, Health Score, Data de Renovação, etc)
- **Ciclo da Conta** (o estágio estratégico)
- **Issues vinculadas** (Interações, Riscos, Oportunidades, etc)

### **Passo 4: Ver Dashboards**
Na barra de menu → **Dashboards**

Lá você vê 3 dashboards:
- **Saúde da Base**: Clientes em risco? Health score baixo?
- **Relacionamento**: Quantas interações? Quando foi a última?
- **Crescimento**: Oportunidades abertas? Renovações próximas?

---

## **No Dia a Dia**

### ✅ **O que você faz**

| Situação | O que fazer |
|----------|------------|
| Cliente novo entrou | Criar um novo **Cliente** no board, colocar na coluna **Análise de Perfil** |
| Você teve uma reunião | Criar uma **Interação** vinculada ao Cliente |
| Viu um problema | Criar um **Risco** vinculado ao Cliente |
| Tem chance de vender mais | Criar uma **Oportunidade** vinculada ao Cliente |
| Cliente precisa de plano | Criar um **Plano de Sucesso** vinculado ao Cliente |
| Contrato perto do vencimento | Criar uma **Renovação** vinculada ao Cliente |

### ✅ **Como mover clientes no board**

1. Arraste o card cliente
2. Ele muda de coluna
3. Pronto! O status atualiza automaticamente

### ✅ **Como atualizar Ciclo da Conta**

1. Abra o Cliente
2. Procure o campo **"Ciclo da Conta"**
3. Clique e escolha o estágio (Onboarding, Ativo, Engajamento, Expansão, etc)
4. Salve

---

## **Erros Comuns: Não Faça Isso**

❌ **NÃO** criar Interações, Riscos, Oportunidades soltos sem vincular a um Cliente
→ Sempre vinculam a um Cliente específico!

❌ **NÃO** confundir Board com Ciclo da Conta
→ Board = operação do dia a dia
→ Ciclo = estratégia de longo prazo

❌ **NÃO** esquecer de atualizar o Ciclo da Conta
→ Ele ajuda a entender a saúde estratégica do cliente

---

## **Precisa de Mais?**

- 📖 Manual completo? Veja **MANUAL_USUARIO_FINAL.md**
- 🗺️ Quer ver a estrutura visual? Veja **MAPA_ESTRUTURA_JIRA_CS.md**
- 🎯 Não sabe quando criar cada coisa? Veja **QUANDO_USAR_CADA_ISSUE_TYPE.md**
- 📊 Como ler os dashboards? Veja **COMO_USAR_DASHBOARDS.md**
- ✓ Checklist diário? Veja **CHECKLIST_OPERACIONAL_CS.md**

---

**Pronto! Você já sabe o essencial. Agora explore e boa sorte! 🎉**
