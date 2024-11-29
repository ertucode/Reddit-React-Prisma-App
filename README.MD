# Demo

- https://reddit.ertu.codes
- To login, use NAME=admin, PASSWORD=password

# How to run?

-   To run this project, you need a postgresql server
-   Change the example.env filenames to .env

    -   Input your db info into the .env file in the server side

## Client side

```
cd client
npm install
npm run start

```

## Server side

```
cd ../server
npm install
npx prisma migrate dev
npm i -g ts-node // If you don't have ts-node(node typescript runner)
npx prisma db seed
npm run watch

```

## Deploy

### Server env

```env
CLIENT_URL=reddit.clientside.com // needed for cors
COOKIE_SECRET=doesntmatter
DATABASE_URL=postgresql connection string
HOST=0.0.0.0 // ???
JWT_SECRET=doesntmatter
```

### Client env

```env
REACT_APP_SERVER_URL=serverurl.com
```

### Locally seeding prod db

-   .env

```env
DATABASE_URL=proddbstring
JWT_SECRET=sameasserver
```

```
npm run install
npx prisma migrate deploy
npm run seed-prod
```
