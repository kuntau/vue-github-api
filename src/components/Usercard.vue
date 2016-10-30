<template lang="html">
<template>
  <div class="usercard">
    <img :src="user.avatar_url" :alt="user.name" />
    <div class="top">
      <div class="info">
        <h2>{{ user.name }}</h2>
        <p>@{{ user.login }}{{ user.company ? " / " + user.company : "" }}</p>
    <div class="row_first">
      <a :href="user.html_url" target="_blank">
        <img :src="user.avatar_url" :alt="user.name" />
      </a>
      <div class="top">
        <div class="name">
          <a @click="getCount('user_view', null)" class="cursor">
            <h2>{{ user.name }}</h2>
          </a>
          <p>@{{ user.login }} <small>/{{ user.type }}</small></p>
        </div>
        <div class="widget">
          <a @click="getCount('repos_view', user.repos_url)" class="cursor">
            <p class="title">Public Repositories</p>
            <span class="count">{{ user.public_repos }}</span>
          </a>
        </div>
        <div class="widget">
          <p class="title">Total Follower</p>
          <span class="count">{{ user.followers }}</span>
        </div>
        <div class="widget">
          <p class="title">Total Following</p>
          <span class="count">{{ user.following }}</span>
        </div>
      </div>
    </div>
    <div class="row_third">
      <div class="name" v-if="current_view === 'user_view'">
        <p v-if="user.email"><strong>E-Mail</strong> {{ user.email }}</p>
        <p v-if="user.company"><strong>Company</strong> {{ user.company }}</p>
        <p v-if="user.blog"><strong>Blog</strong> {{ user.blog }}</p>
        <p v-if="user.location"><strong>Location</strong> {{ user.location }}</p>
        <p v-if="user.bio"><strong>Biodata</strong> {{ user.bio }}</p>
      </div>
      <div class="widget">
        <p class="title">Total Following</p>
        <span class="count">{{ user.following }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'usercard',
  props: {
    user: Object,
    clientID: String,
    clientSecret: String
  },
  data: () => ({
  }),
  beforeUpdate() {
    // this.getCount("followers", this.user.followers_url)
    // this.getCount("following", this.user.following_url)
    // this.getCount("repos", this.user.repos_url)
  },
  beforeMount() {
    // this.getCount("followers", this.user.followers_url)
    // this.getCount("following", this.user.following_url)
    // this.getCount("repos", this.user.repos_url)
  },
  methods: {
    getCount(type, url) {
      this.$http.get(url + "?client_id=" + clientID + "&client_secret="  + clientSecret)
      .then((res) => {
        const result = res.body
        // console.log("HTTP CALL ", result)
        switch (type) {
          case "followers":
            this.followers = result.length
            break
          case "following":
            this.following = result.length
            break
          case "repos":
            this.repos = result.length
            break
          default:
            console.log("SWITCH ERROR" , type)
        }
        return result
      })
      .catch((error) => {
        console.log("Catch", error)
        // this.text = error.status
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.usercard
  margin 50px auto
  padding 20px
  display flex
  width 600px
  height 300px
  background-color white
  border-radius 2px
  box-shadow 1px 1px 10px rgba(0,0,0,.1), 10px 10px 50px rgba(0,0,0,.2), 20px 20px 100px rgba(0,0,0,.3)
  color #333
img
  height 70px
  width  70px
  border-radius 50%
.top
  display flex
  height 70px
  width 530px
  margin 0 0 20px 20px
  border-bottom 1px solid #999
  .info
    margin auto 0
    padding 0
    margin-right auto
    h2,p
      display block
      margin 0
      text-align left
      max-height 30px
      overflow hidden
      text-overflow ellipsis
    h2
      font-size 20px
  .widget
    margin auto 10px
    padding 0
    width 60px
    align right
    p
      text-transform uppercase
      font-size 8px
      margin 0
    span
      font-size 22px
      font-weight bold
</style>
