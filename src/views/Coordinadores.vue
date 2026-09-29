 <template>
     <div class="vista-coordinadores">        
        <GestionLideres ref="gestion"></GestionLideres>
        <div class="busqueda-coordinadores" v-if="($store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 4) && !lideresSublideres">        
            <div class="campo-coordinador">
                <label for="coordinador">Coordinador</label>
                <model-select
                    id="coordinador"
                    :options="coordinadores"
                    v-model="coordinadore_id"
                    placeholder="Mostrar todo"
                ></model-select>
            </div>
            <div class="accion-coordinador">
                <button class="btn btn-verde btn-block" @click="buscarCoordinador">Buscar</button>
            </div>
        </div>
        <a-row type="flex" class="mt-30" v-if="loading">
            <a-spin size="large" class="text-center"/>
        </a-row>
        <div v-if="errorBusqueda" class="alert alert-danger mt-3" role="alert">{{ errorBusqueda }}</div>
        <div v-if="mostrarMensajeSinResultados" class="alert alert-warning text-center mt-3">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Sin resultados</strong>
            <p class="mb-0">Este coordinador no tiene registros agregados.</p>
        </div>
        <a-card :bordered="false" class="header-solid h-full mt-10" :bodyStyle="{padding: 0,}" v-if="infoCoordinador.length > 0">
            <template #title>
                <div class="cabecera-coordinador">
                    <div>
                        <h6 class="my-3" v-if="coordinadore_id > 0">{{ coordinador }}</h6>
                        <p class="meta-badge">Meta: <span class="meta-value">{{ formatearNumero(infoCoordinador[0].meta_votacion) }}</span></p>
                    </div>
                    <div>
                        <button class="btn btn-verde mr-2" @click="newLider"><b-icon icon="file-plus"></b-icon> Nuevo lider</button>
                        <a :href="'https://apisenado.convexosit.co/excel-coordinadores/' + $store.state.user.token_id + '/' + coordinadore_id  + '/-1/-1'" class="btn btn-success" target="_blank" v-if="($store.state.user.role_id === 1 || $store.state.user.role_id === 2)"> <b-icon icon="file-earmark-excel"></b-icon> Generar excel</a>
                    </div>
                </div>
                <p class="info-coordinadores"><strong># Lideres:</strong>
                    <b-badge variant="success" @click="irLideres" role="button">{{ infoCoordinador[0].total_lideres }}</b-badge>
                </p>
                <p class="info-coordinadores"><strong># Militantes:</strong> {{ formatearNumero(totalMilitantes) }}</p>
                
                <!-- Switch de agrupación -->
                <div class="text-center my-4">
                    <div class="agrupacion-switch">
                        <label v-if="agrupacionesPermitidas.includes(1)" class="switch-label" :class="{ active: agrupacion === 1 }">
                            <input 
                                type="radio" 
                                :value="1" 
                                v-model="agrupacion" 
                                @change="buscarCoordinador"
                                class="switch-input"
                            >
                            <span class="switch-text">Departamento</span>
                        </label>
                        <label v-if="agrupacionesPermitidas.includes(2)" class="switch-label" :class="{ active: agrupacion === 2 }">
                            <input 
                                type="radio" 
                                :value="2" 
                                v-model="agrupacion" 
                                @change="buscarCoordinador"
                                class="switch-input"
                            >
                            <span class="switch-text">Municipio</span>
                        </label>
                        <label class="switch-label" :class="{ active: agrupacion === 3 }">
                            <input type="radio" :value="3" v-model="agrupacion" @change="buscarCoordinador" class="switch-input">
                            <span class="switch-text">Puesto de votación</span>
                        </label>
                    </div>
                </div>
            </template>
            
			<div class="municipios-tabla mt-4" v-if="agrupacion === 1 && departamentosOrdenados.length > 0">
				<h6 class="municipios-tabla__titulo">Militantes por departamento</h6>
				<div class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th>Departamento</th>
								<th class="text-center">Cantidad</th>
								<th>Porcentaje del total</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(departamento, index) in departamentosOrdenados" :key="departamento.departamento">
								<td>{{ index + 1 }}</td>
								<td><strong>{{ departamento.departamento }}</strong></td>
								<td class="text-center">{{ formatearNumero(departamento.cantidad) }}</td>
								<td class="porcentaje-celda">
									<div class="porcentaje-contenido">
										<div class="progress porcentaje-barra">
											<div
												class="progress-bar"
												role="progressbar"
												:style="{ width: `${departamento.porcentaje}%` }"
												:aria-valuenow="departamento.porcentaje"
												aria-valuemin="0"
												aria-valuemax="100"
											></div>
										</div>
										<strong class="porcentaje-valor">{{ formatearPorcentaje(departamento.porcentaje) }}%</strong>
									</div>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th colspan="2">Total</th>
								<th class="text-center">{{ formatearNumero(totalMilitantes) }}</th>
								<th>100%</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>

			<div class="municipios-tabla mt-4" v-if="agrupacion === 2 && municipiosOrdenados.length > 0">
				<h6 class="municipios-tabla__titulo">Militantes por municipio</h6>
				<div class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th>Municipio</th>
								<th>Departamento</th>
								<th class="text-center">Cantidad</th>
								<th>Porcentaje del total</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(municipio, index) in municipiosOrdenados" :key="`${municipio.departamento}-${municipio.municipio}`">
								<td>{{ index + 1 }}</td>
								<td><strong>{{ municipio.municipio }}</strong></td>
								<td>{{ municipio.departamento }}</td>
								<td class="text-center">{{ formatearNumero(municipio.cantidad) }}</td>
								<td class="porcentaje-celda">
									<div class="porcentaje-contenido">
										<div class="progress porcentaje-barra">
											<div
												class="progress-bar"
												role="progressbar"
												:style="{ width: `${municipio.porcentaje}%` }"
												:aria-valuenow="municipio.porcentaje"
												aria-valuemin="0"
												aria-valuemax="100"
											></div>
										</div>
										<strong class="porcentaje-valor">{{ formatearPorcentaje(municipio.porcentaje) }}%</strong>
									</div>
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th colspan="3">Total</th>
								<th class="text-center">{{ formatearNumero(totalMilitantes) }}</th>
								<th>100%</th>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
            <div class="municipios-tabla mt-4" v-if="agrupacion === 3">
                <h6 class="municipios-tabla__titulo">Militantes por puesto de votación</h6>
                <label v-if="!soloPuestos" for="municipio-puestos">Municipio</label>
                <model-select v-if="!soloPuestos" id="municipio-puestos" :options="opcionesMunicipios" v-model="municipioSeleccionado" placeholder="Seleccione un municipio" />
                <p class="text-muted mt-3" v-if="!municipioSeleccionado">{{ soloPuestos ? 'El candidato no tiene un municipio configurado.' : 'Seleccione un municipio para consultar sus puestos de votación.' }}</p>
                <p class="text-muted mt-3" v-else-if="!puestosOrdenados.length">No hay militantes registrados en este municipio para la selección actual.</p>
                <div v-else class="table-responsive mt-3" tabindex="0" aria-label="Puestos de votación">
                    <table class="table table-hover align-middle mb-0">
                        <thead><tr><th>#</th><th>Puesto</th><th class="text-center">Cantidad</th><th>Porcentaje del total</th></tr></thead>
                        <tbody>
                            <tr v-for="(puesto, index) in puestosOrdenados" :key="`${puesto.zona}-${puesto.puesto}`">
                                <td>{{ index + 1 }}</td><td><strong>{{ puesto.nombre_puesto }}</strong></td>
                                <td class="text-center">{{ formatearNumero(puesto.cantidad) }}</td>
                                <td class="porcentaje-celda">
                                    <div class="porcentaje-contenido">
                                        <div class="progress porcentaje-barra">
                                            <div
                                                class="progress-bar"
                                                role="progressbar"
                                                :style="{ width: `${puesto.porcentaje}%` }"
                                                :aria-valuenow="puesto.porcentaje"
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                        <strong class="porcentaje-valor">{{ formatearPorcentaje(puesto.porcentaje) }}%</strong>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot><tr><th colspan="2">Total del municipio</th><th class="text-center">{{ formatearNumero(totalPuestos) }}</th><th>100%</th></tr></tfoot>
                    </table>
                </div>
            </div>
        </a-card>
        <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}" >
            <Lideres ref="lideres" @reset="resetear" />
        </a-card>
    </div>
 </template>
 <script>

    import { ModelSelect } from "../../node_modules/vue-search-select/dist/VueSearchSelect.common";
    import GestionLideres from "../components/Config/lider/GestionLideres.vue";    
    import Lideres from "@/components/Coordinadores/Lideres.vue";

    import axios from 'axios';
    export default {
        components:{
			GestionLideres, ModelSelect, Lideres
        },
        data() {
            return {
                agrupacion: 1,
                puestos: [],
                municipiosPuestos: [],
                municipioSeleccionado: "",
                solicitudActual: 0,
                errorBusqueda: "",
                coordinador: '',
                coordinadore_id: -1,
                coordinadores: [],
                infoCoordinador: [],
                lideresSublideres: false,
                loading: false,
                busquedaRealizada: false
            }
        },
        mounted(){
            this.agrupacion = this.agrupacionesPermitidas[0];
            const candidato = (this.$store.state.user.candidato || [])[0];
            if (candidato && Number(candidato.departamento_id) > 0 && Number(candidato.municipio_id) > 0) {
                this.municipioSeleccionado = `${Number(candidato.departamento_id)}-${Number(candidato.municipio_id)}`;
            }
            if(this.$store.state.user.role_id === 6 || this.$store.state.user.role_id === 5){
                this.coordinadore_id = this.$store.state.user.id;                
                this.irLideres();
            }else{
                this.getCoordinadores();
            }
        },
        methods: {
            formatearNumero(valor) {
                return Number(valor || 0).toLocaleString('es-CO');
            },
            buscarCoordinador(){
                if (!this.agrupacionesPermitidas.includes(this.agrupacion)) {
                    this.agrupacion = this.agrupacionesPermitidas[0];
                }
                if (this.soloPuestos) {
                    const candidato = this.candidatoConfigurado;
                    this.municipioSeleccionado = Number(candidato.departamento_id) > 0 && Number(candidato.municipio_id) > 0
                        ? `${Number(candidato.departamento_id)}-${Number(candidato.municipio_id)}` : '';
                }

                if(this.coordinadore_id === -1 || this.coordinadore_id === null || this.coordinadore_id === '' || this.coordinadore_id === undefined){
                    this.coordinadore_id = -1;
                }else{
                    const coordinadorEncontrado = this.coordinadores.find(coord => coord.value === this.coordinadore_id);
                    if(coordinadorEncontrado) {
                        this.coordinador = coordinadorEncontrado.text;
                    }
                }

                const solicitud = ++this.solicitudActual;
                this.errorBusqueda = "";
                this.puestos = [];
                this.infoCoordinador = [];
                this.loading = true;
                this.busquedaRealizada = false;
                axios.get(`api/info-coordinadores/${this.coordinadore_id}/${this.agrupacion}`, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.state.user.token}`
                        }
                    })
                        .then(res => {
                            if (solicitud !== this.solicitudActual) return;
                            this.puestos = res.data.puestos || [];
                            this.municipiosPuestos = res.data.municipios || [];
                            this.busquedaRealizada = true;
                            if(res.data.info.length > 0){
                                this.infoCoordinador = res.data.info;
                            }
                            this.loading = false;
                        })
                        .catch(err => {
                            if (solicitud !== this.solicitudActual) return;
                            this.errorBusqueda = "No se pudieron cargar los resultados. Intente buscar nuevamente.";
                            this.loading = false;
                            this.busquedaRealizada = true;
                            console.log(err)
                        })
            },
            getCoordinadores(){
                if(this.$store.state.user.role_id === 1 || this.$store.state.user.role_id === 2 || this.$store.state.user.role_id === 4){
                    axios.get(`api/coordinadores/${this.$store.state.user.candidato_id}`, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.state.user.token}`
                        }
                    })
                        .then(res => {
                            if(res.data.coordinadores.length >0){
                                for (let i = 0; i < res.data.coordinadores.length; i++) {
                                    this.coordinadores.push({
                                        text: res.data.coordinadores[i].nombres + ' ' + res.data.coordinadores[i].apellidos,
                                        value: res.data.coordinadores[i].id
                                    })
                                }                            
                            }
                        })
                        .catch(err => console.log(err))
                }else{
                    this.coordinadore_id = this.$store.state.user.id;
                    this.buscarCoordinador();
                }
            },
            irLideres(){
                this.lideresSublideres = true;
                this.infoCoordinador = [];
                if(this.$store.state.user.role_id === 5){
                    this.$refs.lideres.getSublideres(this.coordinadore_id);
                }else{
                    this.$refs.lideres.getLideres(this.coordinadore_id);
                }
            },
            newLider(){
                this.$refs.gestion.newLider()
            },
            resetear(){
                this.lideresSublideres = false;
            },
			formatearPorcentaje(porcentaje){
				return porcentaje.toLocaleString('es-CO', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			},
        },
        computed: {
            candidatoConfigurado() {
                const candidato = this.$store.state.user.candidato;
                return (Array.isArray(candidato) ? candidato[0] : candidato) || {};
            },
            soloPuestos() {
                return [4, 5, 8].includes(Number(this.candidatoConfigurado.corporacione_id));
            },
            agrupacionesPermitidas() {
                const corporacion = Number(this.candidatoConfigurado.corporacione_id);
                if ([4, 5, 8].includes(corporacion)) return [3];
                if ([1, 6, 7].includes(corporacion)) return [2, 3];
                return [1, 2, 3];
            },
            opcionesMunicipios() {
                return this.municipiosPuestos.map(m => ({
                    value: `${Number(m.departamento_id)}-${Number(m.id)}`,
                    text: `${m.municipio} — ${m.departamento}`
                }));
            },
            puestosDelMunicipio() {
                if (!this.municipioSeleccionado) return [];
                return this.puestos.filter(p => `${Number(p.departamento_id)}-${Number(p.municipio_id)}` === this.municipioSeleccionado);
            },
            totalPuestos() {
                return this.puestosDelMunicipio.reduce((total, p) => total + Number(p.cantidad || 0), 0);
            },
            puestosOrdenados() {
                return this.puestosDelMunicipio.map(p => ({...p, cantidad: Number(p.cantidad || 0),
                    porcentaje: this.totalPuestos ? Number(p.cantidad || 0) / this.totalPuestos * 100 : 0
                })).sort((a, b) => b.cantidad - a.cantidad || a.nombre_puesto.localeCompare(b.nombre_puesto));
            },
            totalMilitantes(){
				return this.infoCoordinador.reduce((acc, curr) => acc + Number(curr.total_militantes || 0), 0);
            },
			municipiosOrdenados(){
				const total = this.totalMilitantes;

				return this.infoCoordinador
					.map(item => {
						const cantidad = Number(item.total_militantes || 0);

						return {
							municipio: item.municipio,
							departamento: item.departamento,
							cantidad,
							porcentaje: total > 0 ? (cantidad / total) * 100 : 0
						};
					})
					.sort((a, b) => b.cantidad - a.cantidad || a.municipio.localeCompare(b.municipio));
			},
			departamentosOrdenados(){
				const total = this.totalMilitantes;

				return this.infoCoordinador
					.map(item => {
						const cantidad = Number(item.total_militantes || 0);

						return {
							departamento: item.departamento,
							cantidad,
							porcentaje: total > 0 ? (cantidad / total) * 100 : 0
						};
					})
					.sort((a, b) => b.cantidad - a.cantidad || a.departamento.localeCompare(b.departamento));
			},
            mostrarMensajeSinResultados(){
                return !this.errorBusqueda && this.busquedaRealizada && this.infoCoordinador.length === 0 && !this.loading && !this.lideresSublideres;
            }
        }
    }

</script>
<style scoped>
    .municipios-tabla .table-responsive { max-height: 420px; overflow: auto; }
    .municipios-tabla thead th { position: sticky; top: 0; z-index: 1; }
    .municipios-tabla tfoot th { position: sticky; bottom: 0; z-index: 1; }
    .switch-label:focus-within { outline: 2px solid #198754; outline-offset: 2px; }

    .info-coordinadores{
        color: #000 !important;
        font-size: 1.1rem;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #198754;
    }
    
    h6 {
        color: #198754;
        font-weight: 700;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }
    
    .btn {
        border-radius: 8px;
        font-weight: 600;
        padding: 0.5rem 1.5rem;
        transition: all 0.3s ease;
    }
    
    .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .badge {
        font-size: 1rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .badge:hover {
        transform: scale(1.1);
    }
    
    .meta-badge {
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid #198754;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: inline-block;
        margin: 0.5rem 0;
    }
    
    .meta-value {
        color: #198754;
        font-size: 1.4rem;
        font-weight: 700;
        margin-left: 0.5rem;
    }
    
    /* Switch de agrupación */
    .agrupacion-switch {
        display: inline-flex;
        flex-wrap: wrap;
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 0.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 2px solid #e9ecef;
    }
    
    .switch-label {
        position: relative;
        margin: 0;
        cursor: pointer;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 0.95rem;
        color: #6c757d;
    }
    
    .switch-label:hover {
        color: #495057;
    }
    
    .switch-label.active {
        background: linear-gradient(135deg, #198754 0%, #146c43 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2);
    }
    
    .switch-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .switch-text {
        user-select: none;
    }

    /* Estilos del mensaje de alerta */
    .alert-warning {
        background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
        border: 2px solid #ffc107;
        border-radius: 12px;
        padding: 20px;
        color: #856404;
        box-shadow: 0 4px 12px rgba(255, 193, 7, 0.2);
    }

    .alert-warning i {
        font-size: 24px;
        margin-right: 10px;
        color: #ffc107;
    }

    .alert-warning strong {
        display: block;
        font-size: 18px;
        margin-bottom: 5px;
        color: #856404;
    }

    .alert-warning p {
        font-size: 14px;
        color: #856404;
    }

	.municipios-tabla {
		padding: 0 1rem 1rem;
	}

	.municipios-tabla__titulo {
		font-size: 1.15rem;
	}

	.municipios-tabla thead th,
	.municipios-tabla tfoot th {
		background-color: #f8f9fa;
		color: #343a40;
		white-space: nowrap;
	}

	.porcentaje-celda {
		min-width: 260px;
	}

	.porcentaje-contenido {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.porcentaje-barra {
		flex: 1;
		height: 14px;
		background-color: #e9ecef;
		border-radius: 999px;
		overflow: hidden;
	}

	.porcentaje-barra .progress-bar {
		background: linear-gradient(90deg, #198754 0%, #28a76c 100%);
		border-radius: 999px;
	}

	.porcentaje-valor {
		min-width: 64px;
		text-align: right;
		color: #343a40;
	}

    .busqueda-coordinadores {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 1rem;
        align-items: end;
        padding: 1.25rem;
        margin-bottom: 1.25rem;
        background: #f8faf9;
        border: 1px solid #e1e8e4;
        border-radius: 12px;
    }
    .campo-coordinador { min-width: 0; }
    .campo-coordinador label { display: block; margin-bottom: 0.4rem; color: #475569; font-size: 0.875rem; font-weight: 600; }
    .vista-coordinadores ::v-deep .ui.selection.dropdown { width: 100%; min-width: 0; min-height: 44px; border: 1px solid #d8e0dc; border-radius: 8px; font-size: 0.95rem; box-shadow: none; }
    .vista-coordinadores ::v-deep .ui.selection.dropdown:focus-within { border-color: #198754; box-shadow: 0 0 0 3px rgba(25,135,84,0.12); }
    .vista-coordinadores .btn { min-height: 44px; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; }
    .btn-verde { background: #198754; border: 1px solid #198754; color: white; }
    .btn-verde:hover { background: #146c43; border-color: #146c43; color: white; }
    .btn-verde:focus-visible { outline: 3px solid rgba(25,135,84,0.35); outline-offset: 2px; }
    .cabecera-coordinador { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; white-space: normal; }
    .cabecera-coordinador > div:last-child { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .municipios-tabla__titulo { color: #198754; font-weight: 700; }
    .municipios-tabla .table { border: 1px solid #e1e8e4; font-size: 0.9rem; }
    .municipios-tabla .table th, .municipios-tabla .table td { padding: 0.7rem 0.875rem; border-color: #e1e8e4; }
    .municipios-tabla thead th, .municipios-tabla tfoot th { background: #eef6f1; color: #166534; }
    .municipios-tabla tbody tr:nth-child(even) { background: #f8faf9; }
    .agrupacion-switch { flex-wrap: wrap; max-width: 100%; }
    .switch-label:focus-within { outline: 2px solid #198754; outline-offset: 2px; }
    @media (max-width: 767px) {
        .busqueda-coordinadores { grid-template-columns: minmax(0, 1fr); padding: 1rem; }
        .accion-coordinador .btn { width: 100%; }
    }
</style>
