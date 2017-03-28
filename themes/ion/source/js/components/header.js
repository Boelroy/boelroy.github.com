const Vue = require('vue');

const template = `<header class="header">
  <div class="header-container">
    <a href="">
      <i></i>
    </a>
    <div class="header-nav">
    <ul>
      <li>About</li>
      <li class="active">Blog</li>
      <li>Contact</li>
    </ul>
    </div>
  </div>
</header>`

const Header = Vue.component('b-header', {
  template: template
})
