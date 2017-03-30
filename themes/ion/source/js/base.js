var Vue = require('vue');
var RouterSingleton =  require('./router');
var Link = require('./router/link');
var pages = require('./pages');

let App = new Vue({
  el: '#app',
  data: {
    currentView: 'page-home'
  },
  ready() {
    
  }
});

var router = RouterSingleton.getRouter(App);
router.addRoute(pages);

