fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## Android

### android badgeIt

```sh
[bundle exec] fastlane android badgeIt
```



### android ibn

```sh
[bundle exec] fastlane android ibn
```

Increment build number and push to repository - Build number in this case is the android version code
        Check out this link: https://jonathancardoso.com/en/blog/automated-release-publish-deployment-react-native-android-apps-using-fastlane-part-1-play-store/
  

### android ivn

```sh
[bundle exec] fastlane android ivn
```

Increment version number and push to repository - Version number in this case is the android version name

### android build

```sh
[bundle exec] fastlane android build
```

Build a version of the app

### android alpha

```sh
[bundle exec] fastlane android alpha
```

Build and push a new alpha build to the Play Store

### android beta

```sh
[bundle exec] fastlane android beta
```

promote the current alpha build to the beta track

### android generate_icons

```sh
[bundle exec] fastlane android generate_icons
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
