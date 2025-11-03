# Pay Attention Club Backend API

Simple Express.js backend for handling Stripe PaymentIntents with authorization holds.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Stripe secret key:

```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

**Get your Stripe keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret key** (starts with `sk_test_`)

### 3. Run the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST `/api/create-payment-intent`

Creates a Stripe PaymentIntent with authorization hold.

**Request:**
```json
{
  "amount": 10000,
  "currency": "usd",
  "capture_method": "manual",
  "description": "Pay Attention Club - Weekly Authorization"
}
```

**Response:**
```json
{
  "client_secret": "pi_xxxxx_secret_xxxxx",
  "payment_intent_id": "pi_xxxxx"
}
```

### POST `/api/capture-payment-intent`

Captures an authorized PaymentIntent (for week settlement).

**Request:**
```json
{
  "payment_intent_id": "pi_xxxxx",
  "amount_to_capture": 5000
}
```

**Response:**
```json
{
  "success": true,
  "payment_intent_id": "pi_xxxxx",
  "amount_captured": 5000
}
```

### POST `/api/release-payment-intent`

Releases/cancels an authorization hold.

**Request:**
```json
{
  "payment_intent_id": "pi_xxxxx"
}
```

## Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date, any CVC

## Deployment

For production, deploy to:
- Heroku
- Vercel
- Railway
- AWS Lambda
- Any Node.js hosting

Update the `backendBaseURL` in `PaymentManager.swift` with your deployed URL.

