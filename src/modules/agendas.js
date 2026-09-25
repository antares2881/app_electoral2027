import axios from 'axios'

export default{
    state: {        
        fechas: [],
        lideres: [],
        coordinadores: []
    },
    getters: {  
        coordinadores(state){
            return state.coordinadores
        },
        lideres(state){
            return state.lideres
        },
        format_date(state){
          return state.fecha
        },
    },
    mutations: {            
        formating_date(state, fecha) {
            state.fecha = fecha;
        },    
        updateCoordinadores(state, coordinadores){
            state.coordinadores = coordinadores
        },
        updateLideres(state, lideres){
            state.lideres = lideres
        }
    },
    actions:{        
        formating_date({commit}, dateToFormat){
            const d = new Date(dateToFormat);
            const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
            const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
            const year = d.getFullYear();
            commit("formating_date", `${year}-${month}-${day}`);
        },  
        getFechas({commit}, fecha){
            axios.get(`/api/fecha_cumple/${fecha}`, {
                headers: {
                    "Authorization": `Bearer ${this.state.user.token}`
                }
            }).then((response) => {
                commit('updateLideres', response.data.lideres)
                commit('updateCoordinadores', response.data.coordinadores)               

            })
        }
    }
}