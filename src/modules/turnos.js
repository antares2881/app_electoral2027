import axios from 'axios'

export default{
    state: {        
        turnos: []
    },
    getters: {  
        turnos(state){
          return state.turnos
        },
    },
    mutations: {            
        turnos(state, turnos) {
            state.turnos = turnos;
        }, 
    },
    actions:{  
        getTurnos({commit}, fecha){
            axios.get(`/api/turnos/${fecha}`, {
                headers: {
                    "Authorization": `Bearer ${this.state.user.token}`
                }
            })
            .then((response) => {
                commit('turnos', response.data.turnos)
            })
                
        }
    }
}