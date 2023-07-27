## Overview

This is a repo to test Authorize.net's SDK functions to complete transactions and to store sensitive user info in their PCI-approved CIM database (customer info manager).

The code is written in a basic React frontend bootstrapped by Next.js.
The backend is a node-express server written in typescript.

1. First run `npm i` to install dependencies
2. To spin up front-end, run `npm run dev`.
3. To spin up backend, first fill in `.env` values based on the `.env.sample` file. Then run `npx nodemon server/index.ts`
4. Need to migrate your prisma schema to your local SQL database. First edit the `database_url` and `shadow_database_url` inside your `.env` file. Then run `npx prisma migrate dev --name <nameYourMigration>`. Finally, check run a sql command to see that your local MySQL is showing your database with apt tables.
5. You should be ready to go. Go to `/products` page, add products to cart. Then go to `/checkout` page and you should see cart items. Login via Github, then fill out form and submit to create a customerProfile with Authorize.net. Then it should present your available credit cards (will just be 1) highlighted in pink as the selected card.
6. You can now click the `Checkout Button` and see if the transaction goes through (UI message, and check authorize.net dashboard under `CIM>User>History>Invoices`)

Now you can call API by clicking UI button on localhost server in browser.

![Graphic](/public/customerProfile.jpg)
