# Environment Configuration

Environment configuration is managed using [Expo's release channels](https://docs.expo.io/versions/latest/distribution/release-channels/), with configuration stored in an ignored `enviroment.ts` file in the root directory. 


## Config template 
`environment.ts` to be created locally with the following format:

```ts
 /* global __DEV__ */

/*
 * environment.ts
 * path: '/environment.ts' (root of your project)
 */

import { Constants } from "expo";
import { Platform } from "react-native";

// If running through handled device, set localhost to your local IP address
const localhost =
  "[your.local.IP.address]" // to run through expo app on device
  // OR
//  Platform.OS === "android" ? "10.0.2.2": "localhost"; //to run through emulator

const ENV = {
 dev: {
   apiBaseUrl: `http://${localhost}:4000`,
 },
 staging: {
   apiBaseUrl: "[your.staging.api.here]",
 },
 prod: {
   apiBaseUrl: "[your.production.api.here]",
 }
};

const getEnvVars = () => {
 /* What is __DEV__ ?
  * This variable is set to true when react-native is running in Dev mode.
  * __DEV__ is true when run locally, but false when published.
  */
  if (__DEV__) {
    return ENV.dev;
  }
  else
    return ENV.prod;

  //simplify to sort a problem with the Constants.manifest file

  try {
    const env = Constants.manifest.releaseChannel
    if (env === 'staging') {
      return ENV.staging;
    } else if (env === 'prod') {
      return ENV.prod;
    }
  } catch(e) {
    // fallback if no release channel is set
    return ENV.prod;
  }
};

export default getEnvVars;
```

