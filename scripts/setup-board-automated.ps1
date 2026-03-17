param(
    [string]$Email = $env:JIRA_EMAIL,
    [string]$Token = $env:JIRA_API_TOKEN,
    [string]$JiraUrl = $env:JIRA_BASE_URL,
    [string]$ProjectKey = "CSM",
    [int]$ProjectId = 10104,
    [int]$BoardId = 206,
    [string]$ConfigPath = ".\config\board-setup.json"
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
Write-Host "=== CONFIGURACAO DO BOARD KANBAN ===" -ForegroundColor Cyan
Write-Host ""

# Load configuration
Write-Host "[0/5] Carregando configuracao..." -ForegroundColor Yellow
try {
    $config = Get-Content $ConfigPath | ConvertFrom-Json
    Write-Host ("OK - Configuracao carregada: " + $config.stages.Count + " etapas") -ForegroundColor Green
}
catch {
    Write-Host ("Erro ao carregar config: $_") -ForegroundColor Red
    exit 1
}

try {
    # Step 1: Test authentication
    Write-Host ""
    Write-Host "[1/5] Testando autenticacao..." -ForegroundColor Yellow
    $myself = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/myself" -Headers $headers -Method GET
    Write-Host ("OK - Autenticado como: " + $myself.displayName) -ForegroundColor Green
    
    # Step 2: Configure board columns
    Write-Host ""
    Write-Host "[2/5] Configurando colunas do board (etapas)..." -ForegroundColor Yellow
    
    $stageNames = @()
    foreach ($stage in $config.stages) {
        $stageNames += $stage.columnName
    }
    Write-Host ("Colunas a configurar: " + ($stageNames -join ", ")) -ForegroundColor Gray
    Write-Host "Nota: Board columns requerem configuracao via UI" -ForegroundColor Yellow
    
    # Step 3: Create issue types
    Write-Host ""
    Write-Host "[3/5] Criando issue types..." -ForegroundColor Yellow
    
    $createdCount = 0
    foreach ($issueType in $config.issueTypes) {
        try {
            $itBody = @{
                name = $issueType.name
                description = $issueType.description
                type = "standard"
            } | ConvertTo-Json
            
            $createITResp = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/issuetypes" -Headers $headers -Method POST -Body $itBody -ContentType "application/json" -ErrorAction SilentlyContinue
            Write-Host ("OK - Issue type criado: " + $issueType.name) -ForegroundColor Green
            $createdCount += 1
        }
        catch {
            Write-Host ("Aviso - Issue type " + $issueType.name + ": pode ja existir") -ForegroundColor Yellow
        }
    }
    Write-Host ("Total: " + $createdCount + " tipos criados") -ForegroundColor Gray
    
    # Step 4: Get board info
    Write-Host ""
    Write-Host "[4/5] Verificando informacoes do board..." -ForegroundColor Yellow
    
    try {
        $boardResp = Invoke-RestMethod -Uri "$JiraUrl/rest/agile/1.0/board/$BoardId" -Headers $headers -Method GET
        Write-Host ("OK - Board encontrado: " + $boardResp.name) -ForegroundColor Green
        Write-Host ("Tipo: " + $boardResp.type) -ForegroundColor Gray
        Write-Host ("URL: " + $JiraUrl + "/software/c/projects/" + $ProjectKey + "/boards/" + $BoardId) -ForegroundColor Gray
    }
    catch {
        Write-Host ("Erro recuperando board: $_") -ForegroundColor Red
    }
    
    # Step 5: Summary
    Write-Host ""
    Write-Host "[5/5] Relatorio final..." -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "CONFIGURACAO CONCLUIDA!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Proximos passos (MANUAL):" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Renomear colunas: Board > Board Settings > Columns" -ForegroundColor White
    Write-Host ("   Nomes: " + ($stageNames -join ", ")) -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Vincular issue types: Board > Board Settings > Issue types" -ForegroundColor White
    Write-Host ("   Tipos: " + ($config.issueTypes.name -join ", ")) -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Criar dashboards: Project > Dashboards > Create" -ForegroundColor White
    Write-Host ("   Nomes: " + ($config.dashboards.name -join ", ")) -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Provisionar campos: npm run start -- --dryRun=false" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host ("ERRO: $_") -ForegroundColor Red
    exit 1
}
