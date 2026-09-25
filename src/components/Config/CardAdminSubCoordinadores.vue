<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
        <template #title>
            <GestionSubCoordinadores ref="gestionSubCoordinadores"></GestionSubCoordinadores>
            <ModalGenerateToken ref="modalToken" />
            <div class="d-flex justify-content-between my-2">
                <div>
                    <h3>Gestión de sub coordinadores</h3>
                </div>
                <div>
                    <button class="btn btn-primary" @click="newSubCoordinador">Nuevo sub coordinador</button>
                </div>
            </div>
            <div class="table-responsive tabla">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Identificación</th>
                            <th>Nombres</th>
                            <th>Datos personales</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody v-if="!spinner">
                        <tr v-for="(item, index) in $store.state.subcoordinadores" :key="index">
                            <td>{{ item.id }}</td>
                            <td>{{ item.nombres }} {{ item.apellidos }}</td>
                            <td>{{ item.direccion }} / {{ item.barrio }} <br> {{ item.telefono }}</td>
                            <td>
                                <b-icon icon="pencil-square" aria-hidden="true" @click="editSubCoordinador(item, index)"></b-icon>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <b-spinner label="Spinning" ></b-spinner>
                    </tbody>
                </table>
            </div>
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios'
    import GestionSubCoordinadores from '../Config/coordinador/GestionSubCoordinadores.vue'
    import ModalGenerateToken from "../Token/GenerateToken.vue";
    export default{
        components:{
            GestionSubCoordinadores,
            ModalGenerateToken
        },
        data(){
            return{
                spinner: false
            }
        },
        mounted(){
            if(this.$store.state.tokenApi === null){
                this.$refs.modalToken.showModalGenerate()
			}
            this.$store.state.subcoordinadores = []
            this.getSubCoordinadores()
        },
        methods:{
            editSubCoordinador(item, index){
                this.$refs.gestionSubCoordinadores.editSubCoordinador(item, index)
            },
            getSubCoordinadores(){
                this.spinner = true
                axios.get(`api/subcoordinadores/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    for (let i = 0; i < res.data.subcoordinadores.length; i++) {
                        this.$store.commit('setSubCoordinadores', res.data.subcoordinadores[i]) 
                    }
                    this.spinner = false
                })
                .catch(err => {
                    this.spinner = false
                    console.log(err)
                })
            },
            newSubCoordinador(){
                this.$refs.gestionSubCoordinadores.newSubCoordinador()
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
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>