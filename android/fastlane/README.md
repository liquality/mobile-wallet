fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android badgeIt
```
fastlane android badgeIt
```

### android ibn
```
fastlane android ibn
```
Increment build number and push to repository - Build number in this case is the android version code
        Check out this link: https://jonathancardoso.com/en/blog/automated-release-publish-deployment-react-native-android-apps-using-fastlane-part-1-play-store/
  
### android ivn
```
fastlane android ivn
```
Increment version number and push to repository - Version number in this case is the android version name
### android build
```
fastlane android build
```
Build a version of the app
### android alpha
```
fastlane android alpha
```
Build and push a new alpha build to the Play Store
### android generate_icons
```
fastlane android generate_icons
```


----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
