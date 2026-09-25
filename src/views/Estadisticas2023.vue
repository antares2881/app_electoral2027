<template>    
    <a-card :bordered="false" class="header-solid h-full statistics-report" :bodyStyle="{padding: 0,}">
        <template #title>
            <h3>Estadísticas locales 2023</h3>
            <div id="filtros-estadisticas-2023" v-if="mostrarFiltros" class="row mt-3" >
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="corporacion">Corporación</label>
                    <model-select
                        id="corporacion"
                        :options="corporaciones"
                        v-model="estadistica.corporacion"     
                        @input="getMunicipios"                   
                    ></model-select>
                    <span class="text-danger text-small" v-if="errores">{{ errores.corporacion }}</span>
                </div>
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="municipio">Municipio</label>
                    <model-select
                    id="municipio"
                    :options="municipios"
                    v-model="estadistica.municipio"      
                    @input="getComunas"                  
                    ></model-select>
                    <span class="text-danger text-small" v-if="errores">{{ errores.municipio }}</span>
                </div>
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="comuna">Comunas</label>
                    <model-select
                        id="comuna"
                        :options="comunas"
                        v-model="estadistica.comuna"
                        
                    ></model-select>
                </div>  
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="puesto">Puesto</label>
                    <model-select
                        id="puesto"
                        :options="puestos"
                        v-model="estadistica.puesto"      
                        @input='getMesas'                  
                    ></model-select>
                </div>
                <div class="col-12 col-sm-3 mb-3" >
                    <label for="mesa">Mesas</label>
                    <model-select
                        id="mesa"
                        :options="mesas"
                        v-model="estadistica.mesa"   
                    ></model-select>
                </div>      
                <div class="col-12 col-sm-3 mb-3">
                    <label for="partido">Partido</label>
                    <model-select
                        id="partido"
                        :options="partidos"
                        v-model="estadistica.partido"
                        @input="getCandidatos"
                    ></model-select>
                </div>          
                <div class="col-12 col-sm-3 mb-3">
                    <label for="candidato">Candidato</label>
                    <model-select
                    id="candidato"
                    :options="candidatos"
                    v-model="estadistica.candidato"
                    ></model-select>
                </div>
                <div class="col-12 col-sm-3 mb-3">
                    <label for="candidato">Agrupar reporte por: </label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" v-model="estadistica.agrupacion" id="group_comuna" value="1">
                        <label class="form-check-label" for="group_comuna">
                            {{ esReporteDepartamental ? 'Municipios' : 'Comunas' }}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="flexRadioDefault" v-model="estadistica.agrupacion" id="group_candidato" value="2">
                        <label class="form-check-label" for="group_candidato">
                            Candidatos
                        </label>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                    <button v-show="mostrarFiltros" class="btn btn-danger" :disabled="spin" @click="generarEstadistica">{{ spin ? 'Generando…' : 'Generar reporte' }}</button>
                    <button class="btn btn-danger" :aria-expanded="String(mostrarFiltros)" aria-controls="filtros-estadisticas-2023" @click="mostrarFiltros = !mostrarFiltros">
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
                <ResumenVotacion v-if="estadisticas.length" :rows="resultadosReporte" :year="2023" />
                <div v-if="!estadisticas.length" class="statistics-empty">{{ reporteGenerado ? 'No se encontraron resultados para los filtros seleccionados.' : 'Selecciona los filtros y genera el reporte para visualizar los resultados.' }}</div>
                <div v-else class="table-responsive my-3 tabla" tabindex="0" aria-label="Detalle de resultados electorales">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Municipio</th>
                                <th v-if="!reporteResumido">Comuna</th>
                                <th v-if="!reporteResumido">Puesto</th>
                                <th v-if="!reporteResumido">Mesa</th>
                                <th>Partido</th>
                                <th>Candidato</th>
                                <th>Total votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in resultadosReporte" :key="index">
                                <td>{{ item.municipio }}</td>
                                <td v-if="!reporteResumido">{{ item.comuna }}</td>
                                <td v-if="!reporteResumido">{{ item.puesto }}</td>
                                <td v-if="!reporteResumido">{{ item.Mesa }}</td>
                                <td>{{ item.partido }}</td>
                                <td>{{ item.candidato }}</td>
                                <td>{{ new Intl.NumberFormat().format(item.votacion) }}</td>
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
                comunas: [],
                corporacion: null,
                corporaciones: [
                    {text: 'ALCALDE', value: 'ALCALDE'}, {text: 'ASAMBLEA', value: 'ASAMBLEA'}, {text: 'CONCEJO', value: 'CONCEJO'}, {text: 'GOBERNADOR', value: 'GOBERNADOR'}, {text: 'JAL', value: 'JAL'}
                ],
                errores: null,
                estadistica: {municipio: -1, comuna: null, puesto: -1, mesa: -1, candidato: null, corporacion: null, partido: null, agrupacion: 1},
                reporte: null,
                mostrarFiltros: true,
                mesas: [],
                municipios: [],
                partidos: [],
                puestos: [],
                reaonly: false,
                spin: false,
            }
        },
        mounted(){ 
            // this.getCandidatos()
        },
        methods:{
            sinSeleccion(value){
                return value === null || value === undefined || value === '' || String(value) === '-1'
            },
            generarEstadistica(){
                if(this.spin) return
                this.errores = null
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
                if(this.sinSeleccion(this.estadistica.municipio)){
                    if(!this.esReporteDepartamental){
                        Swal.fire({ icon: 'error', title: 'Atención', text: 'Para esta corporación debe elegir un municipio.' })
                        this.spin = false
                        return
                    }
                    this.estadistica.municipio = -1
                    this.estadistica.comuna = -1
                    this.estadistica.puesto = -1
                    this.estadistica.mesa = -1
                }
                if(this.estadistica.comuna === null || this.estadistica.comuna === "" || this.estadistica.comuna === undefined){
                    this.estadistica.comuna = -1
                }
                if(this.estadistica.candidato === null || this.estadistica.candidato === "" || this.estadistica.candidato === undefined){
                    this.estadistica.candidato = -1
                }
                if(this.estadistica.partido === null || this.estadistica.partido === "" || this.estadistica.partido === undefined){
                    this.estadistica.partido = -1
                }
                const filtros = { ...this.estadistica }
                // El reporte conserva los filtros enviados aunque el formulario cambie durante la consulta.
                return axios.get(`estadisticas2023/${filtros.corporacion}/${filtros.municipio}/${filtros.comuna}/${filtros.puesto}/${filtros.mesa}/${filtros.partido}/${filtros.candidato}/${filtros.agrupacion}`)
                .then(res => {
                    if(res.data.status === 'success' && Array.isArray(res.data.estadisticas)){
                        this.reporte = { filtros, filas: res.data.estadisticas }
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
                this.candidatos = []
                this.estadistica.candidato = null
                if(this.estadistica.partido === null || this.estadistica.partido === '' || this.estadistica.partido === undefined){
                    this.estadistica.partido = -1
                }
                axios.get(`candidatoestadisticas/13/${this.estadistica.municipio}/${this.estadistica.corporacion}/${this.estadistica.partido}`)
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.candidatos.length; i++) {
                            this.candidatos.push({
                                text: res.data.candidatos[i].candidato,
                                value: res.data.candidatos[i].id_candidato,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
            },
            getCorporaciones(){
                this.corporaciones = []
                axios.get('corporaciones/13')
                    .then(res => {
                        console.log(res.data)
                        for (let i = 0; i < res.data.corporaciones.length; i++) {
                            this.corporaciones.push({
                                text: res.data.corporaciones[i].corporacion,
                                value: res.data.corporaciones[i].corporacion,
                            })                            
                        }
                        // this.setCorporacion()
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
                    
            },
            getMunicipios(){

                this.municipios = [{ text: 'Todos los municipios', value: -1 }]
                this.estadistica.municipio = -1
                this.estadistica.puesto = -1
                this.estadistica.mesa = -1
                this.puestos = []
                this.mesas = []
                this.comunas = []
                this.candidatos = []
                this.estadistica.comuna = null
                this.estadistica.candidato = null

                axios.get(`municipios/13/${this.estadistica.corporacion}`)
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.municipios.length; i++) {
                            this.municipios.push({
                                text: res.data.municipios[i].municipio,
                                value: res.data.municipios[i].municipio,
                            })                            
                        }
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    this.getPartidos();
                    
            },
            getComunas(){
                this.estadistica.puesto = -1
                this.estadistica.mesa = -1
                this.puestos = []
                this.mesas = []
                this.comunas = []
                this.candidatos = []
                this.estadistica.comuna = null
                this.estadistica.candidato = null
                axios.get(`comunasestadisticas/13/${this.estadistica.municipio}`)
                    .then(res => {
                        for (let i = 0; i < res.data.comunas.length; i++) {
                            this.comunas.push({
                                text: res.data.comunas[i].comuna,
                                value: res.data.comunas[i].cod_comuna
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
                    this.getPuestos();
            },
            getPartidos(){
                this.partidos = []
                axios.get(`partidosestadisticas/13/${this.estadistica.municipio}`)
                    .then(res => {
                        console.log(res.data)
                        for (let i = 0; i < res.data.partidos.length; i++) {
                            this.partidos.push({
                                text: res.data.partidos[i].partido,
                                value: res.data.partidos[i].cod_partido
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
            },
            getPuestos(){
                this.puestos = []
                axios.get(`puestosestadisticas/13/${this.estadistica.municipio}`)
                    .then(res => {
                        console.log(res.data)
                        for (let i = 0; i < res.data.puestos.length; i++) {
                            this.puestos.push({
                                text: res.data.puestos[i].puesto,
                                value: res.data.puestos[i].puesto
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    
            },
            getMesas(){
                this.mesas = [];
                axios.get(`mesasestadisticas/${this.estadistica.puesto}`)
                    .then(res => {
                        for (let i = 0; i < res.data.mesas.length; i++) {
                            this.mesas.push({
                                text: res.data.mesas[i].Mesa,
                                value: res.data.mesas[i].Mesa
                            })                            
                        }
                    })
                    .catch(err => console.log(err))
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
            estadisticas(){
                return this.reporte ? this.reporte.filas : []
            },
            filtrosReporte(){
                return this.reporte ? this.reporte.filtros : null
            },
            reporteGenerado(){
                return this.reporte !== null
            },
            esReporteDepartamental(){
                return ['ASAMBLEA', 'GOBERNADOR'].includes(this.estadistica.corporacion) && this.sinSeleccion(this.estadistica.municipio)
            },
            reportePorMunicipio(){
                return this.filtrosReporte && ['ASAMBLEA', 'GOBERNADOR'].includes(this.filtrosReporte.corporacion) && this.sinSeleccion(this.filtrosReporte.municipio)
            },
            reporteResumido(){
                return this.filtrosReporte && (
                    ['ASAMBLEA', 'GOBERNADOR'].includes(this.filtrosReporte.corporacion) ||
                    Number(this.filtrosReporte.agrupacion) === 2
                )
            },
            resultadosReporte(){
                if(!this.reporteResumido) return this.estadisticas
                const grupos = new Map()
                this.estadisticas.forEach(item => {
                    const key = JSON.stringify([item.municipio, item.partido, item.candidato])
                    if(!grupos.has(key)) grupos.set(key, { ...item, votacion: 0 })
                    grupos.get(key).votacion += Number(item.votacion) || 0
                })
                return Array.from(grupos.values()).sort((a, b) =>
                    String(a.municipio || '').localeCompare(String(b.municipio || ''), 'es') || b.votacion - a.votacion
                )
            },
            totalVotos(){ //suma todos los votos en el array estadisticas.
                return this.estadisticas.reduce((a, b) => a + parseInt(b.votacion), 0)
            }
        }
    }
</script>
