# Expocaster

>Expo mobile, web and API for creating Farcaster native applications.

**Version: v0.0.0**

The one stop repository for native mobile farcaster experiences offering the same to web and additional API building possibilities.

That way with the same code written once you can

- Run a native mobile app
- Run a responsive web app
- Farcaster Frames Backend and general API/backend

Write once, enjoy everywhere.

[Contribute](#contribute)

## Getting Started

to test: 
1) Clone the repository
1) ```npm install``` 
1) ```npm cache clean --force```
1) ```npm expo start```

You'll now be greated by Expo where you can [check their docs](https://docs.expo.dev/get-started/expo-go/)

[Create-Expo-Stack](createexpostack.com) was used to jumpstart this repo in one command ```npx create-expo-stack@latest expocaster --expo-router --drawer+tabs --nativewind --firebase```

## built using Farcaster Ecosystem awesomness

- [Farcasterkit - React Hooks](https://www.farcasterkit.com/)

```
npm install farcasterkit
```

- [Neynar Types and optional API integration](neynar.com)

- [Litecast - Inspired Frame Rendering](https://github.com/dylsteck/litecast)

## also built on top of Typescript awesomeness

- [Create Expo Stack - spin up an expo mobile, web, api stack the way it should be in 10s](https://createexpostack.com/)

## Contribute

The stack used has NativeWind for styling so you can use the typical ```className=""``` syntax your might now from web with Tailwind.

otherwise it's straight Typescript and Expo.

### To contribute changes/improvements

1) fork the repository
2) make your changes
3) submit a PR

### To contribute feedback and bug reports

1) create an Issue

# Deployment of Frames and Web

>Official Expo [Deployment Documentation here](https://vercel.com/docs/cli/deploying-from-cli#deploying-from-local-build-prebuilt) to be used as most up to date document and reference checked if the below doesn't work!

## Dockerfile - COMING SOON

>NOT PROVIDED YET

We are using [NodeJS](#nodejs-with-express) to build the [smallest Dockerfile](https://snyk.io/blog/choosing-the-best-node-js-docker-image/) we can.

To install Docker on Ubuntu go [here](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository) also make sure to [use docker group](https://docs.docker.com/engine/install/linux-postinstall/) instead of sudo if possible :)

Now by building the docker container you can deploy anywhere that supports docker including Kubernetes, DigitalOcean Droplets, Akash.network and the likes.


## NodeJS with Express

> Expo's [Official Documentation can be found here and should be referenced if the below doesn't work](https://docs.expo.dev/router/reference/api-routes/#express)

the one command build expo web for prod and use express routing

```
npx expo export -p web && cp server.js dist/ && cp package.json dist/
```

now you can copy the contents of `dist/` to your nodeJS server root dir and serve with
```
node server.js
```

## Vercel

>NOTE: this hasn't been made work, but is what documentation states! If you make it work please open a PR!

If your remote build doesn't work you may try [prebuilding and then uploading](https://vercel.com/docs/cli/deploying-from-cli#deploying-from-local-build-prebuilt) like so:

this assumes you have vercel installed (```npx vercel```) and configured

```
npx vercel build && npx vercel deploy --prebuilt
```
