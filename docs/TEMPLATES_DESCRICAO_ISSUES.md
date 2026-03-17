# 📝 Templates: Descrição de Issues

Modelos prontos para copiar e colar ao criar issues no Jira.

---

## **Instruções Gerais**

Os templates abaixo são **modelos sugeridos**. Você pode:
- ✅ Copiar exatamente como está
- ✅ Adaptar ao seu padrão
- ✅ Preencher os campos entre `[ ]`

**Objetivo:** Garantir que todos os issues tenham informação mínima necessária.

---

## **1. TEMPLATE: CLIENTE** 🏢

Use este template ao criar um novo Cliente.

```
NOME DO CLIENTE: [Nome da Empresa]

INFORMAÇÕES GERAIS
─────────────────
Segmento: [Enterprise / Mid-Market / SMB]
MRR: R$ [Valor]
Quantidade de Usuários: [Número]
Data de Contrato: [DD/MM/YYYY]
Data de Renovação: [DD/MM/YYYY]

CONTATO PRINCIPAL
─────────────────
Nome: [Nome completo]
Email: [email@empresa.com]
Telefone: [+55 11 99999-9999]
Cargo: [Título do cargo]
Área: [Departamento]

CONTEXTO DO NEGÓCIO
───────────────────
Produtos contratados: [Product A, Product B]
Caso de uso principal: [Breve descrição - 1-2 linhas]
Objetivos dos primeiros 90 dias: [3-4 objetivos]
Pessoa referência interna: [Nome da pessoa na sua empresa]

NOTAS
─────
[Qualquer informação adicional relevante]
```

**Exemplo Preenchido:**
```
NOME DO CLIENTE: ACME Corp

INFORMAÇÕES GERAIS
─────────────────
Segmento: Enterprise
MRR: R$ 50.000
Quantidade de Usuários: 150
Data de Contrato: 01/01/2026
Data de Renovação: 30/06/2026

CONTATO PRINCIPAL
─────────────────
Nome: João Silva
Email: joao@acme.com
Telefone: +55 11 98888-7777
Cargo: VP de Operações
Área: Operações

CONTEXTO DO NEGÓCIO
───────────────────
Produtos contratados: Platform Plus, Integrações API
Caso de uso principal: Automação de processos de operações
Objetivos dos primeiros 90 dias:
1. Go-live em 30 dias
2. Adoção de 80% de usuários
3. 2 integrações ativas

Pessoa referência interna: Maria (CSM) - maria@company.com

NOTAS
─────
Cliente foi apresentação por referência. Caso de sucesso potencial.
```

---

## **2. TEMPLATE: INTERAÇÃO** 💬

Use este template ao registrar uma interação com cliente.

```
TIPO DE INTERAÇÃO: [Reunião / Suporte / Feedback / Treinamento / Evento]
DATA: [DD/MM/YYYY]
CLIENTE: [Nome do Cliente]

RESUMO
──────
[2-3 linhas descrevendo o que aconteceu]

PARTICIPANTES
──────────────
Lado cliente: [Nome(s)]
Lado empresa: [Seu nome / Nome de quem participou]

PONTOS PRINCIPAIS
──────────────────
- [Ponto 1]
- [Ponto 2]
- [Ponto 3]

AÇÕES DEFINIDAS
────────────────
- [Ação 1] → Responsável: [Você/Cliente] → Prazo: [Data]
- [Ação 2] → Responsável: [Você/Cliente] → Prazo: [Data]
- [Ação 3] → Responsável: [Você/Cliente] → Prazo: [Data]

PRÓXIMA ETAPA
──────────────
[O que vai fazer para acompanhar? Próxima reunião quando?]

OBSERVAÇÕES
────────────
[Qualquer coisa adicional relevante]
```

**Exemplo Preenchido:**
```
TIPO DE INTERAÇÃO: Reunião
DATA: 01/03/2026
CLIENTE: ACME Corp

RESUMO
──────
Reunião de revisão 60 dias. Cliente muito satisfeito com implementação.
Começou discussão sobre expansão para novos departamentos.

PARTICIPANTES
──────────────
Lado cliente: João Silva, Maria (Finance), Pedro (IT)
Lado empresa: Eu (CSM), Implementação (Tech Lead)

PONTOS PRINCIPAIS
──────────────────
- Adoção: 82% de usuários ativos (acima da meta)
- Feedback: Usuários querem dashboard customizável
- Expansão: 3 departamentos querem usar (Sales, Marketing, HR)
- Estimativa: 200 novos usuários

AÇÕES DEFINIDAS
────────────────
- Passar feedback de dashboard para product team → Responsável: Eu → Prazo: 02/03
- Preparar proposta de expansão → Responsável: Vendas → Prazo: 10/03
- Agendar reunião com finance cliente → Responsável: Eu → Prazo: 08/03

PRÓXIMA ETAPA
──────────────
Reunião com finance do cliente para aprovar expansão. Depois demo dos 3 casos.

OBSERVAÇÕES
────────────
Cliente muito promoter (NPS: 42). Potencial para case study.
Indicou outro cliente em conversa de corredor.
```

---

## **3. TEMPLATE: PLANO DE SUCESSO** 📋

Use este template ao criar um Plano de Sucesso.

```
TÍTULO: [Nome do Plano - ex: Onboarding ACME 90 dias]
CLIENTE: [Nome do Cliente]
PERÍODO: [DD/MM/YYYY] até [DD/MM/YYYY]

OBJETIVO GERAL
───────────────
[1 frase clara - o que você quer conseguir? - ex: Go-live bem-sucedido com 80% adoção]

OBJETIVOS ESPECÍFICOS & ATIVIDADES
──────────────────────────────────

OBJETIVO 1: [Objetivo específico]
├─ Descrição: [Detalhe do objetivo]
├─ Atividades principais:
│  • [Atividade 1]
│  • [Atividade 2]
├─ Responsável: [Você/Time/Cliente]
├─ Prazo: [DD/MM/YYYY]
└─ Status: [Planejado / Em progresso / Concluído]

OBJETIVO 2: [Objetivo específico]
├─ Descrição: [Detalhe do objetivo]
├─ Atividades principais:
│  • [Atividade 1]
│  • [Atividade 2]
├─ Responsável: [Você/Time/Cliente]
├─ Prazo: [DD/MM/YYYY]
└─ Status: [Planejado / Em progresso / Concluído]

OBJETIVO 3: [Objetivo específico]
├─ Descrição: [Detalhe do objetivo]
├─ Atividades principais:
│  • [Atividade 1]
│  • [Atividade 2]
├─ Responsável: [Você/Time/Cliente]
├─ Prazo: [DD/MM/YYYY]
└─ Status: [Planejado / Em progresso / Concluído]

MÉTRICAS DE SUCESSO
────────────────────
- [Métrica 1]: Target [Valor]
- [Métrica 2]: Target [Valor]
- [Métrica 3]: Target [Valor]

RISCOS E MITIGAÇÕES
────────────────────
- [Risco 1] → Mitigação: [Como vai evitar]
- [Risco 2] → Mitigação: [Como vai evitar]

PRÓXIMAS ETAPAS
────────────────
[Resumo das próximas 2 semanas]
```

**Exemplo Preenchido:**
```
TÍTULO: Onboarding ACME 90 dias
CLIENTE: ACME Corp
PERÍODO: 01/01/2026 até 30/03/2026

OBJETIVO GERAL
───────────────
Go-live bem-sucedido com 80% de adoção em 90 dias.

OBJETIVOS ESPECÍFICOS & ATIVIDADES
──────────────────────────────────

OBJETIVO 1: Setup e Configuração Técnica
├─ Descrição: Implementar todas as integrações e configs específicas
├─ Atividades principais:
│  • Setup de ambiente (01-10 jan)
│  • Integrações API (10-20 jan)
│  • Testes e validação (20-31 jan)
├─ Responsável: Time de Implementação
├─ Prazo: 31/01/2026
└─ Status: Concluído ✅

OBJETIVO 2: Treinamento de Usuários
├─ Descrição: Treinar 150 usuários em 3 turmas
├─ Atividades principais:
│  • Turma 1 (10-12 fev)
│  • Turma 2 (13-15 fev)
│  • Turma 3 (18-20 fev)
├─ Responsável: CSM + Training Team
├─ Prazo: 28/02/2026
└─ Status: Em progresso ⏳

OBJETIVO 3: Go-live e Suporte Pós-Lançamento
├─ Descrição: Lançar em produção e oferecer suporte intensivo por 30 dias
├─ Atividades principais:
│  • Go-live em produção (01 mar)
│  • Suporte 24/7 por 14 dias (01-15 mar)
│  • Revisão de problemas (15-30 mar)
├─ Responsável: Support Team + CSM
├─ Prazo: 30/03/2026
└─ Status: Planejado 🔄

MÉTRICAS DE SUCESSO
────────────────────
- Adoção: 80% de usuários ativos
- Problemas críticos: 0 (resolvidos em 48h)
- NPS: 50+ (promoter)

RISCOS E MITIGAÇÕES
────────────────────
- Risco: Integração com SAP demora → Mitigação: Contratou dev externo, começou cedo
- Risco: Baixa participação no treinamento → Mitigação: 3 turmas em horários diferentes

PRÓXIMAS ETAPAS
────────────────
Semana 1: Turma 2 de treinamento (13-15 fev)
Semana 2: Finalize integração SAP, inicie testes
Semana 3: Go-live, monitorar erros
```

---

## **4. TEMPLATE: RISCO** ⚠️

Use este template ao criar um Risco.

```
TÍTULO: [Nome breve do risco - ex: ACME Desengajada]
CLIENTE: [Nome do Cliente]
SEVERIDADE: [Alta / Média / Baixa]

DESCRIÇÃO DO RISCO
──────────────────
[2-3 linhas: o que é o risco? por quê é risco?]

INDICADORES/SINAIS
───────────────────
- [Sinal 1: ex: Health Score caiu de X para Y]
- [Sinal 2: ex: Sem contato há X dias]
- [Sinal 3: ex: Reclamação sobre...]

PROBABILIDADE
──────────────
[Alta / Média / Baixa] - [Explicar por quê]

IMPACTO
────────
[Alto / Médio / Baixo] - [Se virar churn, quanto perde em receita?]

PLANO DE AÇÃO
──────────────
1. [Ação 1] → Responsável: [Você/Time] → Prazo: [Data] → Status: [Planejado]
2. [Ação 2] → Responsável: [Você/Time] → Prazo: [Data] → Status: [Em andamento]
3. [Ação 3] → Responsável: [Você/Time] → Prazo: [Data] → Status: [Planejado]

DATA DE REVISÃO
────────────────
[DD/MM/YYYY - quando vai revisar o status?]

OBSERVAÇÕES
────────────
[Contexto adicional, histórico, etc]
```

**Exemplo Preenchido:**
```
TÍTULO: ACME Desengajada
CLIENTE: ACME Corp
SEVERIDADE: Alta

DESCRIÇÃO DO RISCO
──────────────────
Cliente com baixo engajamento. Health Score caindo. Sem contato há 45 dias.
Histórico: Cliente era muito ativo, mas desde março não tem interação.
Risco de churn em renovação (junho).

INDICADORES/SINAIS
───────────────────
- Health Score: 85 → 60 (queda de 25 pontos em 2 meses)
- Último login: 30 dias atrás
- Interações: 0 nos últimos 45 dias
- Ticket support: Nenhum aberto (era 1-2 por semana)

PROBABILIDADE
──────────────
Alta (70%) - Cliente desapareceu de repente. Algo mudou internamente ou com concorrente.

IMPACTO
────────
Alto - Cliente vale R$ 50k/mês. Se churn, perde R$ 600k/ano.

PLANO DE AÇÃO
──────────────
1. Reunião executiva com João (VP) → Responsável: Eu → Prazo: 10/03 → Status: Agendada
2. Revisar utilização + identificar problema → Responsável: Tech Lead → Prazo: 12/03 → Status: Planejado
3. Oferecer treinamento avançado / suporte extra → Responsável: Training → Prazo: 15/03 → Status: Planejado
4. Check-in semanal até melhorar → Responsável: Eu → Prazo: Toda segunda → Status: Iniciado

DATA DE REVISÃO
────────────────
15/03/2026 - Se não melhorar, escalar para gerente

OBSERVAÇÕES
────────────
Cliente era muito promoter. Algo mudou. Precisa investigar.
Possível que fizeram deal com concorrente ou trocaram de prioridade.
```

---

## **5. TEMPLATE: OPORTUNIDADE** 🚀

Use este template ao criar uma Oportunidade.

```
TÍTULO: [Nome da oportunidade - ex: Upsell ACME Platform Enterprise]
CLIENTE: [Nome do Cliente]

DESCRIÇÃO
──────────
[2-3 linhas: qual é a oportunidade? como surgiu?]

TIPO DE OPORTUNIDADE
─────────────────────
[Upsell / Expansão / Indicação / Advocacy / Outra]

VALOR ESTIMADO
────────────────
R$ [Valor/mês] (novo MRR)
ou
Não monetário - [Descrição: ex: Marketing value, indicação]

PROBABILIDADE DE FECHAR
────────────────────────
[%] - [Explicar: cliente comprometido? Em que etapa?]

PRÓXIMAS ETAPAS
────────────────
1. [Etapa 1] → Responsável: [Você/Vendas] → Prazo: [Data]
2. [Etapa 2] → Responsável: [Você/Vendas] → Prazo: [Data]
3. [Etapa 3] → Responsável: [Você/Vendas] → Prazo: [Data]

TIMELINE ESPERADA
──────────────────
[DD/MM/YYYY] - Expectativa de fechar

CONTEXTO / HISTÓRIA
─────────────────────
[Como surgiu? Quem mencionou? Em que reunião?]

OBSERVAÇÕES
────────────
[Notas adicionais: stakeholders, objeções, etc]
```

**Exemplo Preenchido:**
```
TÍTULO: Upsell ACME - Platform Enterprise
CLIENTE: ACME Corp

DESCRIÇÃO
──────────
Em reunião de 60 dias, cliente (João - VP) comentou que usuários queriam
recursos avançados de relatório. Demo rápida mostrou que Platform Enterprise
resolve 100% da necessidade. Cliente "muito interessado".

TIPO DE OPORTUNIDADE
─────────────────────
Upsell

VALOR ESTIMADO
────────────────
R$ 30.000/mês (novo MRR)

PROBABILIDADE DE FECHAR
────────────────────────
60% - Cliente expressou interesse real, mas precisa de aprovação finance.
Concorrente pode estar oferecendo desconto.

PRÓXIMAS ETAPAS
────────────────
1. Enviar proposta comercial → Responsável: Vendas → Prazo: 25/03
2. Demo com produto & finance cliente → Responsável: Eu + Product → Prazo: 28/03
3. Negociação (se houver objeção) → Responsável: Vendas → Prazo: 30/03-15/04
4. Contrato assinado → Responsável: Legal → Prazo: 20/04

TIMELINE ESPERADA
──────────────────
30/04/2026 - Expectativa de fechar e ir para implantação

CONTEXTO / HISTÓRIA
─────────────────────
Surpreendentemente cliente mencionou isso no meio de uma conversa sobre feedback
de dashboard. João (VP) estava muito receptivo. Falou que isso é prioritário para Q2.
Stakeholders: João (VP Ops), Maria (Finance), Pedro (IT).

OBSERVAÇÕES
────────────
- João é decision maker, está comprometido
- Finance precisa de POV de ROI
- Concorrente pode estar oferecendo desconto (investigar)
- Se ganhar, pode levar para outra divisão (potencial R$ 60k extra)
```

---

## **6. TEMPLATE: RENOVAÇÃO** 🔄

Use este template ao criar uma Renovação.

```
TÍTULO: [Nome da renovação - ex: Renovação ACME 2026]
CLIENTE: [Nome do Cliente]

DATA DE VENCIMENTO
───────────────────
[DD/MM/YYYY]

VALOR ATUAL
────────────
R$ [Valor/mês] = R$ [Valor anual]

VALOR PROPOSTO PARA RENOVAÇÃO
──────────────────────────────
R$ [Valor/mês] = R$ [Valor anual]
(Diferença: +/- R$ [Valor] = +/- [%])

RAZÃO DA MUDANÇA
──────────────────
[Se aumentou: por quê? Expansão? Upsell?]
[Se diminuiu: problema? Cliente pediu desconto?]

STATUS DA RENOVAÇÃO
─────────────────────
[Em negociação / Aprovado / Renovado / Perdido]

TAREFAS/CHECKLIST
──────────────────
- [ ] Reunião de revisão com cliente (data: ___)
- [ ] Proposta comercial preparada (data: ___)
- [ ] Proposta enviada (data: ___)
- [ ] Reunião com finance cliente (data: ___)
- [ ] Objeções tratadas (data: ___)
- [ ] Contrato assinado (data: ___)
- [ ] Novo período iniciado (data: ___)

APRENDIZADOS / OBSERVAÇÕES
────────────────────────────
[Se perdeu: por quê?]
[Se renovou: o que fez bem?]
[Lições para próxima renovação?]
```

**Exemplo Preenchido:**
```
TÍTULO: Renovação ACME 2026
CLIENTE: ACME Corp

DATA DE VENCIMENTO
───────────────────
30/06/2026

VALOR ATUAL
────────────
R$ 50.000/mês = R$ 600.000/ano

VALOR PROPOSTO PARA RENOVAÇÃO
──────────────────────────────
R$ 80.000/mês = R$ 960.000/ano
(Diferença: +R$ 30.000/mês = +50%)

RAZÃO DA MUDANÇA
──────────────────
Adição de 200 novos usuários (3 novos departamentos) em expansão aprovada.
Novo módulo (Platform Enterprise).
Cliente muito satisfeito, quer expandir.

STATUS DA RENOVAÇÃO
─────────────────────
Em negociação

TAREFAS/CHECKLIST
──────────────────
- [x] Reunião de revisão com cliente (data: 01/03) ✅
- [x] Proposta comercial preparada (data: 15/03) ✅
- [ ] Proposta enviada (data: 20/03) - HOJE
- [ ] Reunião com finance cliente (data: 25/03)
- [ ] Objeções tratadas (data: 01/04 estimado)
- [ ] Contrato assinado (data: 30/05 target)
- [ ] Novo período iniciado (data: 01/07)

APRENDIZADOS / OBSERVAÇÕES
────────────────────────────
Cliente muito satisfeito com implementação (review 60d foi excelente).
Health Score: 85 (excelente).
NPS: 42 (promoter).
Indicou 2 outros clientes.

Expectativa: 100% de renovação, possível expansão adicional.
```

---

## **DICAS FINAIS**

✅ **Copie e Cole:**
1. Copie o template inteiro
2. Cole no Jira (campo Descrição)
3. Preencha os [ ]
4. Salve

✅ **Customize Conforme Necessário:**
- Adicione campos específicos do seu negócio
- Remova campos que não faz sentido
- Adapte linguagem para sua cultura

✅ **Use Regularmente:**
- Quanto mais usa, mais rápido fica
- Cria consistência
- Facilita relatórios e análises

✅ **Compartilhe com Time:**
- Mostre para colegas
- Todos preenchem igual
- Dados fica consistente

---

**Pronto! Agora você tem templates prontos para usar. Boa sorte! 🚀**
