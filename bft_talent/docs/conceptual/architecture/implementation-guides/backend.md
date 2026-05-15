# Guia de Implementação — Backend (Laravel 13)

> Base: `laravel-api-kit`. Locale `pt_PT`. Toda a output em PT-PT.

---

## Setup Inicial

```bash
# 1. Copiar kit para apps/api
cp -r laravel-api-kit apps/api
cd apps/api
composer install
cp .env.example .env
php artisan key:generate

# 2. Locale PT-PT
# config/app.php
#   'locale' => 'pt_PT',
#   'fallback_locale' => 'pt_PT',
#   'faker_locale' => 'pt_PT',
# Carbon::setLocale('pt_PT'); no AppServiceProvider::boot()

# 3. Pacotes adicionais
composer require spatie/laravel-permission spatie/laravel-activitylog \
                 laravel/horizon resend/resend-laravel sentry/sentry-laravel \
                 league/flysystem-aws-s3-v3
php artisan vendor:publish --tag=permission-migrations
php artisan vendor:publish --tag=activitylog-migrations
php artisan migrate
```

---

## Mensagens de Validação PT-PT

Criar `lang/pt_PT/validation.php` (ver Laravel docs) com mensagens completas. Exemplo (excerto):

```php
return [
    'required' => 'O campo :attribute é obrigatório.',
    'email'    => 'O campo :attribute deve ser um email válido.',
    'unique'   => 'O :attribute já está em uso.',
    'min'      => [
        'string'  => 'O :attribute deve ter pelo menos :min caracteres.',
        'numeric' => 'O :attribute deve ser pelo menos :min.',
    ],
    // ...
    'attributes' => [
        'email' => 'email',
        'password' => 'palavra-passe',
        'name' => 'nome',
        'telefone' => 'telefone',
        'data_nascimento' => 'data de nascimento',
    ],
    'custom' => [
        'telefone' => [
            'regex' => 'O telefone deve ter o formato +244 9XX XXX XXX.',
        ],
    ],
];
```

---

## Estrutura de Pastas

```
app/
├── Http/
│   ├── Controllers/Api/V1/
│   │   ├── AuthController.php           (kit)
│   │   ├── CandidaturaController.php
│   │   ├── TalentoController.php
│   │   ├── EstagiarioController.php
│   │   ├── BolseiroController.php
│   │   ├── PagamentoController.php
│   │   ├── WorkflowController.php
│   │   ├── TarefaController.php
│   │   ├── FaltaController.php
│   │   ├── VoluntarioController.php
│   │   ├── ActividadeController.php
│   │   ├── HoraController.php
│   │   ├── MentoriaController.php
│   │   ├── AvaliacaoController.php
│   │   ├── DocumentoController.php
│   │   ├── EventoController.php
│   │   ├── MensagemController.php
│   │   ├── NotificacaoController.php
│   │   ├── AnalyticsController.php
│   │   ├── ComplianceController.php
│   │   └── Publico/
│   │       ├── CandidaturaPublicaController.php
│   │       └── PortalCandidatoController.php
│   ├── Requests/Api/V1/
│   ├── Resources/Api/V1/
│   └── Middleware/
├── Models/
├── Services/                           (regras de negócio)
├── Data/                               (DTOs spatie/laravel-data)
├── Policies/
├── Notifications/
└── Jobs/
```

---

## Convenções de Endpoint

- Controllers `__invoke` ou `index/show/store/update/destroy`
- Form Requests por acção (`StoreCandidaturaRequest`, etc.) com `authorize()` + `rules()` + `messages()`
- Resources para output (`CandidaturaResource`, `TalentoResource`)
- Services para lógica complexa (`AdvanceApplicationService`, `ProcessPaymentService`)
- Transações DB explícitas em transições de estado: `DB::transaction(fn () => …)`
- Activity log automático via trait `LogsActivity` nos models críticos

---

## Sanctum + Roles

```php
// Em UserResource:
'role' => $this->role,
'abilities' => $this->getPermissionsViaRoles()->pluck('name'),

// Token com abilities:
$user->createToken('mobile', $user->getPermissionsViaRoles()->pluck('name')->toArray());
```

Middleware `EnsureRole` para alguns endpoints específicos:

```php
Route::middleware(['auth:sanctum', 'role:rh|direcao'])->group(...)
```

---

## Storage S3

`config/filesystems.php` com disk `documents` (S3). Documentos guardados como:

```
documents/{owner_type}/{owner_id}/{document_id}/{version}/{slug}.{ext}
```

URLs assinadas (TTL 5 min) servidas em `GET /documentos/{id}/url`.

---

## Filas e Jobs

- `php artisan horizon` — supervisor
- Jobs:
  - `SendApplicationConfirmationEmail`
  - `NotifyWorkflowApprover`
  - `ProcessSwiftPayment`
  - `RecalculateVolunteerHours`
  - `RebuildOverviewCache`

---

## Testes

Pest. Estrutura:

```
tests/
├── Feature/
│   ├── Api/V1/
│   │   ├── AuthTest.php (kit)
│   │   ├── CandidaturaTest.php
│   │   ├── TalentoTest.php
│   │   ├── ...
│   └── Publico/
└── Unit/
    └── Services/
```

Cada feature: testes para cada role × cada endpoint (positivo + 403/422).

---

## Qualidade

- `./vendor/bin/pest` antes de cada commit
- `./vendor/bin/phpstan analyse --level=max`
- `./vendor/bin/pint --test`
- `./vendor/bin/rector process --dry-run`

CI bloqueia merge se algum falhar.

---

## Seeders (PT-PT)

Os seeders **devem** popular dados em PT-PT realista usando `data.ts` como fonte:

- `ProgramSeeder` — 5 programas + `vol`
- `UniversitySeeder` — todas as universidades de `data.ts`
- `DepartmentSeeder` — 11 departamentos
- `StageSeeder` — 6 fases
- `DemoUsersSeeder` — 1 user por role com password `bfa-2026`
- `TalentSeeder` + `MentorSeeder` + `RotationSeeder` + ...

Comando único: `php artisan db:seed --class=DemoSeeder`.
