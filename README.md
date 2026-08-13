# VELORA® --- Fine Jewellery

```{=html}
<p align="center">
```
`<strong>`{=html}A premium full-stack jewellery e-commerce
platform`</strong>`{=html}
```{=html}
</p>
```
```{=html}
<p align="center">
```
React • Vite • Node.js • Express.js • MongoDB • Mongoose • Passport.js
```{=html}
</p>
```

------------------------------------------------------------------------

## 🎥 Demo Video

> **Watch the complete project demonstration below.**

```{=html}

```
[![VELORA Demo
Video](https://img.shields.io/badge/▶%20Watch-Demo%20Video-black?style=for-the-badge)](https://github.com/YOUR-USERNAME/YOUR-REPOSITORY/blob/main/docs/demo/VELORA-demo.mp4)

**Demo video:** `vanisha-mittal/jewelleryStore/docs/demo/VELORA-demo.mp4`


------------------------------------------------------------------------

## ✨ About The Project

**VELORA®** is a luxury jewellery e-commerce web application designed
around a premium editorial shopping experience.

The platform supports two types of users:

-   **Buyer** --- browse jewellery, view products, manage cart and
    wishlist, write reviews and proceed through the purchase flow.
-   **Seller** --- create and manage jewellery products and edit/delete
    only products owned by the seller.

The frontend and backend are separated into independent applications and
communicate through REST APIs.

------------------------------------------------------------------------

## 🖥️ Features

### Authentication

-   Buyer and Seller registration
-   Login and logout
-   Session-based authentication
-   Current-user authentication state
-   Generic invalid-credentials error handling
-   Role-based authorization

### Jewellery Catalogue

-   Browse all jewellery
-   Category filtering
-   Necklaces
-   Rings
-   Earrings
-   Bracelets
-   Product quick-look
-   Product detail view
-   Luxury editorial UI

### Seller Dashboard / Product Management

Sellers can:

-   Add products
-   Add product image URLs
-   Select jewellery category
-   Set price
-   Add product description
-   View only their own products
-   Edit products
-   Change product category
-   Delete their own products

Product ownership is verified on the backend.

### Cart

-   Add products to cart
-   View cart
-   Remove products
-   Calculate cart total

### Wishlist

-   Add/remove products from wishlist
-   View saved products
-   Wishlist state reflected in product cards

### Reviews

-   Submit product rating
-   Submit review comment
-   Store reviews in MongoDB
-   Associate reviews with products
-   Calculate/display product rating
-   Show success/error messages directly on screen

### Payment

The backend contains the payment gateway integration used by the project
purchase flow.

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   React.js
-   Vite
-   JavaScript
-   CSS
-   Responsive UI

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   Passport.js
-   Passport Local Strategy
-   Express Session
-   CORS

### Database

-   MongoDB
-   MongoDB Atlas
-   Mongoose

### Authentication

-   Passport Local
-   passport-local-mongoose
-   Server-side sessions

### Deployment

-   Vercel --- frontend
-   Render --- backend
-   MongoDB Atlas --- database

------------------------------------------------------------------------

##  Architecture

``` text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  React + Vite       │
                         │  Vercel Frontend    │
                         └──────────┬──────────┘
                                    │
                              REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │  Render Backend     │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌─────────────┐     ┌──────────────┐    ┌─────────────┐
        │  Passport   │     │   Mongoose   │    │   Payment   │
        │  Sessions   │     │    Models    │    │   Gateway   │
        └─────────────┘     └──────┬───────┘    └─────────────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │    MongoDB    │
                           │    Atlas      │
                           └───────────────┘
```

------------------------------------------------------------------------

##  Project Structure

``` text
VELORA/
│
├── backend/
│   ├── controllers/
│   │   └── product.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Review.js
│   │
│   ├── routes/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── productapi.js
│   │   │   ├── cart.js
│   │   │   ├── wishlist.js
│   │   │   └── review.js
│   │   ├── product.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── review.js
│   │   └── payment.js
│   │
│   ├── public/
│   │   └── products/
│   │
│   ├── middleware.js
│   ├── seed.js
│   ├── app.js
│   ├── Schema.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

##  User Roles

### Buyer

A buyer can:

``` text
Register
   ↓
Login
   ↓
Browse Jewellery
   ↓
View Product
   ├── Add to Wishlist
   ├── Add to Cart
   └── Write Review
   ↓
Checkout / Payment
```

### Seller

A seller can:

``` text
Register as Seller
       ↓
      Login
       ↓
Seller Product Management
       ↓
 ┌─────┼─────────────┐
 ▼     ▼             ▼
Create Edit         Delete
       │
       ▼
Only Own Products
```

------------------------------------------------------------------------

## Important API Endpoints

### Authentication

  Method   Endpoint               Description
  -------- ---------------------- -----------------------
  `POST`   `/api/auth/register`   Register buyer/seller
  `POST`   `/api/auth/login`      Login
  `GET`    `/api/auth/me`         Get current user
  `POST`   `/api/auth/logout`     Logout

### Products

  Method     Endpoint               Description
  ---------- ---------------------- -------------------------------
  `GET`      `/api/products`        Get all products
  `GET`      `/api/products/mine`   Get current seller's products
  `GET`      `/api/products/:id`    Get one product
  `POST`     `/api/products`        Create product
  `PATCH`    `/api/products/:id`    Update own product
  `DELETE`   `/api/products/:id`    Delete own product

### Cart

  Method     Endpoint                 Description
  ---------- ------------------------ ----------------
  `GET`      `/api/cart`              Get cart
  `POST`     `/api/cart/:productId`   Add product
  `DELETE`   `/api/cart/:productId`   Remove product

### Wishlist

  Method   Endpoint                         Description
  -------- -------------------------------- -----------------
  `GET`    `/api/wishlist`                  Get wishlist
  `POST`   `/api/product/:productId/like`   Toggle wishlist

### Reviews

  Method   Endpoint                             Description
  -------- ------------------------------------ -------------
  `POST`   `/api/products/:productId/reviews`   Add review

------------------------------------------------------------------------

##  Database Models

### User

``` text
User
├── username
├── email
├── password (managed by Passport)
├── role
├── wishList[]
└── cart[]
```

Roles:

``` text
buyer
seller
```

### Product

``` text
Product
├── name
├── img
├── category
├── price
├── desc
├── avgRating
├── reviews[]
└── author
```

Categories:

``` text
NECKLACES
RINGS
EARRINGS
BRACELETS
```

### Review

``` text
Review
├── rating
├── comment
└── timestamps
```

------------------------------------------------------------------------

##  Running Locally

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

### 2. Install backend dependencies

``` bash
cd backend
npm install
```

### 3. Create backend `.env`

``` env
dbURL=mongodb://localhost:27017/velora-jewellery
SESSION_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=8080
```

If using MongoDB Atlas:

``` env
dbURL=mongodb+srv://<username>:<password>@<cluster-url>/velora-jewellery
```

### 4. Start backend

``` bash
npm start
```

or, if nodemon is configured:

``` bash
npm run dev
```

Backend:

``` text
http://localhost:8080
```

### 5. Install frontend dependencies

Open another terminal:

``` bash
cd frontend
npm install
```

### 6. Create frontend `.env`

``` env
VITE_API_URL=http://localhost:8080
```

### 7. Start frontend

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

##  Seed Default Jewellery Products

The project supports default jewellery data through `seed.js`.

Default products include examples such as:

-   Diamond Tennis Necklace
-   Diamond Drop Earrings
-   Emerald Halo Ring
-   Sculptural Gold Ring

Default product images can be stored inside:

``` text
backend/public/products/
```

The seed file references these images using paths such as:

``` text
/products/product-image.png
```

------------------------------------------------------------------------

## Deployment

### Frontend --- Vercel

Set the following environment variable in Vercel:

``` env
VITE_API_URL=https://YOUR-BACKEND.onrender.com
```

The value should be the **Render backend URL**, not the Vercel URL.

### Backend --- Render

Set:

``` env
NODE_ENV=production
dbURL=YOUR_MONGODB_ATLAS_CONNECTION_STRING
SESSION_SECRET=YOUR_STRONG_SECRET
FRONTEND_URL=https://YOUR-PROJECT.vercel.app
```

Use the exact Vercel deployment origin for `FRONTEND_URL`.

For example:

``` env
FRONTEND_URL=https://velora-jewellery.vercel.app
```

Do not add a trailing `/`.

### Production Request Flow

``` text
Vercel
  │
  │ VITE_API_URL
  ▼
Render Backend
  │
  │ dbURL
  ▼
MongoDB Atlas
```

Because authentication uses cookies/sessions, the production backend
must allow the Vercel frontend through CORS with credentials.

------------------------------------------------------------------------

## Security

-   Passwords are handled using Passport Local /
    passport-local-mongoose.
-   Seller routes require authentication.
-   Product modification requires seller authorization.
-   Product ownership is checked before editing/deleting.
-   CORS is restricted using `FRONTEND_URL`.
-   Production sessions use secure cookies.
-   Login errors use a generic invalid-credentials response.
-   Database credentials and session secrets are stored in environment
    variables.

------------------------------------------------------------------------


------------------------------------------------------------------------

## Product Images

Default product images are included as backend static assets.

Example:

``` text
backend/
└── public/
    └── products/
        ├── diamond_tennis_necklace.png
        ├── diamond_drop_earrings.png
        ├── emerald_halo_ring.png
        └── sculptural_gold_ring.png
```

Images are served by Express and accessed from the frontend through the
backend API/base URL.

------------------------------------------------------------------------

##  Main Test Scenarios

### Authentication

-   Register as Buyer
-   Register as Seller
-   Login with valid credentials
-   Login with invalid credentials
-   Logout
-   Check current session

### Seller

-   Create product
-   Select category
-   View own products
-   Edit product
-   Change category
-   Delete product
-   Attempt to modify another seller's product

### Buyer

-   Browse products
-   Filter by category
-   Open quick look
-   Add to cart
-   Remove from cart
-   Add/remove wishlist item
-   Add review

### Deployment

-   Verify Vercel → Render API communication
-   Verify CORS
-   Verify session cookies
-   Verify MongoDB Atlas connection
-   Verify product images
-   Verify authentication after deployment

------------------------------------------------------------------------

##  Important Environment Variables

### Frontend

``` env
VITE_API_URL=
```

### Backend

``` env
dbURL=
SESSION_SECRET=
FRONTEND_URL=
NODE_ENV=
PORT=
```

Never commit `.env` files or database credentials to GitHub.


------------------------------------------------------------------------

## 👩‍💻 Author

**VELORA® --- Fine Jewellery**

A full-stack e-commerce project demonstrating:

-   Frontend development
-   REST API development
-   Authentication
-   Role-based authorization
-   MongoDB database design
-   E-commerce functionality
-   API integration
-   Production deployment

------------------------------------------------------------------------

