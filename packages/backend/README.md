#### Serverless offline (npm run dev)
We need to use node version 18

#### Run Prisma migration (creates tables)
> pnpm run migrate:dev

#### Generate prisma client
> pnpm run generate

#### Run the seed (to fill database with dummy data)
> pnpm run seed
If the above does not work then try below command
> pnpm dlx ts-node --transpile-only packages/backend/prisma/seed.ts 

#### Running the prisma studio from local
> npx prisma studio
Prisma studio (UI for postgres db) will be up on http://localhost:5555

#### Seeding the postgres DB with dummy data for local development
FILE: packages/backend/prisma/seed.ts
WHAT IT DOES: Creates dummy data in all the tables.




