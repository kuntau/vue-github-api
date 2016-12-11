# vue-github-api

> A Vue.js test project

## Screenshot

![Vue Github API](/vue-github-api.png?raw=true)

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

### Learning Milestone

- [x] Get a user from github
- [x] Display the user info
  - [x] Store data in user object
  - [x] Display user info in nice card
- [x] Call another API from user object _public repos_
  - [x] Store _repos_ data in cache
  - [x] Check cache when switching between views to prevent redundant API call
  - [x] Made a Vue.js compoenent; `Usercard`
  - [x] Learned `computed, methods`
  - [x] Learned Vue.js life cycle; `beforeCreate, beforeMount, mounted, afterMount, etc...`
- [ ] Call remaining callable API _public gists, followers, following_
  - [ ] Call and process _gists_
  - [ ] Call and process _followers_
  - [ ] Call and process _following_
- [x] Get multiple user from a single input
  - User object now stored in users array
- [x] Output users in multiple cards
  - [x] Dynamic card style base on how many cards.  _just using `nth-child` conditioning_
- [x] Animate list of Usercards on hover
- [ ] Animate list of Usercards on enter after search
- [x] Highlight class `@click` as active for `v-for`
- [ ] Add `sort` for Usercard by `id` `login` `followers` etc...
- [ ] Sort feature for repos list
- [ ] Load more repos as default API request is limited to `30` repos per page
  - [ ] Bonus point if I can make option for infinite scrolling
- [ ] Learn vue-router
- [ ] Learn vuex
