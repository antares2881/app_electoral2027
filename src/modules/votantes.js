import axios from 'axios'
export default{
    state: {        
        votantes: []
    },
    getters: {        
        votantes(state){
            return state.votantes
        }
    },
    mutations: {        
        updateVotantes(state, votantes){
            state.votantes = votantes
        }
    },
    actions:{        
        getVotantes({commit}){
            axios.get('/api/listadovotantes', {
                headers: {
                    "Authorization": `Bearer ${this.state.user.token}`
                }
            })
            .then((response) => {
                commit('updateVotantes', response.data.listadovotantes)
            })
                
        }
    }
}