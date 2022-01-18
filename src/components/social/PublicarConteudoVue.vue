<template>
  <div class="row">
    <grid-vue class="input-field" tamanho="12">
      <input type="text" v-model="conteudo.titulo">
      <textarea v-if="conteudo.titulo" v-model="conteudo.texto" class="materialize-textarea" placeholder="Conteudo"></textarea>
      <input v-if="conteudo.texto && conteudo.titulo" type="text" v-model="conteudo.link" placeholder="Link">
      <input v-if="conteudo.texto && conteudo.titulo" type="text" v-model="conteudo.imagem" placeholder="Url da imagem">
      <label>O que está acontecendo?</label>
    </grid-vue>
    <p class="right-align">
      <button v-if="conteudo.texto && conteudo.titulo" @click="adicionaConteudo()" class="btn waves-effect waves-light">Publicar</button>
    </p>
  </div>
</template>

<script>
import GridVue from '@/components/layouts/GridVue'
import axios from 'axios';

export default {
  name: 'PublicarConteudoVue',
  data () {
    return {
      conteudo: {
        titulo: '',
        texto : '',
        link  : '',
        imagem: ''
      }
    }
  },
  components:{
    GridVue
  },
  methods: {
    adicionaConteudo()
    {
      axios.post(this.$urlAPI + '/conteudo/adicionar', {
        titulo : this.conteudo.titulo,
        texto  : this.conteudo.texto,
        link   : this.conteudo.link,
        imagem : this.conteudo.imagem,
        id_user: this.conteudo.id
      } ,
      {"headers": {"Authorization": "Bearer " + this.$store.getters.getToken}
      })
      .then(response => {
        if(response.data.status)
        {
          this.conteudo = { titulo: '', texto : '', link  : '', imagem: ''};
          this.$store.commit('setConteudosLinhaTempo', response.data.conteudos.data);
        }else
        {
          let erros = '';
          for(let erro of Object.values(response.data.erros))
          {
            erros += erro + "\n";
          }
          alert(erros);
        }
      })
      .catch(e => {
        console.log(e);
        alert('Servidor indisponivel!');
      })
    }
  }
}
</script>