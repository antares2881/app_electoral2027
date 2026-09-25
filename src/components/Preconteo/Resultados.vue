<template>
    <div class="row resultados-preconteo">
        <div class="col-12" v-if="loader">
            <Loading />
        </div>
        <div class="col-12" v-else>
            <MesasInformadas ref="mesasInformadas" />
            <MesasFaltantes ref="mesasFaltantes" />
            <div class="card filtro-card mb-2">
                <div class="card-body py-2 px-3">
                    <div class="row g-2 align-items-end">
                        <div class="col-12 col-md-6 col-lg-3">
                            <label class="filtro-label">Departamento</label>
                            <select class="form-control form-control-sm" v-model="filtros.dpto" @change="onDepartamentoChange">
                                <option :value="null">Todos</option>
                                <option v-for="(item, index) in departamentos" :key="`dpto-${index}`" :value="item.value">{{ item.text }}</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3">
                            <label class="filtro-label">Municipio</label>
                            <select class="form-control form-control-sm" v-model="filtros.mcpio" @change="onMunicipioChange" :disabled="!filtros.dpto">
                                <option :value="null">Todos</option>
                                <option v-for="(item, index) in municipios" :key="`mcpio-${index}`" :value="item.value">{{ item.text }}</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-6 col-lg-2" v-if="mostrarComuna">
                            <label class="filtro-label">Comuna</label>
                            <select class="form-control form-control-sm" v-model="filtros.comuna" @change="onComunaChange" :disabled="!filtros.mcpio">
                                <option :value="null">Todas</option>
                                <option v-for="(item, index) in comunas" :key="`comuna-${index}`" :value="item.value">{{ item.text }}</option>
                            </select>
                        </div>
                        <div class="col-12 col-md-6" :class="mostrarComuna ? 'col-lg-2' : 'col-lg-3'">
                            <label class="filtro-label">Puesto de votación</label>
                            <select class="form-control form-control-sm" v-model="filtros.puesto" @change="onPuestoChange" :disabled="!filtros.mcpio">
                                <option :value="null">Todos</option>
                                <option v-for="(item, index) in puestos" :key="`puesto-${index}`" :value="item.value">{{ item.text }}</option>
                            </select>
                        </div>
                        <div class="col-12" :class="mostrarComuna ? 'col-lg-2' : 'col-lg-3'">
                            <label class="filtro-label">Buscar candidato</label>
                            <input type="text" class="form-control form-control-sm" v-model="filtros.nombre" placeholder="Nombre...">
                        </div>
                    </div>
                </div>
            </div>

            <div class="row resumen-row g-2" v-if="resultados.length > 0">
                <div class="col-12 col-md-4">
                    <div class="card text-center bg-light h-100 resumen-card">                
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1"># MESAS</h6>
                            <h4 class="text-success mb-0">{{resultados[0].total_mesas}}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card text-center bg-light h-100 resumen-card">                
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">MESAS INFORMADAS</h6>
                            <h4 class="text-success mb-0">{{resultados[0].mesas_informadas}}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card text-center bg-light h-100 resumen-card" @click="verMesasFaltantes">                
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">MESAS FALTANTES</h6>
                            <h4 class="text-success mb-0">{{resultados[0].total_mesas - resultados[0].mesas_informadas}}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-wrap align-items-center acciones-row my-2">
                <button class="btn btn-sm btn-secondary mr-2 mb-1" @click="getResultados"><b-icon icon="arrow-clockwise"></b-icon> Refrescar</button>
                <a href="https://apiparlamentarias.convexosit.co/reporte-preconteo-general" class="btn btn-sm btn-success mb-1" target="_blank"><b-icon icon="file-earmark-excel"></b-icon> Descargar detalle votacion</a>
            </div>

            <div class="table-responsive">
                <table class="table table-sm table-hover my-0 tabla-compacta">
                    <thead>
                        <tr>
                            <th>Partido</th>
                            <th>Candidato</th>
                            <th>Total votos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in resultadosFiltrados" :key="index">
                            <td>{{item.partido}}</td>
                            <td>{{item.nombres}} {{item.apellidos}}</td>
                            <td>{{item.total}}</td>
                        </tr>
                        <tr v-if="resultadosFiltrados.length === 0">
                            <td colspan="3" class="text-center">No hay resultados para los filtros seleccionados</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>

    import axios from 'axios';
    import Loading from '../Loader/Loading.vue';
    import MesasInformadas from './ModalMesasInformadas.vue';
    import MesasFaltantes from './ModalMesasFaltantes.vue';

    export default {
        components: {
            Loading, MesasInformadas, MesasFaltantes
        },
        computed: {
            resultadosFiltrados(){
                const texto = (this.filtros.nombre || '').toString().toLowerCase().trim();
                if(!texto){
                    return this.resultados;
                }

                return this.resultados.filter(item => {
                    const nombre = `${item.nombres || ''} ${item.apellidos || ''}`.toLowerCase();
                    return nombre.includes(texto);
                });
            }
        },
        data(){
            return{
                loader: true,
                resultados: [],
                departamentos: [],
                municipios: [],
                comunas: [],
                puestos: [],
                mostrarComuna: false,
                filtros: {
                    dpto: null,
                    mcpio: null,
                    comuna: null,
                    puesto: null,
                    nombre: ''
                }
            }
        },
        mounted(){
            this.getDepartamentosPreconteo();
            this.getResultados();
            this.ejecutaAutomatico();
        },
        methods:{
            mapSelectOptions(items = [], textKeys = [], valueKeys = []){
                return (items || []).map(item => {
                    if(typeof item !== 'object' || item === null){
                        return {
                            text: item,
                            value: item
                        };
                    }

                    let text = null;
                    let value = null;

                    for (let i = 0; i < textKeys.length; i++) {
                        if(item[textKeys[i]] !== undefined && item[textKeys[i]] !== null && item[textKeys[i]] !== ''){
                            text = item[textKeys[i]];
                            break;
                        }
                    }

                    for (let i = 0; i < valueKeys.length; i++) {
                        if(item[valueKeys[i]] !== undefined && item[valueKeys[i]] !== null && item[valueKeys[i]] !== ''){
                            value = item[valueKeys[i]];
                            break;
                        }
                    }

                    if(text === null){
                        text = value !== null ? value : 'Sin nombre';
                    }

                    if(value === null){
                        value = text;
                    }

                    return { text, value };
                });
            },
            ejecutaAutomatico(){
                
                setInterval(this.getResultados, 300000);
            },
            getResultadosParams(){
                const params = {};
                if(this.filtros.dpto){
                    params.dpto = this.filtros.dpto;
                }
                if(this.filtros.mcpio){
                    params.mcpio = this.filtros.mcpio;
                }
                if(this.filtros.comuna){
                    params.comuna = this.filtros.comuna;
                }
                if(this.filtros.puesto){
                    params.puesto = this.filtros.puesto;
                }
                return params;
            },
            getResultados(){
                this.resultados = [];
                let corporacion = this.$store.state.user.candidato[0].corporacione_id;
                axios.get(`api/preconteo-resultados-general/${corporacion}`, {
					params: this.getResultadosParams(),
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data)
                    // console.log('PRUEBA')
                    this.resultados = res.data.resultados || [];
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            getDepartamentosPreconteo(){
                axios.get('api/preconteo-dpto', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    const lista = res.data.departamentos || res.data.dptos || res.data.dpto || res.data.data || [];
                    this.departamentos = this.mapSelectOptions(lista, ['departamento', 'dpto', 'desc_dpto', 'nombre', 'text'], ['id', 'departamento_id', 'dpto_id', 'cod_dpto', 'value']);
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getMunicipiosPreconteo(dpto){
                axios.get(`api/preconteo-mcpio/${dpto}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    const lista = res.data.municipios || res.data.mcpios || res.data.mcpio || res.data.data || [];
                    this.municipios = this.mapSelectOptions(lista, ['municipio', 'mcpio', 'desc_mcpio', 'nombre', 'text'], ['id', 'municipio_id', 'mcpio_id', 'cod_mcpio', 'value']);
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getComunasPreconteo(dpto, mcpio){
                return axios.get(`api/preconteo-comuna/${dpto}/${mcpio}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    const lista = res.data.comunas || res.data.comuna || res.data.data || [];
                    this.comunas = this.mapSelectOptions(lista, ['comuna', 'nombre', 'text'], ['comuna', 'id', 'value']);
                    this.mostrarComuna = this.comunas.length > 0;
                })
                .catch(err => {
                    this.comunas = [];
                    this.mostrarComuna = false;
                    console.log(err)
                })
            },
            getPuestosPreconteo(dpto, mcpio){
                return axios.get(`api/preconteo-puesto/${dpto}/${mcpio}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    const lista = res.data.puestos || res.data.puesto || res.data.data || [];
                    this.puestos = this.mapSelectOptions(lista, ['nombre_puesto', 'puesto', 'nombre', 'text'], ['id', 'puesto', 'cod_puesto', 'value']);
                })
                .catch(err => {
                    this.puestos = [];
                    console.log(err)
                })
            },
            onDepartamentoChange(){
                this.filtros.mcpio = null;
                this.filtros.comuna = null;
                this.filtros.puesto = null;
                this.municipios = [];
                this.comunas = [];
                this.puestos = [];
                this.mostrarComuna = false;

                if(this.filtros.dpto){
                    this.getMunicipiosPreconteo(this.filtros.dpto);
                }

                
                this.getResultados();
            },
            onMunicipioChange(){
                this.filtros.comuna = null;
                this.filtros.puesto = null;
                this.comunas = [];
                this.puestos = [];
                this.mostrarComuna = false;
                
                if(this.filtros.dpto && this.filtros.mcpio){
                    Promise.all([
                        this.getComunasPreconteo(this.filtros.dpto, this.filtros.mcpio),
                        this.getPuestosPreconteo(this.filtros.dpto, this.filtros.mcpio)
                    ]).finally(() => {
                        this.getResultados();
                    });
                    return;
                }
                
                this.getResultados();
            },
            onComunaChange(){
                this.getResultados();
            },
            onPuestoChange(){
                console.log(this.filtros)
                this.getResultados();
            },
            verMesasFaltantes(){
                this.$refs.mesasFaltantes.modalMesasFaltantes();
            },
            verMesasInformadas(){
                this.$refs.mesasInformadas.viewMesasInformadas()
            }
        }
    }
</script>
<style scoped>
    .resultados-preconteo {
        font-size: 0.95rem;
    }

    .filtro-label {
        display: inline-block;
        margin-bottom: 0.2rem;
        font-size: 0.82rem;
        font-weight: 600;
        color: #495057;
    }

    .filtro-card {
        border-radius: 8px;
    }

    .resumen-row {
        margin-top: 0.1rem;
        margin-bottom: 0.1rem;
    }

    .resumen-card {
        cursor: pointer;
        border-radius: 8px;
    }

    .resumen-card .card-title {
        font-size: 1rem;
        font-weight: 700;
    }

    .acciones-row {
        gap: 0.25rem;
    }

    .tabla-compacta th,
    .tabla-compacta td {
        padding-top: 0.45rem;
        padding-bottom: 0.45rem;
        vertical-align: middle;
    }

    .filtro-card{
        cursor: default;
    }
</style>