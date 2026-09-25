import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {getLocalUser, getTokenApi} from '../helpers/auth';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL

import agendas from '../modules/agendas';
import calendarios from '../modules/calendarioElectoral';
import metas from '../modules/metas';
import turnos from '../modules/turnos';
import votantes from '../modules/votantes'

import Swal from 'sweetalert2';
window.Swal = Swal;

Vue.use(Vuex)

const user = getLocalUser()
//const tokenApi = getTokenApi()

const store =  new Vuex.Store({
  state: {
    auth: !!user,
    auth_error: null,
    candidato: null,
    candidatos: [],
    comandos: [],
    coordinadores: [],
    jurados: [],
    lideres: [],
    loading: false,
    persona: {},
    recolectores: [],
    subcoordinadores: [],
    //tokenApi: tokenApi,
    token_err: false,
    url: null,
    user: user,
    users: []
  },
  getters: {
    isLoading(state){
      return state.loading
    },
    isAuth(state){
      return state.auth
    },
    auth_error(state){
      return state.auth_error
    },
    user(state){
      return state.user
    },
    getCandidatos(state){
      return state.candidatos
    },
    getComandos(state){
      return state.comandos
    },
    getCoordinadores(state){
      return state.coordinadores
    },
    getJurados(state){
      return state.jurados
    },
    getPersona(state){
      return state.persona
    },
    getSubCoordinadores(state){
      return state.subcoordinadores
    },
    getRecolectores(state){
      return state.recolectores
    },
    getLideres(state){
      return state.lideres
    },
    getUrlApi(state){
      return state.url
    },
    getUsers(state){
      return state.users
    }
  },
  mutations: {
    authError(state){
      state.auth_error = false
    },
    cleanUsers(state){
      state.users = []
    },
    deleteCandidato(state, index){
      state.candidatos.splice(index, 1)
    },  
    deleteComando(state, index){
      state.comandos.splice(index, 1)
    },  
    deleteCoordinador(state, index){
      state.coordinadores.splice(index, 1)
    },  
    deleteLider(state, index){
      state.lideres.splice(index, 1)
    },   
    deleteRecolector(state, index){
      state.recolectores.splice(index, 1)
    },
    deleteSubCoordinador(state, index){
      state.subcoordinadores.splice(index, 1)
    },  
    deleteUser(state, index){
      state.users.splice(index, 1)
    },
    isLoading(state){
      state.loading = true
    },
    login(state){
      state.loading = true
      state.auth_err = null
    },
    loginSuccess(state, payload){
      // console.log(payload)
      state.tokenApi = null
      state.auth_err = null
      state.auth = true;
      state.loading = false
      state.user = Object.assign({}, payload.user, {token: payload.token.accessToken}, {token_id: payload.token.token.id}, {candidato: payload.candidato}, {comando: payload.comando});
      // state.candidato = Object.assign({}, payload.candidato);
      localStorage.removeItem("token_api");
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    loginFail(state, payload){
      state.loading = false
      state.auth_error = payload.err
    },
    
    logout(state){
      localStorage.removeItem("user");
      localStorage.removeItem("token_api");
      state.auth = false;
      state.user = null;
      state.auth_error = null
      state.tokenApi = null
    },
    noLoading(state){
      state.loading= false
    },
    setComandos(state, comando){
      state.comandos.unshift(comando)
    },
    setLideres(state, lider){
      state.lideres.unshift(lider)
    },
    setUrlApi(state, url){
      state.url = url
    },
    setCandidatos(state, candidato){
      state.candidatos.unshift(candidato)
    }, 
    setCoordinadores(state, coordinador){
      state.coordinadores.unshift(coordinador)
    },    
    setJurados(state, jurado){
      state.jurados.unshift(jurado)
    },
    setPersona(state, persona){
      state.persona = persona
    },
    setRecolector(state, recolector){
      state.recolectores.unshift(recolector)
    },
    setSubCoordinadores(state, subcoordinador){
      state.subcoordinadores.unshift(subcoordinador)
    },  
    setTokenApi(state, res){
      state.tokenApi = res.access_token
      state.token_err = false
      localStorage.setItem('token_api', state.tokenApi);
      state.loading = false
    },
    setUsers(state, user){
      state.users.unshift(user)
    },
    tokenErr(state){
      state.token_err = true
      state.loading = false
    },
  },
  actions: {  
    async getTokenApi({commit}, credentials){

      let json = JSON.stringify(credentials)
      let params = "json="+json
      const respuesta = await axios.post(`http://190.251.52.73:8000/api/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        
      if(respuesta.data.status === 'incorrect'){
        commit("tokenErr")
      }else{
        commit("setTokenApi", respuesta.data)
      }
    },
    getUrlApi({commit}, token){
      axios.get('api/api-url',{
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        // console.log(res.data)
        commit("setUrlApi", res.data[0].ip_publica)
      }).
      catch(err => {
        console.log(err)
      })
    },  
    login({commit}){
      commit("login");
    },
  },
  modules: {
    agendas,
    calendarios,
    metas,
    turnos,
    votantes
  }
});

export default store;