<template>    
    <a-card :bordered="false" class="header-solid h-full statistics-report" :bodyStyle="{padding: 0,}">
        <template #title>
            <h3>Estadísticas Congreso 2022</h3>
            <div id="filtros-estadisticas-2022" v-if="mostrarFiltros" class="row mt-3" >
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="corporacion">Corporación</label>
                    <model-select
                        id="corporacion"
                        :options="corporaciones"
                        v-model="estadistica.corporacion"     
                        @input="getDepartamentos"                   
                    ></model-select>
                    <span class="text-danger text-small" v-if="errores">{{ errores.corporacion }}</span>
                </div>
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="departamento">Departamento</label>
                    <model-select
                        id="departamento"
                        :options="departamentos"
                        v-model="estadistica.departamento"      
                        @input="getMunicipios"                  
                    ></model-select>
                    <span class="text-danger text-small" v-if="errores">{{ errores.departamento }}</span>
                </div>
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="municipio">Municipio</label>
                    <model-select
                        id="municipio"
                        :options="municipios"
                        v-model="estadistica.municipio"   
                        @input="getPuestos"
                    ></model-select>
                    <span class="text-danger text-small" v-if="errores">{{ errores.municipio }}</span>
                </div>
                <div class="col-12 col-sm-3 mb-3 text-center" v-if="spinPuesto">
                <a-spin size="small" />
            </div> 
            <div class="col-12 col-sm-3 mb-3" v-else>
                <label for="puesto">Puesto</label>
                <model-select
                    id="puesto"
                    :options="puestos"
                    v-model="estadistica.puesto"
                ></model-select>
                <span class="text-danger text-small" v-if="errores">{{ errores.municipio }}</span>
            </div>
                <div class="col-12 col-sm-4 mb-3 text-center" v-if="spinPartido">
                    <a-spin size="small" />
                </div> 
                <div class="col-12 col-sm-4 mb-3" v-else>
                    <label for="partido">Partido</label>
                    <model-select
                        id="partido"
                        :options="partidos"
                        v-model="estadistica.partido"
                        @input="getCandidatos"
                    ></model-select>
                </div>         
                <div class="col-12 col-sm-4 mb-3 text-center" v-if="spinCandidato">
                    <a-spin size="small" />
                </div> 
                <div class="col-12 col-sm-4 mb-3" v-else>
                    <label for="candidato">Candidato</label>
                    <model-select
                        id="candidato"
                        :options="candidatos"
                        v-model="estadistica.candidato"
                    ></model-select>
                </div>
                <div class="col-12 col-sm-4 mb-3">
                    <label for="candidato">Tipo de reporte: </label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" v-model="estadistica.tipo_reporte" id="general" value="1">
                        <label class="form-check-label" for="general">
                            General
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" v-model="estadistica.tipo_reporte" id="detallado" value="2">
                        <label class="form-check-label" for="detallado">
                            Detallado
                        </label>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                    <button v-show="mostrarFiltros" class="btn btn-danger" :disabled="spin" @click="generarEstadistica">{{ spin ? 'Generando…' : 'Generar reporte' }}</button>
                    <button class="btn btn-danger" :aria-expanded="String(mostrarFiltros)" aria-controls="filtros-estadisticas-2022" @click="mostrarFiltros = !mostrarFiltros">
                        {{ mostrarFiltros ? 'Ocultar filtros' : 'Modificar filtros' }}
                    </button>
                </div>
                <h4 v-if="reporteGenerado"><strong>Total votos: </strong>{{ new Intl.NumberFormat('es-CO').format(totalVotos) }}</h4>
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
                <ResumenVotacion v-if="estadisticas.length" :rows="estadisticas" :year="2022" />
                <div v-if="!estadisticas.length" class="statistics-empty">{{ reporteGenerado ? 'No se encontraron resultados para los filtros seleccionados.' : 'Selecciona los filtros y genera el reporte para visualizar los resultados.' }}</div>
                <div v-else class="table-responsive my-3 tabla" tabindex="0" aria-label="Detalle de resultados electorales">
                    <table class="table">
                        <thead>
                            <tr>
                                <th v-if="tipoReporteGenerado == 2">Municipio</th>
                                <th v-if="tipoReporteGenerado == 2">Puesto</th>
                                <th>Partido</th>
                                <th>Candidato</th>
                                <th>Total votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in estadisticas" :key="index">
                                <td v-if="tipoReporteGenerado == 2">{{ item.municipio }}</td>
                                <td v-if="tipoReporteGenerado == 2">{{ item.PUESNOMBRE }}</td>
                                <td>{{ item.partido }}</td>
                                <td>{{ item.CAN }} - {{ item.CANNOMBRE }}</td>
                                <td>{{ new Intl.NumberFormat().format(item.total) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </template>
    </a-card>
</template>
<script>
    import { ModelSelect } from 'vue-search-select'
    import axios from 'axios'
    import ResumenVotacion from '../components/Estadisticas/ResumenVotacion.vue'
    import '../assets/styles/estadisticas.css'
    export default{
        components:{
            ModelSelect,
            ResumenVotacion
        },
        data(){
            return{                
                candidatos: [],
                corporacion: null,
                corporaciones: [
                    {text: 'SENADO', value: 1}, {text: 'CAMARA', value: 2}, {text: 'CITREP', value: 7}
                ],
                departamentos: [],
                errores: null,
                estadistica: {departamento: -1, municipio: -1, candidato: -1, corporacion: null, partido: -1, tipo_reporte: 1, puesto: -1},
                estadisticas: [],
                mostrarFiltros: true,
                reporteGenerado: false,
                tipoReporteGenerado: null,
                municipios: [],
                partidos: [],
                puestos: [],
                reaonly: false,
                spin: false,
                spinCandidato: false,
                spinPartido: false,
                spinPuesto: false
            }
        },
        mounted(){ 
            // this.getCandidatos()
        },
        methods:{
            generarEstadistica(){
                if(this.spin) return
                this.errores = null
                // console.log(this.estadistica)
                this.spin = true
                if(this.estadistica.corporacion === null || this.estadistica.corporacion === "" || this.estadistica.corporacion === undefined ){
                    Swal.fire({
                        icon: 'error',
                        title: 'Atencion',
                        text: 'Elija una corporacion valida'
                    })
                    this.spin = false
                    return;
                }

                if(this.estadistica.departamento === null || this.estadistica.departamento === "" || this.estadistica.departamento === undefined ){
                    Swal.fire({
                        icon: 'error',
                        title: 'Atencion',
                        text: 'Elija un departamento valido'
                    })
                    this.spin = false
                    return;
                }                
                
                if(this.estadistica.municipio === null || this.estadistica.municipio === "" || this.estadistica.municipio === undefined){
                    this.estadistica.municipio = -1
                }

                if(this.estadistica.partido === null || this.estadistica.partido === "" || this.estadistica.partido === undefined){
                    this.estadistica.partido = -1
                }

                if(this.estadistica.candidato === null || this.estadistica.candidato === "" || this.estadistica.candidato === undefined){
                    this.estadistica.candidato = -1
                }

                // this.estadistica.corporacione_id = this.$store.state.user.candidato[0].corporacione_id
                const tipoReporte = this.estadistica.tipo_reporte
                return axios.get(`https://apiserver.convexosit.co/estadisticas2022/${this.estadistica.corporacion}/${this.estadistica.departamento}/${this.estadistica.tipo_reporte}/${this.estadistica.municipio}/${this.estadistica.partido}/${this.estadistica.candidato}/${this.estadistica.puesto}`)
                .then(res => {
                    if(res.data.status === 'success' && Array.isArray(res.data.estadisticas)){
                        this.estadisticas = res.data.estadisticas
                        this.tipoReporteGenerado = tipoReporte
                        this.reporteGenerado = true
                        this.mostrarFiltros = false
                    }else{
                        this.errores = res.data
                    }
                    this.spin = false
                    })
                    .catch(err => {
                        console.log(err)
                        this.errores = 'No fue posible cargar el reporte. Intenta nuevamente.'
                        this.spin = false
                    })
            },
            getCandidatos(){
                this.spinCandidato = true;
                this.candidatos = []
                this.estadistica.candidato = null
                if(this.estadistica.partido === null || this.estadistica.partido === '' || this.estadistica.partido === undefined){
                    this.estadistica.partido = -1
                }
                axios.get(`https://apiserver.convexosit.co/candidatos2022/${this.estadistica.departamento}/${this.estadistica.corporacion}/${this.estadistica.partido}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.candidatos.length; i++) {
                            this.candidatos.push({
                                text: res.data.candidatos[i].CANNOMBRE,
                                value: res.data.candidatos[i].CAN,
                            })                            
                        }
                        this.spinCandidato = false;                    
                    })
                    .catch(err => {
                        this.spinCandidato = false;                    
                        console.log(err)
                    })
            },
            getDepartamentos(){
                this.departamentos = [];
                axios.get('https://apiserver.convexosit.co/departamentos', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.departamentos.length > 0){
                            for (let i = 0; i < res.data.departamentos.length; i++) {
                                this.departamentos.push({
                                    text: res.data.departamentos[i].departamento,
                                    value: res.data.departamentos[i].id,
                                })                            
                            }
                        }
                    })
                    .catch(err => console.log(err))
                
            },
            getMunicipios(){

                this.municipios = []

                axios.get(`https://apiserver.convexosit.co/municipios/${this.estadistica.departamento}`, {
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
                
                this.getPartidos();
                    
            },
            getPartidos(){
                this.spinPartido = true
                this.partidos = []
                axios.get(`https://apiserver.convexosit.co/partidos2022/${this.estadistica.departamento}/${this.estadistica.corporacion}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.partidos.length; i++) {
                            this.partidos.push({
                                text: res.data.partidos[i].partido,
                                value: res.data.partidos[i].PAR
                            })                            
                        }
                        this.spinPartido = false;
                    })
                    .catch(err => {
                        this.spinPartido = false;
                        console.log(err)
                    })
                    this.getCandidatos();
            },
            
            getPuestos(){
                this.spinPuesto = true
                this.puestos = []
                axios.get(`https://apiserver.convexosit.co/puestos2022/${this.estadistica.departamento}/${this.estadistica.municipio}`)
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.puestos.length; i++) {
                            this.puestos.push({
                                text: res.data.puestos[i].PUESNOMBRE,
                                value: res.data.puestos[i].PUESNOMBRE
                            })                            
                        }
                        this.spinPuesto = false;
                    })
                    .catch(err => {
                        this.spinPuesto = false;
                        console.log(err)
                    })
            }
        },
        computed:{
            totalVotos(){ //suma todos los votos en el array estadisticas.
                return this.estadisticas.reduce((a, b) => a + parseInt(b.total), 0)
            }
        }
    }
</script>
