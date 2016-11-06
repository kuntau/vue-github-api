<template>
  <div class="usercard mui--z5">
    <div class="row_first">
      <a :href="user.html_url" target="_blank">
        <img :src="user.avatar_url" :alt="user.name" :title="user.id" />
      </a>
      <div class="top">
        <div class="name">
          <a @click="getCount('user_view', null)" class="cursor">
            <h2>{{ user.name || 'Unknown' }}</h2>
          </a>
          <p>@{{ user.login }} <small>/{{ user.type }} #{{ user.id }}</small></p>
        </div>
        <div class="widget">
          <a @click="getCount('repos_view', user.repos_url)" class="cursor">
            <p class="title">Public Repositories</p>
            <span class="count">{{ formatNumber(user.public_repos) }}</span>
          </a>
        </div>
        <div class="widget">
          <a @click="getCount('repos_view', user.repos_url)" class="cursor">
            <p class="title">Public<br />Gists</p>
            <span class="count">{{ formatNumber(user.public_gists) }}</span>
          </a>
        </div>
        <div class="widget">
          <p class="title">Total Follower</p>
          <span class="count">{{ formatNumber(user.followers) }}</span>
        </div>
        <div class="widget">
          <p class="title">Total Following</p>
          <span class="count">{{ formatNumber(user.following) }}</span>
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
        <p><strong>Member since</strong> {{ new Date(user.created_at).toLocaleDateString() }}</p>
      </div>
      <div class="repos" v-if="current_view === 'repos_view'">
        <div v-if="cache.repos.length > 0" class="repos_list">
          <input id="repos-filter" type="text" v-model="repos_filter" placeholder="filter repos" />
          <ul>
            <li v-for="(repo, index) in filteredRepos" :key="repo.id">
              <a @click="reposMore(repo.id)" class="cursor" :class="{ active: repo.id === cache.repos_id && cache.repos_more_view }">
                {{ repo.name }}
              </a>
            </li>
          </ul>
          <p>Showing {{ filteredRepos.length }} of {{ totalReposPage }} repos</p>
          <button v-if="cache.repos.length < user.public_repos" @click="loadMoreRepos()" class="mui-btn light">Load more</button>
        </div>
        <div v-if="cache.repos_more_view" class="repos_more">
          <h4>Repositories Details:</h4>
          <p>
          {{ filteredRepos.name }}
          </p>
          <ul class="mui-list--unstyled">
            <li>
              <a :href="cache.repos[cache.repos_index].html_url" :title="cache.repos[cache.repos_index].id" target="_blank">Github Page</a>
              <span v-if="cache.repos[cache.repos_index].homepage">|</span>
              <a :href="cache.repos[cache.repos_index].homepage" v-if="cache.repos[cache.repos_index].homepage" target="_blank">Home Page</a>
            </li>
            <li><b>Stars</b> &#9733; {{ cache.repos[cache.repos_index].stargazers_count }}</li>
            <li><b>Fork</b> {{ cache.repos[cache.repos_index].forks_count }}</li>
            <li><b>A Fork</b> {{ cache.repos[cache.repos_index].fork ? 'Yes' : 'No' }}</li>
            <li><b>Language</b> {{ cache.repos[cache.repos_index].language }}</li>
            <li><b>Size</b> {{ formatNumber(cache.repos[cache.repos_index].size) }} Files</li>
            <li><b>Has Issues</b> {{ cache.repos[cache.repos_index].has_issues ? 'Yes' : 'No' }}</li>
            <li><b>Has Downloads</b> {{ cache.repos[cache.repos_index].has_downloads ? 'Yes' : 'No' }}</li>
            <li><b>Has Wiki</b> {{ cache.repos[cache.repos_index].has_wiki ? 'Yes' : 'No' }}</li>
            <li><b>Has Pages</b> {{ cache.repos[cache.repos_index].has_pages ? 'Yes' : 'No' }}</li>
            <li><b>Default Branch</b> {{ cache.repos[cache.repos_index].default_branch }}</li>
            <li><b>Created at</b> {{ new Date(cache.repos[cache.repos_index].created_at).toLocaleDateString() }}</li>
            <li><b>Pushed at</b> {{ new Date(cache.repos[cache.repos_index].pushed_at).toLocaleDateString() }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ITEM_PER_PAGE = 30
export default {
  name: 'usercard',
  props: {
    user: Object,
    clientID: String,
    clientSecret: String
  },
  data: () => ({
    current_view: "user_view",
    isActive: false,
    repos_filter: '',
    last_call: {
      repos: {},
      followers: {},
      following: {},
    },
    cache: {
      repos: {},
      repos_more: {},
      repos_index: 0,
      repos_id: 0,
      repos_page: 1,
      repos_more_view: false,
      followers: {},
      following: {},
    },
  }),
  computed: {
    filteredRepos() {
      return this.cache.repos.filter(repo => {
        // using this nasty NOT operator below read: https://www.joezimjs.com/javascript/great-mystery-of-the-tilde/
        return (~repo.name.toLowerCase().indexOf(this.repos_filter.toLowerCase()) ? true : false)
      })
    },
    totalReposPage() {
      // return this.user.public_repos
      // return (Math.round(this.user.public_repos / ITEM_PER_PAGE) + (this.user.public_repos%ITEM_PER_PAGE > 0 ? 1 : 0))
      return this.user.public_repos
    },
  },
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
    reposMore(id) {
      if (this.cache.repos_id !== id) {
        this.cache.repos_more_view = true
        this.cache.repos_id = id
        this.cache.repos_index = this.cache.repos.findIndex(repo => repo.id === id)
      } else {
        this.cache.repos_more_view = !this.cache.repos_more_view
      }
    },
    loadMoreRepos() {

    },
    formatNumber (num, digits = 1) {
      let si = [
        { value: 1E18, symbol: "E" },
        { value: 1E15, symbol: "P" },
        { value: 1E12, symbol: "T" },
        { value: 1E9,  symbol: "G" },
        { value: 1E6,  symbol: "M" },
        { value: 1E3,  symbol: "k" },
        { value: 1E0,  symbol: ""  }
      ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
      for (let i = 0; i < si.length; i++) {
        if (num >= si[i].value) {
          return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
        }
      }
      return num.toFixed(digits).replace(rx, "$1");
    }
  }
}
</script>

<style lang="stylus" scoped>
.usercard
  margin 0 auto
  padding 20px
  display inline-flex
  flex-direction column
  width 600px
  background-color white
  border-radius 2px
  /* box-shadow 1px 1px 10px rgba(0,0,0,.1), 10px 10px 50px rgba(0,0,0,.2), 20px 20px 100px rgba(0,0,0,.3) */
  color #333
  &:hover
    transform scale3d(1.02, 1.02, 1.02)
    transition all 0.2s ease-in-out

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
      margin auto 2px
      padding 0
      width 55px
      align-self right
      text-align center
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
    input
      margin-bottom 10px
      padding 0 10px
      width 200px
    .repos_list
      ul
        padding-left 20px
        li
          list-style square
    .repos_more
      margin-left auto
      padding 0 10px 20px 0
      border 1px #333 solid
      align-self flex-start
      max-width 50%
      h4
        padding 20px 20px 0 20px
        margin 0
      ul
        padding-left 20px
        li
          list-style none
          overflow hidden

.cursor
  cursor pointer
  &:hover
    color #1976d2
    text-decoration none

.active
  /* color #66cc6a */
  color #1976d2
  font-weight bold

.mui-btn.light
  color #fff
  background-color #bbdefb
  </style>
