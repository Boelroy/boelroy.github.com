const Vue = require('vue');
const Header = require('../components/header');
const HomePost = require('../components/home/post');
const template = `<div>
  <b-header ></b-header>
  <div class="artical-container home">
    <template v-for="(index, post) in posts">
    <home-post v-if="index < 3" v-bind:post="post"></home-post>
    </template>
  </div>
</div>`

const HomePage = Vue.component('page-home', {
  template: template,
  data(){
    return {
      posts: []
    }
  },
  ready() {
    fetch('/api/posts/1.json')
      .then((response) => {
        return response.json()
      }, (error) => {

      }).then((data) => {
        this.posts = data.data;
      })
  }
})

module.exports = HomePage;