import axios from 'axios'

export default{
    state: {        
        calendarios: []
    },
    getters: {  
        calendarios(state){
          return state.calendarios
        },
    },
    mutations: {            
        calendarios(state, calendarios) {
            state.calendarios = calendarios;
        }, 
    },
    actions:{  
        getCalendario({commit}, anio, mes){
            axios.get(`/api/calendarios/${anio}/${mes}`, {
                headers: {
                    "Authorization": `Bearer ${this.state.user.token}`
                }
            })
            .then((response) => {
                commit('calendarios', response.data.calendarios)
            })
                
        }
    }
}