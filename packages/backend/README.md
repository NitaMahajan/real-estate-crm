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

#### Pushing to db: good for local
> npx prisma db push


## APIs Available :-

Register an agent in the portal

> curl --location 'http://localhost:3001/auth/register' \ --header 'Content-Type: application/json' \ --data-raw '{ "name": "Nov21SecondAgent","email": "nov21second@local","password": "Nov21SecondAgent123"}'

Response
{
    "agent": {
        "id": "f6..",
        "name": "Nov21SecondAgent",
        "email": "nov21second@local",
        "role": "AGENT",
        "createdAt": "timestamp"
    }
}

Login an agent in portal

curl --location 'http://localhost:3001/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{"email":"nov21second@local","password":"Nov21SecondAgent123"}'

Response
{
    "accessToken": "ey..",
    "refreshToken": "ey..",
    "user": {
        "id": "f6..",
        "name": "Nov21SecondAgent",
        "email": "nov21second@local",
        "role": "AGENT"
    }
}


