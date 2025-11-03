# Apple Pay + Stripe Integration Setup

## Current Status

✅ **Code is ready!** The Stripe integration is implemented:
- `PaymentManager.swift` - Handles Stripe PaymentSheet with Apple Pay support
- `AuthorizationView.swift` - Updated with authorization button
- `AppModel.swift` - Tracks authorization status

⚠️ **Requires Stripe SDK** - Follow steps below to add the Stripe SDK to your Xcode project.

## Next Steps to Enable Real Payments

### 1. Add Stripe SDK to Xcode Project

1. Open `PayAttentionClub.xcodeproj` in Xcode
2. Go to **File → Add Package Dependencies...**
3. Enter: `https://github.com/stripe/stripe-ios`
4. Select version: **Latest stable** (or specific version, e.g., `23.0.0`)
5. Add these products:
   - `StripePaymentSheet` ✅
   - `StripeApplePay` ✅
6. Click **Add Package**
7. Build the project to ensure it compiles

### 2. Get Stripe Keys

1. Sign up at [stripe.com](https://stripe.com) (free test account)
2. Go to **Developers → API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Update `PaymentManager.swift`:
   ```swift
   private let stripePublishableKey = "pk_test_YOUR_ACTUAL_KEY_HERE"
   ```
5. Copy your **Secret key** (starts with `sk_test_`) - you'll need this for your backend

### 3. Set Up Merchant ID (for Apple Pay)

1. Go to [developer.apple.com](https://developer.apple.com)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **Merchant ID** (if you don't have one)
   - Identifier: `merchant.com.payattentionclub.app`
4. Update `PaymentManager.swift`:
   ```swift
   request.merchantIdentifier = "merchant.com.payattentionclub.app"
   ```

### 4. Configure Apple Pay Capability in Xcode

1. Select your project in Xcode
2. Select the **PayAttentionClub** target
3. Go to **Signing & Capabilities**
4. Click **+ Capability**
5. Add **Apple Pay**
6. Select your Merchant ID

### 5. Set Up Backend Endpoint

**The backend is REQUIRED** for production. See `STRIPE_BACKEND_SETUP.md` for:
- Backend endpoint implementation examples (Node.js, Python)
- How to create PaymentIntents with authorization holds
- How to capture payments at week settlement

**Update backend URL in `PaymentManager.swift`:**
```swift
private let backendBaseURL = "https://your-backend.com/api"
```

## Testing with Stripe

Once Stripe SDK is added and backend is set up:
1. Use Stripe test cards (e.g., `4242 4242 4242 4242`)
2. PaymentSheet will automatically show Apple Pay if available
3. Authorization hold is placed via Stripe
4. Test mode - no real money is charged

## User Flow

1. User taps **"Authorize" button**
2. Stripe PaymentSheet appears
3. PaymentSheet shows Apple Pay option (if available) or card input
4. User confirms with Face ID/Touch ID (Apple Pay) or enters card details
5. Authorization hold placed via Stripe (backend creates PaymentIntent with `capture_method: 'manual'`)
6. Navigates to Screen Time access screen

## Test Cards (Stripe Test Mode)

Once Stripe is set up, use these test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date, any CVC

## Notes

- **Authorization holds** (not charges) are created using `capture_method: 'manual'`
- The hold amount matches `authorizationAmount` from the app
- Real charges happen at week settlement (Monday noon EST)
- Test mode uses Stripe's test environment (no real money)

