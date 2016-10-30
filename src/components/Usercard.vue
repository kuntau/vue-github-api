<template>
  <div class="usercard">
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
      <div class="repos" v-if="current_view === 'repos_view'">
        <div class="repos_list">
          <ul v-if="cache.repos.length > 0">
            <li v-for="(repo, index) in cache.repos">
              <a @click="reposMore(index)" class="cursor">
                {{ repo.name }}
              </a>
            </li>
          </ul>
        </div>
        <div v-if="cache.repos_more_view" class="repos_more">
          <ul>
            <li><strong>Repositories Details :</strong> {{ cache.repos_index }}</li>
            <li><b>Star</b> {{ cache.repos[cache.repos_index].stargazers_count }}</li>
            <li><b>Watcher</b> {{ cache.repos[cache.repos_index].watchers_count }}</li>
            <li><b>Fork</b> {{ cache.repos[cache.repos_index].forks_count }}</li>
          </ul>
        </div>
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
    current_view: "user_view",
    last_call: {
      repos: {},
      followers: {},
      following: {},
    },
    cache: {
      repos: {},
      repos_more: {},
      repos_index: 0,
      repos_more_view: false,
      followers: {},
      following: {},
    },
  }),
  methods: {
    getCount(type, url) {
      this.current_view = type
      if ((!url) || // check if url is null/empty
        (url === this.last_call.repos) || // prev url call check, thus limit the api call
        (url === this.last_call.followers) ||
        (url === this.last_call.following))
        return

      // if the url was never called, clear previous obejct
      this.cache.repos = {}

      // xhr http request using promise
      this.$http.get(url + "?client_id=" + this.clientID + "&client_secret="  + this.clientSecret)
      // this.$http.get(url)
      .then((res) => {
        const result = res.body
        switch (type) {
          case "followers":
            this.followers = result.length
            break
          case "following":
            this.following = result.length
            break
          case "repos_view":
            this.cache.repos = result
            this.last_call.repos = url
            break
          default:
            console.log("SWITCH ERROR" , type)
        }
        // console.log("HTTP CALL ", type, url, result)
        return result
      })
      .catch((error) => {
        console.log("Catch", error)
        // this.text = error.status
      })
    },
    reposMore(i) {
      if (this.cache.repos_index !== i) {
        this.cache.repos_more_view = true
        this.cache.repos_index = i
      } else {
        this.cache.repos_more_view = !this.cache.repos_more_view
      }
    },
    reposMoreOld(repo) {
      if (this.cache.repos_more !== repo) {
        this.cache.repos_more_view = true
        this.cache.repos_more = repo
      } else {
        this.cache.repos_more_view = !this.cache.repos_more_view
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.usercard
  margin 50px auto
  padding 20px
  display inline-flex
  flex-direction column
  width 600px
  background-color white
  border-radius 2px
  box-shadow 1px 1px 10px rgba(0,0,0,.1), 10px 10px 50px rgba(0,0,0,.2), 20px 20px 100px rgba(0,0,0,.3)
  color #333
.row_first
  display flex
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
    .name
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
      small
        text-transform uppercase
        font-size 8px
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
.row_third
  display flex
  margin-left 90px
  padding-bottom 20px
  border-bottom 1px solid #999
  .name
    margin auto 0
    padding 0
    margin-right auto
    p
      display block
      margin 0
      text-align left
  .repos
    text-align left
    display flex
    width 100%
    ul
      padding-left 20px
      li
        list-style square
    .repos_more
      margin-left auto
      border 1px #333 solid
      height 33%
      ul
        padding 0 20px
        li
          list-style none
.cursor
  cursor pointer
  &:hover
    color #66bb6a
</style>
