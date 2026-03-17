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
Write-Host "=== CRIAR ISSUE TYPES CUSTOMIZADOS ===" -ForegroundColor Cyan
Write-Host ""

$issueTypes = @(
    @{
        name = "Cliente"
        description = "Representa um cliente/conta no pipeline CS"
    },
    @{
        name = "Interacao"
        description = "Registro de interacao com cliente"
    },
    @{
        name = "Plano de Sucesso"
        description = "Estrategia de sucesso para conta"
    },
    @{
        name = "Risco"
        description = "Fator de risco identificado"
    },
    @{
        name = "Oportunidade"
        description = "Oportunidade de expansao CS"
    },
    @{
        name = "Renovacao"
        description = "Processo de renovacao"
    }
)

Write-Host "[1/2] Testando autenticacao..." -ForegroundColor Yellow
try {
    $myself = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/myself" -Headers $headers -Method GET
    Write-Host ("OK - Autenticado: " + $myself.displayName) -ForegroundColor Green
}
catch {
    Write-Host ("ERRO: " + $_) -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] Criando issue types..." -ForegroundColor Yellow

$createdCount = 0
$failedCount = 0

foreach ($it in $issueTypes) {
    try {
        $itBody = @{
            name = $it.name
            description = $it.description
            type = "standard"
        } | ConvertTo-Json
        
        Write-Host ("Criando: " + $it.name + "...") -ForegroundColor Gray
        
        $resp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/issuetypes" -Headers $headers -Method POST -Body $itBody -ContentType "application/json"
        Write-Host ("  OK - Criado com ID: " + $resp.id) -ForegroundColor Green
        $createdCount += 1
    }
    catch {
        $errorMsg = $_.Exception.Response.StatusCode
        if ($errorMsg -eq "Conflict" -or $_.ToString().Contains("409")) {
            Write-Host ("  Aviso - Ja existe") -ForegroundColor Yellow
        }
        else {
            Write-Host ("  Erro: " + $_) -ForegroundColor Red
            $failedCount += 1
        }
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "RESUMO" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ("Criados: " + $createdCount) -ForegroundColor White
Write-Host ("Falhados: " + $failedCount) -ForegroundColor White
Write-Host ""
Write-Host "Proxima etapa:" -ForegroundColor Cyan
Write-Host "Vincular os issue types ao board no Jira UI:" -ForegroundColor White
Write-Host "  Board > Board Settings > Issue types" -ForegroundColor Gray
Write-Host ""
