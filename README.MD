-   To run this project, you need a postgresql server
-   Change the example.env filenames to .env

    -   Input your db info into the .env file in the server side

# Client side

```
cd client
npm install
npm run start

```

# Server side

```
cd ../server
npm install
npx prisma migrate dev
npm i -g ts-node // If you don't have ts-node(node typescript runner)
npx prisma db seed
npm run watch

```

# Deploy

-   Find a site to deploy client
-   Find a site to deploy server
-   Find a site to create postgresql db

## Server env

```env
CLIENT_URL=deployedsite.com // needed for cors
COOKIE_SECRET=doesntmatter
DATABASE_URL=database string provided by the site
HOST=0.0.0.0 // ???
JWT_SECRET=doesntmatter
```

## Client env

```env
REACT_APP_SERVER_URL=serverurl.com
```

## Locally seeding prod db

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
