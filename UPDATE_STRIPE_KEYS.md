# Update Stripe Keys - Quick Guide

## Step 1: Update Backend .env File

Open `backend/.env` and replace:

```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

With your actual Stripe secret key:

```
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
```

**⚠️ Important:** Never commit this file to git (it's in .gitignore)

## Step 2: Update PaymentManager.swift

Open `PayAttentionClub/PayAttentionClub/Utilities/PaymentManager.swift`

### Find Line ~44 and update:
```swift
private let stripePublishableKey = "pk_test_YOUR_KEY_HERE"
```

Replace with your actual publishable key:
```swift
private let stripePublishableKey = "pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY"
```

### Find Line ~48 and update:
```swift
private let backendBaseURL = "https://your-backend.com/api"
```

For local testing, use:
```swift
private let backendBaseURL = "http://localhost:3000"
```

## Step 3: Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Pay Attention Club Backend API running on port 3000
```

## Step 4: Test in Xcode

1. Build and run the app
2. Navigate to Authorization screen
3. Check consent checkbox
4. Tap "Authorize" button
5. Use test card: `4242 4242 4242 4242`

## Security Notes

- ✅ Publishable key is safe to include in app code
- ✅ Secret key MUST stay in backend .env file only
- ✅ Never commit .env file to git

