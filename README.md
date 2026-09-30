# Offline Student Task / Assignment Tracker

React Native + Expo mobile app for tracking student assignments **offline**.

## Features
- Add, edit, delete assignments
- Mark tasks complete
- Due dates and overdue detection
- Low / Medium / High priority
- Subject and notes
- Home dashboard with progress
- Filters: All / Active / Completed / Overdue
- Local storage using AsyncStorage
- Works without internet after the app is installed
- Android and iOS ready through Expo

## Run on a phone

### 1. Install Node.js
Install Node.js LTS on your computer.

### 2. Install dependencies
Open this folder in VS Code / terminal:

```bash
npm install
```

### 3. Start Expo
```bash
npx expo start
```

### 4. Android phone
Install **Expo Go** on the Android phone, connect the phone and PC to the same Wi-Fi, then scan the QR code shown by Expo.

### 5. Build an installable Android APK
For a real standalone APK, use Expo Application Services (EAS):

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

Then install the generated APK on the phone.

## Data storage
Tasks are saved locally on the device using AsyncStorage. There is no backend and no internet/database account is required.

## Suggested project presentation
For the rubric shown in the provided screenshot:
- Presentation: demonstrate adding an assignment, editing it, marking complete, filtering overdue tasks, and showing the progress dashboard.
- Creativity: emphasize offline-first design, phone-friendly UI, priority labels, progress tracking, and local persistence.
- Technical execution: React Native components + state + AsyncStorage CRUD.
- Documentation: this README explains installation and architecture.
