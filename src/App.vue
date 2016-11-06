<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <input id="searchbox" type="text" @keyup.enter="getdata(username)" v-model="username" placeholder="enter github name, separate multiple name with comma." autofocus=true /><br />
    <button @click="getdata(username)" class="mui-btn mui-btn--primary">{{ text }}</button>
    <button type="button" v-if="on" @click="toggleRaw" class="mui-btn mui-btn--accent">{{ rawLabel }} DUMP</button><br />
    <small v-if="rate_limit.core">Core API usage is <b>{{ rate_limit.core.remaining }}/{{ rate_limit.core.limit }}</b> and will reset <b>{{ coreTimeReset }}</b></small><br />
    <small v-if="rate_limit.search">Search API usage is <b>{{ rate_limit.search.remaining }}/{{ rate_limit.search.limit }}</b> and will reset <b>{{ searchTimeReset }}</b></small><br />
    <transition name="fade">
      <code v-if="on && rawBool" class="raw">
        <ul>
          <li v-for="user in users" v-if="users">
            <ul>
              <li v-for="(value, key) in user" v-if="value">{{ key }}: {{ value ? value : 'null' }}<br />
              </li>
            </ul>
          </li>
        </ul>
      </code>
    </transition>
    <!-- <Usercard v-for="id in idx" :user="getdata(id)" v-if="user.login"></Usercard> -->
    <ul class="listcard">
      <li v-for="user in users">
        <Usercard :user=user  v-if="user.login"></Usercard>
      </li>
    </ul>
  </div>
</template>

<script>
import Usercard from './components/Usercard.vue'
import moment from 'moment'

export default {
  name: 'app',
  components: {
    Usercard
  },
  data () {
    return {
      msg: 'Github User Card',
      text: 'Search User',
      username: '',
      on: false,
      users: [],
      rawLabel: 'Show',
      rawBool: false,
      rate_limit: {},
      clientID: "fake",
      clientSecret: "fake"
    }
  },
  computed: {
    reduced () {
      return this.essentials.filter(e => e.name.match('vue'))
    },
    idx () {
      return this.username.split(',')
    },
    coreTimeReset () {
      return (moment(this.rate_limit.core.reset*1000).fromNow())
    },
    searchTimeReset () {
      return (moment(this.rate_limit.search.reset*1000).fromNow())
    }
  },
  methods: {
    toggleRaw() {
      this.rawBool = !this.rawBool
      this.rawLabel = this.rawBool === true ? "Hide" : "Show"
    },
    ids () {
      return this.username.split(',')
    },
    getdatas(id) {
      this.getRateLimit()
      this.$http.get('https://api.github.com/users/' + id + "?client_id=" + this.clientID + "&client_secret="  + this.clientSecret)
      .then((response) => {
        this.text = response.status
        return response
      })
      .then((res) => {
        const result = res.body
        // console.log(result)
        this.users.push(result)
        this.on = true
        return result
      })
      .catch((error) => {
        // console.log("Catch", error)
        this.text = error.status
      })
    },
    getdata(login) {
      // console.log(this.$options.computed.idx())
      this.users = []
      const ids = this.ids()
      ids.forEach(id => {
        this.$http.get('https://api.github.com/users/' + id + "?client_id=" + this.clientID + "&client_secret="  + this.clientSecret)
        .then((response) => {
          this.text = response.status
          return response
        })
        .then((res) => {
          const result = res.body
          // console.log(result)
          this.users.push(result)
          this.on = true
          return result
        })
        .catch((error) => {
          // console.log("Catch", error)
          this.text = error.status
        })
      })
      this.getRateLimit()
    },
    getRateLimit() {
      this.$http.get('https://api.github.com/rate_limit')
        .then(res  => {
          this.rate_limit = res.body.resources
          console.log("calling getRateLimit")
          return res
        })
        .catch(err =>  {
          console.log(err)
        })
    }
  },
  mounted() {
    // document.getElementById('searchbox').focus()
    this.getRateLimit()
  },
}
</script>

<style lang="stylus">
body
  background-color #f9f9f9
  background-color #1976b2
  font-family 'Open Sans', Helvetica, Arial, sans-serif
  -webkit-font-smoothing subpixel-antialiased
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
</style>

<style lang="stylus" scoped>
#app
  text-align center
  color #2c3e50
  padding 50px
  height 100vh

h1, h2
  font-weight normal
  color rgab(0,0,0,.87)

ul
  list-style-type none
  padding 10px
  margin 10px 10%
  li
    margin 5px

.raw
  ul
    list-style-type none
    padding 10px
    margin 10px 10%
    font-family 'Menlo', monospace
    font-size 12px
    border 1px #eaeaea solid
    border-radius 5px
    background-color #eaeaea
    li
      margin 5px

.listcard > li
  &:nth-child(1)
    margin-top 50px
  &:last-child
    margin-bottom 50px
a
  color #42b983

small
  color rgba(0,0,0,.7)
  font-size 10px

input
  width 500px
  border 1px #eaeaea solid
  border-radius 5px
  line-height 20px
  padding 2px 10px
  margin 15px

.fade-enter-active
  transition all .3s ease
.fade-leave-active
  transition all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.fade-enter
.fade-leave-active
  opacity 0

</style>
