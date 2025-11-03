# Stripe Integration Setup - Step by Step

Follow these steps in order to complete the Stripe integration.

## Step 1: Add Stripe SDK to Xcode Project

**⚠️ This must be done in Xcode - cannot be automated**

1. Open `PayAttentionClub.xcodeproj` in Xcode
2. Select the project in the navigator (top item)
3. Select the **PayAttentionClub** target
4. Go to **"Package Dependencies"** tab
5. Click the **"+"** button
6. Enter: `https://github.com/stripe/stripe-ios`
7. Click **"Add Package"**
8. Select version: **Up to Next Major Version** (or latest stable)
9. Click **"Add Package"** again
10. Select these products:
    - ✅ `StripePaymentSheet`
    - ✅ `StripeApplePay`
11. Click **"Add Package"**
12. Build the project (⌘B) to verify it compiles

## Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Sign in or create a free account
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

**⚠️ Important:** Use test keys for development. They start with `test_` and don't charge real money.

## Step 3: Update PaymentManager.swift

Open `PayAttentionClub/PayAttentionClub/Utilities/PaymentManager.swift` and update:

```swift
// Line ~45: Replace with your Stripe publishable key
private let stripePublishableKey = "pk_test_YOUR_ACTUAL_KEY_HERE"

// Line ~48: Replace with your backend URL
// For local testing: "http://localhost:3000"
// For production: "https://your-backend.com"
private let backendBaseURL = "http://localhost:3000"
```

## Step 4: Set Up Backend Server

### Option A: Local Development (Recommended for Testing)

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
   ```

5. Start the server:
   ```bash
   npm start
   ```

   Server will run on `http://localhost:3000`

### Option B: Deploy to Production

Deploy the `backend/` folder to your hosting service (Heroku, Vercel, Railway, etc.) and update `backendBaseURL` in `PaymentManager.swift` with your deployed URL.

## Step 5: Set Up Apple Pay Merchant ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list/merchant)
2. Click **"+"** to create a new Merchant ID
3. Enter identifier: `merchant.com.payattentionclub.app`
4. Click **"Continue"** and **"Register"**
5. In Xcode:
   - Select your project
   - Select **PayAttentionClub** target
   - Go to **"Signing & Capabilities"** tab
   - Click **"+ Capability"**
   - Add **"Apple Pay"**
   - Select your Merchant ID: `merchant.com.payattentionclub.app`

## Step 6: Update Merchant ID in Code

In `PaymentManager.swift`, update the merchant ID:

```swift
// Line ~117: Should match your Apple Developer Merchant ID
configuration.applePay = .init(
    merchantId: "merchant.com.payattentionclub.app",
    merchantCountryCode: "US"
)
```

## Step 7: Test the Integration

1. Build and run the app in Xcode
2. Navigate to Authorization screen
3. Check the consent checkbox
4. Tap "Authorize $X.XX"
5. PaymentSheet should appear
6. Use test card: `4242 4242 4242 4242`
7. Any future expiry date, any CVC
8. Authorization should complete successfully

## Troubleshooting

### "Cannot find type 'PaymentSheet'"
- Make sure Stripe SDK packages are added in Xcode
- Clean build folder (⌘⇧K) and rebuild

### "Backend request failed"
- Check that backend server is running (`npm start` in backend folder)
- Verify `backendBaseURL` in `PaymentManager.swift` matches your server URL
- Check backend logs for errors

### "Apple Pay not available"
- Make sure Apple Pay capability is added in Xcode
- Merchant ID must be configured correctly
- Test on a real device (simulator may not support Apple Pay)

### "Invalid Stripe key"
- Verify you're using test keys (start with `test_`)
- Check that keys are correctly pasted (no extra spaces)

## Next Steps

Once everything is working:
- Deploy backend to production
- Update `backendBaseURL` to production URL
- Switch to live Stripe keys (when ready for production)
- Test with real cards (in test mode first)

