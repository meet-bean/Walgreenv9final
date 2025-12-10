# 🔍 D-1 Dashboard Diagnostic Script

## Run this in your browser console (F12)

Copy and paste this entire block into your browser console:

```javascript
console.log('=== D-1 DASHBOARD DIAGNOSTIC ===\n');

// Check 1: localStorage
console.log('1️⃣ CHECKING LOCALSTORAGE:');
const stored = localStorage.getItem('customDashboards');
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    console.log('✅ localStorage has', parsed.length, 'dashboard(s)');
    console.log('   Dashboard IDs:', parsed.map(d => d.id));
    const d1InStorage = parsed.find(d => d.id === 'd-1');
    if (d1InStorage) {
      console.log('✅ d-1 IS in localStorage');
      console.log('   Name:', d1InStorage.name);
      console.log('   Sections:', d1InStorage.sections?.length || 0);
    } else {
      console.log('❌ d-1 NOT in localStorage');
    }
  } catch (e) {
    console.error('❌ Failed to parse localStorage:', e);
  }
} else {
  console.log('⚠️ localStorage is EMPTY');
}

console.log('\n2️⃣ CLEAR AND RESET:');
console.log('Run: resetDashboards()');

console.log('\n3️⃣ MANUAL CLEAR:');
console.log('Run: localStorage.clear(); location.reload();');

console.log('\n=== END DIAGNOSTIC ===');
```

## Expected Output

You should see something like:

```
=== D-1 DASHBOARD DIAGNOSTIC ===

1️⃣ CHECKING LOCALSTORAGE:
✅ localStorage has 1 dashboard(s)
   Dashboard IDs: ['d-1']
✅ d-1 IS in localStorage
   Name: Supply Chain Overview
   Sections: 6

2️⃣ CLEAR AND RESET:
Run: resetDashboards()

3️⃣ MANUAL CLEAR:
Run: localStorage.clear(); location.reload();

=== END DIAGNOSTIC ===
```

## If d-1 is NOT in localStorage

Run this command:

```javascript
resetDashboards()
```

Or manually:

```javascript
localStorage.clear();
location.reload();
```

## Check Console Logs

Look for these messages when the page loads:

- `✅ mockData.ts loaded - customDashboards contains:`
- `🔧 Module initialization: Checking localStorage for dashboards...`
- `🔍 getAllCustomDashboards called`
- `🔍 MainApp: getAllCustomDashboards() returned:`

## If You See Errors

Look for any red errors in the console that mention:
- "circular dependency"
- "undefined"
- "cannot read property"
- "D1_SUPPLY_CHAIN_OVERVIEW"

Copy the error and we can fix it.
