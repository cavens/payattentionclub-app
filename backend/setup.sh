#!/bin/bash

echo "🚀 Setting up Pay Attention Club Backend..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Stripe secret key:"
    echo "   STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm start"
echo ""
echo "Or for development with auto-reload:"
echo "  npm run dev"
echo ""

