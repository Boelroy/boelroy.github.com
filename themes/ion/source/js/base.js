var Vue = require('vue');
var RouterSingleton =  require('./router');
var Link = require('./router/link');
var pages = require('./pages');

var router = RouterSingleton.getRouter(app);
router.addRoute(pages);

let App = new Vue({
  el: '#app',
  data: {
    currentView: 'b-homepage'
  }
});
