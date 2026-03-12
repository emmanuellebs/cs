# Arquitetura do projeto jira-cs-provisioning

## Visão geral

O projeto é um provisionador de estrutura de Customer Success no Jira Cloud, escrito em **Node.js + TypeScript**, com foco em:

- Idempotência (reexecução segura)
- Modos **audit-only** e **apply**
- Geração de documentação complementar para configurações manuais.

## Camadas principais

- `config/`: arquivos de configuração (projeto, issue types, campos, filtros, boards, dashboards, runtime).
- `clients/`: clientes HTTP para Jira REST e Jira Agile.
- `services/`: lógica de integração com a API (auth, projeto, issue types, campos, filtros, boards, dashboards, documentação).
- `provisioning/`: (planejado) orquestradores por domínio, coordenando os services.
- `utils/`: utilitários de logging, IO e tipos compartilhados.

## Fluxo principal

1. Carrega runtime (modo audit/apply, dry-run) e configurações de ambiente.
2. Valida autenticação com `/rest/api/3/myself`.
3. Garante a existência do projeto (reutiliza ou cria, conforme modo).
4. Garante issue types, campos, contextos e opções, filtros, board Kanban e dashboards.
5. Gera um relatório estruturado de provisionamento em `outputs/provisioning-summary.*`.
6. Gera documentação complementar em `docs/*.md`.

## Decisões de design

- **Nenhuma falha isolada** interrompe o provisionamento completo; cada item é marcado com `created`, `reused`, `skipped`, `manual` ou `failed`.
- **Workflows e colunas de board** não são configurados por API, apenas documentados.
- **Dashboards e gadgets** são parcialmente automatizados (criação de dashboards) e complementados com blueprint manual.
