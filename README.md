# Liquality Mobile Wallet <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

## Project Setup

- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Go to the project root folder and run `nvm use`. This will make sure the right version of Node is used.
- Add a mnemonic and password for easy testing. Create `.env` file:
  ```
  MNEMONIC="your seed phrase"
  PASSWORD="123123123"
  ```
- Install npm dependencies
  ```
  yarn install
  ```
- Install Cocoapods dependencies
  ```
  cd ios && pod install && cd ..
  ```

# Android environment

- Ensure you have JDK11 installed and setup

# IOS environment

- Ensure you have latest version of Xcode and Command-Line-Tools
- To simulate background fetch in iOS emulator, build and run the /ios/LiqualityMobile.xcworkspace directly in Xcode and navigate to the 'Signing and capabilities' –> 'Background Modes' → to make sure that the following are checked:

* Audio, Airplay and Picture in Picture
* Background fetch
* Remote notifications
* Background processing
* Make sure to create a .env file and add these environment variables to it: MNEMONIC, PASSWORD, and INFURA_API_KEY

## Running the app

- For iOS
  ```
  yarn run ios
  ```
- For Android
  ```
  yarn run android
  ```

## Using Node modules

We are using rn-nodeify to provide polyfills for the code that is using crypto and Node related modules. All the magic happens when we load the shim.js file.
The shim file is generated in the postinstall step

## Linting

```
yarn run lint
```

## Running Tests

```
yarn run test
```

## Deploying to Testflight

- iOS

```
cd ios/fastlane && fastlane ios beta
```

- Android

```
cd android/fastlane && fastlane android alpha
```

## Deploying to production

## Standards

## Theming

## Localization

## Error Tracking

- Sentry.io

## Analytics

## Troubleshoot

1. FBReactNativeSpec - Command PhaseScriptExecution failed with a nonzero exit code<br>
   https://github.com/react-native-community/upgrade-support/issues/161<br>
   In node_modules/react-native/scripts/find-node.sh, comment out this code block:

```
if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "$HOME/.nvm/nvm.sh" --no-use
  nvm use 2> /dev/null || nvm use default
elif [[ -x "$(command -v brew)" && -s "$(brew --prefix nvm)/nvm.sh" ]]; then
  # shellcheck source=/dev/null
  . "$(brew --prefix nvm)/nvm.sh" --no-use
  nvm use 2> /dev/null || nvm use default
fi
```

2. Android Error: Plugin with id 'maven' not found

```
  Replace maven with maven-publish
```

3. Android Error: CMake Error at CMakeLists.txt:12 (include_directories)

```
  Open Android Studion Go to File Menu > Tap Invalidate Caches
```

## License

[MIT](./LICENSE.md)
