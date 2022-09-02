-   To run this project, you need a postgresql server
-   Change the example.env filenames to .env

    -   Input your db info into the .env file in the server side

-   Client side

```
cd client
npm install
npm run start

```

-   Server side

```
cd ../server
npm install
npx prisma migrate dev
npm i -g ts-node // If you don't have ts-node(node typescript runner)
npx prisma db seed
npm run watch

```
