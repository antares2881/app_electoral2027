import axios from 'axios'

export default{
    state: {        
        metas: []
    },
    getters: {  
        metas(state){
          return state.metas
        },
    },
    mutations: {            
        updateMetas(state, metas) {
            state.metas = metas;
        }, 
    },
    actions:{  
        getMetas({commit}){
            axios.get('/api/metas', {
                headers: {
                    "Authorization": `Bearer ${this.state.user.token}`
                }
            })
            .then((response) => {
                commit('updateMetas', response.data.metas)
            })
                
        }
    }
}