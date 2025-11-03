# 🔒 Security Notes - Stripe Keys

## ✅ Safe (Public Keys)

**Publishable Key in PaymentManager.swift** - ✅ SAFE
- Publishable keys (starting with `pk_test_` or `pk_live_`) are **designed to be public**
- They can be safely committed to git
- They can only create PaymentIntents, not access account data
- This is standard practice - all Stripe apps include publishable keys in client code

## ⚠️ Secret Keys - MUST BE PROTECTED

**Secret Key in backend/.env** - ✅ PROTECTED
- `.env` file is in `.gitignore` - ✅ Not tracked by git
- Secret keys (starting with `sk_test_` or `sk_live_`) must NEVER be committed
- They have full access to your Stripe account

## Current Protection Status

✅ **backend/.env** - Protected by `.gitignore`
✅ **PaymentManager.swift** - Contains only publishable key (safe)

## Best Practices

1. ✅ **Never commit `.env` files** - Already protected
2. ✅ **Use environment variables** - Backend uses `.env` file
3. ✅ **Rotate keys if exposed** - If a secret key ever gets exposed, immediately rotate it in Stripe Dashboard
4. ✅ **Use test keys for development** - You're using `test_` keys (good!)
5. ✅ **Separate keys per environment** - Use different keys for test vs production

## If You Accidentally Commit a Secret Key

If you ever accidentally commit a secret key:

1. **Immediately rotate the key** in Stripe Dashboard
2. Remove it from git history: `git filter-branch` or `git-filter-repo`
3. Force push (if already pushed): `git push --force`
4. Never use that key again

## Current Status: ✅ SECURE

Your setup is secure:
- Secret key is in `.env` (ignored by git)
- Publishable key in code is safe (meant to be public)
- Backend uses environment variables properly

