
#### Summary

* Scaffolded a monorepo with Next.js 15 + shadcn-style UI components on the frontend and Nest.js + PostgreSQL CRUD on the backend.
* Implemented a full Posts API with TypeORM entities, DTOs, validation, and CORS.
* Built a shadcn-inspired UI with create/edit dialog, list cards, and status badges.

#### Key Files

package.json
globals.css
layout.tsx
page.tsx
utils.ts
button.tsx
input.tsx
textarea.tsx
card.tsx
dialog.tsx
badge.tsx
separator.tsx
label.tsx
.env.example
app.module.ts
main.ts
post.entity.ts
posts.controller.ts
posts.service.ts
posts.module.ts
create-post.dto.ts
update-post.dto.ts
.env.example
docker-compose.yml

#### Notes

* shadcn/ui registry init failed due to a network error, so I created the shadcn-style components locally based on the standard patterns.
* Next.js is pinned to 15.2.2 and eslint-config-next to 15.2.2.

#### Run It

1. Start Postgres (optional if you already have one):
```
docker compose up -d
```

2. Backend:
```
(powershell)
cp apps/api/.env.example apps/api/.env
pnpm -C apps/api start:dev
```

3. Frontend:
```
cp apps/web/.env.example apps/web/.env
pnpm -C apps/web dev
```

Frontend runs on http://localhost:3000 and backend on http://localhost:3001.

#### Not Run

Tests or linting.

#### Next Steps

If you want auth or user accounts, I can add JWT-based access.
If you want server actions or React Query for data fetching, I can refactor the frontend.

