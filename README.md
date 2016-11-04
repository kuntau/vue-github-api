# vue-github-api

> A Vue.js test project

## Retiring vue-resource

As Vue users, many of you may have used _vue-resource_ for handling ajax requests in your Vue applications. For a long time it’s been thought of as the “official” ajax library for Vue, but today we are retiring it from official recommendation status.

[Read on Medium](https://medium.com/the-vue-point/retiring-vue-resource-871a82880af4#.pxb9tlz39)

### Tips for Using Axios with Vue

1. You need to provide your own Promise polyfill when using Axios, if your target environments do not natively support Promises.
2. If you’d like to access `this.$http` like in vue-resource, you can just set `Vue.prototype.$http = axios`.

## Build Setup

``` zsh
# install dependencies
yarn

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
