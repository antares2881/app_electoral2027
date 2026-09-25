<template>
    <div class="row">
        
        <GuardarJurado ref="guardarJurado" />
        <div class="col-6">
            <Persona @setPersona="setPersona" ref="buscarEnPersona" />
        </div>
        <div class="col-6">
            <button class="btn btn-primary" @click="buscar">Buscar</button>
        </div>
        <div class="col-12 text-center">
            <Loading v-if="loader" />
        </div>
    </div>
</template>
<script>

    import Persona from '../../Persona/Persona.vue'
    import GuardarJurado from './ModalGuardarJurado.vue'
    import Loading from '../../Loader/Loading.vue'
    import axios from 'axios'

    export default {
        components: {
            GuardarJurado,
            Persona,
            Loading
        },
        data(){
            return{
                loader: false
            }
        },
        mounted(){
        },
        methods: {
            buscar(){
                this.loader = true
                this.$refs.buscarEnPersona.activarBusqueda()
            },
            juradoRepetido(persona){
                axios.get(`api/jurados/${persona.cedula}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.jurado !== null){
                            this.$refs.guardarJurado.editarJurado(res.data.jurado)
                        }else{
                            persona.direccion = null
                            persona.telefono = null
                            persona.celular = null
                            persona.correo = null
                            persona.neducativo_id = null
                            persona.filiacionpolitica_id = null
                            persona.filiacionpolitica_id = null
                            persona.tipoempleado_id = null

                            this.$refs.guardarJurado.nuevoJurado(persona, 0)
                        }
                        this.loader = false
                        console.log(res.data.jurado)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            setPersona(){
                const persona = this.getPersona     
                this.juradoRepetido(persona)                
            }
        },  
        computed:{
            getPersona(){                
                return this.$store.getters.getPersona
            }
        }
    }
</script>
