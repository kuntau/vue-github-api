<template>
  <div id="app">
    <h2>Essential Links</h2>
    <ul>
      <li v-for="essential in essentials">
        <a v-bind:href="essential.name" target="_blank">{{ essential.name }}</a>
      </li>
    </ul>
    <ul>
      <li v-for="essential in reduced">
        <a v-bind:href="essential.name" target="_blank">{{ essential.name }}</a>
      </li>
    </ul>
    <hr />
    <input type="text" @keyup.enter="getdata(username)" v-model="username" placeholder="enter github username">
    <button @click="getdata(username)">
      {{ text }}
    </button>
    <button type="button" v-if="on" @click="toggleRaw">{{ rawLabel }} Raw Data</button><br />
    <code v-if="on && rawBool">
      <span v-for="(value, key) in user" v-if="value">{{ key }}: {{ value ? value : 'null' }}<br /></span>
    </code>
    <hr />
    <Usercard :user=user v-if="user.login"></Usercard>
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
      essentials: [
        { name: 'Core Docs', url: 'https://vuejs.org' },
        { name: 'Forum', url: 'https://forum.vuejs.org' },
        { name: 'Gitter Chat', url: 'https://gitter.im/vuejs/vue' },
        { name: 'Twiiter', url: 'https://twitter.com/vuejs' },
        { url: 'http://router.vuejs.org/', name: 'vue-router' },
        { url: 'http://vuex.vuejs.org/', name: 'vuex' },
        { url: 'http://vue-loader.vuejs.org/', name: 'vue-loader' },
        { url: 'https://github.com/vuejs/awesome-vue', name: 'awesome-vue' }
      ],
      user: {},
      rawLabel: 'Show',
      rawBool: false
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
      this.$http.get('https://api.github.com/users/' + id)
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
  }
}
</script>

<style lang="stylus" scoped>
html
  margin 0
  padding 0
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  padding 59px 50px
  background-color rgba(0,0,0,.1)

h1, h2
  font-weight normal

ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px

a
  color #42b983

</style>
