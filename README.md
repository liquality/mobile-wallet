# Liquality Mobile Wallet <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

## Project Setup
- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Go to the project root folder and run `nvm use`. This will make sure the right version of Node is used.
- Add the FontAwesome Pro key to .npmrc
  ```
  echo 'FONTAWESOME_NPM_AUTH_TOKEN=INSERT_THE_FONTAWESOME_TOKEN_HERE' >> .npmrc
  ```
- Install npm dependencies
    ```
    npm i
    ```
- Install Cocoapods dependencies
    ```
    cd ios && pod install && cd ..
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

## License
[MIT](./LICENSE.md)
