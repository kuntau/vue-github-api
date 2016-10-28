<template lang="html">
  <div class="usercard">
    <img :src="user.avatar_url" :alt="user.name" />
    <div class="top">
      <p>{{ user.name }}</p>
      <p>{{ user.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'usercard',
  props: [ 'user' ],
  data () {
    return {
      username: 'Kuntau',
      avatar: 'https://avatars.githubusercontent.com/u/327489?v=3',
    }
  }
}
</script>

<style lang="stylus" scoped>
.usercard
  margin 0 auto
  padding 20px
  display flex
  width 600px
  height 300px
  background-color white
  border-radius 2px
  box-shadow 1px 1px 10px rgba(0,0,0,.1), 10px 10px 50px rgba(0,0,0,.2), 20px 20px 100px rgba(0,0,0,.3)
img
  height 50px
  width  50px
  border-radius 50%
.top
  display flex
  height 50px
  margin-left 20px
  h2
    margin auto
</style>
