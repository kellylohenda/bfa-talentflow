# Guia de Implementação — Frontend (Next.js 14)

> Mantido o protótipo em `apps/web/`. Trabalho consiste em substituir mocks de `lib/data.ts` por chamadas reais à API V1.

---

## Setup

```bash
cd apps/web
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
pnpm install
pnpm dev
```

---

## Cliente API

Criar `lib/api.ts`:

```ts
const BASE = process.env.NEXT_PUBLIC_API_URL!;

function authHeaders(): HeadersInit {
  if (typeof document === 'undefined') return {};
  const token = document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1];
  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'pt-PT',
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...init?.headers,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body);
  }
  return res.json();
}

export class ApiError extends Error {
  constructor(public status: number, public body: any) {
    super(body?.message ?? 'Erro na API');
  }
}
```

---

## Geração de Tipos TS a partir do OpenAPI

```bash
pnpm add -D openapi-typescript
pnpm openapi-typescript http://localhost:8080/docs/api.json -o types/api.gen.ts
```

Adicionar script `pnpm gen:api`. Tipos manuais em `types/index.ts` mantidos para domínio interno; **tipos da API** vêm de `types/api.gen.ts`.

---

## Substituição de Mocks por Calls API

Padrão por página: trocar `import { ... } from '@/lib/data'` por hooks/server-fetches.

### Server Component

```tsx
// app/(dashboard)/candidaturas/page.tsx
import { api } from '@/lib/api';

export default async function CandidaturasPage() {
  const { data } = await api<{ data: Candidatura[] }>('/candidaturas?include=programa,universidade');
  return <CandidaturasView data={data} />;
}
```

### Client Component (mutations)

```tsx
'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

async function avancarFase(id: string) {
  await api(`/candidaturas/${id}/avancar`, { method: 'POST' });
}
```

---

## i18n (PT-PT only em V1)

- Centralizar strings em `lib/strings.ts` (ou aceitar inline — todo o protótipo já está em PT-PT)
- Datas: `Intl.DateTimeFormat('pt-PT', { dateStyle: 'short' })`
- Moeda: `Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' })`
- Pluralização simples (sem libs) — strings dedicadas onde necessário

---

## Tratamento de Erros

`lib/error-handler.ts`:

```ts
import { ApiError } from './api';
export function handleError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 422) {
      const first = Object.values(e.body.errors ?? {})[0] as string[] | undefined;
      return first?.[0] ?? 'Os dados fornecidos são inválidos.';
    }
    return e.body?.message ?? 'Ocorreu um erro.';
  }
  return 'Ocorreu um erro inesperado.';
}
```

---

## Auth Flow

1. `/login` → `POST /api/v1/login` → guarda `token` em cookie HttpOnly (server action) + `role` no cookie atual
2. `useRole.ts` faz `GET /me` ao montar e cacheia em SWR/React Query (ou estado simples)
3. Logout → `POST /logout` + clear cookies + redirect

---

## Substituição da Mock Layer

Plano por página (M2 → M5):

| Página | Mock importado | Substituição |
|---|---|---|
| `/candidaturas` | `applications`, `stages` | `GET /candidaturas`, `GET /candidaturas/stages` |
| `/talentos` | `talents`, `programs` | `GET /talentos?include=programa,mentor` |
| `/talentos/[id]` | filtra `talents` | `GET /talentos/{id}?include=rotacoes,sessoes,pagamentos` |
| `/estagiarios` | `talents` (kind=estagiario) + `rotations` | `GET /estagiarios?include=rotacoes` |
| `/bolseiro` | composto de mocks | `GET /me/bolseiro` |
| `/pagamentos` | `payments` | `GET /pagamentos` |
| `/workflows` | `workflows` | `GET /workflows?include=steps` |
| `/tarefas` | `tasks` | `GET /tarefas` (filtrado por role) |
| `/faltas` | `absences` | `GET /faltas` |
| `/voluntarios` | `volunteers` | `GET /voluntarios` |
| `/actividades` | `volunteerActivities` | `GET /actividades` |
| `/horas` | `hoursEntries` | `GET /horas` |
| `/agenda` | `eventos` | `GET /eventos` |
| `/mentor` | filtros sobre mocks | `GET /mentoria/sessoes`, `GET /talentos?filter[mentor]=me` |
| `/overview` | `activity` + KPIs | `GET /analytics/overview` |
| `/geografia` | `geo` | `GET /analytics/geografia` |
| `/sucessao` | `nineBox` | `GET /analytics/sucessao` |

---

## Boas Práticas

- Loading skeletons em todas as listas
- Empty states em PT-PT
- Toasts para mutations (componente custom)
- Acessibilidade: `aria-label`, focos visíveis, navegação teclado
- Bundle: evitar libs desnecessárias (já é a regra)
