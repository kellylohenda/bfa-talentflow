# Modelo de Negócio — BFA TalentFlow

> Sistema **interno** ao BFA. Não é SaaS comercial. Esta página descreve estrutura de programas, custos típicos e KPIs.

---

## Programas e Volumes (Estimados)

| Programa | Cohort anual | Duração | Bolsa mensal típica | Total invest./talento |
|---|---|---|---|---|
| Futuro BFA (FBFA) | 20–30 | 24 meses | 380.000–420.000 Kz | ~10M Kz |
| Bolsa Internacional (BIF) | 8–12 | 12–24 meses | 1.5M–3.1M Kz (USD/EUR) | 30M–75M Kz |
| Bolsa Nacional (BNAC) | 30–50 | 36–48 meses | 200.000–250.000 Kz | ~10M Kz |
| Mestrado Patrocinado (MEST) | 5–8 | 12–24 meses | 1.6M–3.1M Kz | 25M–60M Kz |
| Liderança+ (LID) | 10–15 | 12 meses | 540.000 Kz | ~7M Kz |
| Voluntariado (Fundação) | 100+ | sem fim | — | apenas custos de actividades |

> **Total ano-base:** ~150–180 talentos activos · 200+ candidaturas/ano · ~120 voluntários activos.

---

## KPIs Executivos (Página Overview)

| KPI | Fórmula | Meta |
|---|---|---|
| Taxa de Retenção | `hired / completed` por cohort | >60% |
| Tempo médio de contratação | dias de `onboarding` até `hired` | <120 dias |
| Custo médio por talento contratado | `Σ pagamentos / nº hired` | <8M Kz (FBFA) |
| Taxa de absentismo | `faltas injustificadas / dias úteis` | <2% |
| GPA médio activo | média de GPA dos `active` | >15.0 |
| Score de risco médio | média de `riskScore` dos `active` | <0.25 |
| Horas de voluntariado/mês | soma `HoursEntry` validadas | >800h |
| ROI do programa | `valor gerado por hired - custo total` | >3× |

---

## KPIs por Programa

| Programa | KPI principal | Threshold de risco |
|---|---|---|
| FBFA | % rotações concluídas no prazo | <85% → review |
| BIF | GPA mantido ≥ 14 | abaixo → contacto urgente |
| BNAC | Conclusão dentro do tempo nominal | atraso → status `delayed` |
| MEST | Defesa de tese no prazo | atraso → status `risk` |
| LID | Conclusão + contratação | <80% → review do programa |

---

## Custos Operacionais

- **Plataforma TalentFlow** (infraestrutura): SaaS / on-prem custos de hosting, BD, S3, monitorização
- **Equipa RH dedicada:** 3–5 FTEs
- **Mentores internos:** sem custo directo (tempo alocado pelo BFA)
- **Eventos/workshops:** ~5M Kz/ano (catering, espaço, formadores externos)
- **Bolsas e estipêndios:** maior componente — variável por programa

---

## Sucessão e Contratação

Pipeline objectivo:

```
Candidatura → Estagiário/Bolseiro → "hired" → Quadro BFA
                                    ↓
                            (LID) → Liderança intermédia
                                    ↓
                            9-Box (high-perf + high-pot) → Sucessor executivo
```

Métrica final: % de directores e quadros C-level que **passaram pelo programa** (objectivo de longo prazo: >40%).
