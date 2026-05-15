# Glossário — BFA TalentFlow

Dicionário do domínio. **Toda a UI, mensagens e validações usam estes termos em PT-PT.**

---

## Programas

| ID | Nome oficial | Tipo | Descrição |
|---|---|---|---|
| `fbfa` | Futuro BFA | Trainee | Programa de estagiários internos do BFA — Y1 e Y2, com rotações por departamento |
| `bif` | Bolsa Internacional | Bolsa | Mestrados em universidades estrangeiras de referência (Europa, EUA, Brasil) |
| `bnac` | Bolsa Nacional | Bolsa | Bolsas para licenciaturas em universidades angolanas |
| `mest` | Mestrado Patrocinado | Bolsa | Mestrado parcial ou total custeado pelo BFA |
| `lid` | Programa Liderança+ | Trainee | Pós-graduação em liderança para quadros internos / alumni |

---

## Perfis (Roles)

| Slug | Designação | Acesso |
|---|---|---|
| `rh` | Gestor de Programa / RH | Full + gestão de candidaturas, talentos, pagamentos |
| `direcao` | Direcção de RH | Full read + aprovações executivas |
| `mentor` | Mentor (quadro BFA) | Mentees + sessões + avaliações |
| `bolseiro` | Bolseiro | Portal pessoal (pagamentos, sessões, faltas, tarefas) |
| `estagiario` | Estagiário FBFA | Portal pessoal + rotações |
| `voluntario` | Voluntário | Actividades + registo de horas |

---

## Estados

### Talento (`TalentStatus`)
- `active` — Activo
- `delayed` — Atraso
- `risk` — Em risco
- `completed` — Concluído
- `hired` — Contratado
- `pending` — Pendente
- `onboarding` — Onboarding

### Candidatura (`ApplicationStage`)
- `triagem`
- `entrevista1`
- `entrevista2`
- `avaliacao`
- `aprovacao`
- `oferta`
- `rejeitado`

### Pagamento (`PaymentStatus`)
- `paid` — Pago
- `pending` — Pendente
- `failed` — Falhado
- `hold` — Retido

### Tarefa (`TaskStatus`)
- `pending` — Pendente
- `in_progress` — Em curso
- `done` — Concluída
- `overdue` — Em atraso

### Falta (`AbsenceStatus`)
- `pending` — Pendente
- `approved` — Aprovada
- `rejected` — Rejeitada

### Workflow (`WorkflowStatus`)
- `pending` — Pendente
- `approved` — Aprovado
- `rejected` — Rejeitado

### Rotação (`RotationStatus`)
- `concluida` — Concluída
- `activa` — Activa
- `agendada` — Agendada

### Voluntário (`VolunteerStatus`)
- `activo` — Activo
- `inactivo` — Inactivo
- `desistente` — Desistente

### Actividade (`ActivityStatus`)
- `agendada` — Agendada
- `em_curso` — Em curso
- `concluida` — Concluída
- `cancelada` — Cancelada

### Presença (`PresencaStatus`)
- `presente` — Presente
- `ausente` — Ausente
- `justificado` — Justificado
- `pendente` — Pendente

---

## Termos do Domínio

| PT-PT | EN (interno) | Definição |
|---|---|---|
| Bolseiro | Scholarship student | Beneficiário de bolsa BIF/BNAC/MEST/LID |
| Estagiário | Trainee | Participante FBFA, rotação por departamentos |
| Mentor | Mentor | Quadro BFA que orienta bolseiro/estagiário |
| Mentorado / Mentee | Mentee | Bolseiro ou estagiário acompanhado por mentor |
| Triagem | Screening | 1ª fase de avaliação de candidatura |
| Rotação | Rotation | Período de estágio num departamento (FBFA) |
| Workshop | Workshop | Formação curta institucional |
| Voluntário | Volunteer | Inscrito na Fundação BFA, contributo em horas |
| Actividade | Activity | Acção comunitária organizada pela Fundação |
| 9-Box | 9-Box | Matriz 3x3 de Performance × Potencial |
| Sucessão | Succession | Plano de identificação de sucessores executivos |
| ROI | ROI | Retorno do investimento por programa / talento |

---

## Convenções de Formato

| Tipo | Formato | Exemplo |
|---|---|---|
| Data (UI) | `d/m/Y` | `09/05/2026` |
| Data (API) | `Y-m-d` | `2026-05-09` |
| Hora | `H:i` | `14:30` |
| Telefone Angola | `+244 9XX XXX XXX` | `+244 923 456 789` |
| BI Angola | 9 dígitos + 2 letras + 3 dígitos | `001234567LA001` |
| Moeda local | AOA com `pt_AO` | `380.000,00 Kz` |
| Moeda internacional | USD / EUR | `$1,850.00` |
| Referência candidatura | `A-XXXX` | `A-2451` |
| ID Talento | `T-XXXX` | `T-1042` |
| ID Voluntário | `V-XXXX` | `V-0123` |
| ID Rotação | `ROT-XXX` | `ROT-001` |
| ID Pagamento | `PAY-XXXX` | `PAY-0451` |
