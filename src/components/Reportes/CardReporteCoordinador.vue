<template>
	<div class="reporte-coordinador">
		<div class="selector-reporte">
			<div class="report-mode-selector">
				<button
					type="button"
					class="mode-option"
					:class="{ active: reporteTipo === 'personal' }"
                    :aria-pressed="reporteTipo === 'personal'"
					@click="cambiarTipoReporte('personal')"
				>
					<div class="mode-title">Reporte por Personal</div>
					<small>Filtra por coordinador y líder</small>
				</button>
				<button
					type="button"
					class="mode-option"
					:class="{ active: reporteTipo === 'divipole' }"
                    :aria-pressed="reporteTipo === 'divipole'"
					@click="cambiarTipoReporte('divipole')"
				>
					<div class="mode-title">Reporte por Divipole</div>
					<small>Filtra por departamento y municipio</small>
				</button>
			</div>
		</div>

		<div class="caja-filtros-reporte">
        <div class="campos-reporte">
		<template v-if="reporteTipo === 'personal'">
			<div class="campo-reporte" v-if="$store.state.user.role_id !== 5 && $store.state.user.role_id !== 6 ">
				<label for="coordinador">Coordinador</label>
				<model-select
					:options="coordinadores"
					v-model="reporte.coordinadore_id"
					@input="getLideres()"
					id="coordinador"
				></model-select>
			</div>
			<div class="campo-reporte" v-if="$store.state.user.role_id !== 5 ">
				<label for="lider">Líder</label>
				<model-select
					:options="lideres"
					v-model="reporte.lidere_id"
					id="lider"
				></model-select>
			</div>
		</template>

		<template v-else>
			<div class="campo-reporte">
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
			<div class="campo-reporte">
				<label for="municipio">Municipio</label>
				<model-select
					:options="municipios"
					v-model="divipole.municipio_id"
					id="municipio"
					:disabled="!divipole.departamento_id || loadingMunicipios || generandoReporte"
				></model-select>
				<small v-if="loadingMunicipios" class="text-muted">Cargando municipios...</small>
			</div>
			<div class="aviso-reporte" v-if="errorDivipole">
				<div class="alert alert-warning py-2 mb-0">
					{{ errorDivipole }}
				</div>
			</div>
		</template>

		</div>
		<div class="acciones-reporte">
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
				{{ generandoReporte ? 'Generando reporte...' : 'Generar Excel' }}
			</button>
			<small class="text-muted" v-if="generandoReporte">Se abrirá una nueva pestaña con el archivo.</small>
		</div>
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
.reporte-coordinador { background: #fff; padding: 1.25rem; border-radius: 12px; white-space: normal; }
.report-mode-selector { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; margin-bottom: 1.25rem; }
.mode-option { min-width: 0; padding: 1.25rem; text-align: left; background: #f8faf9; border: 1px solid #e1e8e4; border-radius: 12px; color: #475569; cursor: pointer; transition: background 0.2s, border-color 0.2s; }
.mode-title { color: #198754; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.35rem; }
.mode-option small { font-size: 0.875rem; }
.mode-option:hover { border-color: #198754; }
.mode-option.active { border-color: #198754; background: #eef6f1; box-shadow: inset 4px 0 #198754; }
.mode-option:focus-visible { outline: 3px solid rgba(25,135,84,0.25); outline-offset: 2px; }
.caja-filtros-reporte { padding: 1.25rem; background: #f8faf9; border: 1px solid #e1e8e4; border-radius: 12px; }
.campos-reporte { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.25rem; }
.campo-reporte { min-width: 0; }
.campo-reporte label { display: block; margin-bottom: 0.4rem; color: #475569; font-size: 0.875rem; font-weight: 600; }
.campo-reporte ::v-deep .ui.selection.dropdown { width: 100%; min-width: 0; min-height: 44px; border: 1px solid #d8e0dc; border-radius: 8px; font-size: 0.95rem; box-shadow: none; }
.campo-reporte ::v-deep .ui.selection.dropdown:focus-within { border-color: #198754; box-shadow: 0 0 0 3px rgba(25,135,84,0.12); }
.aviso-reporte { grid-column: 1 / -1; }
.acciones-reporte { display: flex; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.25rem; }
.acciones-reporte .btn-success { min-height: 44px; padding: 0.6rem 1.25rem; border-radius: 8px; background: #198754; border: 1px solid #198754; color: #fff; font-weight: 600; }
.acciones-reporte .btn-success:hover { background: #146c43; border-color: #146c43; }
.acciones-reporte .btn-success:focus-visible { outline: 3px solid rgba(25,135,84,0.35); outline-offset: 2px; }
.acciones-reporte .btn-success:disabled { opacity: 0.65; cursor: not-allowed; }
@media (max-width: 767px) {
    .report-mode-selector, .campos-reporte { grid-template-columns: minmax(0, 1fr); }
    .reporte-coordinador, .mode-option, .caja-filtros-reporte { padding: 1rem; }
    .acciones-reporte .btn { width: 100%; }
}
</style>
