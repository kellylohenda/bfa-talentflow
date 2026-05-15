# Guia de Deploy — BFA TalentFlow

---

## Ambientes

| Ambiente | URL API | URL Web | Branch | Auto-deploy |
|---|---|---|---|---|
| Local | `http://localhost:8080` | `http://localhost:3000` | qualquer | manual |
| Staging | `https://api-staging.talentflow.bfa.ao` | `https://staging.talentflow.bfa.ao` | `develop` | sim |
| Produção | `https://api.talentflow.bfa.ao` | `https://talentflow.bfa.ao` | `master` | sim (com aprovação manual) |

---

## Dev Local

### Backend

```bash
cd apps/api
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve --port=8080
```

### Frontend

```bash
cd apps/web
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
pnpm install
pnpm dev
```

### Docker (alternativa ao local)

```bash
docker compose up -d
docker compose run --rm api php artisan migrate --seed
```

---

## Staging

### Pré-requisitos

- Servidor Linux (Ubuntu 22.04+) com 2 vCPU / 4 GB RAM
- PostgreSQL 16
- Redis 7
- Nginx + TLS (Let's Encrypt)
- Domínios apontados

### Variáveis de ambiente críticas (API)

```env
APP_ENV=staging
APP_KEY=base64:...
APP_URL=https://api-staging.talentflow.bfa.ao
APP_LOCALE=pt_PT
APP_FALLBACK_LOCALE=pt_PT
DB_CONNECTION=pgsql
DB_HOST=...
DB_DATABASE=bfa_talentflow_staging
SANCTUM_STATEFUL_DOMAINS=staging.talentflow.bfa.ao
SESSION_DOMAIN=.talentflow.bfa.ao
RESEND_API_KEY=...
QUEUE_CONNECTION=redis
REDIS_HOST=...
S3_BUCKET=bfa-talentflow-staging-docs
SENTRY_LARAVEL_DSN=...
```

### Pipeline

GitHub Actions (`.github/workflows/staging.yml`):

1. Push para `develop` → corre testes (Pest) + análise estática (PHPStan max) + Pint
2. Build da imagem Docker da API
3. Build do Next.js (`pnpm build`)
4. Deploy via SSH para o servidor de staging
5. `php artisan migrate --force`
6. `php artisan queue:restart`
7. `php artisan octane:reload` (se Octane activo)
8. Smoke test (cURL nos endpoints críticos)

---

## Produção

### Diferenças vs Staging

- Aprovação manual no GitHub Actions antes do deploy
- Backup automático do PostgreSQL antes de cada migration
- Window de deploy: 22:00–05:00 (Luanda) salvo emergência
- Sentry com alertas para errors P1/P2
- Rate limiting reforçado (throttle por IP + user)
- WAF / Cloudflare à frente do Nginx

### Backup

- PostgreSQL: `pg_dump` diário, retenção 30 dias, replicado para S3 (Wasabi/AWS)
- Storage S3: versionamento activo, retenção 1 ano
- Restore testado mensalmente em staging

### Observabilidade

- Laravel Pulse — dashboard interno
- Sentry — error tracking
- Logs estruturados (JSON) → CloudWatch / Loki
- Health endpoint: `GET /health` (200 OK + DB/Redis check)

---

## Rollback

1. Identificar release SHA anterior estável
2. Re-trigger workflow com input `target_sha`
3. Migration rollback **só se** explicitamente seguro: `php artisan migrate:rollback --step=N`
4. Cache busting de Next.js no CDN

> Política: em caso de dúvida, fazer **forward fix** em vez de migration rollback.

---

## Segurança

- TLS 1.3 obrigatório
- HSTS: `max-age=31536000; includeSubDomains; preload`
- CSP estrita no Next.js
- CORS restrito aos domínios oficiais
- Sanctum com SPA cookie + token bearer (mobile)
- Secrets em vault (Bitwarden Secrets / Doppler / AWS Secrets Manager)
- 2FA obrigatório para roles `rh` e `direcao` (M3+)
- Auditoria via spatie/activitylog em todas as transições de estado críticas
