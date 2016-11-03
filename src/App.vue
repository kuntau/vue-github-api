<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <small v-if="rate_limit.core">Core API: {{ rate_limit.core.remaining }}/{{ rate_limit.core.limit }} until {{ coreTimeReset }}</small><br />
    <small v-if="rate_limit.search">Search API: {{ rate_limit.search.remaining }}/{{ rate_limit.search.limit }} until {{ searchTimeReset }}</small><br />
    <input id="searchbox" type="text" @keyup.enter="getdata(username)" v-model="username" placeholder="enter github username">
    <button @click="getdata(username)">{{ text }}</button>
    <button type="button" v-if="on" @click="toggleRaw">{{ rawLabel }} DUMP</button><br />
    <code v-if="on && rawBool" class="json">
      <ul>
        <li v-for="(value, key) in user" v-if="value">{{ key }}: {{ value ? value : 'null' }}<br /></li>
      </ul>
    </code>
    <!-- <Usercard v-for="id in idx" :user="getdata(id)" v-if="user.login"></Usercard> -->
    <Usercard v-for="user in users" :user=user  v-if="user.login"></Usercard>
  </div>
</template>

<script>
import Usercard from './components/Usercard.vue'

export default {
  name: 'app',
  components: {
    Usercard
  },
  data () {
    return {
      msg: 'Github User Card',
      text: 'Promise?',
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
      return (new Date(this.rate_limit.core.reset*1000).toLocaleTimeString())
    },
    searchTimeReset () {
      return (new Date(this.rate_limit.search.reset*1000).toLocaleTimeString())
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
    document.getElementById('searchbox').focus()
    this.getRateLimit()
  },
}
</script>

<style lang="stylus">
html
  margin 0
  padding 0
  background #787B83
  color #f9f9f9
</style>

<style lang="stylus" scoped>
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  padding 50px
  height 100vh

h1, h2
  font-weight normal
  color #f9f9f9

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

a
  color #42b983

small
  font-size 10px

</style>
