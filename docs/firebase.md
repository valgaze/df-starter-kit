## Firebase setup

[[WIP]]

### Setup

You'll need npm on your machine & a google account that can authenticate to firebase

Enter the following commands to give setup & login

```sh
npm install -g firebase-tools
firebase login

```

### Deploy

From a deployment directory (ie a folder with a `firebase.json`, `.firebaserc`, and a `functions` directory) use the following to deploy your function:

```sh
firebase deploy
```

Note if you get an error about a missing module/library, install it & try again"

```
cd functions
npm i
cd ..
firebase deploy
```
