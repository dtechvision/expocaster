// vercel middle ware based on https://docs.expo.dev/router/reference/api-routes/#vercel 2023-02-06
const { createRequestHandler } = require('@expo/server/adapter/vercel');

module.exports = createRequestHandler({
  build: require('path').join(__dirname, '../dist/server'),
  mode: process.env.NODE_ENV,
});