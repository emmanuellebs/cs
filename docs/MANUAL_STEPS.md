# Passos manuais necessários

Este arquivo consolida itens que não puderam ser totalmente provisionados via API no projeto **CSM - WH-CS Management**.

## Itens com status manual/failed

| Recurso | Nome | Status | Detalhes |
| ------- | ---- | ------ | -------- |
| fieldContext:customfield_12076:Contexto CS | Segmento / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12077:Contexto CS | Quantidade de usuários / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12078:Contexto CS | MRR / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12079:Contexto CS | Health Score / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12080:Contexto CS | NPS / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12081:Contexto CS | Engajamento da plataforma / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12082:Contexto CS | Participação CS / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12083:Contexto CS | Participa do programa de Advocacy / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12084:Contexto CS | Data de renovação / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12085:Contexto CS | Produto / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12086:Contexto CS | Data de início da jornada / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12087:Contexto CS | Data do lançamento / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12088:Contexto CS | Data do treinamento / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12089:Contexto CS | Duração do contrato / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12090:Contexto CS | Observações da conta / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12091:Contexto CS | Nome do contato principal / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12092:Contexto CS | Email do contato principal / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12093:Contexto CS | Telefone do contato principal / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12094:Contexto CS | Cargo do contato principal / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12095:Contexto CS | Área do contato principal / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12096:Contexto CS | Ciclo da Conta / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12097:Contexto CS | Tipo de interação / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12098:Contexto CS | Data da interação / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12099:Contexto CS | Resumo da interação / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12100:Contexto CS | Insight coletado / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12101:Contexto CS | Sentimento do cliente / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:customfield_12102:Contexto CS | Próximos passos / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldContext:priority:Contexto CS | Prioridade / Contexto CS | failed | Falha ao garantir contexto de campo. |
| fieldOption:customfield_12076:unknown: | Segmento /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12081:unknown: | Engajamento da plataforma /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12082:unknown: | Participação CS /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12083:unknown: | Participa do programa de Advocacy /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12085:unknown: | Produto /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12096:unknown: | Ciclo da Conta /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12097:unknown: | Tipo de interação /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:customfield_12101:unknown: | Sentimento do cliente /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| fieldOption:priority:unknown: | Prioridade /  | manual | Contexto não disponível. Opções do campo precisam ser configuradas manualmente. |
| filter:boardBase | CSM - Board base | failed | Falha ao criar filtro via API. |
| filter:noRecentInteractions | CSM - Clientes sem interação recente | failed | Falha ao criar filtro via API. |
| filter:openOpportunities | CSM - Oportunidades em aberto | failed | Falha ao criar filtro via API. |
| filter:accountsByLifecycle | CSM - Contas por estágio do lifecycle | failed | Falha ao criar filtro via API. |

## Workflow recomendado (lifecycle da Conta Cliente)

- **Estados principais**: Onboarding → Ativo → Engajamento → Expansão → Advocacy → Renovação → Renovado
- **Estados adicionais**: Risco, Churn

### Recomendações de configuração manual

- Criar um workflow específico para o issue type **Conta Cliente** com os estados acima.
- Habilitar transições:
  - Onboarding → Ativo
  - Ativo → Engajamento → Expansão → Advocacy
  - Advocacy → Renovação → Renovado
  - De qualquer estado não final para **Risco** e **Churn**, conforme regra de negócio.
- Associar o workflow a um workflow scheme aplicado ao projeto de CS.

## Configuração manual do board Kanban

Após a criação do board Kanban (automática ou manual), configurar as colunas para mapear os estados do workflow:

- **Onboarding** → status: Onboarding
- **Cliente Ativo** → status: Ativo
- **Engajamento** → status: Engajamento
- **Expansão** → status: Expansão
- **Advocacy** → status: Advocacy
- **Renovação** → status: Renovação
- **Clientes Renovados** → status: Renovado
- **Risco** → status: Risco
- **Churn** → status: Churn

