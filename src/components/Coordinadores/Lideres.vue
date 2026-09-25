<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}" v-if="show">
        
        <GestionLideres ref="gestion"></GestionLideres>
        <DeleteLideres ref="delete" />
        <ModalConteoMilitantes ref="conteoMilitantes" />
        <GestionUser ref="gestionUser" />
        <template #title>
            <div v-if="loader">
                <Loading />
            </div>
            <div v-else>
                <div class="d-flex justify-content-between my-2">
                    <div>
                        <h5 v-if="lider">LIDERES DE {{ nombre_coordinador }}</h5>
                        <h5 v-else>LIDERES DE {{ nombre_lider }}</h5>
                    </div>
                    <div v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                        <button class="btn btn-dark" @click="regresar"><b-icon icon="arrow-left"></b-icon> Atras</button>
                    </div>
                    <div>    
                        <button class="btn btn-success mr-2" @click="descargarExcel" ><b-icon icon="file-earmark-excel"></b-icon></button>
                        <button class="btn btn-primary mr-2" @click="newLider"><b-icon icon="file-plus"></b-icon></button>
                        <button class="btn btn-danger" @click="deleteLider" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2"><b-icon icon="trash"></b-icon></button>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12 col-md-6">
                        <input 
                            type="text" 
                            class="form-control" 
                            v-model="searchTerm" 
                            :placeholder="lider ? 'Buscar por lider...' : 'Buscar por sublider...'"
                        />
                    </div>
                </div>
                <div class="table-responsive tabla" style="max-height: 600px; overflow-y: auto;">
                    <table class="table text-center" id="tabla">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Lider</th>
                                <th>Direccion</th>
                                <th>Telefono</th>
                                <th>Meta</th>
                                <th v-if="lider"># Sublideres</th>
                                <th># Militantes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredLideres" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nombres + ' ' + item.apellidos }}</td>
                                <td>{{ item.direccion }}</td>
                                <td>{{ item.telefono }}</td>
                                <td>{{ item.meta_votantes }}</td>
                                <td v-if="lider">
                                    <b-badge variant="danger" @click="getSublideres(item.id)" role="button" v-if="item.numero_sublideres > 0">{{ item.numero_sublideres }}</b-badge>                                    
                                </td>
                                <td>{{ item.total_militantes }}</td>
                                <td>                                    
                                    <b-icon icon="pencil-square" aria-hidden="true" @click="editLider(item, index)" class="mr-1"></b-icon>
                                    <!-- <b-icon icon="pie-chart" aria-hidden="true" @click="showMilitantes(item)" ></b-icon> -->
                                    
                                    <span v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                                        <a :href="'https://apidemo.convexosit.co/excel-coordinadores/' + $store.state.user.token_id + '/' + id  + '/' + item.id + '/-1'" v-if="lider"><b-icon icon="file-earmark-excel" style="color: #198754; text-decoration: none; height: 1.5em; width: 1.5em;"></b-icon></a>
                                        <a :href="'https://apidemo.convexosit.co/excel-coordinadores/' + $store.state.user.token_id + '/' + id  + '/' + lidere_id + '/' + item.id " v-else><b-icon icon="file-earmark-excel" style="color: #198754; text-decoration: none; height: 1.5em; width: 1.5em;"></b-icon></a>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td :colspan="lider ? 6 : 5"><h5>Total militantes</h5></td>
                                <td><h5>{{ totalMilitantesFiltrados }}</h5></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </template>
    </a-card>
</template>
<script>

    import GestionLideres from "../Config/lider/GestionLideres.vue";
    import Loading from '../Loader/Loading.vue';
    import axios from 'axios';
    import DeleteLideres from '../Config/lider/DeleteLideres.vue';
    import ModalConteoMilitantes from "./ModalConteoMilitantes.vue";
    import GestionUser from "../Config/user/GestionUser.vue";

    export default {
        props:['id'],
        components:{
            GestionLideres,
            Loading,
            DeleteLideres,
            ModalConteoMilitantes,
            GestionUser
        },
        data(){
            return{
                lider: false,
                lideres: [],
                lidere_id: null,
                loader: false,
                nombre_coordinador: '',
                nombre_lider: '',
                searchTerm: '',
                show:false,
                sublider: false,
                totalMilitantes: 0
            }
        },
        mounted(){       
        },
        methods: {
            descargarExcel(){
                const $tabla = document.querySelector("#tabla");
                let tableExport = new TableExport($tabla, {
                    exportButtons: false, 
                    filename: "lideres" + Date.now(),
                    sheetname: "lideres",
                });
                let datos = tableExport.getExportData();
                let preferenciasDocumento = datos.tabla.xlsx;
                tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
            },
            deleteLider(){
                this.$refs.delete.showLider()
            },
            editLider(item, index){
                const tipo = (this.lider) ? 1 : 2;
                this.$refs.gestion.editLider(item, index, tipo)
            },
            getLideres(id){
                this.totalMilitantes = 0;
                this.show = true;
                this.loader = true;
                this.$store.state.lideres = [];
                this.lider = true;
                this.sublider = false;
                
                axios.get(`api/coordinadores/${id}/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        this.loader = false;
                        
                        this.nombre_coordinador = (this.$store.state.user.role_id === 6)? this.$store.state.user.name : res.data.lideres[0].nombres_coordinador + ' ' + res.data.lideres[0].apellidos_coordinador

                        for (let i = 0; i < res.data.lideres.length; i++) {
                            this.calcularTotalMilitantes(res.data.lideres[i].total_militantes)
                            this.$store.commit('setLideres', res.data.lideres[i]) 
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        this.loader = false;
                    })
            },
            getSublideres(id){
                this.loader = true;
                this.show = true;
                this.sublider = true;
                this.lider = false;
                this.nombre_lider = '';
                this.$store.state.lideres = [];
                axios.get(`api/sublideres/${id}/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        this.loader = false;
                        const liderPrincipal = (res.data.lider && res.data.lider.length > 0) ? res.data.lider[0] : null;
                        const primerSublider = (res.data.sublideres && res.data.sublideres.length > 0) ? res.data.sublideres[0] : null;

                        this.lidere_id = liderPrincipal ? liderPrincipal.id : null;

                        if(liderPrincipal){
                            this.nombre_lider = liderPrincipal.nombres_lider + ' ' + liderPrincipal.apellidos_lider;
                        }else if(primerSublider){
                            this.nombre_lider = primerSublider.nombres_lider + ' ' + primerSublider.apellidos_lider;
                        }else{
                            this.nombre_lider = '';
                        }

                        for (let i = 0; i < res.data.sublideres.length; i++) {
                            this.$store.commit('setLideres', res.data.sublideres[i]) 
                        }

                        if(liderPrincipal){
                            this.$store.commit('setLideres', liderPrincipal)
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        this.loader = false;
                    })
            },
            newLider(){
                this.$refs.gestion.newLider()
            },
            regresar(){
                this.show = false;
                this.$emit('reset');
            },
            showMilitantes(item){
                const nombre = item.nombres + ' ' + item.apellidos
                const tipo = (this.lider) ? 1 : 2;
                axios.get(`api/lideres-militantes/${item.id}/${this.$store.state.user.candidato_id}/${tipo}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        const num_militantes = res.data.numero_militantes[0].total_militantes 
                        this.$refs.conteoMilitantes.setChart(item.meta_votantes, num_militantes, tipo, nombre)
                    })
                    .catch(err => console.log(err))     
            },
            calcularTotalMilitantes(militantes){
                this.totalMilitantes += militantes;
            }
        },
        computed: {
            filteredLideres() {
                let result;
                if (!this.searchTerm) {
                    result = this.$store.state.lideres;
                } else {
                    const search = this.searchTerm.toLowerCase();
                    result = this.$store.state.lideres.filter(item => {
                        const fullName = (item.nombres + ' ' + item.apellidos).toLowerCase();
                        return fullName.includes(search);
                    });
                }
                // Ordenar por total_militantes de mayor a menor
                return result.slice().sort((a, b) => (b.total_militantes || 0) - (a.total_militantes || 0));
            },
            totalMilitantesFiltrados() {
                return this.filteredLideres.reduce((total, item) => {
                    return total + (item.total_militantes || 0);
                }, 0);
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
    svg.bi-pie-chart.b-icon.bi{
        color: #C60000;
        cursor: pointer !important;
        height: 1.5em;
        width: 1.5em;
    }
    svg.bi-person.b-icon.bi{
        color: blue;
        cursor: pointer !important;
        height: 1.5em;
        width: 1.5em;
    }
    
</style>