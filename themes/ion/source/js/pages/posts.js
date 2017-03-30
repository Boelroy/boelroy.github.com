const Vue = require('vue');
const Header = require('../components/header');
const template = `<div>
  <b-header ></b-header>
  <div class="posts">posts</div>
</div>`

const PostsPage = Vue.component('page-posts', {
  template: template
})

module.exports = PostsPage;