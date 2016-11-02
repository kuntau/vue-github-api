<template>
  <div id="app">
    <h1>Github User Card</h1>
    <input id="searchbox" type="text" @keyup.enter="getdata(username)" v-model="username" placeholder="enter github username">
    <button @click="getdata(username)">{{ text }}</button>
    <button type="button" v-if="on" @click="toggleRaw">{{ rawLabel }} Raw Data</button><br />
    <code v-if="on && rawBool">
      <hr />
      <span v-for="(value, key) in user" v-if="value">{{ key }}: {{ value ? value : 'null' }}<br /></span>
      <hr />
    </code>
    <Usercard :user="user" :clientID="clientID" :clientSecret="clientSecret" v-if="user.login"></Usercard>
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
      msg: 'Welcome to Your Vue.js App',
      text: 'Promise?',
      username: '',
      on: false,
      user: {},
      rawLabel: 'Show',
      rawBool: false,
      clientID: "fake",
      clientSecret: "fake"
    }
  },
  computed: {
    reduced () {
      return this.essentials.filter(e => e.name.match('vue'))
    }
  },
  methods: {
    toggleRaw() {
      this.rawBool = !this.rawBool
      this.rawLabel = this.rawBool === true ? "Hide" : "Show"
    },
    getdata(id) {
      this.$http.get('https://api.github.com/users/' + id + "?client_id=" + this.clientID + "&client_secret="  + this.clientSecret)
      .then((response) => {
        this.text = response.status
        return response
      })
      .then((res) => {
        const result = res.body
        // console.log(result)
        this.user = result
        this.on = true
        return result
      })
      .catch((error) => {
        // console.log("Catch", error)
        this.text = error.status
      })
    }
  },
  mounted() {
    document.getElementById('searchbox').focus()
  }
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
  padding 0

li
  display inline-block
  margin 0 10px

a
  color #42b983

</style>
