#!/bin/bash

echo "🔑 Stripe Keys Setup Script"
echo ""

# Check if keys are provided as arguments
if [ $# -lt 2 ]; then
    echo "Usage: ./update-keys.sh <publishable_key> <secret_key>"
    echo ""
    echo "Example:"
    echo "  ./update-keys.sh pk_test_1234... sk_test_5678..."
    echo ""
    exit 1
fi

PUBLISHABLE_KEY=$1
SECRET_KEY=$2

# Update backend .env file
echo "📝 Updating backend/.env with secret key..."
cd backend
if [ -f .env ]; then
    # Replace the STRIPE_SECRET_KEY line
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$SECRET_KEY|" .env
    else
        # Linux
        sed -i "s|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=$SECRET_KEY|" .env
    fi
    echo "✅ Updated backend/.env"
else
    echo "❌ .env file not found. Creating it..."
    echo "STRIPE_SECRET_KEY=$SECRET_KEY" > .env
    echo "PORT=3000" >> .env
    echo "✅ Created backend/.env"
fi

cd ..

# Update PaymentManager.swift
echo "📝 Updating PaymentManager.swift with publishable key..."
PAYMENT_MANAGER="PayAttentionClub/PayAttentionClub/Utilities/PaymentManager.swift"

if [ -f "$PAYMENT_MANAGER" ]; then
    # Escape the key for sed (handle special characters)
    ESCAPED_KEY=$(echo "$PUBLISHABLE_KEY" | sed 's/[[\.*^$()+?{|]/\\&/g')
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|private let stripePublishableKey = \".*\"|private let stripePublishableKey = \"$PUBLISHABLE_KEY\"|" "$PAYMENT_MANAGER"
        sed -i '' 's|private let backendBaseURL = "https://your-backend.com/api"|private let backendBaseURL = "http://localhost:3000"|' "$PAYMENT_MANAGER"
    else
        # Linux
        sed -i "s|private let stripePublishableKey = \".*\"|private let stripePublishableKey = \"$PUBLISHABLE_KEY\"|" "$PAYMENT_MANAGER"
        sed -i 's|private let backendBaseURL = "https://your-backend.com/api"|private let backendBaseURL = "http://localhost:3000"|' "$PAYMENT_MANAGER"
    fi
    echo "✅ Updated PaymentManager.swift"
else
    echo "❌ PaymentManager.swift not found at $PAYMENT_MANAGER"
    exit 1
fi

echo ""
echo "✨ All done! Keys have been updated."
echo ""
echo "Next steps:"
echo "1. Make sure Stripe SDK is added to Xcode project"
echo "2. Start backend server: cd backend && npm start"
echo "3. Build and run the app in Xcode"

