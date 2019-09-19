# Setup

## Prerequisits

- global install of expo-cli (setup with `v3.0.10`)
- node > `v12`
- Optional ways to emulate app
  - Xcode
  - Android studio
  - installed expo app on ios/andriod device
- setup configuration outlined in [config.md](./config.md)

## Install dependencies
- `cd nativeApp`
- `npm install`

## Running Locally
- `cd native app`
- `expo start`
- follow terminal commands to run app:
```
To run the app with live reloading, choose one of:
  • Scan the QR code above with the Expo app (Android) or the Camera app (iOS).
  • Press a for Android emulator, or i for iOS simulator.
  • Press e to send a link to your phone with email.
  • Press s to sign in and enable more options.
```

## Troubleshooting
> This version of the Expo app is out of date. Uninstall the app and run again to upgrade.

The issue is to do with the app that is on the iOS simulator / device is out of date and is not compatible with the current version of Expo that you running.

Delete the Expo app from the the iOS simulator and it should work, or install the latest update if you are on a device

Click:

Hardware > Erase all content and settings
