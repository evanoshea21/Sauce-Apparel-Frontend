## Overview

This is the front-end repository for an e-Commerce site built for a client using the following tech stack:

- The whole full-stack project was written in Typescript for type-safety and explicit object programming
- React.js bootstrapped with Next.js framework
- Node-Express server for the backend
- Auth.js for client-side authentication and server-side session management via Prisma's Adapter
- MySQL database (paired with Prisma ORM as a querying tool) to store Products, Customers, Accounts (OAuth providers/sessions), etc. All queries can be found in the `/app/api` directory.
- Authorize.net to process payment transactions and to store sensitive user info in their PCI-approved CIM database (customer info manager).

This application provides the store owner with an admin dashboard to Create-Read-Update-Delete products on their database, which includes inventory management of each product's variation (sizes in this case).

What is shown on the customer's side is a traditional e-commerce grid of products, with a dynamic product-details page allowing the customer to configure item variation and quantity before adding items to their cart. An additional feature allows users to save items to navigate to later.

Upon navigating to the checkout page, the user can update their cart, choose their payment method via sign-in or guest checkout, and complete their order via Authorize.net payment processor.

## Authorize.net's SDK was implemented with Node.js and facilitated the following operations:

Note: each operation works through Authorize.net's in-house PCI-approved database for payment processing

1. **Create Profile** -- Save a profile with credit card, address, and email information
2. **Add Card** -- Allows user to save a credit card to their profile for future use
3. **Charge Profile** -- Charge a Customer Profile (#1) by supplying the customer's id, and the payment id associated with the credit card
4. **Charge Card** -- For guest checkout, where a saved profile with saved payment methods aren't provided (#1 and #2)
5. **Refund Profile** -- Refund a Customer Profile (#1) by supplying the customer's id, and the payment id associated with the credit card to be refunded
6. **Get Profile** -- So a logged in user (Client-side with Auth.js) can retrieve their Customer profile on Authorize.net via the same email so they can choose from their saved Payment methods to complete a transaction at checkout

# The Complex Process of Securing a Checkout

Securing and processing an order seemed like a straight-forward operation, or so I thought. Turns out, there's a lot of logic that goes into this user story to avoid inconsistencies with the database. I'll give a few examples I had to account for:

- User A adds an item to their cart, but moments before they complete checkout, User B processes _their_ order, hence clearing out the limited inventory for that item.
- Simultaneously 2 users purchase the same item, hence decrementing the inventory on both ends, but due to limited stock only 1 customer can complete the transaction successfully, in effect canceling one of the orders
- A user has items in their cart with sufficient inventory but upon processing their order, their card gets declined

All of these scenarios are based on 2 async queries with unknown responses:

1. Is there sufficient inventory at the time of purchase?
2. Will the user's payment method work?

### Ordering the API calls to complete a purchase

1. First, a payload object is created that contains [1] the Cart Items, [2] the User's Information, and [3] the Customer's chosen Payment Method
2. Next, an API call is made to verify sufficient inventory. If sufficient inventory DOES exist, the inventory is decremented (put "ON-HOLD" as the transaction is not yet complete). If sufficient inventory DOES NOT exist, a return object provides information indicating the remaining inventory for each item (prompting the user to edit their cart).
3. Finally, the Customer's profile is charged from the payload created in Step #1. If the payment DOES NOT go through, the inventory "ON-HOLD" is re-stocked by incrementing their values to their original amounts. If the payment DOES go through, the purchase is complete
4. As a last step, cart-items (stored in localStorage) are cleared out, and user is shown a Thank You page

The reason I chose to have the inventory put on hold is because it's much more convenient to re-stock inventory after a failed transaction than it is to refund a profile because of insufficient inventory.

Furthermore, querying a SQL database for inventory is much quicker than processing a payment (which has to pass data through multiple institutions). This means less time is shared between simultaneous purchases, which decreases the likelihood of purchases depending on the same limited stock.

By putting inventory on hold for User A before their purchase is even complete, this prevents User B from entering the transaction step (#3) until User A has completed their order.

## Features of the Application

#### Shop owner's Dashboard hosted on the `/admin` page to CRUD Products

Most of the front-end is rendered on the server-side with Next.js's incremental static regeneration which rebuilds pages every 20 seconds to keep content fresh. The /admin page, however, is client-rendered with Products fetched in batches and stored in an array client-side. This makes searching and filtering products lightning-fast. CRUD operations per product are also batched by sending full forms in single payloads, reducing load time and increasing the User Experience.

#### Saved items and Cart items added to LocalStorage

This decision was made for persistence between sessions, regardless of whether a user is signed in. Global state was created with React Context API to update the Cart and Saved (heart) components in the navbar with ease.

#### Email Protected `/admin` page with `.env` variable

A client-side session is accessible app-wide via the Auth.js session provider placed at the DOM's root level. This gives access to the currently signed in user, providing their email, id, etc.

Instead of setting up another login component for the `/admin` page, and creating a new database column to track which users are granted admin access (not to mention needing to create an API route to update this value), I accessed the currently signed in User and cross-checked their email with a comma-separated list of admin emails provided in the `.env` file.

#### Checkout Page

The checkout page is composed of three React components: Cart, Payment, & Checkout.

- **Cart** -- You can update a cart item's quantity or delete it from your cart (stored in localStorage)
- **Payment** -- You can sign in Using Google or Facebook OAuth (or only Github for this sandbox demo instance) to save/retrieve your payment methods. OR you can opt for guest checkout which prompts you for your Billing Address and Credit Card information.
- **Checkout** -- Based on the first two components, your payment info and cart items are loaded into React state to prepare for user checkout. Once checkout is initiated, the chain-reaction of async operations to complete your purchase is kick-started (mentioned above, under _The Complex Process of Securing a Checkout_ section).

#### Consolidated all Types & Utility functions in discrete files

I decided to consolidate all typescript interfaces and utility functions in their own discrete files (`/scripts/Types.ts` & `/app/utils.ts`).

I found this very beneficial to my development process as I could reference interfaces for all my different API payloads very quickly. Creating a single file for all your interfaces also helps new devs entering the project get a quick glance of what data is being passed around your application.

Creating one consolidated file for utility functions also made it extremely easy to reference commonly used functions app-wide, such as retrieving cart Items or mutating price (rounding and adding .00 if no cents provided)
