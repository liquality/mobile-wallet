# Liquality Mobile Wallet <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

## Project Setup
- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Go to the project root folder and run `nvm use`. This will make sure the right version of Node is used.
- Install npm dependencies
    ```
    FONTAWESOME_NPM_AUTH_TOKEN=INSERT_THE_FONTAWESOME_TOKEN_HERE npm i
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
We are using rn-nodeify to provide polyfills for the code that is using Node modules. All the magic happens when we load the shim.js file.
The shim file is generated in the postinstall step

## Linting

## Running Tests

## Deploying to Testflight

## Deploying to production

## Standards

## Theming

## Localization

## Error Tracking
- Sentry.io

## Analytics

## License
[MIT](./LICENSE.md)
