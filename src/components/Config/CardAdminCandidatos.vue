<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>

        <a-card :bordered="false" class="header-solid h-full personal-admin" :bodyStyle="{padding: 0,}">
            <template #title>
                <GestionCandidatos ref="gestionCandidato" />
                <div class="personal-cabecera">
                    <div>
                        <h3>Gestión de candidatos</h3>
                    </div>
                    <!-- <div>
                        <button class="btn btn-dark" @click="newCandidato" v-if="$store.state.user.candidato[0].corporacione_id !== 5">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 00-6 6 2 2 0 002 2h8a2 2 0 002-2 6 6 0 00-6-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" fill="currentColor"/>
                            </svg>
                            Nuevo candidato
                        </button>
                    </div> -->
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Corporación</th>
                                <th>Nombres</th>
                                <th>Partido</th>
                                <th>Territorio</th>
                                <th>Meta votación</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-for="(item, index) in $store.state.candidatos" :key="index">
                            <tr>
                                <td>{{ item.corporacion }}</td>
                                <td>{{ item.nombres }}</td>
                                <td>{{ item.partido }}</td>
                                <td>{{ item.departamento }} / {{ item.municipio }}</td>
                                <td>{{ item.meta_votacion }}</td>
                                <td>
                                    <b-icon icon="pencil-square" aria-hidden="true" @click="editCandidato(item, index)"></b-icon>
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
    import GestionCandidatos from './candidato/GestionCandidatos.vue'
    import Loading from '../Loader/Loading.vue'
    export default{
        components:{
            GestionCandidatos, Loading
        },
        data(){
            return{
                loader: true
            }
        },
        mounted(){
            this.$store.state.candidatos = []
            this.getCandidatos()
        },
        methods:{            
            editCandidato(item, index){
                this.$refs.gestionCandidato.editCandidato(item, index)                
            },
            getCandidatos(){
                let corporacion = this.$store.state.user.candidato[0].corporacione_id
                axios.get(`api/candidatos/${corporacion}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data.candidatos[0])
                    for (let i = 0; i < res.data.candidatos.length; i++) {
                        this.$store.commit('setCandidatos', res.data.candidatos[i]) 
                    }
                    this.loader = false
                })
                .catch(err => {
                    this.loader = false
                    console.log(err)
                })
            },
            newCandidato(){
                this.$refs.gestionCandidato.newCandidato()
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
<style scoped src="../../assets/styles/personal-admin.css"></style>
