<template>
  <span>
    <header>
      <nav-bar logo="Social" url="/" cor="green darken-1" >
        <li v-if="usuario">
          <router-link to="/perfil">{{ usuario.name }}</router-link>
        </li>
        <li v-if="usuario">
          <a @click="sair()">Sair</a>
        </li>
      </nav-bar>
    </header>
    <main>
      <div class="container">
        <div class="row">
          <grid-vue tamanho="4">
            <card-menu-vue>
              <slot name="menuesquerdo"/>
            </card-menu-vue>
            <card-menu-vue>
              <slot name="amigos"/>
            </card-menu-vue>
          </grid-vue>
          <grid-vue tamanho="8">
            <slot name="principal" />
          </grid-vue>
        </div>
      </div>
    </main>
    <footer-vue cor="green darken-1" logo="Social" descricao="Teste de descrição" ano="2018">
      <li><a class="grey-text text-lighten-3" href="#!">Link - 1</a></li>
      <li><a class="grey-text text-lighten-3" href="#!">Link - 2</a></li>
    </footer-vue>
  </span>
</template>

<script>
import NavBar from '@/components/layouts/NavBar'
import FooterVue from '@/components/layouts/FooterVue'
import GridVue from '@/components/layouts/GridVue'
import CardMenuVue from '@/components/layouts/CardMenuVue'

export default {
  name: 'SiteTemplate',
  data()
  {
    return {
      usuario: false,
    }
  },
  components:{
    NavBar,
    FooterVue,
    GridVue,
    CardMenuVue
  },
  created()
  {
    let usuarioAux = this.$store.getters.getUsuario;
    if(usuarioAux)
    {
      this.usuario = this.$store.getters.getUsuario;
    }else
    {
      this.$router.push('/login');
    }
  },
  methods: {
    sair()
    {
      this.usuario = false;
      this.$store.commit('setUsuario', null);
      this.$router.push('/login');
      sessionStorage.clear();
    }
  }
}
</script>

<style>

</style>
