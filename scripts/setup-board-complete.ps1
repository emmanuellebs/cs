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

# Setup headers
$auth = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("$Email`:$Token"))
$headers = @{ 
    "Authorization" = "Basic $auth"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "=== SETUP COMPLETO: DELETE + CREATE BOARD ===" -ForegroundColor Cyan
Write-Host ""

try {
    Write-Host "[1/3] Testando autenticacao..." -ForegroundColor Yellow
    $myself = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/myself" -Headers $headers -Method GET
    Write-Host "OK - Usuario: $($myself.displayName)" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "[2/3] Deletando espaço WCS (Service Desk)..." -ForegroundColor Yellow
    try {
        # Buscar o ID do espaço WCS
        $spacesResp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/spaces" -Headers $headers -Method GET
        $wcsSpace = $spacesResp.spaces | Where-Object { $_.name -eq "WH - Customer Success" }
        
        if ($wcsSpace) {
            $spaceId = $wcsSpace.id
            Write-Host "Espaço encontrado: ID $spaceId" -ForegroundColor Gray
            
            # Deletar espaço
            $deleteResp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/spaces/$spaceId" -Headers $headers -Method DELETE
            Write-Host "OK - Espaço WCS deletado" -ForegroundColor Green
        } else {
            Write-Host "⚠ Espaço WCS nao encontrado (pode ja estar deletado)" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠ Nao conseguiu deletar via API (manual delete pode ser necessario): $_" -ForegroundColor Yellow
    }
    Write-Host ""
    
    Write-Host "[3/3] Criando board Kanban simples..." -ForegroundColor Yellow
    
    # Tentar abordagem minimalista
    $boardBody = @{
        name = "WH - Customer Success"
        type = "kanban"
        projectId = $ProjectId
    } | ConvertTo-Json
    
    Write-Verbose "Body: $boardBody"
    
    $boardResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board" -Headers $headers -Method POST -Body $boardBody -ContentType "application/json"
    $boardId = $boardResp.id
    
    Write-Host "OK - Board criado com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "SUCESSO!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Board Name: WH - Customer Success" -ForegroundColor White
    Write-Host "Board ID: $boardId" -ForegroundColor White
    Write-Host "Project: CSM ($ProjectId)" -ForegroundColor White
    Write-Host ""
    Write-Host "Board URL:" -ForegroundColor Cyan
    Write-Host "$JiraUrl/software/c/projects/$ProjectKey/boards/$boardId" -ForegroundColor White
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Cyan
    Write-Host "1. Acesse o board e configure as colunas" -ForegroundColor White
    Write-Host "2. Crie os issue types customizados (7 tipos)" -ForegroundColor White
    Write-Host "3. Execute: npm run start -- --dryRun=false" -ForegroundColor White
}
catch {
    Write-Host ""
    Write-Host "ERRO: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solucao manual:" -ForegroundColor Yellow
    Write-Host "1. Acesse https://whd.atlassian.net" -ForegroundColor White
    Write-Host "2. Delete o espaço WCS (Projects > WCS > Settings > Delete)" -ForegroundColor White
    Write-Host "3. Va para Project CSM > Create board > Kanban" -ForegroundColor White
    Write-Host "4. Nome: WH - Customer Success" -ForegroundColor White
    Write-Host ""
    exit 1
}
