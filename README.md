# React Native app for GP

## Start app
> cd gp_fe

> npx expo start

## Persistent storage
Uses the community version:
- https://react-native-async-storage.github.io/async-storage/

## Build app / production
We need to create an optimised build for production. To do this run:
> npm run web-build

This will create a `web-build` folder. This is what should be deployed to production.

## Environmental variables
If building this app locally for the first time remember to add a `.env` file with
this environmental variable set:
> REACT_APP_IS_LOCAL_DEVELOPMENT=true
