const Vue = require('vue');
const Header = require('../components/header');
const template = `<div>
  <b-header ></b-header>
  <div class="home"></div>
</div>`

const HomePage = Vue.component('b-homepage', {
  template: template
})

module.exports = HomePage;