# Diagrama de Componentes

```mermaid
flowchart TB
    subgraph "apps/web (Next.js 14)"
        Pages[App Router pages]
        Components[components/ui + layout]
        ApiClient[lib/api.ts - fetch wrapper]
        Pages --> Components
        Pages --> ApiClient
    end

    subgraph "apps/api (Laravel 13)"
        Routes["routes/api/v1.php"]
        Controllers[Controllers/Api/V1]
        FormRequests[Form Requests pt-PT]
        Resources[API Resources]
        DTOs["DTOs (spatie/laravel-data)"]
        Services[Services/Domain]
        Models[Eloquent Models]
        Policies[Policies]
        Notifications[Notifications]
        Jobs[Queue Jobs]
        Routes --> Controllers
        Controllers --> FormRequests
        Controllers --> Services
        Controllers --> Resources
        Services --> DTOs
        Services --> Models
        Services --> Notifications
        Notifications --> Jobs
        Controllers --> Policies
    end

    ApiClient -->|HTTPS Bearer| Routes
    Models --> PG[(PostgreSQL)]
    Jobs --> Redis[(Redis)]
    Notifications --> Resend[Resend]
    Models --> S3[(S3)]
```

---

## Camadas

- **HTTP** — Routes + Controllers + FormRequests + Resources
- **Domínio** — Services (regras), DTOs, Eloquent Models
- **Infra** — Cache (Redis), Queue (Horizon), Storage (S3), Email (Resend)
- **Cross-cutting** — Activity Log (auditoria), Sentry (errors), Pulse (métricas)
