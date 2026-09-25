<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
        <template #title>
            <h3>Estadisticas locales 2019</h3>
            <div class="row mt-3" >
                <div class="col-12 col-sm-6 mb-3" >
                    <label for="municipio">Municipio</label>
                    <model-select
                        id="municipio"
                        :options="municipios"
                        v-model="estadistica.municipio_id"
                    ></model-select>
                </div>
                <div class="col-12 col-sm-5 mb-3">
                    <label for="corporacion">Corporacion</label>
                    <model-select
                        id="corporacion"
                        :options="corporaciones"
                        v-model="estadistica.corporacione_id"
                        @input="getCandidatos"
                    ></model-select>
                </div>
                <div class="col-12 col-sm-5 mb-3">
                    <label for="candidato">Candidato</label>
                    <model-select
                        id="candidato"
                        :options="candidatos"
                        v-model="estadistica.candidato_id"
                    ></model-select>
                </div><!-- 
                <div class="col-12 col-sm-2 mb-3">
                    <label for="zona">Zona</label>
                    <model-select
                        id="zona"
                        :options="zonas"
                        v-model="estadistica.zona"
                        @input="getPuestos"
                    ></model-select>
                </div>
                <div class="col-12 col-sm-5 mb-3">
                    <label for="puesto">Puesto</label>
                    <model-select
                        id="puesto"
                        :options="puestos"
                        v-model="estadistica.puesto"
                    ></model-select>
                </div> -->
                
                
                <div class="col-12 mb-3">
                    <div class="d-flex justify-content-between">
                        <div>
                            <button class="btn btn-primary" @click="generarEstadistica">Generar</button>
                        </div>
                        <div v-if="estadisticas.length > 0">
                            <h4><strong>Total votos: </strong>{{ new Intl.NumberFormat().format(totalVotos) }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" v-if="errores">
                <p class="col-12 alert alert-danger">{{ errores }}</p>
            </div>
            <div class="row justify-content-center mt-3" v-if="spin">
                <div class="col-4">
                    <a-spin size="large"/>
                </div>
            </div>
            <div v-else>
                <div class="table-responsive my-3 tabla">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Candidato</th>
                                <th>Municipio</th>
                                <th>Zona</th>
                                <th>Puesto</th>
                                <th>Total votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in estadisticas" :key="index">
                                <td>{{ item.nombres }}</td>
                                <td>{{ item.municipio }}</td>
                                <td>{{ item.zona }}</td>
                                <td>{{ item.nombre_puesto }}</td>
                                <td>{{ new Intl.NumberFormat().format(item.votos) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </a-card>
</template>
<script>
    import { ModelSelect } from '../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    import axios from 'axios'
    export default{
        components:{
            ModelSelect
        },
        data(){
            return{
                candidatos: [],
                corporacion: null,
                corporaciones: [
                    {text: 'Alcalde', value: 4},
                    {text: 'Concejo', value: 5},
                    {text: 'Asamblea', value: 6},
                    {text: 'Gobernador', value: 7},
                ],
                errores: null,
                estadistica: {zona: -1, puesto: -1, partido_id: -1, candidato_id: -1},
                estadisticas: [],
                municipios: [],
                partidos: [],
                puestos: [],
                reaonly: false,
                spin: false,
                zonas: []
            }
        },
        mounted(){       
            // this.getCorporaciones()
            this.getMunicipios()
            this.getPartidos()
            // this.setValues()
            // this.getCandidatos()
        },
        methods:{
            generarEstadistica(){
                this.spin = true
                if(this.estadistica.municipio_id === null || this.estadistica.municipio_id < 0 || this.estadistica.municipio_id === '' || this.estadistica.municipio_id === undefined){
                    Swal.fire({
                        icon: 'error',
                        title: 'Atencion',
                        text: 'El municipio no puede estar vacio'
                    })
                    this.spin = false
                    return;
                }
                if(this.estadistica.candidato_id === undefined){
                    this.estadistica.candidato_id = -1
                }
                if(this.estadistica.zona === undefined){
                    this.estadistica.zona = -1
                }
                if(this.estadistica.puesto === undefined){
                    this.estadistica.puesto = -1
                }
                // this.estadistica.corporacione_id = this.$store.state.user.candidato[0].corporacione_id
                axios.post('api/estadisticas2019', this.estadistica, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    if(res.data.status === 'success'){
                        this.estadisticas = res.data.estadisticas
                    }else{
                        this.errores = res.data
                    }
                    this.spin = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getCandidatos(){
                this.candidatos = []
                let corporacion = this.estadistica.corporacione_id
                axios.get(`api/candidatoestadisticas/${corporacion}/${this.estadistica.municipio_id}/${this.estadistica.partido_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.candidatos.length; i++) {
                            this.candidatos.push({
                                text: res.data.candidatos[i].nombres,
                                value: res.data.candidatos[i].id,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getCorporaciones(){
                this.corporaciones = []
                axios.get('api/corporaciones', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.corporaciones.length; i++) {
                            this.corporaciones.push({
                                text: res.data.corporaciones[i].corporacion,
                                value: res.data.corporaciones[i].id,
                            })                            
                        }
                        this.setCorporacion()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getMunicipios(){
                this.municipios = []
                axios.get(`api/municipios/13`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.municipios.length; i++) {
                            this.municipios.push({
                                text: res.data.municipios[i].municipio,
                                value: res.data.municipios[i].id,
                            })                            
                        }
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getPartidos(){
                this.partidos = []
                axios.get(`api/partidoestadisticas`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.partidos.length; i++) {
                            this.partidos.push({
                                text: res.data.partidos[i].partido,
                                value: res.data.partidos[i].id,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getPuestos(){
                this.puestos = []
                axios.get(`api/puestosestadisticas/${this.estadistica.municipio_id}/${this.estadistica.zona}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        for (let i = 0; i < res.data.puestos.length; i++) {
                            this.puestos.push({
                                text: res.data.puestos[i].nombre_puesto,
                                value: res.data.puestos[i].puesto
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getZonas(){
                this.zonas = []
                axios.get(`api/zonasestadisticas/${this.estadistica.municipio_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        for (let i = 0; i < res.data.zonas.length; i++) {
                            this.zonas.push({
                                text: res.data.zonas[i].zona,
                                value: res.data.zonas[i].zona
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            setCorporacion(){
                const corporacion = this.corporaciones.find(({ value }) => value === this.$store.state.user.candidato[0].corporacione_id);

                this.corporacion = corporacion.text
                this.corporacione_id = this.$store.state.user.candidato.corporacione_id
            },
            setValues(){
                const candidato = this.$store.state.user.candidato[0]
                if(candidato.corporacione_id === 6 || candidato.corporacione_id === 7){
                    this.estadistica.municipio_id = null
                }else{
                    this.estadistica.municipio_id = candidato.municipio_id
                    this.reaonly = true
                }
            }
        },
        computed:{
            totalVotos(){ //suma todos los votos en el array estadisticas.
                return this.estadisticas.reduce((a, b) => a + parseInt(b.votos), 0)
            }
        }
    }
</script>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>