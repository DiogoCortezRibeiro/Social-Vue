<template>
  <site-template>

    <span slot="menuesquerdo">
      <div class="row valign-wrapper">
        <grid-vue tamanho="4">
          <router-link :to="'/pagina/' + usuario.id + '/' + $slug(usuario.name, {lower: true})">
            <img :src="usuario.imagem" alt="" class="circle responsive-img"> 
          </router-link>
        </grid-vue>
        <grid-vue tamanho="8">
          <span class="black-text">
            <router-link :to="'/pagina/' + usuario.id">
              <h5 style="color: black;">{{ usuario.name }}</h5>
            </router-link>
          </span>
        </grid-vue>
      </div>
    </span>

    <span slot="principal">
      <publicar-conteudo-vue/>
      <card-conteudo-vue v-for="item in listarConteudos" :key="item.id"
        :perfil="item.user.imagem"
        :nome="item.user.name"
        :id_conteudo="item.id"
        :id_usuario="item.user_id"
        :total_curtidas="item.total_curtidas"
        :comentarios="item.comentarios"
        :curtiu_conteudo="item.curtiu_conteudo"
        :data="item.data">
          <card-detalhe-vue
            :img="item.imagem"
            :titulo="item.titulo"
            :txt="item.texto" 
            :link="item.link" />
      </card-conteudo-vue>
      <div v-scroll="handleScroll"></div>
    </span>
  </site-template>
</template>

<script>
import CardConteudoVue from '@/components/social/CardConteudoVue'
import CardDetalheVue from '@/components/social/CardDetalheVue'
import SiteTemplate from '@/templates/SiteTemplate'
import PublicarConteudoVue from '@/components/social/PublicarConteudoVue'
import GridVue from '@/components/layouts/GridVue';
import axios from 'axios';

export default {
  name: 'Home',
  data () {
    return {
      usuario    : false,
      nextPage   : null,
      pararScroll: false,
    }
  },
  created()
  {
    let usuario = this.$store.getters.getUsuario;
    if(usuario)
    {
      this.usuario = usuario;
      this.listaConteudos();
    }
  },
  components:{
    CardConteudoVue,
    CardDetalheVue,
    PublicarConteudoVue,
    SiteTemplate,
    GridVue
  },
  methods: {
    listaConteudos()
    {
      axios.get(this.$urlAPI + '/conteudo/lista', {"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
            if(response.data.status)
            {
              this.$store.commit('setConteudosLinhaTempo', response.data.conteudos.data);
              this.nextPage = response.data.conteudos.next_page_url;
            }
          })
          .catch(e => {
            console.log(e);
            alert('Erro! Tente novamente mais tarde!');
          })
    },
    carregaPaginacao()
    {
      if(!this.nextPage)
      {
        return;
      }

      axios.get(this.nextPage, {"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
            if(response.data.status)
            {
              this.$store.commit('setPaginacaoConteudosLinhaTempo', response.data.conteudos.data);
              this.nextPage    = response.data.conteudos.next_page_url;
              this.pararScroll = false;
            }
          })
          .catch(e => {
            console.log(e);
            alert('Erro! Tente novamente mais tarde!');
          })
    },
    handleScroll()
    {
      if(this.pararScroll)
      {
        return;
      }

      if(window.scrollY >= (document.body.clientHeight - 1000))
      {
        this.pararScroll = true;
        this.carregaPaginacao();
      }
    }
  },
  computed: {
    listarConteudos()
    {
      console.log(this.$store.getters.getConteudosLinhaTempo)
      return this.$store.getters.getConteudosLinhaTempo;
    }
  }
}
</script>