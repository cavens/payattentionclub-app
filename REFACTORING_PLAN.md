# Refactoring Plan - Pay Attention Club App

## Strategy: Incremental, Tested Changes

### Phase 1: Constants & Configuration (Low Risk)
**Goal:** Extract magic numbers and strings into constants

1. **PaymentManager.swift**
   - Extract Stripe keys to configuration
   - Extract merchant ID
   - Extract backend URL
   - Extract error domains/codes

2. **AppModel.swift**
   - Extract default values (14.0h, $0.10/min)
   - Extract UserDefaults keys
   - Extract timezone identifier

3. **Views**
   - Extract hardcoded strings to constants
   - Extract colors/sizes if needed

**Risk:** ⭐ Low - Just moving values, no logic changes

---

### Phase 2: Code Organization (Medium Risk)
**Goal:** Better separation of concerns

1. **AppModel.swift** (446 lines - too large?)
   - Split into smaller concerns:
     - `AppModel` - Core state
     - `WeekManager` - Week calculations, timers
     - `PenaltyCalculator` - Penalty logic
   
2. **PaymentManager.swift** (456 lines - manageable)
   - Already well-organized
   - Maybe extract error handling

3. **Views**
   - Check if any view is too large (>200 lines)
   - Extract reusable components

**Risk:** ⭐⭐ Medium - Need to test navigation and state flow

---

### Phase 3: Error Handling (Low Risk)
**Goal:** Consistent error handling

1. Create `AppError` enum
2. Standardize error messages
3. Better error logging

**Risk:** ⭐ Low - Mostly additive

---

### Phase 4: Testing Helpers (Low Risk)
**Goal:** Clean up testing code

1. Move testing helpers to separate file
2. Use feature flags instead of hardcoded buttons
3. Better organization

**Risk:** ⭐ Low - Testing code only

---

## Recommended Approach

**Start with Phase 1** - It's the safest and gives immediate benefits:
- Easier to change configuration
- Better code readability
- No logic changes = low risk

**Then Phase 3** - Improve error handling
- Better debugging
- Better user experience
- Low risk

**Phase 2** can wait - AppModel works fine, splitting it is optional

**Phase 4** - Clean up testing code when ready

---

## Safety Checklist Before Each Change
- [ ] Commit current state
- [ ] Understand what you're changing
- [ ] Make one change at a time
- [ ] Test immediately after change
- [ ] If breaks, revert immediately

