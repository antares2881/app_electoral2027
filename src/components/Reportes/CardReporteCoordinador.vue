<template>
	<div class="row">
		<div class="col-12 mb-3">
			<div class="report-mode-selector">
				<button
					type="button"
					class="mode-option"
					:class="{ active: reporteTipo === 'personal' }"
					@click="cambiarTipoReporte('personal')"
				>
					<div class="mode-title">Reporte por Personal</div>
					<small>Filtra por coordinador y líder</small>
				</button>
				<button
					type="button"
					class="mode-option"
					:class="{ active: reporteTipo === 'divipole' }"
					@click="cambiarTipoReporte('divipole')"
				>
					<div class="mode-title">Reporte por Divipole</div>
					<small>Filtra por departamento y municipio</small>
				</button>
			</div>
		</div>

		<template v-if="reporteTipo === 'personal'">
			<div class="col-6" v-if="$store.state.user.role_id !== 5 && $store.state.user.role_id !== 6 ">
				<label for="coordinador">Coordinador</label>
				<model-select
					:options="coordinadores"
					v-model="reporte.coordinadore_id"
					@input="getLideres()"
					id="coordinador"
				></model-select>
			</div>
			<div class="col-6" v-if="$store.state.user.role_id !== 5 ">
				<label for="lider">Lider</label>
				<model-select
					:options="lideres"
					v-model="reporte.lidere_id"
					id="lider"
				></model-select>
			</div>
		</template>

		<template v-else>
			<div class="col-6">
				<label for="departamento">Departamento</label>
				<model-select
					:options="departamentos"
					v-model="divipole.departamento_id"
					@input="onDepartamentoChange"
					id="departamento"
					:disabled="loadingDepartamentos || generandoReporte"
				></model-select>
				<small v-if="loadingDepartamentos" class="text-muted">Cargando departamentos...</small>
			</div>
			<div class="col-6">
				<label for="municipio">Municipio</label>
				<model-select
					:options="municipios"
					v-model="divipole.municipio_id"
					id="municipio"
					:disabled="!divipole.departamento_id || loadingMunicipios || generandoReporte"
				></model-select>
				<small v-if="loadingMunicipios" class="text-muted">Cargando municipios...</small>
			</div>
			<div class="col-12 mt-2" v-if="errorDivipole">
				<div class="alert alert-warning py-2 mb-0">
					{{ errorDivipole }}
				</div>
			</div>
		</template>

		<div class="col-12 my-3 d-flex align-items-center gap-2 flex-wrap">
			<button
				type="button"
				class="btn btn-success"
				@click="generarReporte"
				:disabled="generandoReporte"
			>
				<b-icon v-if="!generandoReporte" icon="file-earmark-excel"></b-icon>
				<span
					v-else
					class="spinner-border spinner-border-sm me-1"
					role="status"
					aria-hidden="true"
				></span>
				{{ generandoReporte ? 'Generando reporte...' : 'Generar excel' }}
			</button>
			<small class="text-muted" v-if="generandoReporte">Se abrirá una nueva pestaña con el archivo.</small>
		</div>
	</div>
</template>
<script>

	import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
	import axios from 'axios';
	import Swal from 'sweetalert2';

	export default {
		components: {
			ModelSelect
		},
		data(){
			const reportesBaseUrl = process.env.VUE_APP_REPORTS_BASE_URL || 'https://apidemo.convexosit.co'
			return{
				candidato: null,
				reporteTipo: 'personal',
				coordinadores: [],
				lideres: [],
				departamentos: [],
				municipios: [],
				divipole: {departamento_id: null, municipio_id: null},
				loadingDepartamentos: false,
				loadingMunicipios: false,
				generandoReporte: false,
				errorDivipole: null,
				reporte: {coordinadore_id: -1, lidere_id: -1},
				url: reportesBaseUrl.replace(/\/$/, '')
			}
		},
		mounted(){
			this.candidato = this.$store.state.user.candidato_id
			this.getCoordinadores();
			this.getLideres();
			this.getDepartamentos();
			if(this.$store.state.user.role_id === 5){				
				this.reporte.lidere_id = this.$store.state.user.id
			}
		},
		computed: {
			reporteUrlPersonal(){
				return `${this.url}/excel-coordinadores/${this.$store.state.user.token_id}/${this.reporte.coordinadore_id}/${this.reporte.lidere_id}/-1`
			},
			reporteUrlDivipole(){
				const mcpio = this.divipole.municipio_id || -1
				return `${this.url}/excel-coordinadores/${this.$store.state.user.token_id}/-1/-1/-1?tipo=divipole&departamento_id=${this.divipole.departamento_id}&municipio_id=${mcpio}`
			}
		},
		methods: {
			cambiarTipoReporte(tipo){
				this.reporteTipo = tipo;
				this.errorDivipole = null;
			},
			onDepartamentoChange(){
				this.divipole.municipio_id = null;
				this.errorDivipole = null;
				if(this.divipole.departamento_id){
					this.getMunicipiosByDepartamento(this.divipole.departamento_id)
					return;
				}
				this.municipios = [];
			},
			async generarReporte(){
				if(this.reporteTipo === 'divipole' && !this.divipole.departamento_id){
					this.errorDivipole = 'Debe seleccionar al menos un departamento para generar el reporte por Divipole.';
					Swal.fire({
						icon: 'warning',
						title: 'Departamento requerido',
						text: 'Seleccione un departamento antes de generar el reporte.'
					})
					return;
				}

				this.generandoReporte = true;
				const destino = this.reporteTipo === 'personal' ? this.reporteUrlPersonal : this.reporteUrlDivipole;

				try {
					window.open(destino, '_blank');
					setTimeout(() => {
						this.generandoReporte = false;
					}, 1200)
				} catch (error) {
					this.generandoReporte = false;
					Swal.fire({
						icon: 'error',
						title: 'No se pudo generar el reporte',
						text: 'Intente nuevamente en unos segundos.'
					})
					console.log(error)
				}
			},
			getCoordinadores(){
				this.coordinadores = [];
				axios.get(`api/coordinadores/${this.candidato}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
				.then(res => {

					if(res.data.status === 'success'){						
						for (let i = 0; i < res.data.coordinadores.length; i++) {
							this.coordinadores.push({
								text: res.data.coordinadores[i].nombres + ' ' +res.data.coordinadores[i].apellidos ,
								value: res.data.coordinadores[i].id
							})
						}
					}else{
						this.coordinadores = [];
					}

				})
				.catch(err => {
					console.log(err);
				})
			},
			getDepartamentos(){
				this.loadingDepartamentos = true;
				this.departamentos = [];

				axios.get('/api/departamentos', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					if(res.data && res.data.departamentos){
						for (let i = 0; i < res.data.departamentos.length; i++) {
							this.departamentos.push({
								text: res.data.departamentos[i].departamento,
								value: res.data.departamentos[i].id
							})
						}
					}
				})
				.catch(err => {
					console.log(err)
					Swal.fire({
						icon: 'error',
						title: 'Error al cargar departamentos',
						text: 'No fue posible consultar departamentos en este momento.'
					})
				})
				.finally(() => {
					this.loadingDepartamentos = false;
				})
			},
			getMunicipiosByDepartamento(departamentoId){
				this.loadingMunicipios = true;
				this.municipios = [];

				axios.get(`/api/municipios/${departamentoId}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					if(res.data && res.data.municipios){
						for (let i = 0; i < res.data.municipios.length; i++) {
							this.municipios.push({
								text: res.data.municipios[i].municipio,
								value: res.data.municipios[i].id
							})
						}
					}
				})
				.catch(err => {
					console.log(err)
					Swal.fire({
						icon: 'error',
						title: 'Error al cargar municipios',
						text: 'No fue posible consultar municipios para el departamento seleccionado.'
					})
				})
				.finally(() => {
					this.loadingMunicipios = false;
				})
			},
			getLideres(){
				console.log(this.$store.state.user.id)
				if(this.$store.state.user.role_id === 6){
					this.reporte.coordinadore_id = this.$store.state.user.id
				}
				this.lideres = [];

				axios.get(`api/lideres/${this.reporte.coordinadore_id}/${this.candidato}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
				.then(res => {
					if(res.data.status === 'success'){
						for (let i = 0; i < res.data.lideres.length; i++) {
							this.lideres.push({
								text: res.data.lideres[i].nombres + ' ' + res.data.lideres[i].apellidos,
								value: res.data.lideres[i].id
							})
						}
					}else{
						this.lideres = []
					}
				})
				.catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>
<style scoped>
	.report-mode-selector {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.mode-option {
		background: #fff;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 12px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.mode-option:hover {
		border-color: #198754;
	}

	.mode-option.active {
		border-color: #198754;
		background: #f2fff7;
	}

	.mode-title {
		font-weight: 600;
	}

	.gap-2 {
		gap: 0.5rem;
	}
</style>