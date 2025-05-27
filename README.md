# CRP TypeScript Fastify Backend Server

A production-grade backend server built in **TypeScript**, using **Fastify** and following **Clean Architecture** principles.  
We adopted a custom architecture based on **VIPER**, adapted for backend services: **DICER**.

## 🏛️ Project Architecture: DICER

The architecture is structured in five distinct layers:

| Layer                | Purpose                                                                           |
| -------------------- | --------------------------------------------------------------------------------- |
| **D**ata Layer       | Abstracts persistence: database, external APIs, file systems, etc. (Repositories) |
| **I**nteractor Layer | Business logic, application rules and error handling (Use Cases)                  |
| **C**ontroller Layer | Interface adapters, orchestrates input/output from HTTP (Presenters)              |
| **E**ntity Layer     | Pure data models: DTOs, DMs, and core Models                                      |
| **R**outer Layer     | Handles HTTP endpoints and links requests to controllers                          |

## 🛠️ Why DICER?

**DICER** is derived from **VIPER**, a well-known architecture used in mobile apps.

| VIPER       | DICER (this project)                                                |
| ----------- | ------------------------------------------------------------------- |
| View        | **Removed** (backend doesn't manage UI)                             |
| Interactor  | Interactor                                                          |
| Presenter   | Controller                                                          |
| Entity      | Entity                                                              |
| Router      | Router                                                              |
| _New: Data_ | Added to replace View, responsible for persistence and integrations |

Thus, we designed a **backend-centric VIPER** for web services.

## 📦 Project Structure

<pre>
/src
├── app/               # 🧠 Application core (DICER)
│   ├── routers/       # Route definitions (Fastify endpoints)
│   ├── controllers/   # HTTP request handling (input/output adapter)
│   ├── entities/      # Pure domain models, DTOs, DMs
│   ├── interactors/   # Application use cases (business logic)
│   └── repositories/  # Data access and infrastructure (DB, APIs, etc.)
├── clients/           # Singleton clients (DB, HTTP, Email, etc.)
├── general/           # Managers, helpers, templates, types, enums, etc.
├── migrations/        # Kysely migrations
├── entrypoints/       # CLI entrypoints like `server.entrypoint.ts`
└── docs/              # OpenAPI/Swagger documentation generation
</pre>

## 🧩 Layers Explained

### 1. **Routers**

- **Responsibility:** Define the HTTP routes and map them to controllers.
- **Details:**
  - Register Fastify routes.
  - Attach route-specific middlewares or hooks if necessary.

---

### 2. **Controllers (Presenters)**

- **Responsibility:** Handle incoming HTTP requests and prepare responses.
- **Details:**
  - Validate Fastify request/response objects.
  - Call the appropriate Interactor (use case).
  - Translate use case output into HTTP responses.

---

### 3. **Entities**

- **Responsibility:** Contain **pure** domain data.
- **Subfolders:**
  - `DTOs`: Data Transfer Objects (e.g., Request/Response structures).
  - `DMs`: Data Mappers for database interaction.
  - `Models`: Rich domain models with behavior (if necessary).
- **Details:**
  - No dependencies on frameworks (pure TypeScript classes/interfaces).
  - Always serializable and self-contained.

---

### 4. **Interactors (Use Cases)**

- **Responsibility:** Contain all the application-specific business logic.
- **Details:**
  - Implement the **rules** for interacting with the system.
  - Always pure and testable (no HTTP, DB, etc. here directly).
  - Should only depend on Entities and Interfaces (contracts).

---

### 5. **Repositories (Data)**

- **Responsibility:** Provide data from external sources (DB, APIs, etc.).
- **Details:**
  - Infrastructure adapters (database, third-party APIs, caches).
  - Always exposed through interfaces.
  - Interactors use repositories via **Dependency Inversion**.

## 🔥 Key Features

- 🔒 **Strong Type Safety** with TypeScript — Ensures reliability and maintainability
- 🚀 **Fast and Efficient** HTTP handling using Fastify
- ✅ **Centralized Error Handling** using a custom `ErrorModel`
- 📚 **Automatic OpenAPI 3.0 Docs** generation with `zod-to-openapi`
- 🛡️ **Strict Input Validation** via `Zod` schemas
- 📊 **Structured Logging** with `Pino`
- 🧹 **Clean Codebase** following Clean Architecture and Separation of Concerns (SoC)
- 📦 **Dependency Injection** friendly, enabling better modularity and easier testing
- ⚡ **High Performance** with minimum overhead
- 🛠️ **Built for Scale** and maintainability

## 📚 Principles Followed

The entire project is built respecting **SOLID** principles:

- **S**ingle Responsibility Principle (SRP) — Every class and module has one clear responsibility
- **O**pen/Closed Principle (OCP) — Code is open for extension but closed for modification
- **L**iskov Substitution Principle (LSP) — Derived classes can substitute their base types
- **I**nterface Segregation Principle (ISP) — Interfaces are fine-grained and focused
- **D**ependency Inversion Principle (DIP) — High-level modules are independent of low-level modules

Additionally, the architecture ensures:

- 🧩 **Separation of Concerns (SoC)** — Clear boundary between layers (DICER)
- 🔄 **Reusability and Scalability** — Each module is replaceable and extendable
- 🧪 **Testability** — Components are isolated and easy to unit or integration test
- 🛠️ **Resilience to Change** — Business logic (Interactors) remains independent of infrastructure
- ✈️ **Stateless** — Services remain lightweight and horizontally scalable

## 📋 Tech Stack

- Node.js `v22`
- TypeScript
- Fastify (Server)
- EJS (templating)
- Kysely (SQL Builder)
- Undici (HTTP Client)
- Zod (Schema validation)
- Pino (logging)

## 📈 Example Diagram

<pre>
[Router] → [Controller (Presenter)] → [Interactor (UseCase)] → [Repository (Data)]
                                                 ↓
                                   [Entity (DTOs, DMs, Models)]
</pre>

# 🚀 Quick Start

## 📦 Requirements

- [Node.js 22.x](https://nodejs.org/) (strictly >=22.0.0, <23.0.0)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Docker](https://www.docker.com/) (for local development)
- [Docker Compose](https://docs.docker.com/compose/) (for local development)

## ⚙️ Local Development

### 1. Install dependencies

```bash
yarn install
```

### 2. Create a .env file

You must create a `.env` file at the project root.

Example structure (can be out of date):

```bash
#Node General envs
TZ=''
NODE_ENV=''
NODE_PORT=''
LOG_LEVEL=''

#Credential envs
DB_HOST=''
DB_PORT=''
DB_USER=''
DB_PASSWORD=''
DB_NAME=''

INETUM_USER=''
INETUM_PASSWORD=''

CRP_USER=''
CRP_PASSWORD=''

SMTP_USER=''
SMTP_PASS=''

INFOBIP_API_KEY=''

JWT_SECRET=''

#Endpoint envs
INETUM_CATALOG_URL=''
INETUM_CATALOG_BINDING_URL=''

INETUM_USER_URL=''
INETUM_USER_BINDING_URL=''

INETUM_APPOINTMENT_URL=''
INETUM_APPOINTMENT_BINDING_URL=''

INETUM_HISTORY_URL=''
INETUM_HISTORY_BINDING_URL=''

INETUM_AUTH_URL=''
INETUM_AUTH_BINDING_URL=''

INETUM_FMP_URL=''
INETUM_FMP_BINDING_URL=''

INETUM_RESULTS_URL=''
INETUM_RESULTS_BINDING_URL=''

CRP_TOKEN_URL=''
CRP_IMAGES_URL=''

INFOBIP_BASE_URL=''
```

> ⚠️ Without a valid `.env` file, the server will not start correctly.

### 3. Start full local environment (server + database)

```bash
yarn local
```

This will:

- Start the MySQL database inside Docker
- Build and run the Fastify backend container
- Automatically run database migrations

**Access Points (Port 3000 by default):**

- API Server: http://localhost:3000
- API Docs (Swagger UI): http://localhost:3000/docs

## 🛠️ Useful Development Commands

| Task                                 | Command         | Description                              |
| ------------------------------------ | --------------- | ---------------------------------------- |
| Start full Docker environment        | yarn local      | Start app and DB containers              |
| Stop and clean Docker                | yarn local:down | Remove containers + volumes              |
| Start backend locally without Docker | yarn dev        | Run Fastify locally with nodemon         |
| Manually start the server            | yarn init       | Run src/entrypoints/server.entrypoint.ts |
| Run database migrations manually     | yarn migrate    | Run Kysely migrations                    |
| Rollback database migrations         | yarn rollback   | Rollback Kysely migrations               |
| Build project for production         | yarn build      | Clean and build into dist/               |
| Lint code                            | yarn lint       | Run ESLint on TypeScript files           |
| Check type safety                    | yarn typecheck  | Run TypeScript compiler                  |
