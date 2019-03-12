# Build & Signing

## Android
### Requirements
* ionic v4.2.1 (Use `npm`)
* cordova v8.0.0 (Use `npm`)
* cordova-android@7.0.0 (See below)
* Android Studio v3.2.1 (Install manually)
* Gradle v4.10.2 (Install manually using `brew` or `apt-get`)

### Build
In the project directory, run:
```sh
$ ionic cordova platforms rm android
$ ionic cordova platforms add android
```
After this finishes, check the `package.json` for the package named `cordova-android`. It should have verison `7.0.0`. If it has a different verison number, remove the Android platform again specify the version number when adding:
```sh
$ ionic cordova platforms add android@7.0.0
```
Having installed Android Studio, set the `JAVA_HOME` environment variable to point to the home directory for the bundled JRE. On macOS:
```
/Applications/Android Studio.app/Contents/jre/jdk/Contents/Home
```
Now run
```sh
$ ionic cordova build android
```
To produce a debug build.

### Production Build
1. Open Android Studio in the `/platforms/android` directory
1. Select _"Build"_ > _"Generate Signed Bundle / APK"_
1. Select _"APK"_
1. Enter the keystore details
1. Choose both signature versions (V1 and V2)
1. Press _"Finish"_
1. Once build is finish, locate the APK file
1. Go to the Google Play Console website
1. Select the Twine app (`com.ionicframework.powertochange157302`)
1. Select _"Release management"_ > _"App releases"_
1. Select _"Manage"_ on one of the release tracks (Production/Beta/Alpha/Internal)
1. Select _"Create release"_ and follow the prompts and instructions

## iOS
### Requirements
* ionic v4.2.1 (Use `npm`)
* cordova v8.0.0 (Use `npm`)
* cordova-ios@4.4.0 (See below https://github.com/ionic-team/ionic/issues/12942)
* Xcode 9 (See below https://developer.apple.com/download/more/)
* https://github.com/compelling/cordova-plugin-geofence/

### Build
Read https://github.com/cowbell/cordova-plugin-geofence/issues/243#issuecomment-332822465

Download the distribution of Xcode 9, and extract it into
```
/Applications/Xcode9/Xcode.app
```
DO NOT overwrite any existing Xcode installations at `/Applications/Xcode.app`.

Now set the command line tools to use this legacy version of Xcode:
```sh
$ sudo xcode-select -s /Applications/Xcode9/Xcode.app
```
Verify this with
```
$ xcode-select -p
```
In the project directory, run:
```sh
$ ionic cordova platforms rm ios
$ ionic cordova plugings add https://github.com/compelling/cordova-plugin-geofence/
$ ionic cordova platforms add ios@4.4.0
```
Note we specify the exact version of the iOS platform to install. Newer versions will produce failing builds.

Now run:
```sh
$ ionic cordova build ios
```

### Production Build
1. Locally install the distribution certificates from the Apple Developer portal
1. Open Xcode 9 in the `/platforms/ios` directory
1. Under the _"Signing"_ section of the main project view, untick, then retick _"Automatically manage signing"_
1. Ensure the selected team is _"POWER TO CHANGE TRUSTEE LIMITED"_
1. Change the build target to _"Generic iOS Device"_
1. Select _"Product"_ > _"Archive"_
1. Click _"Upload to App Store"_
1. Follow the onscreen prompts, selecting _"Automatically manage signing"_
1. On success, that build of the app will be available in TestFlight. After testing, it can be promoted to production through the _AppStoreConnect_ web app
