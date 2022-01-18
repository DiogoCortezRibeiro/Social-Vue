// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex';
import Slug from 'slug';

Vue.use(Vuex);

Vue.config.productionTip = false
Vue.prototype.$urlAPI = 'http://localhost:8000/api';
Vue.prototype.$slug = Slug;

var store = {
  state: {
    usuario: sessionStorage.getItem('usuario') ? JSON.parse(sessionStorage.getItem('usuario')) : null,
    conteudosLinhaTempo: [],
  },
  getters: {
    getUsuario: state => {
      return state.usuario;
    },
    getToken: state => {
      return state.usuario.token;
    },
    getConteudosLinhaTempo: state => {
      return state.conteudosLinhaTempo;
    }
  },
  mutations: {
    setUsuario(state, novoUsuario)
    {
      state.usuario = novoUsuario;
    },
    setConteudosLinhaTempo(state, novoConteudosLinhaTempo)
    {
      state.conteudosLinhaTempo = novoConteudosLinhaTempo;
    },
    setPaginacaoConteudosLinhaTempo(state, lista)
    {
      for(let item of lista)
      {
        state.conteudosLinhaTempo.push(item);
      }
    }
  }
}

Vue.directive('scroll', {
  inserted: function(el, binding) {
    let f = function (evt) {
      if(binding.value(evt, el)) {
        window.removeEventListener('scroll' , f);
      }
    }
    window.addEventListener('scroll', f);
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: new Vuex.Store(store),
  router,
  template: '<App/>',
  components: { App }
})
