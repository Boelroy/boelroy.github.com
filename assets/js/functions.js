(function(initData){

  Vue.component('post-item', {
    props: ['post'],
    template: `<li>
            <a v-bind:data-href="post.url" class="post-list-link">
                <div class="post-list-info">
                    <h2 class="post-list-title">{{ post.title }}</h2>
                    <span class="post-list-meta">{{ post.date}}</span>
                </div>
            </a>

            <img v-bind:src="post.thumb" class="post-list-thumb" />
        </li>`
  })

  var app = new Vue({
    el: '#app',
    data: {
      posts: initData
    }
  })
})(window.data);