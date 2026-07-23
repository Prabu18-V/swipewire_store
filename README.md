# Swipewire Store — React E-Commerce Application

A fully functional, responsive e-commerce single-page application built as the
Front-End Developer technical task. Implements product management (CRUD), a
shopping cart, a discount/coupon system, JWT authentication, a checkout & order
summary flow, and a responsive Tailwind UI.

🔗 **Live Demo:** https://stellular-kashata-7288e4.netlify.app
💻 **Source:** https://github.com/Prabu18-V/swipewire-store

**Real backends:** Product data comes from the live
[DummyJSON](https://dummyjson.com/products) REST API (via Axios), and
authentication is handled by [Supabase](https://supabase.com) (real signup/login,
bcrypt-hashed passwords, signed JWTs). If either service is unreachable, the app
gracefully **falls back to a local mock**, so it never breaks in a demo.

---

## Tech Stack

| Concern              | Choice                                        |
| -------------------- | --------------------------------------------- |
| Framework            | React 18 + Vite                               |
| State management     | Redux Toolkit (+ Context API for auth)        |
| Routing              | React Router v6 (dynamic + protected routes)  |
| Forms & validation   | React Hook Form                               |
| HTTP / API           | Axios (with request + response interceptors)  |
| Product API          | DummyJSON (real REST API)                      |
| Authentication       | Supabase (real JWT, hashed passwords)         |
| Styling              | Tailwind CSS                                   |

---

## Getting Started

```bash
npm install     # install dependencies
npm run dev     # start the dev server (opens http://localhost:5173)
```

Other scripts:

```bash
npm run build     # production build → dist/
npm run preview   # preview the production build
```

### Environment variables

Create a `.env` file in the project root (see `.env.example`):

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
VITE_PRODUCT_API_URL=https://dummyjson.com
```

> Without Supabase credentials the app automatically falls back to a local mock
> auth, so it still runs — but real signup/login requires the two Supabase vars.

### Demo login

You can **sign up** with any email + password, or use this demo account:

- **Email:** `swipewire.test2@gmail.com`
- **Password:** `password123`

### Demo coupon codes

| Code         | Effect                                            |
| ------------ | ------------------------------------------------- |
| `WELCOME10`  | 10% off (min cart ₹500, capped at ₹2000)          |
| `FLAT200`    | ₹200 flat off (min cart ₹1000)                    |
| `ELECTRO15`  | 15% off Electronics only                          |
| `EXPIRED`    | Intentionally expired — demonstrates validation   |

---

## Feature Checklist (maps to the task requirements)

### 1. Product Management (CRUD)
- ✅ Create, Read, Update, Delete products (`/admin/products`)
- ✅ All fields: name, price, category, description, image, stock
- ✅ Validation + error handling on every operation
- ✅ Product listing (`/products`) with search + category filter
- ✅ Product detail page (`/product/:id`)

### 2. Shopping Cart
- ✅ Add from listing or detail page
- ✅ Remove items
- ✅ Quantity management with +/- and direct input
- ✅ Invalid quantities prevented (no zero/negative)
- ✅ Automatic price recalculation (subtotal, tax, total)

### 3. Discount & Coupon System
- ✅ Coupon validation: format, expiry, min cart value, eligible categories
- ✅ Percent + flat coupons, with max-discount cap
- ✅ Real-time update of the payable amount
- ✅ Auto-revalidation if the cart changes below a coupon's minimum

### 4. User Authentication (JWT)
- ✅ Login + Signup with form validation & error handling
- ✅ Real JWT-based auth via Supabase (bcrypt-hashed passwords)
- ✅ Session persistence in localStorage
- ✅ Protected routes (checkout, admin)
- ✅ Auto-logout on token expiry (interval check + interceptor)

### 5. Checkout & Order Summary
- ✅ Itemized product list, quantity & per-item price
- ✅ Subtotal, applied discount, tax (GST 18%), final payable
- ✅ Real-time totals reflecting cart changes
- ✅ Shipping form (React Hook Form) + order confirmation

### 6. Responsive UI
- ✅ Fully responsive with Tailwind (mobile → tablet → desktop)
- ✅ Responsive navbar with mobile menu, responsive admin table → cards

---

## React Concepts Demonstrated (the 9 steps)

| # | Requirement          | Where                                                       |
| - | -------------------- | ---------------------------------------------------------- |
| 1 | Hooks                | `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo`, `useCallback` throughout |
|   | Custom hooks         | `hooks/useCart.js`, `hooks/useAuth.js`, `hooks/useCouponForm.js` (useReducer), `hooks/useInfiniteScroll.js` |
| 2 | Routing              | `routes/AppRoutes.jsx` — dynamic `/product/:id`, protected `/checkout`, redirect-after-login |
| 3 | State management     | `redux/` (Redux Toolkit) + `context/AuthContext.jsx`       |
| 4 | API integration      | `services/` — Axios client, interceptors, loading/error states |
| 5 | Authentication (JWT) | `redux/authSlice.js`, `services/supabaseClient.js`, `services/token.js`, auto-logout |
| 6 | Forms & validation   | React Hook Form in login/signup/checkout/product form      |
| 7 | Cart logic           | `redux/cartSlice.js`, `utils/cartCalculations.js`          |
| 8 | Derived state        | `useMemo` for subtotal/tax/discount in `useCart`           |
| 9 | Project structure    | `components / pages / redux / hooks / services / utils / routes / context` |

---

## Project Structure

```
src/
├── components/     # Reusable UI (Navbar, ProductCard, CartItem, CouponInput, …)
├── pages/          # Route-level pages (Products, Cart, Checkout, Login, Admin, …)
├── redux/          # Redux Toolkit store + slices (cart, auth, products)
├── context/        # AuthContext (useContext requirement + auto-logout)
├── hooks/          # Custom hooks (useCart, useAuth, useCouponForm, useInfiniteScroll)
├── services/       # API layer (Axios client, Supabase, DummyJSON, token helpers)
├── utils/          # Pure logic (cart math, coupons, formatting, constants)
├── routes/         # Route config + ProtectedRoute
├── App.jsx
├── main.jsx
└── index.css
```

---

## Highlights beyond the requirements

- **Real REST API integration** — products fetched from DummyJSON via Axios, with
  a normalizer that maps the API's shape to the app's model (anti-corruption layer).
- **Real authentication** — Supabase handles signup/login with hashed passwords
  and signed JWTs; the service layer maps its response to the app's user model.
- **Infinite scroll** — server-side pagination (`limit`/`skip`) with an
  IntersectionObserver-based custom hook.
- **Debounced search** and **skeleton loaders** for a smooth, professional UX.
- **Accessibility** — semantic lists, ARIA labels, keyboard focus rings.
- **Graceful fallback** — degrades to a local mock if a backend is unavailable.
