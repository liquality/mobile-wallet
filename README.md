# Liquality Mobile App <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

## Project Setup
- Install [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- Go to the project root folder and run `nvm use`. This will make sure the right version of Node is used.
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
We are using rn-nodeify to provide polyfills for the code that is using Node modules. All the magic happens when we load the shim.js file.
Here is how we set it up. Note that this only happens once during the project setup:

### install react-native-crypto
```
npm i --save react-native-crypto
```

### install peer deps
```
npm i --save react-native-randombytes
cd ios && pod install && cd ..
```

### install latest rn-nodeify
```
npm i --save-dev rn-nodeify
```
### install node core shims
```
./node_modules/.bin/rn-nodeify --hack --install
```

## Linting
## Running Tests
## Deploying to Testflight
## Deploying to production
## License

[MIT](./LICENSE.md)
