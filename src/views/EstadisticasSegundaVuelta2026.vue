<template>    
    <a-card :bordered="false" class="header-solid h-full statistics-report" :bodyStyle="{padding: 0,}">
        <template #title>
            <h3>Estadísticas segunda vuelta 2026</h3>
            <div id="filtros-segunda-vuelta-2026" v-if="mostrarFiltros" class="row mt-3" >
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
                        v-model="candidatoSeleccionado"
                        @input="seleccionarCandidato"
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
                        <input class="form-check-input" type="radio" name="flexRadioDefault" v-model="estadistica.tipo_reporte" id="detallado" value="2" :disabled="!tieneMunicipio">
                        <label class="form-check-label" for="detallado">
                            Detallado
                        </label>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                    <button v-show="mostrarFiltros" class="btn btn-danger" :disabled="spin" @click="generarEstadistica">{{ spin ? 'Generando…' : 'Generar reporte' }}</button>
                    <button class="btn btn-danger" :aria-expanded="String(mostrarFiltros)" aria-controls="filtros-segunda-vuelta-2026" @click="mostrarFiltros = !mostrarFiltros">
                        {{ mostrarFiltros ? 'Ocultar filtros' : 'Modificar filtros' }}
                    </button>
                </div>
                <h4 v-if="reporteGenerado"><strong>Total votos del reporte: </strong>{{ new Intl.NumberFormat('es-CO').format(totalVotos) }}</h4>
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
                <ResumenVotacion v-if="estadisticas.length" :rows="estadisticas" :year="2026" />
                <div v-if="!estadisticas.length" class="statistics-empty">{{ reporteGenerado ? 'No se encontraron resultados para los filtros seleccionados.' : 'Selecciona los filtros y genera el reporte para visualizar los resultados.' }}</div>
                <div v-else class="table-responsive my-3 tabla" tabindex="0" aria-label="Detalle de resultados electorales">
                    <table class="table">
                        <thead>
                            <tr>
                                <th v-if="columnaTerritorial">{{ columnaTerritorial.titulo }}</th>
                                <th v-if="mostrarPuesto">Puesto</th>
                                <th>Partido</th>
                                <th>Candidato</th>
                                <th>Total votos</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in estadisticas" :key="index">
                                <td v-if="columnaTerritorial">{{ item[columnaTerritorial.campo] }}</td>
                                <td v-if="mostrarPuesto">{{ item.PUESNOMBRE }}</td>
                                <td>{{ item.partido }}</td>
                                <td>{{ item.CAN }} - {{ item.CANNOMBRE }}</td>
                                <td>{{ new Intl.NumberFormat('es-CO').format(item.total) }}</td>
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

const todos = { text: 'Todos', value: -1 }
const normalizar = value => value === null || value === undefined || value === '' ? -1 : value

export default {
    components: { ModelSelect, ResumenVotacion },
    data() {
        return {
            departamentos: [todos], municipios: [todos], puestos: [todos], partidos: [todos], candidatos: [todos],
            estadistica: { corporacion: 3, departamento: -1, municipio: -1, puesto: -1, partido: -1, candidato: -1, tipo_reporte: 1 },
            estadisticas: [], errores: null,
            candidatoSeleccionado: -1,
            mostrarFiltros: true, reporteGenerado: false, tipoReporteGenerado: null,
            filtrosReporteGenerado: null,
            spin: false, spinPuesto: false, spinPartido: false, spinCandidato: false,
            solicitudes: {}
        }
    },
    created() {
        this.getDepartamentos()
        this.getCandidatos()
    },
    methods: {
        reiniciar(campos) {
            campos.forEach(([campo, lista, spinner]) => {
                this.estadistica[campo] = -1
                if (campo === 'candidato') this.candidatoSeleccionado = -1
                this[lista] = [todos]
                this.solicitudes[lista] = (this.solicitudes[lista] || 0) + 1
                if (spinner) this[spinner] = false
            })
        },
        async cargarOpciones(lista, ruta, texto, valor, spinner) {
            const solicitud = (this.solicitudes[lista] || 0) + 1
            this.solicitudes[lista] = solicitud
            if (spinner) this[spinner] = true
            try {
                const { data } = await axios.get(ruta)
                if (this.solicitudes[lista] !== solicitud) return
                if (!Array.isArray(data[lista])) throw new Error('Respuesta inválida')
                // La identidad de cada opción conserva PAR y CAN.
                // El índice distingue cada opción; el reporte sigue enviando PAR y CAN.
                const opciones = data[lista].map((item, indice) => lista === 'candidatos'
                    ? { text: item[texto], value: JSON.stringify([item.PAR, item.CAN, indice]), PAR: item.PAR, CAN: item.CAN }
                    : { text: item[texto], value: item[valor] })
                this[lista] = [todos, ...opciones]
            } catch (error) {
                if (this.solicitudes[lista] === solicitud) {
                    this.errores = `No fue posible cargar ${lista}. Vuelve a seleccionar el filtro para reintentar.`
                }
            } finally {
                if (spinner && this.solicitudes[lista] === solicitud) this[spinner] = false
            }
        },
        getDepartamentos() {
            return this.cargarOpciones('departamentos', 'departamentos', 'departamento', 'id')
        },
        getMunicipios() {
            this.errores = null
            this.reiniciar([
                ['municipio', 'municipios'], ['puesto', 'puestos', 'spinPuesto'],
                ['partido', 'partidos', 'spinPartido'], ['candidato', 'candidatos', 'spinCandidato']
            ])
            const { departamento } = this.estadistica
            const candidatos = this.getCandidatos()
            if (Number(normalizar(departamento)) === -1) return candidatos
            return Promise.all([
                this.cargarOpciones('municipios', `municipios/${departamento}`, 'municipio', 'id'),
                this.cargarOpciones('partidos', `partidos_segunda_vuelta2026/${departamento}`, 'partido', 'PAR', 'spinPartido'),
                candidatos
            ])
        },
        getCandidatos() {
            this.errores = null
            this.reiniciar([['candidato', 'candidatos', 'spinCandidato']])
            const { departamento, partido } = this.estadistica
            const parametros = [normalizar(departamento), normalizar(partido)]
                .map(valor => encodeURIComponent(valor)).join('/')
            return this.cargarOpciones('candidatos', `candidatos_segunda_vuelta2026/${parametros}`, 'CANNOMBRE', 'CAN', 'spinCandidato')
        },
        seleccionarCandidato(valor) {
            const candidato = this.candidatos.find(item => item.value === valor)
            this.estadistica.candidato = candidato && candidato.value !== -1 ? candidato.CAN : -1
            if (candidato && candidato.value !== -1) this.estadistica.partido = candidato.PAR
        },
        getPuestos() {
            this.errores = null
            this.reiniciar([['puesto', 'puestos', 'spinPuesto']])
            const { departamento, municipio } = this.estadistica
            if (Number(normalizar(departamento)) === -1 || Number(normalizar(municipio)) === -1) return
            return this.cargarOpciones('puestos', `puestos_segunda_vuelta2026/${departamento}/${municipio}`, 'PUESNOMBRE', 'PUESNOMBRE', 'spinPuesto')
        },
        async generarEstadistica() {
            if (this.spin) return
            this.errores = null
            const filtros = { ...this.estadistica }
            if (!this.tieneMunicipio) {
                filtros.tipo_reporte = 1
                this.estadistica.tipo_reporte = 1
            }
            const parametros = ['departamento', 'tipo_reporte', 'municipio', 'partido', 'candidato', 'puesto']
                .map(campo => encodeURIComponent(normalizar(filtros[campo]))).join('/')
            this.spin = true
            this.estadisticas = []
            this.reporteGenerado = false
            try {
                const { data } = await axios.get(`estadisticas_segunda_vuelta2026/${parametros}`)
                if (data.status !== 'success' || !Array.isArray(data.estadisticas)) throw new Error('Respuesta inválida')
                this.estadisticas = data.estadisticas
                this.tipoReporteGenerado = filtros.tipo_reporte
                this.filtrosReporteGenerado = filtros
                this.reporteGenerado = true
                this.mostrarFiltros = false
            } catch (error) {
                this.errores = 'No fue posible cargar el reporte. Intenta nuevamente.'
            } finally {
                this.spin = false
            }
        }
    },
    watch: {
        tieneMunicipio(valor) {
            if (!valor) this.estadistica.tipo_reporte = 1
        }
    },
    computed: {
        columnaTerritorial() {
            const filtros = this.filtrosReporteGenerado
            if (!filtros) return null
            if (Number(normalizar(filtros.departamento)) === -1) return { titulo: 'Departamento', campo: 'departamento' }
            if (Number(normalizar(filtros.municipio)) === -1 || this.tipoReporteGenerado == 2) return { titulo: 'Municipio', campo: 'municipio' }
            return null
        },
        mostrarPuesto() {
            return this.filtrosReporteGenerado && Number(normalizar(this.filtrosReporteGenerado.municipio)) !== -1 && this.tipoReporteGenerado == 2
        },
        tieneMunicipio() {
            return Number(normalizar(this.estadistica.departamento)) !== -1 && Number(normalizar(this.estadistica.municipio)) !== -1
        },
        totalVotos() {
            return this.estadisticas.reduce((total, item) => total + (Number(item.total) || 0), 0)
        }
    }
}
</script>
