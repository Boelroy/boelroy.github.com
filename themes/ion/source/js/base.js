var ION = (function(){

function Ion() {

}

/*
 * init the site request configuration data
 */
Ion.prototype.init = function() {
  fetch('/api/site.json')
    .then((data) => {
      console.log(data);
    }, () => {

    });
}

return {
  init: function() {
    var ion = new Ion();
    ion.init();
  }
};


/*
 * RouterSingleton
 */

class RouterSingleton {
  static getRouter() {
    if (typeof window.RouterInstance_ !== 'undefined') {
      return window.RouterInstance_;
    }
    window.RouterInstance_ = new Router();
  }

  static clickCallBack(e) {
    e.preventDefault();
    var router = RouterSingleton.getRouter();
    router.goToPath(e.target.href);
  }
}

/*
 * Router instance
 */
class Router {
  constructor() {
    this.routes = {};
    this.currentPath = null;
    this.defaulActivity = null;
    window.addEventListener('popstate', (e) => {
      this.onPopState(e);
    });
  }

  addRoute(path, activity) {
    if (this.routes[path]) {
      throw 'A handler alreay exists for this path: ' + path;
    }
    this.routes[path] = path;
  }

  setDefaultActivity(activity) {
    if (this.defaulActivity) {
      throw 'A default handler already exists';
    }
    this.defaulActivity = activity;
  }

  removeRouter(path) {
    if (!this.routes[path]) {
      return;
    }
    delete this.routes[path];
  }

  requestStateUpdate() {
    requestAnimationFrame(() => {
      this.manageState();
    })
  }

  manageState() {
    var newPath = document.location.pathname;
    var newActivity = this.routes[newPath];
    var currentActivity = this.routes[this.currentPath];
    if (!newActivity && this.setDefaultActivity) {
      newActivity = this.defaulActivity;
    }

    if (this.currentPath === newPath) {
      if (typeof newActivity.onUpdate === 'function') {
        newActivity.onUpdate();
        return true;
      }
      return false;
    }
    if (currentActivity) {
      currentActivity.onFinish();
    }
    if (newActivity) {
      newActivity.onStart();
      this.currentPath = newPath;
    } else {
      this.currentPath = null;
    }
    
  }

  goToPath(path, title=null) {
    if (path === window.location.pathname) {
      return;
    }
    history.pushState(undefined, title, path);
    this.requestStateUpdate();
  }

  onPopState(e) {
    e.preventDefault();
    this.requestStateUpdate();
  }
}
Vue.component('index', {

});

Vue.component('link', {
  template: '<a v-on:click="goToPath"><slot></slot></a>',
  goToPath: function(e) {
    RouterSingleton.clickCallBack(e);
  }
})

})();

ION.init();