# AURELIA® Jewellery Backend

Backend written in the same CommonJS + Express + MongoDB + Passport style as the provided project.

## Structure

- `controllers/product.js` — product CRUD controller
- `models/User.js` — buyer/seller user model
- `models/Product.js` — product + author + reviews
- `models/Review.js` — reviews
- `routes/auth.js` — EJS login/register/logout
- `routes/product.js` — EJS product routes
- `routes/cart.js` — EJS cart routes
- `routes/review.js` — EJS review routes
- `routes/api/auth.js` — React login/register/logout/me
- `routes/api/productapi.js` — React product APIs
- `routes/api/cart.js` — React cart APIs
- `routes/api/wishlist.js` — React wishlist APIs
- `routes/api/review.js` — React review API
- `routes/payment.js` — PayU sandbox integration
- `middleware.js` — authentication, seller and ownership middleware

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and set the MongoDB connection and session secret.

## Run

```bash
npm run dev
```

Server runs on port `8080` by default.

## React authentication endpoints

### Register

`POST /api/auth/register`

```json
{
  "username": "Vanisha",
  "email": "vanisha@example.com",
  "password": "secret123",
  "role": "buyer"
}
```

`role` can be `buyer` or `seller`.

### Login

`POST /api/auth/login`

```json
{
  "username": "Vanisha",
  "password": "secret123"
}
```

### Current user

`GET /api/auth/me`

### Logout

`POST /api/auth/logout`

Because Passport uses an Express session, the React frontend should send requests with credentials:

```js
fetch("http://localhost:8080/api/auth/login", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    username,
    password
  })
});
```

## Important

The cart schema intentionally follows the original project and stores product ObjectIds in `User.cart`. It does not yet store quantities.

For production, replace the default session store with MongoDB-backed sessions and use a strong `SESSION_SECRET`.
