import axios from 'axios'

export default{
    state: {
        lideres: []
    },
    getters: {
        getLideres(state){
            return state.lideres
        }
    },
    mutations:{
        deleteLider(state, index){
            state.lideres.splice(index, 1)
        },
        setLideres(state, lider){
            state.lideres.unshift(lider)
        }
    },
    actions:{

    }
}