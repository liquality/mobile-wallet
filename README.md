# Liquality Mobile Wallet <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

## Project Setup

- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Go to the project root folder and run `nvm use`. This will make sure the right version of Node is used.
- Add the FontAwesome Pro key to .npmrc
  ```
  echo 'FONTAWESOME_NPM_AUTH_TOKEN=INSERT_THE_FONTAWESOME_TOKEN_HERE' >> .npmrc
  ```
- Add a mnemonic and password for easy testing. Create `.env` file:
  ```
  MNEMONIC="your seed phrase"
  PASSWORD="123123123"
  ```
- Install npm dependencies
  ```
  npm i
  ```
- Install Cocoapods dependencies
  ```
  cd ios && pod install && cd ..
  ```

# Android environment

- Ensure you have JDK11 installed and setup
- Generate key: `keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000`
- Place keyfile in `./android/app/`
- Create `keystore.properties` in `./android/` folder with contents:
  ```
  storePassword=<ENTER_PASSWORD_HERE>
  keyPassword=<ENTER_PASSWORD_HERE>
  keyAlias=my_key_alias
  storeFile=my-release-key.keystore
  ```

## Running the app

- For iOS
  ```
  npm run ios
  ```
- For Android
  ```
  npm run android
  ```

## Using Node modules

We are using rn-nodeify to provide polyfills for the code that is using crypto and Node related modules. All the magic happens when we load the shim.js file.
The shim file is generated in the postinstall step

## Linting

```
npm run lint
```

## Running Tests

```
npm run test
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

## License

[MIT](./LICENSE.md)
