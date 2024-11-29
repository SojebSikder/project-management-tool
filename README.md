# nest-project-management-tool

Building a project-management-tool using nestjs

## Installation

Install all dependencies

```
yarn install
```

## Config
Copy .env.example to .env and config according to your needs.

Migrate database:
```bash
npx prisma migrate dev
```


Seed dummy data to database

```
yarn cmd seed
```

## Running the app

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod

# watch mode with swc compiler (faster)
yarn start:dev-swc
```

## Or just run using docker

[Note: still you have to setup PostgresSQL in your local device. docker will use database from your local network]
```
docker compose up
```

# Api documentation
Postman: https://borabor-1522.postman.co/workspace/e98694fc-0982-4703-a6db-cfc16825b329

Swagger: http://localhost:4000/api/docs

## Used technology
- Typescript
- Nest.js
- Prisma
- PostgresSQL
- Socket.io
- Redis
- etc