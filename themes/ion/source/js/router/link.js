const Vue = require('vue');
const Router = require('./index');

const Link = Vue.component('a-link', {
  template: '<a v-on:click="goToPath" href="{{href}}"><slot></slot></a>',

  props: ['href'],

  methods: {
      goToPath(e) {
        Router.clickCallBack(e);
      }
  }
});

module.exports = Link;