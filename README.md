---

## 🔐 Environment Variables

Create a `.env.local` file in the project root and add the following environment variables.

### 🗄️ Database

```env
DATABASE_URL="your_postgresql_database_url"
```

### 🔑 Kinde Authentication

```env
KINDE_CLIENT_ID="your_kinde_client_id"
KINDE_CLIENT_SECRET="your_kinde_client_secret"
KINDE_ISSUER_URL="your_kinde_issuer_url"
KINDE_SITE_URL="http://localhost:3000"
KINDE_POST_LOGOUT_REDIRECT_URL="http://localhost:3000"
KINDE_POST_LOGIN_REDIRECT_URL="http://localhost:3000/auth/callback"
```

### 💳 Stripe Payments

```env
STRIPE_SECRET_KEY="your_stripe_secret_key"

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"

STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

### 📅 Stripe Subscription Plans

```env
STRIPE_MONTHLY_PLAN_LINK="your_stripe_monthly_plan_link"
STRIPE_YEARLY_PLAN_LINK="your_stripe_yearly_plan_link"

STRIPE_MONTHLY_PRICE_ID="your_stripe_monthly_price_id"
STRIPE_YEARLY_PRICE_ID="your_stripe_yearly_price_id"

NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL="your_stripe_customer_portal_url"
```


---
