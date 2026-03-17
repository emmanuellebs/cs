param(
    [string]$Email = $env:JIRA_EMAIL,
    [string]$Token = $env:JIRA_API_TOKEN,
    [string]$JiraUrl = $env:JIRA_BASE_URL,
    [string]$ProjectKey = "CSM",
    [int]$ProjectId = 10104
)

$ErrorActionPreference = "Stop"

if (-not $Email -or -not $Token -or -not $JiraUrl) {
    throw "Defina JIRA_EMAIL, JIRA_API_TOKEN e JIRA_BASE_URL antes de executar."
}

Write-Host "=== JIRA BOARD CREATION ===" -ForegroundColor Cyan
Write-Host ""

$auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$Email`:$Token"))
$headers = @{
    "Authorization" = "Basic $auth"
    "Content-Type" = "application/json"
}

try {
    Write-Host "[1/3] Testando autenticacao..." -ForegroundColor Yellow
    $myself = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/myself" -Headers $headers -Method GET
    Write-Host "OK - Usuario: $($myself.displayName)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[2/3] Criando filtro base..." -ForegroundColor Yellow
    # Criar filtro base - usar project = CSM (project ID)
    $filterJql = 'project = 10104'
    $filterBody = @{
        name = "WH - CS Management - Board base"
        description = "Filtro base para o board Kanban de CS"
        jql = $filterJql
        favourite = $false
    } | ConvertTo-Json
    
    $filterResp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/filters" -Headers $headers -Method POST -Body $filterBody -ContentType "application/json"
    $filterId = $filterResp.id
    Write-Host "OK - Filtro criado: ID $filterId" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[3/3] Criando board Kanban..." -ForegroundColor Yellow
    # A API do Agile Board precisa de um filtro existente
    $boardBody = @{
        name = "WH - Customer Success"
        type = "kanban"
        filterOpt = @{
            id = $filterId.ToString()
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Verbose "Board Body: $boardBody"
    
    $boardResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board" -Headers $headers -Method POST -Body $boardBody -ContentType "application/json"
    $boardId = $boardResp.id
    Write-Host "OK - Board criado: ID $boardId" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCESSO - Board criado!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Board URL:" -ForegroundColor Cyan
    Write-Host "$JiraUrl/software/c/projects/$ProjectKey/boards/$boardId" -ForegroundColor White
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "1. Configure as colunas conforme BOARD_SETUP_GUIDE.md" -ForegroundColor White
    Write-Host "2. Crie os issue types: Conta Cliente, Interação, etc." -ForegroundColor White
}
catch {
    Write-Host "ERRO: $_" -ForegroundColor Red
    exit 1
}
