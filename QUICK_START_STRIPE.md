# 🚀 Quick Start: Stripe Integration

## Automated Setup (What I Just Did)

✅ Created backend server (`backend/server.js`)
✅ Created backend package.json with dependencies
✅ Created setup script (`backend/setup.sh`)
✅ Created comprehensive setup instructions

## What You Need to Do Now

### 1. Add Stripe SDK to Xcode (Required)

**This must be done manually in Xcode:**

1. Open `PayAttentionClub.xcodeproj` in Xcode
2. Select project → PayAttentionClub target → **Package Dependencies** tab
3. Click **"+"** → Enter: `https://github.com/stripe/stripe-ios`
4. Add packages: `StripePaymentSheet` and `StripeApplePay`
5. Build project (⌘B) to verify

**See `SETUP_INSTRUCTIONS.md` for detailed steps.**

### 2. Set Up Backend (Choose One)

#### Option A: Local Development (Recommended)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add: STRIPE_SECRET_KEY=sk_test_YOUR_KEY
npm start
```

#### Option B: Use Setup Script

```bash
cd backend
./setup.sh
# Then edit .env with your Stripe key
npm start
```

### 3. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy **Publishable key** (`pk_test_...`)
3. Copy **Secret key** (`sk_test_...`)

### 4. Update PaymentManager.swift

```swift
// Line ~45
private let stripePublishableKey = "pk_test_YOUR_KEY_HERE"

// Line ~48 (for local testing)
private let backendBaseURL = "http://localhost:3000"
```

### 5. Test It!

1. Start backend: `cd backend && npm start`
2. Run app in Xcode
3. Go to Authorization screen
4. Tap "Authorize" button
5. Use test card: `4242 4242 4242 4242`

## Files Created

- `backend/server.js` - Express backend API
- `backend/package.json` - Node.js dependencies
- `backend/README.md` - Backend documentation
- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `STRIPE_BACKEND_SETUP.md` - Backend implementation details

## Need Help?

- See `SETUP_INSTRUCTIONS.md` for step-by-step guide
- See `STRIPE_BACKEND_SETUP.md` for backend details
- Check backend logs if API calls fail

