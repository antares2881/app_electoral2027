<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>
        <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
            <GestionComandos ref="gestionComandos" />
            <template #title>
                <div class="d-flex justify-content-between my-2">
                    <div>
                        <h3>Gestión de comandos</h3>
                    </div>
                    <div>
                        <button class="btn btn-primary" @click="newComando">Nuevo comando</button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nombres</th>
                                <th>Proyectados</th>
                                <th>Contacto</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-for="(item, index) in $store.state.comandos" :key="index">
                            <tr>
                                <td>{{ item.nombre }}</td>
                                <td>{{ item.proyectados }}</td>
                                <td>{{ item.contacto }}</td>
                                <td>
                                    <b-icon icon="pencil-square" aria-hidden="true" @click="editComandos(item, index)"></b-icon>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </a-card>
    </div>
</template>
<script>
    import axios from 'axios'
    import Loading from '../Loader/Loading.vue';
    import GestionComandos from '../Config/comando/GestionComando.vue'
    export default{
        components:{
            Loading, GestionComandos
        },
        data(){
            return{
                loader: true
            }
        },
        mounted(){
            this.$store.state.comandos = []
            this.getComandos()
        },
        methods:{            
            editComandos(item, index){
                this.$refs.gestionComandos.editComando(item, index)                
            },
            getComandos(){
                // let corporacion = this.$store.state.user.candidato[0].corporacione_id
                axios.get(`api/comandos`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data.candidatos[0])
                    for (let i = 0; i < res.data.comandos.length; i++) {
                        this.$store.commit('setComandos', res.data.comandos[i]) 
                    }
                    this.loader = false
                })
                .catch(err => {
                    this.loader = false
                    console.log(err)
                })
            },
            newComando(){
                this.$refs.gestionComandos.newComando()
            }
        }
    }
</script>
<style scoped>
    svg.bi-pencil-square.b-icon.bi{
        color: orange;
        cursor: pointer !important;
        height: 1.5em;
        width: 1.5em;
    }
</style>