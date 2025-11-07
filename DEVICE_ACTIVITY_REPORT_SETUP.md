# DeviceActivityReport Extension Setup

## Why This Is Needed

The DeviceActivity API doesn't allow direct queries for usage data. Instead, you need a **DeviceActivityReport Extension** that the system calls to provide usage information.

## Step 1: Add App Extension Target in Xcode

1. Open Xcode
2. Select your project (PayAttentionClub) in the navigator
3. Click the **+** button at the bottom of the targets list
4. Select **App Extension** → **Widget Extension**
5. Name it: `DeviceActivityReportExtension`
6. Make sure it's embedded in the PayAttentionClub app
7. Click **Finish**

## Step 2: Add DeviceActivityReport Extension File

1. In the new extension target, create a new Swift file
2. Name it: `DeviceActivityReportExtension.swift`
3. See `DeviceActivityReportExtension_Template.swift` in the project root for a template
4. Note: The exact API structure may vary by iOS version - check Apple's documentation
5. Make sure the extension target includes this file (NOT the main app target)

## Step 3: Configure Extension Target

1. Select the **DeviceActivityReportExtension** target
2. Go to **Signing & Capabilities**
3. Add **Family Controls** capability (same as main app)
4. Set Bundle Identifier: `com.payattentionclub.app.DeviceActivityReportExtension`

## Step 4: Update Info.plist

The Widget Extension template should already have the correct Info.plist setup. Verify it includes:
```xml
<key>NSExtension</key>
<dict>
    <key>NSExtensionPointIdentifier</key>
    <string>com.apple.deviceactivity.report</string>
</dict>
```

**Note:** If you're using a Widget Extension, you may need to use a different extension point. Check Apple's documentation for the correct extension type for DeviceActivityReport.

## Step 5: Link Extension

Update `ScreenTimeManager.swift` to use the extension:
- The system will automatically call the extension
- We'll need to access the report data through notifications or shared storage

## Alternative: Simpler Approach

Since DeviceActivityReport is complex, we could:
1. Use the test buttons for now
2. Implement a simpler usage tracking method
3. Or use ManagedSettings to track when apps are blocked/unblocked

## Key Learnings: Time Difference Tracking Implementation

### Overview
Implemented a feature to track and display the time spent on selected apps since they were first selected, showing both total time and the difference (newSpent = timeSpent - initSpent).

### Architecture

1. **Data Flow**:
   - Extension calculates `timeSpent` (total time on selected apps)
   - Stores `initSpent` (baseline) in App Group UserDefaults when selection is first made
   - View calculates `newSpent = timeSpent - initSpent` and displays it

2. **Extension to View Communication**:
   - Extension returns JSON string with both formatted time and raw seconds:
     ```json
     {"formatted":"1h 23m","seconds":4980}
     ```
   - This allows the view to both display formatted time and calculate differences

3. **Baseline Management**:
   - When apps are selected: `SettingsStore.saveSelection()` resets baseline to `nil`
   - When report first loads: Extension checks if baseline exists
   - If baseline is 0 or missing: Extension sets it to current `timeSpent`
   - Baseline stored in App Group UserDefaults: `group.com.screentimefinal2`

4. **Real-time Updates**:
   - Timer in `ReportScreen` refreshes report every 5 seconds
   - Uses UUID key on `DeviceActivityReport` to force refresh
   - `TotalActivityView` updates via `onChange(of: totalActivity)`

### Implementation Details

**TotalActivityReport.swift**:
- Returns JSON with formatted string and raw seconds
- Sets baseline on first load if not already set
- Logs baseline operations for debugging

**TotalActivityView.swift**:
- Parses JSON to extract raw seconds
- Loads `initSpent` from App Group UserDefaults
- Calculates `newSpent = max(0, timeSpent - initSpent)`
- Displays both total time and new time since selection
- Handles case where baseline not yet set

**ReportScreen.swift**:
- Timer refreshes report every 5 seconds
- Uses `.id(reportKey)` with UUID to force refresh
- Cleans up timer on view disappear

**SettingsStore.swift**:
- Resets baseline when new selection is saved
- Uses App Group UserDefaults for sharing between app and extension

### Key Patterns

1. **App Group Communication**: Extension and main app share data via `UserDefaults(suiteName: "group.com.screentimefinal2")`

2. **JSON for Complex Data**: Since `makeConfiguration` returns `String`, use JSON to pass multiple values

3. **Force Refresh**: Changing the `.id()` modifier forces SwiftUI to recreate the view

4. **Baseline Logic**: Check if baseline exists before setting to avoid overwriting

5. **Timer Management**: Always invalidate timers in `.onDisappear` to prevent memory leaks

### UI Display

- **Total Time**: Shows total time spent on selected apps (large, bold)
- **New Time Since Selection**: Shows difference since selection was made (highlighted in blue)
- Handles edge case: Shows message if baseline not yet set

### Testing Notes

- Baseline is set automatically on first report load after selection
- Report refreshes every 5 seconds automatically
- Difference calculation handles negative values (uses `max(0, ...)`)
- Works seamlessly with existing DeviceActivityFilter implementation

