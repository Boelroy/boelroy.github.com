/*
 * RouterSingleton
 */

let RouterInstance_ = null;

class RouterSingleton {
  static getRouter(app) {
    if (RouterInstance_ === null) {
      RouterInstance_ = new Router(app);
    }
    return RouterInstance_;
  }

  static clickCallBack(e) {
    e.preventDefault();
    let router = RouterSingleton.getRouter();
    router.goToPath(e.target.href);
  }
}

/*
 * Router instance
 */
class Router {
  constructor(app) {
    this.routes = {};
    this.currentPath = null;
    this.defaulComponent = null;
    this.app = app;
    window.addEventListener('popstate', (e) => {
      this.onPopState(e);
    });
  }

  addRoute(path, component) {
    if (typeof path === 'object') {
      for (let p in path) {
        this._addRoute(p, path[p]);
      }
    } else {
      this._addRoute(path, component);
    }
  }

  _addRoute(path, component) {
    if (this.routes[path]) {
      throw 'A handler alreay exists for this path: ' + path;
    }
    this.routes[path] = component;
  }

  setDefaultComponent(component) {
    if (this.defaulComponent) {
      throw 'A default handler already exists';
    }
    this.defaulComponent = component;
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

  getCurrentComponent() {
    return this.routes[this.currentPath];
  }

  manageState() {
    var newPath = document.location.pathname;
    var newComponent = this.routes[newPath];
    var currentComponent = this.routes[this.currentPath];
    
    this.app.currentView = newComponent;
    if (!newComponent && this.setDefaultActivity) {
      newComponent = this.defaulActivity;
    }

    if (this.currentPath === newPath) {
      if (typeof newComponent.onUpdate === 'function') {
        newComponent.onUpdate();
        return true;
      }
      return false;
    }
    if (currentComponent) {
      // currentComponent.onFinish();
    }
    if (newComponent) {
      // newComponent.onStart();
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

module.exports = RouterSingleton;