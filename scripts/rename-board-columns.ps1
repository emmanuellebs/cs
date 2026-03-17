param(
    [string]$Email = $env:JIRA_EMAIL,
    [string]$Token = $env:JIRA_API_TOKEN,
    [string]$JiraUrl = $env:JIRA_BASE_URL,
    [string]$ProjectKey = "CSM",
    [int]$BoardId = 206
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
Write-Host "=== RENOMEANDO COLUNAS DO BOARD ===" -ForegroundColor Cyan
Write-Host ""

# Novos nomes das colunas (8 etapas)
$newColumnNames = @(
    "Analise de Perfil",
    "Implantacao",
    "Lancamento",
    "Acompanhamento 1",
    "Acompanhamento 2",
    "Expansao",
    "Renovacao",
    "Cancelamento"
)

try {
    Write-Host "[1/3] Obtendo configuracao de statuses do projeto..." -ForegroundColor Yellow
    
    $statuses = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/project/$ProjectKey/statuses" -Headers $headers -Method GET
    
    Write-Host "OK - Statuses obtidos" -ForegroundColor Green
    Write-Host ("Total de statuses: " + $statuses.Count) -ForegroundColor Gray
    
    foreach ($status in $statuses) {
        Write-Host ("  - " + $status.name + " (" + $status.id + ")") -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "[2/3] Preparando atualizacao das colunas..." -ForegroundColor Yellow
    
    # Mapear colunas status para novos nomes
    $columns = @()
    for ($i = 0; $i -lt $boardConfig.columnConfig.columns.Count -and $i -lt $newColumnNames.Count; $i++) {
        $col = $boardConfig.columnConfig.columns[$i]
        $columns += @{
            name = $newColumnNames[$i]
            statuses = $col.statuses
        }
        Write-Host ("Coluna " + ($i + 1) + ": " + $newColumnNames[$i] + " -> " + ($col.statuses -join ", ")) -ForegroundColor Gray
    }
    
    # Preparar payload
    $updateBody = @{
        columnConfig = @{
            columns = $columns
        }
    } | ConvertTo-Json -Depth 10
    
    Write-Host ""
    Write-Host "[3/3] Enviando atualizacao..." -ForegroundColor Yellow
    
    $updateResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board/$BoardId/config" -Headers $headers -Method PUT -Body $updateBody
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "COLUNAS RENOMEADAS COM SUCESSO!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Colunas atualizadas:" -ForegroundColor Green
    for ($i = 0; $i -lt $newColumnNames.Count; $i++) {
        Write-Host ("  " + ($i + 1) + ". " + $newColumnNames[$i]) -ForegroundColor White
    }
    Write-Host ""
    
    Write-Host "Proxima etapa:" -ForegroundColor Cyan
    Write-Host "  Vincular issue types ao board (Manual: Board > Board Settings > Issue types)" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host ("ERRO: $_") -ForegroundColor Red
    Write-Host ""
    Write-Host "Nota: Se a API de board config nao funcionar, renomeie manualmente:" -ForegroundColor Yellow
    Write-Host "  1. Acesse o board no Jira" -ForegroundColor White
    Write-Host "  2. Clique em Board Settings (engrenagem)" -ForegroundColor White
    Write-Host "  3. Abra a aba 'Columns'" -ForegroundColor White
    Write-Host "  4. Renomeie cada coluna" -ForegroundColor White
    Write-Host ""
    exit 1
}
