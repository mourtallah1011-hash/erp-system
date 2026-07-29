# ERP Backend — Phase 1 (Socle technique)

## Ce qui est fait ✅
- Structure NestJS modulaire
- Schéma Prisma complet (Company, User/RBAC, Product, Stock, Sale, Purchase, LedgerEntry, AuditLog, RefreshToken)
- Module **Auth** : register, login, refresh (rotation), logout
  - Argon2id pour le hash des mots de passe
  - JWT access token (15 min) + refresh token opaque (7 jours, hashé en DB)
  - Verrouillage de compte après 5 tentatives échouées (15 min)
  - Rate limiting sur `/auth/login` (5 req/min)
  - Journal d'audit (AuditLog) sur les connexions
- Module **Users** de base avec guard RBAC (`@Roles(...)`)
- Swagger sur `/api/docs`
- Docker Compose : API + PostgreSQL + Redis + Nginx

## Démarrage local

```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

API : http://localhost:3000/api/v1
Swagger : http://localhost:3000/api/docs

## Avec Docker

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec api npx prisma migrate deploy
```

## Roadmap (suite)
- [ ] Phase 2 : durcir sécurité (2FA optionnel, gestion multi-société par utilisateur)
- [ ] Phase 3 : module Products/Stocks (CRUD + mouvements de stock + alertes seuil min)
- [ ] Phase 4 : module Sales/POS + Socket.IO temps réel
- [ ] Phase 5 : module Purchases
- [ ] Phase 6 : module Accounting (LedgerEntry, rapprochement)
- [ ] Phase 7 : CRM + Reports (dashboards)
- [ ] Phase 8 : app mobile Flutter + IA

## Notes
- Chaque requête doit être scopée par `companyId` (multi-tenant) — voir `CurrentUser('companyId')`.
- Les rôles RBAC sont dans `prisma/schema.prisma` (`enum RoleName`).
