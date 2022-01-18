<template>

  <login-template>

      <span slot="menuesquerdo">
          <img src="https://www.designerd.com.br/wp-content/uploads/2013/06/criar-rede-social.png" class="responsive-img" alt="">
      </span>

      <span slot="principal">
          <span v-if="!cadastro">
            <h2>Login</h2>
            <input type="text" placeholder="E-mail" v-model="usuario.email">
            <input type="password" placeholder="Senha" v-model="usuario.password">
            <button class="btn" type="submit" @click="login()">Entrar</button>
            <button class="btn orange" @click="cadastro = !cadastro">Cadastra-se</button>
          </span>

          <span v-else>
            <h2>Cadastro</h2>
            <input type="text" placeholder="Nome" v-model="usuarioCadastro.name">
            <input type="text" placeholder="E-mail" v-model="usuarioCadastro.email">
            <input type="password" placeholder="Senha" v-model="usuarioCadastro.password">
            <input type="password" placeholder="Confirme sua senha" v-model="usuarioCadastro.password_confimed">
            <button class="btn" type="submit" @click="cadastrar()">Enviar</button>
            <button class="btn orange" @click="cadastro = !cadastro">Já tenho conta</button>
          </span>
        
      </span>

  </login-template>

</template>

<script>
import LoginTemplate from '@/templates/LoginTemplate'
import axios from 'axios';

export default {
  name: 'Login',
  data () {
    return {
        cadastro: false,
        usuarioCadastro: {
          email            : '',
          password         : '',
          password_confimed: '',
          name             : ''
        },
        usuario: {
           email   : ''
          ,password: ''
        }
    }
  },
  components:{
    LoginTemplate
  },
  methods: {
    login()
    {
      axios.post(`${this.$urlAPI}/login`, {
        email   : this.usuario.email,
        password: this.usuario.password
      })
      .then(response => {
        if(response.data.status)
        {
          sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
          this.$store.commit('setUsuario', response.data.usuario);
          this.$router.push('/');
        }else if(response.data.status == false && response.data.validacao)
        {
          let erros = '';
          for(let erro of Object.values(response.data.erros))
          {
            erros += erro + "\n";
          }
          alert(erros);
        }else
        {
          alert('Login inválido!');
        }
      })
      .catch(e => {
        console.log(e);
        alert('Servidor indisponível!');
      })  
    },
    cadastrar()
    {
      axios.post(this.$urlAPI + '/cadastro', {
        email   : this.usuarioCadastro.email,
        name    : this.usuarioCadastro.name,
        password: this.usuarioCadastro.password,
        password_confirmation: this.usuarioCadastro.password_confimed,
      })
      .then(response => {
        if(response.data.status)
        {
          sessionStorage.setItem('usuario', JSON.stringify(response.data.usuario));
          this.$store.commit('setUsuario', response.data.usuario);
          this.$router.push('/');
        }else if(response.data.status == false && response.data.validacao)
        {
          let erros = '';
          for(let erro of Object.values(response.data.erros))
          {
            erros += erro + "\n";
          }
          alert(erros);
        }else
        {
          alert('Cadastro inválido!');
        }
      })
      .catch(e => {
        console.log(e);
        alert('Servidor indisponível!');
      }) 
    }
  }
}
</script>