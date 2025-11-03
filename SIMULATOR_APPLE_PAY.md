# Apple Pay in iOS Simulator - How to Confirm

## Confirming Payment in Simulator

In the iOS Simulator, when PaymentSheet asks for confirmation:

### Method 1: Touch ID Simulation (Recommended)
1. When PaymentSheet shows the confirmation prompt
2. Go to **Device → Touch ID → Enrolled** (if not already)
3. Go to **Device → Touch ID → Matching Touch**
4. This will simulate a successful Touch ID confirmation

### Method 2: Face ID Simulation
1. Go to **Device → Face ID → Enrolled**
2. Go to **Device → Face ID → Matching Face**

### Method 3: Use Test Cards with Full Details
- When entering test card details, make sure to fill in:
  - Card number: `4242 4242 4242 4242`
  - Expiry: Any future date (e.g., 12/25)
  - CVC: Any 3 digits (e.g., 123)
  - **Address**: Fill in a complete address
    - Street: `123 Test Street`
    - City: `San Francisco`
    - State: `CA`
    - ZIP: `94102`
    - Country: `United States`

### Method 4: Simulator Menu
- **Features → Touch ID → Matching Touch**
- Or use the keyboard shortcut shown in the menu

## Notes

- In the simulator, you can't physically double-click the side button
- Use Touch ID/Face ID simulation instead
- Make sure to fill in complete address details for test cards
- Apple Pay will work the same way on a real device (double-click side button)

## Troubleshooting

If PaymentSheet isn't showing:
- Make sure you have a test card added in Wallet (simulator)
- Or use the card input form in PaymentSheet
- Fill in all required fields including address

