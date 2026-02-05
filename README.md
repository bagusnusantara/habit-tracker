<div align="center">
  <img src="./assets/icon.png" width="100" height="100" style="border-radius: 20%">
  <h1>Habit Tracker</h1>
  <p>Build better habits, one day at a time.</p>

  [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
</div>

<br />

<div align="center">
  <img src="../assets/screenshot.png" width="100%" alt="Habit Tracker Mockup">
</div>

---

This is a Habit Tracker application built with **Expo (React Native)** and **Supabase**.

## Features
- **Authentication**: Sign up and login with Email/Password.
- **Habit Management**: Create and track daily/weekly habits.
- **Automatic Scheduling**: Daily habits are automatically added to your "Today" view.
- **Notifications**: Push notifications reminders (demo implementation).
- **Dark Mode**: Premium dark UI.

## Credits
Created by **Adetiya Bagus Nusantara** (nusantara@its.ac.id) with assistance from **Google Antigravity**.

## Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `db/schema.sql` and run it. This will create the tables and policies.
4. Go to **Project Settings > API**.
5. Copy the **Project URL** and **anon public key**.

### 2. Configure Environment
1. Open `.env` in this directory.
2. Replace the placeholders with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Run the App
```bash
npx expo start
```
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.
- Scan the QR code with Expo Go on your physical device.

## Creating an Android APK

To build a standalone APK that can be installed on Android devices:

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS Build
```bash
eas build:configure
```

### 4. Build APK (Direct Download)
Run this command to generate an APK instead of an AAB (App Bundle):
```bash
eas build --platform android --profile preview
```
*Wait for the build to complete. EAS will provide a link to download the `.apk` file.*

## Notes
- Push notifications require a physical device for full functionality.
- The "automatic scheduling" runs when you open the "Today" tab.
