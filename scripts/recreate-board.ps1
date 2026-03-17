param(
    [string]$Email = $env:JIRA_EMAIL,
    [string]$Token = $env:JIRA_API_TOKEN,
    [string]$JiraUrl = $env:JIRA_BASE_URL,
    [string]$ProjectKey = "CSM",
    [int]$ProjectId = 10104,
    [int]$OldBoardId = 205
)

$ErrorActionPreference = "Stop"

if (-not $Email -or -not $Token -or -not $JiraUrl) {
    throw "Defina JIRA_EMAIL, JIRA_API_TOKEN e JIRA_BASE_URL antes de executar."
}

# Setup headers
$auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$Email`:$Token"))
$headers = @{ 
    "Authorization" = "Basic $auth"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "=== CRIAR NOVO BOARD KANBAN SOFTWARE ===" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "[1/4] Testando autenticacao..." -ForegroundColor Yellow
    $myself = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/myself" -Headers $headers -Method GET
    Write-Host ("OK - Autenticado: " + $myself.displayName) -ForegroundColor Green
    
    Write-Host ""
    Write-Host "[2/4] Deletando board antigo (ID $OldBoardId)..." -ForegroundColor Yellow
    
    try {
        $deleteResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board/$OldBoardId" -Headers $headers -Method DELETE -ErrorAction SilentlyContinue
        Write-Host "OK - Board antigo deletado" -ForegroundColor Green
    }
    catch {
        Write-Host "Aviso - Nao conseguiu deletar board antigo (pode ja estar deletado)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "[3/4] Criando filtro base para o board..." -ForegroundColor Yellow
    
    # Criar filtro primeiro
    $filterBody = @{
        name = "WH - CS Management - Board base"
        description = "Filtro base para board Kanban"
        jql = "project = " + $ProjectKey
        favourite = $false
    } | ConvertTo-Json
    
    try {
        $filterResp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/filters" -Headers $headers -Method POST -Body $filterBody -ContentType "application/json"
        $filterId = $filterResp.id
        Write-Host ("OK - Filtro criado: ID " + $filterId) -ForegroundColor Green
    }
    catch {
        Write-Host ("Aviso - Nao conseguiu criar filtro: $_") -ForegroundColor Yellow
        $filterId = $null
    }
    
    Write-Host ""
    Write-Host "[4/4] Criando novo board Kanban Software..." -ForegroundColor Yellow
    
    # Tentar com filtro ID
    if ($filterId) {
        Write-Host "Tentativa com filtro ID..." -ForegroundColor Gray
        $boardBody = @{
            name = "WH - Customer Success"
            type = "kanban"
            filterId = [int]$filterId
        } | ConvertTo-Json
        
        try {
            $boardResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board" -Headers $headers -Method POST -Body $boardBody -ContentType "application/json"
            $newBoardId = $boardResp.id
            Write-Host ("OK - Board criado com filtro: ID " + $newBoardId) -ForegroundColor Green
        }
        catch {
            Write-Host "Filtro nao funcionou, tentando sem filtro..." -ForegroundColor Yellow
            $filterId = $null
        }
    }
    
    # Se filtro nao funcionou, tentar abordagens alternativas
    if (!$filterId -or !$newBoardId) {
        Write-Host "Tentativa com JQL inline..." -ForegroundColor Gray
        
        $boardBody = @{
            name = "WH - Customer Success"
            type = "kanban"
            filterOpt = @{
                jql = "project = 10104"
            }
        } | ConvertTo-Json -Depth 5
        
        try {
            $boardResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board" -Headers $headers -Method POST -Body $boardBody -ContentType "application/json"
            $newBoardId = $boardResp.id
            Write-Host ("OK - Board criado com JQL: ID " + $newBoardId) -ForegroundColor Green
        }
        catch {
            Write-Host "JQL tambem falhou. Sera necessario criar via UI." -ForegroundColor Red
            throw $_
        }
    }
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCESSO - NOVO BOARD CRIADO!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Novo Board ID: $newBoardId" -ForegroundColor White
    Write-Host ("URL: " + $JiraUrl + "/software/c/projects/" + $ProjectKey + "/boards/" + $newBoardId) -ForegroundColor White
    Write-Host ""
    
    Write-Host "Proximas etapas:" -ForegroundColor Cyan
    Write-Host "1. Acessar o novo board" -ForegroundColor White
    Write-Host "2. Renomear colunas via Board Settings > Columns" -ForegroundColor White
    Write-Host ("3. Nomes: Analise de Perfil, Implantacao, Lancamento, Acompanhamento 1, Acompanhamento 2, Expansao, Renovacao, Cancelamento") -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host ("ERRO: $_") -ForegroundColor Red
    exit 1
}
