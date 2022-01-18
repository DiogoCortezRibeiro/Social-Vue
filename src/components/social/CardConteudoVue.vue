<template>

<div class="row">
    <div class="card">
      <div class="card-content">
        <div class="row valign-wrapper">
          <grid-vue tamanho="1">
            <router-link :to="'/pagina/' + id_usuario">
              <img :src="perfil" :alt="nome" class="circle responsive-img"> <!-- notice the "circle" class -->
            </router-link>
          </grid-vue>
          <grid-vue tamanho="11">
            <span class="black-text">
              <router-link :to="'/pagina/' + id_usuario">
                <strong style="color: black;">{{nome}}</strong> - <small>{{data}}</small>
              </router-link>

            </span>
          </grid-vue>
        </div>

        <slot />

      </div>
      <div class="card-action">
        
        <p>
          <a style="cursor: pointer;" @click="curtirPostagem(id_conteudo)">
            <i class="material-icons">{{ curtiu }}</i>{{ totalCurtidas }}
          </a>
          <a style="cursor: pointer;" @click="abreComentarios()">
            <i class="material-icons">insert_comment</i>
            {{ totalComentarios }}
          </a>
        </p>

        <p v-if="exibirComentarios" class="right-align">
          <input type="text" placeholder="Comentario" v-model="textoComentario">
          <button class="btn waves-effect waves-light orange" v-if="textoComentario" @click="comentar(id_conteudo)">
            <i class="material-icons">send</i>
          </button>
        </p>

        <p v-if="exibirComentarios">
          <ul class="collection">
            <li class="collection-item avatar" v-for="comentario in comentarios" :key="comentario.id">
              <img :src="comentario.user.imagem" alt="" class="circle">
              <span class="title"> {{ comentario.user.name }}<small> - {{ comentario.data }}</small></span>
              <p>{{ comentario.texto }}</p>
            </li>
          </ul>
        </p>

      </div>
    </div>

</div>

</template>

<script>
import GridVue from '@/components/layouts/GridVue'
import axios from 'axios';

export default {
  name: 'CardConteudoVue',
  props:['perfil','nome','data','id_conteudo','total_curtidas', 'curtiu_conteudo', 'comentarios', 'id_usuario'],
  data () {
    return {
      curtiu           : 'favorite_border',
      totalCurtidas    : this.total_curtidas,
      totalComentarios : this.comentarios.length || 0,
      exibirComentarios: false,
      textoComentario  : '',
    }
  },
  mounted()
  {
    if(this.curtiu_conteudo)
    {
      this.curtiu = 'favorite';
    }
  },
  components:{
    GridVue
  },
  methods: {
    curtirPostagem(id_conteudo)
    {
      axios.put(this.$urlAPI+'/conteudo/curtir/' + id_conteudo,{},{"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
              if(response.data.status)
              {
                this.totalCurtidas = response.data.curtidas;
                this.$store.commit('setConteudosLinhaTempo', response.data.lista.conteudos.data);
                if(this.curtiu == 'favorite_border')
                {
                  this.curtiu = 'favorite';
                }else
                {
                  this.curtiu = 'favorite_border';
                }
              }else
              {
                alert(response.data.erro);
              }
           })
           .catch(e => {
             console.log(e);
             alert('Servidor indisponivel!');
           })
    },
    abreComentarios()
    {
      this.exibirComentarios = !this.exibirComentarios
    },
    comentar(id_conteudo)
    {
      axios.post(this.$urlAPI+'/conteudo/comentario/' + id_conteudo,{
        texto: this.textoComentario
      },{"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}})
           .then(response => {
              if(response.data.status)
              {
                this.$store.commit('setConteudosLinhaTempo', response.data.lista.conteudos.data);
                this.textoComentario = '';
              }else
              {
                alert(response.data.erro);
              }
           })
           .catch(e => {
             console.log(e);
             alert('Servidor indisponivel!');
           });
    }
  }
}
</script>
