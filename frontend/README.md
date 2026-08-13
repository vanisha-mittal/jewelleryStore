# AURELIA® Full React Frontend

This frontend is built specifically for the supplied AURELIA backend.

## Backend expected

The backend should run on:

```text
http://localhost:8080
```

The Vite development server proxies:

- `/api` → `http://localhost:8080`
- `/payment_gateway` → `http://localhost:8080`
- `/payment` → `http://localhost:8080`

This avoids CORS problems during local development.

## Install and run

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Authentication

The backend uses `passport-local-mongoose`, so **login uses `username + password`**, not email + password.

### Sign up

The frontend sends:

```json
{
  "username": "vanisha",
  "email": "vanisha@example.com",
  "password": "secret123",
  "role": "buyer"
}
```

or:

```json
{
  "username": "seller1",
  "email": "seller@example.com",
  "password": "secret123",
  "role": "seller"
}
```

### Login

```json
{
  "username": "vanisha",
  "password": "secret123"
}
```

The frontend uses `credentials: "include"` so Passport's session cookie is sent with API requests.

## Included UI

- Login
- Sign up
- Buyer/Seller selection
- Session-aware header
- Logout
- Product listing
- Category filtering
- Wishlist
- Cart
- Product quick look
- Reviews
- Seller dashboard
- Seller product create/update/delete
- Cinematic AURELIA campaign
- Responsive mobile menu

## Important clarification

There is no `npm run login` or `npm run signup` command in the backend. Login and signup are **HTTP routes**, not terminal commands:

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/me
```

The frontend calls those routes automatically.
