# Stripe Backend Setup Guide

## Overview

The iOS app requires a backend endpoint to create Stripe PaymentIntents with `capture_method: 'manual'` (authorization holds). This guide explains what your backend needs to implement.

## Backend Endpoint Required

### POST `/api/create-payment-intent`

**Request Body:**
```json
{
  "amount": 10000,          // Amount in cents (e.g., $100.00 = 10000)
  "currency": "usd",
  "capture_method": "manual",  // Creates authorization hold, not immediate charge
  "description": "Pay Attention Club - Weekly Authorization"
}
```

**Response:**
```json
{
  "client_secret": "pi_xxxxx_secret_xxxxx"
}
```

## Backend Implementation Examples

### Node.js (Express) Example

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', capture_method = 'manual', description } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency,
      capture_method: 'manual', // Authorization hold
      description: description,
      // Optional: Add metadata
      metadata: {
        type: 'authorization_hold',
        app: 'pay_attention_club'
      }
    });
    
    res.json({
      client_secret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Python (Flask) Example

```python
from flask import Flask, request, jsonify
import stripe

app = Flask(__name__)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    try:
        data = request.json
        amount = data.get('amount')
        currency = data.get('currency', 'usd')
        capture_method = data.get('capture_method', 'manual')
        description = data.get('description')
        
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,  # Amount in cents
            currency=currency,
            capture_method='manual',  # Authorization hold
            description=description,
            metadata={
                'type': 'authorization_hold',
                'app': 'pay_attention_club'
            }
        )
        
        return jsonify({
            'client_secret': payment_intent.client_secret
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000)
```

## Important Notes

### Authorization Holds vs Charges

- **Authorization Hold (`capture_method: 'manual'`)**: Places a hold on the card, but doesn't charge immediately
- **Capture**: Later, you can capture the authorized amount (up to the hold amount)
- **Release**: If you don't capture, the hold is automatically released after a few days (varies by card issuer)

### Capture the Authorization (Week Settlement)

When the week ends (Monday noon EST), you'll need to:

1. Calculate the actual penalty based on usage
2. Capture the authorized amount (up to the hold amount)
3. Release any remaining hold

**Example Capture:**
```javascript
// Capture the full authorized amount
await stripe.paymentIntents.capture(paymentIntentId);

// Or capture a specific amount (penalty only)
await stripe.paymentIntents.capture(paymentIntentId, {
  amount_to_capture: actualPenaltyAmountInCents
});
```

### Security Considerations

1. **Never expose your Stripe secret key** in the iOS app
2. **Always validate** the amount on the backend before creating PaymentIntent
3. **Store PaymentIntent IDs** in your database to track authorizations
4. **Implement authentication** to prevent unauthorized requests

### Testing

Use Stripe's test mode:
- **Test publishable key**: `pk_test_...`
- **Test secret key**: `sk_test_...`
- **Test cards**: Use `4242 4242 4242 4242` for successful authorization

### Environment Variables

```bash
# .env file
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

## Next Steps

1. Deploy your backend endpoint
2. Update `backendBaseURL` in `PaymentManager.swift` with your actual backend URL
3. Update `stripePublishableKey` in `PaymentManager.swift` with your Stripe publishable key
4. Test the authorization flow with Stripe test cards

