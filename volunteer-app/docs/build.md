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

### Sign
TBD

## iOS
### Requirements
* ionic v4.2.1 (Use `npm`)
* cordova v8.0.0 (Use `npm`)
* cordova-ios@4.4.0 (See below https://github.com/ionic-team/ionic/issues/12942)
* Xcode 8.2 (See below https://developer.apple.com/download/more/)
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

### Sign
TBD
