<template>
  <site-template>

    <span slot="menuesquerdo">
      <div class="row valign-wrapper">
        <grid-vue tamanho="4">
          <img :src="dono_pagina.imagem" alt="" class="circle responsive-img"> 
        </grid-vue>
        <grid-vue tamanho="8">
          <span class="black-text">
            <h5>{{ dono_pagina.name }}</h5>
            <button v-if="dono_pagina.id != usuario.id" class="btn" @click="amigo(dono_pagina.id)" style="cursor: pointer;">Seguir</button>
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
  name: 'Pagina',
  data () {
    return {
      usuario    : false,
      nextPage   : null,
      pararScroll: false,
      dono_pagina: {
        imagem: '',
        name  : '',
        id    : '',
      },
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
      axios.get(this.$urlAPI + '/conteudo/pagina/lista/' + this.$route.params.id , {"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
            if(response.data.status)
            {
              this.$store.commit('setConteudosLinhaTempo', response.data.conteudos.data);
              this.nextPage = response.data.conteudos.next_page_url;
              this.dono_pagina.imagem = response.data.dono_pagina.imagem;
              this.dono_pagina.name = response.data.dono_pagina.name;
              this.dono_pagina.id = response.data.dono_pagina.id;
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
    },
    amigo(id)
    {
      axios.post(this.$urlAPI + "/usuario/seguir", {id: id}, {"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
            if(response.data.status)
            {
              console.log(response.data);
            }else
            {
              console.log(response.data.error);
            }
          })
          .catch(e => {
            console.log(e);
            alert('Erro! Tente novamente mais tarde!');
          })
    }
  },
  computed: {
    listarConteudos()
    {
      return this.$store.getters.getConteudosLinhaTempo;
    }
  }
}
</script>