# Guia Rápido: Criar Board CSM no Jira

## Status Atual
- ✅ Projeto CSM (ID: 10104) - Existente
- ✅ Autenticação - Validada  
- ✅ Filtros JQL - Validados e prontos
- ⏳ Board - Aguarda criação

## Opção 1: Criação via UI (Recomendado - 2 minutos)

### Passo 1: Acessar Projetos
1. Abra https://whd.atlassian.net
2. No menu superior, selecione **Projects** > **CSM**

### Passo 2: Criar Board
1. No menu lateral esquerdo, clique em **Board**
2. Se vazio, clique em **Create board** > **Create a Kanban board**
3. Preencha:
   - **Board name**: `CSM - Lifecycle Kanban`
   - **Board location**: Selecione projeto `CSM`
   - **Clique Create**

### Passo 3: Configurar Colunas
Após criar o board, será mostrado um dialog para configurar colunas:

1. **Coluna 1**: `Onboarding`
   - Status(es) mapeados: Onboarding
   
2. **Coluna 2**: `Active`
   - Status(es) mapeados: In Progress
   
3. **Coluna 3**: `At Risk`
   - Status(es) mapeados: At Risk
   
4. **Coluna 4**: `Renewal`
   - Status(es) mapeados: In Review
   
5. **Coluna 5**: `Done`
   - Status(es) mapeados: Done

**Clique Confirm**

### Passo 4: Configurar Filtro Base (Opcional)
1. No board, clique em **Board settings** (ícone de engrenagem)
2. Na aba **Filter**, Cole:
   ```
   project = CSM
   ```
3. **Clique Save**

## Opção 2: Criação via API PowerShell

Se preferir automatizar, execute:
```powershell
cd c:\Users\emman\cs\cs
powershell -File scripts/create-board.ps1
```

**Nota**: Atualmente requer algumas permissões extras na API.

## Opção 3: Criar Issue Types Manualmente

Antes de poder usar o board com suas issues, crie os tipos:

1. **Project settings** > **Issue types** > **Create issue type**
2. Para cada um:
   - **Conta Cliente** (Description: "Representa um cliente/conta")
   - **Interação** (Description: "Registro de interação com cliente")
   - **Plano de Sucesso** (Description: "Estratégia de sucesso para conta")
   - **Risco** (Description: "Fator de risco identificado")
   - **Oportunidade CS** (Description: "Oportunidade de CS")
   - **Renovação** (Description: "Processo de renovação")
   - **Onboarding Task** (Description: "Tarefa de onboarding")

## Próximos Passos

1. ✅ Criar board Kanban
2. ⏳ Criar issue types customizados (7 tipos)
3. ⏳ Criar campos customizados (38 campos em 6 grupos)
4. ⏳ Configurar dashboards (3 dashboards de relatórios)
5. ⏳ Configurar automações (5 regras de automação)

## Validação

Após criar o board, verifique:
- [ ] Board acessível em Project CSM
- [ ] Colunas configuradas conforme documentação
- [ ] Filtro base funcionando
- [ ] Pode crear issues do tipo padrão

**URL do Board após criação**:
```
https://whd.atlassian.net/software/c/projects/CSM/boards/{boardId}
```

## Documentação Completa

Para detalhes técnicos e screenshots, veja:
- [BOARD_SETUP_GUIDE.md](./BOARD_SETUP_GUIDE.md)
- [MANUAL_STEPS.md](./MANUAL_STEPS.md)
