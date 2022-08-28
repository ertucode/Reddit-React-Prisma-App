-   To run this project, you need a postgresql server
-   Change the example.env filenames to .env
    -   Input your db info into the .env file in the server side

cd client
npm install
npm run start

cd ../server
npm install
npx prisma migrate dev
npx prisma seed
npm run watch
