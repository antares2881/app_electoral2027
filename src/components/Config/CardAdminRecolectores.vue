<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
        <template #title>
            <ModalGenerateToken ref="modalToken" />
            <a-row type="flex">
                <a-col :span="24" :md="16">          
                    <div class="d-flex justify-content-between">
                        <div>
                            <h4><strong>Recolectores</strong></h4>
                        </div>
                        <div>
                            <button class="btn btn-primary" @click="gestionRecolector(null, 1, 0)" v-if="$store.state.user.role_id <= 2">Nuevo</button>
                        </div>    
                    </div>       
                    <div class="table-responsive tabla  mt-3">

                        <table class="table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Cedula</th>
                                    <th>Nombres</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>  
                            <tbody v-if="!loading">
                                <tr v-for="(recolector, index) in $store.state.recolectores" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{recolector.id}}</td>
                                    <td>{{recolector.nombres}} {{recolector.apellidos}}</td>
                                    <td>
                                        <a-icon type="form" theme="outlined" class="iconos editar" v-if="$store.state.user.role_id <= 2" @click="gestionRecolector(recolector, 2, index)" />
                                    </td>
                                </tr>                            
                            </tbody>  
                            <tbody v-else >
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </tbody>
                        </table>  
                    </div>
                </a-col>
            </a-row>
            <GestionRecolector ref="gestionRecolector" />
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios'
    import GestionRecolector from '../Config/recolector/GestionRecolector.vue'
    import ModalGenerateToken from "../Token/GenerateToken.vue";
    export default {
        components:{
           GestionRecolector,
           ModalGenerateToken
        },
        data() {
            return {
                loading: false,
                recolectores: []
            }
        },
        mounted() {
            if(this.$store.state.tokenApi === null){
                this.$refs.modalToken.showModalGenerate()
			}
            this.$store.state.recolectores = []
            this.getRecolectores()
        },
        methods: {
            gestionRecolector(item, opc, index){
                // console.log(user)
                this.$refs.gestionRecolector.showModalRecolector(item, opc, index)
            },
            getRecolectores(){

                // this.$store.commit('cleanUsers')
                this.loading = true

                axios.get(`/api/recolectores/${this.$store.state.user.candidato_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    for (let i = 0; i < res.data.recolectores.length; i++) {
                        this.$store.commit('setRecolector',res.data.recolectores[i])                                                
                    }
                    this.loading = false
                    // this.users = this.setUser
                })
                .catch(err => {
                    console.log(err)
                })
            },
            
        },
        computed: {
            getRecolector(){
                return this.$store.getters.getRecolectores
            }
        },
    }
</script>
<style scoped>
	.editar{
		color: orange;
	}
	.iconos{
		font-size: 16pt;
		margin-right: 5px;
        cursor: pointer;
	}
</style>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>