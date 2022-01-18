<template>

  <site-template>

      <span slot="menuesquerdo">
          <img :src="usuario.imagem" class="responsive-img" alt="">
      </span>

      <span slot="principal">
        <h2>Perfil</h2>

        <input type="text" placeholder="Nome" v-model="name">
        <input type="text" placeholder="E-mail" v-model="email">

        <div class="file-field input-field">
            <div class="btn">
                <span>Imagem</span>
                <input type="file" @change="salvarImagem">
            </div>
            <div class="file-path-wrapper">
                <input type="text" class="file-path validate">
            </div>
        </div>

        <input type="password" placeholder="Senha" v-model="password">
        <input type="password" placeholder="Confirme sua senha" v-model="password_confimed">

        <button class="btn" type="submit" @click="perfil">Atualizar</button>
        <button class="btn orange" @click="voltar()">Voltar</button>
        
      </span>

  </site-template>

</template>

<script>
import SiteTemplate from '@/templates/SiteTemplate'
import axios from 'axios';

export default {
  name: 'Perfil',
  data () {
    return {
        usuario : false,
        email   : '',
        password: '',
        name    : '',
        password_confimed: '',
        imagem  : '', 
    }
  },
  components:{
    SiteTemplate
  },
  created()
  {
      let usuario = this.$store.getters.getUsuario;
      if(usuario)
      {
          this.usuario = usuario;
          this.name    = this.usuario.name;
          this.email   = this.usuario.email;
      }
  },
  methods: {
        perfil()
        {
            axios.put(this.$urlAPI + '/perfil', {
                email   : this.email,
                name    : this.name,
                password: this.password,
                password_confirmation: this.password_confimed,
                imagem  : this.imagem
            }, {
                "headers": {
                    "Authorization": "Bearer " + this.$store.getters.getToken 
                }
            })
            .then(response => {
                if(response.data.status)
                {
                    this.usuario = response.data.usuario;
                    this.$store.commit('setUsuario', this.usuario);
                    sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
                    alert('Perfil atualizado com sucesso');
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
                alert('Servidor indisponível!');
            }) 
        },
        voltar()
        {
            this.$router.push('/');
        },
        salvarImagem(event)
        {
            let arquivo = event.target.files || e.dataTransfer.files;
            
            if(!arquivo.length)
            {
                return;
            }

            let reader = new FileReader();
            reader.onloadend = (e) => {
                this.imagem  = e.target.result;
            };

            reader.readAsDataURL(arquivo[0]);
        },
    }
}
</script>