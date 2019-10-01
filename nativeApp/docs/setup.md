# Setup

## Prerequisits

- global install of expo-cli (setup with `v3.0.10`)
- node >= `v12`
- Optional ways to emulate app
  - Xcode
  - Android studio
  - installed expo app on ios/andriod device
- setup configuration outlined in [config.md](./config.md)

## Install dependencies
- `cd nativeApp`
- `npm install`

## Running in Locally Development Mode
This app relies on the `twine-api` to work. You have two options for running locally:
- running through an emulator
- running through the expo app on your handheld device

### Emulator
- install Xcode for OSX emulation
- install Android Studio for andoid emulation
- setup the `twine-api` locally (See docs for further details)
- in `/api` use the `npm run dev` script to start local server


- in `/nativeApp` use the script `expo start`
- follow terminal commands to run app:
```
  • Press a for Android emulator, or i for iOS simulator.
```
### On Device
- install Expo from app store or android play
- setup the `twine-api` locally (See docs for further details)
- in `/api` use the `npm run dev-native` script to start local server


- in `/nativeApp` use the script `expo start`
- follow terminal commands to run app:
```
  • Scan the QR code above with the Expo app (Android) or the Camera app (iOS).
```

## Troubleshooting
> This version of the Expo app is out of date. Uninstall the app and run again to upgrade.

The issue is to do with the app that is on the iOS simulator / device is out of date and is not compatible with the current version of Expo that you running.

Delete the Expo app from the the iOS simulator and it should work, or install the latest update if you are on a device

Click:

Hardware > Erase all content and settings
