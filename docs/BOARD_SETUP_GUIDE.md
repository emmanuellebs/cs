# Guia Completo: Criar Board Kanban CSM no Jira

**Data:** 12 de Março de 2026  
**Projeto:** CSM (Key: CSM, ID: 10104)  
**Board:** CSM - Lifecycle Kanban  

---

## 📋 Pré-requisitos

Antes de criar o board, você precisa ter:

✅ **Projeto CSM criado** (ID: 10104)  
✅ **Issue types criados:**
- Conta Cliente
- Interação
- Plano de Sucesso
- Risco
- Oportunidade CS
- Renovação
- Onboarding Task

✅ **Campo "Status da conta" configurado** com as opções:
- Onboarding
- Ativo
- Engajamento
- Expansão
- Advocacy
- Renovação
- Renovado
- Risco
- Churn

✅ **Workflow criado** com os estados acima

---

## 🔧 OPÇÃO 1: Criar via API (Programático)

### Passo 1: Criar o Filtro Base

```powershell
# Variáveis de autenticação (use variáveis de ambiente; nunca commit tokens)
$email = $env:JIRA_EMAIL
$token = $env:JIRA_API_TOKEN
$baseUrl = $env:JIRA_BASE_URL

if (-not $email -or -not $token -or -not $baseUrl) {
    throw "Defina JIRA_EMAIL, JIRA_API_TOKEN e JIRA_BASE_URL antes de executar."
}

# Codificar credenciais para Basic Auth
$auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$email`:$token"))

# Headers
$headers = @{
    "Authorization" = "Basic $auth"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

# Criar filtro base
$jql = 'project = CSM ORDER BY updated DESC'
$filterBody = @{
    name = "CSM - Board base"
    description = "Filtro base para o board Kanban de lifecycle"
    jql = $jql
    favourite = $true
} | ConvertTo-Json

$filterResponse = Invoke-RestMethod `
    -Uri "$baseUrl/rest/api/3/filters" `
    -Method POST `
    -Headers $headers `
    -Body $filterBody

$filterId = $filterResponse.id
Write-Host "✅ Filtro criado com ID: $filterId"
```

### Passo 2: Criar o Board Kanban

```powershell
# Criar board
$boardBody = @{
    name = "CSM - Lifecycle Kanban"
    type = "kanban"
    filterId = [int]$filterId
} | ConvertTo-Json

$boardResponse = Invoke-RestMethod `
    -Uri "$baseUrl/rest/agile/1.0/board" `
    -Method POST `
    -Headers $headers `
    -Body $boardBody

$boardId = $boardResponse.id
Write-Host "✅ Board criado com ID: $boardId"
```

### Passo 3: Configurar Colunas do Board

```powershell
# Obter configuração atual do board
$boardConfig = Invoke-RestMethod `
    -Uri "$baseUrl/rest/agile/1.0/board/$boardId/configuration" `
    -Method GET `
    -Headers $headers

# Configurar colunas para mapear estados
$columnConfig = @{
    columnConfig = @{
        columns = @(
            @{
                name = "Onboarding"
                statuses = @(
                    @{ id = "10001"; name = "Onboarding" }
                )
            },
            @{
                name = "Cliente Ativo"
                statuses = @(
                    @{ id = "10002"; name = "Ativo" }
                )
            },
            @{
                name = "Engajamento"
                statuses = @(
                    @{ id = "10003"; name = "Engajamento" }
                )
            },
            @{
                name = "Expansão"
                statuses = @(
                    @{ id = "10004"; name = "Expansão" }
                )
            },
            @{
                name = "Advocacy"
                statuses = @(
                    @{ id = "10005"; name = "Advocacy" }
                )
            },
            @{
                name = "Renovação"
                statuses = @(
                    @{ id = "10006"; name = "Renovação" }
                )
            },
            @{
                name = "Renovado"
                statuses = @(
                    @{ id = "10007"; name = "Renovado" }
                )
            },
            @{
                name = "Risco"
                statuses = @(
                    @{ id = "10008"; name = "Risco" }
                )
            },
            @{
                name = "Churn"
                statuses = @(
                    @{ id = "10009"; name = "Churn" }
                )
            }
        )
    }
} | ConvertTo-Json -Depth 10

$configResponse = Invoke-RestMethod `
    -Uri "$baseUrl/rest/agile/1.0/board/$boardId/configuration" `
    -Method PUT `
    -Headers $headers `
    -Body $columnConfig

Write-Host "✅ Colunas configuradas com sucesso"
```

---

## 🖥️ OPÇÃO 2: Criar via Interface Gráfica (Manual)

### Passo 1: Acessar Boards no Jira

1. Vá para **Projetos** → **CSM**
2. Clique em **Boards** (menu lateral esquerdo)
3. Clique em **Criar board**

### Passo 2: Configurar Board Básico

1. **Nome:** `CSM - Lifecycle Kanban`
2. **Tipo:** Kanban
3. **Filtro:** `project = CSM ORDER BY updated DESC`
4. Clique em **Criar**

### Passo 3: Configurar Colunas

1. Vá para **Configurações do Board** (engrenagem no canto superior direito)
2. Clique em **Colunas**
3. Configure as colunas conforme tabela abaixo:

| Coluna | Status mapeado | Cor |
|--------|---|---|
| Onboarding | Onboarding | Azul |
| Cliente Ativo | Ativo | Verde |
| Engajamento | Engajamento | Verde claro |
| Expansão | Expansão | Amarelo |
| Advocacy | Advocacy | Roxo |
| Renovação | Renovação | Laranja |
| Renovado | Renovado | Verde escuro |
| Risco | Risco | Vermelho |
| Churn | Churn | Cinza |

### Passo 4: Configurar Swimlanes (Opcional)

1. **Configurações do Board** → **Swimlanes**
2. Selecione: **Agrupar por:** "Responsável" ou deixe padrão

### Passo 5: Configurar Rápido Filtro (Opcional)

1. **Configurações do Board** → **Filtro rápido**
2. Crie filtros para:
   - `"Status da conta" = "Risco"` → "Clientes em Risco"
   - `"Status da conta" = "Ativo"` → "Clientes Ativos"
   - `updated >= -7d` → "Atualizados esta semana"

---

## 📊 Estrutura Esperada do Board

```
KANBAN BOARD: CSM - Lifecycle Kanban
├── Onboarding
│   ├── Conta Cliente | Nova Empresa S/A
│   └── Conta Cliente | Startup XYZ
├── Cliente Ativo
│   ├── Conta Cliente | Tech Corp
│   └── Conta Cliente | Digital Solutions
├── Engajamento
│   ├── Interação | Reunião estratégica
│   └── Plano de Sucesso | Q1 2026 Goals
├── Expansão
│   ├── Oportunidade CS | Novo módulo
│   └── Oportunidade CS | Upgrade
├── Advocacy
│   ├── Conta Cliente | Market Leader
│   └── Interação | Case study
├── Renovação
│   ├── Renovação | Contract renewal Q2
│   └── Risco | Churn risk mitigation
├── Renovado
│   ├── Renovação | Completed 2026
│   └── Conta Cliente | Renewed
├── Risco
│   └── Conta Cliente | Customer in Risk
└── Churn
    └── Conta Cliente | Customer Lost
```

---

## 🔍 Validação

Após criar o board, valide:

- ✅ Todas as 9 colunas aparecem
- ✅ Issues aparecem nas colunas corretas conforme status
- ✅ Filtro base retorna ~30-50 contas (variável)
- ✅ Drag & drop funciona entre colunas
- ✅ Swimlanes funcionam (se configurado)
- ✅ Rápido filtro funciona (se configurado)

---

## 📌 Comandos Úteis via Terminal

### Listar Boards Existentes
```powershell
$headers = @{
    "Authorization" = "Basic $auth"
    "Content-Type" = "application/json"
}

$boards = Invoke-RestMethod `
    -Uri "https://whd.atlassian.net/rest/agile/1.0/board?projectKeyOrId=CSM" `
    -Method GET `
    -Headers $headers

$boards.values | Select-Object id, name, @{Name="Type"; Expression={$_.type}}
```

### Obter Configuração do Board
```powershell
$boardConfig = Invoke-RestMethod `
    -Uri "https://whd.atlassian.net/rest/agile/1.0/board/{boardId}/configuration" `
    -Method GET `
    -Headers $headers

$boardConfig | ConvertTo-Json -Depth 5
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Filtro não encontrado" | Certifique-se de que o filtro "CSM - Board base" foi criado |
| "Status não mapeado" | Verifique se todos os 9 status foram criados no workflow |
| "Agile não disponível" | Ative o módulo Agile no projeto (Configurações → Módulos) |
| "Não consigo ver issues no board" | Verifique se há contas criadas no projeto com status apropriado |

---

## 📚 Referências

- [Jira API - Create Board](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-post)
- [Jira API - Filter](https://developer.atlassian.com/cloud/jira/rest/api-group-filters/#api-rest-api-3-filters-post)
- [Jira Agile Board Configuration](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-id-configuration-put)

