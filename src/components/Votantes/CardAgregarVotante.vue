<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<GestionProfesiones ref="profesiones" @profesion_id="updateProfesioneid" />
			<!-- <ModalGenerateToken ref="modalToken" /> -->
			<GestionLideres ref="gestion" @setLideres="setLideres" />
			<VotantesRepetidos ref="votanteRepetido" />
			<div class="row" >
				<div class="col-12 col-sm-7 mt-2">
					<input type="number" id="cedula" v-model="votante.cedula" class="form-control" placeholder="Cedula" @keypress.enter="verificarVotanteConsultado" :disabled="nuevoVotante" />
				</div>	
				<div class="col-12 col-sm-5 mt-2">
					<button class="btn btn-dark btn-block"  @click="nuevaBusqueda" v-if="nuevoVotante">Nueva busqueda</button>
				<button class="btn btn-dark btn-block" @click="verificarVotanteConsultado" v-else :disabled="loading || isProcessing">
					<span v-if="loading || isProcessing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
					{{ (loading || isProcessing) ? 'Buscando...' : 'Buscar' }}
					</button>
				</div>	
			</div>
			<div class="row">
				<div class="col-md-12 mt-2" v-if="msnconexion">
					<p class="alert alert-info overflow-visible">No se recibio respuesta del servidor, puedes agregar el registro de forma manual o comunicarte con el administrador del sistema.</p>
				</div>
			</div>
			<div class="row" v-if="showForm">
				<div class="col-12">
					<h5 class="card-tag mt-3">Lugar votación</h5>
					<hr>
					<div class="row">
						<div class="col-12 col-sm-4 mb-3">
							<label for="departamento">Departamento votación</label>
					<select id="departamento" class="form-control" v-model="votante.departamento_id" @change="getMunicipio" :disabled="lugarDesdeApi">
								<option v-for="(item, index) in departamentos" :key="index" :value="item.id">{{ item.departamento }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-4 mb-3">
							<label for="municipio">Municipio votación</label>
					<select id="municipio" class="form-control" v-model="votante.municipio_id" @change="getZonas" :disabled="lugarDesdeApi">
								<option v-for="(item, index) in municipios" :key="index" :value="item.id">{{ item.municipio }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-4 mb-3">
							<label for="nombre_puesto">Puesto votación</label>
					<select id="nombre_puesto" v-model="votante.nombre_puesto" class="form-control" @change="setPuesto" :disabled="lugarDesdeApi">
								<option v-for="(puesto, index) in puestos" :key="index" :value="puesto.nombre_puesto">{{ puesto.nombre_puesto }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-4 mb-3" v-if="$store.state.user.candidato[0].municipio_id === 1">
							<label for="comuna">Comuna</label>
							<b-select id="comuna" class="form-control" v-model="votante.comuna" :options="comunas">
							</b-select>
						</div>
						<div class="col-12 col-sm-2">
							<label for="mesa">Mesa</label>
					<input type="text" id="mesa" class="form-control" v-model="votante.mesa" :disabled="lugarDesdeApi">
						</div>
					</div>
				</div>
				<div class="col-12">
					<h5 class="card-tag">Otros datos</h5>
					<hr>
					<div class="row">
						<div class="col-12 col-sm-3 mb-3">
							<div class="d-flex justify-content-between">
								<div>
									<label for="lider">Lider</label>
								</div>
							</div>
							<model-select :options="lideres" v-model="votante.lidere_id" id="lider" @input="getSublideres"></model-select>
						</div>
						<div class="col-12 col-sm-3 mb-3" v-if="sublideres.length > 0">
							<div class="d-flex justify-content-between">
								<div>
									<label for="sublider">Sublider</label>
								</div>
							</div>
							<model-select :options="sublideres" v-model="votante.sublidere_id" id="sublider"></model-select>
						</div>
						<div class="col-12 col-sm-3 mb-3">
							<label for="nombres">Nombres votante</label>
							<input type="text" class="form-control" id="nombres" v-model="votante.nombres" required>
						</div>
						<div class="col-12 col-sm-3 mb-3">
							<label for="apellidos">Apellidos votante</label>
							<input type="text" class="form-control" id="apellidos" v-model="votante.apellidos" required>
						</div>
						
						
						<div class="col-12 col-sm-3 mb-3">
							<label for="direccion">Direccion</label>
							<input type="text" id="direccion" class="form-control" v-model="votante.direccion">
						</div>
						<div class="col-12 col-sm-3 mb-3">
							<label for="telefono">Telefono</label>
							<input type="number" id="telefono" class="form-control" v-model="votante.telefono">
						</div>
						
					</div>
				</div>
				<div class="col-12 my-3" v-if="errores !== null">
					<p class="alert alert-danger">{{ errores }}</p>
				</div>
				<div class="col-12 my-3" v-if="cedValida">
					<button class="btn btn-dark" @click="guardarVotante" :disabled="loadingSave">
						<span v-if="loadingSave" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						{{ loadingSave ? 'Guardando...' : 'Guardar votante' }}
					</button>
				</div>
				<div class="col-12 my-3" v-if="repetido && $store.state.user.role_id === 2">
					<button class="btn btn-warning mr-2" @click="updateVotante" :disabled="loadingUpdate">
						<span v-if="loadingUpdate" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						{{ loadingUpdate ? 'Actualizando...' : 'Actualizar' }}
					</button>
					<button class="btn btn-danger" @click="deleteVotante" :disabled="loadingDelete">
						<span v-if="loadingDelete" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						{{ loadingDelete ? 'Eliminando...' : 'Eliminar' }}
					</button>
				</div>
			</div>
			<a-row type="flex" class="mt-30" v-else>
				<a-spin size="large" class="text-center"/>
			</a-row>
		</template>
	</a-card>
</template>

<script>

	import axios from 'axios'
	import ModalGenerateToken from "../Token/GenerateToken.vue";
	import GestionLideres from '../Config/lider/GestionLideres.vue'
	import GestionProfesiones from "../Config/profesiones/GestionProfesiones.vue";
	import VotantesRepetidos from "../Votantes/repetidos/ModalVotantesRepetidos.vue";
	import { ModelSelect, BasicSelect } from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
	export default {
		components:{
			ModalGenerateToken,
			GestionLideres,
			GestionProfesiones,
			VotantesRepetidos,
			ModelSelect,
			BasicSelect
		},
		data() {
			return {
				apiKey: 'S3CUR32025',
				cedValida: true,
				comunas: [],
				departamentos: [],
				errores: null,
				hoy: null,
				item: {
                    value: '',
                    text: ''
                },
				lideres: [],
				municipios: [],
				msnestado: null,
				msnconexion: false,
				msnLugar: false,
				msnPersona: false,
				nuevoVotante: false,
				profesiones: [],
				puestos: [],
				repetido: false,
				showForm: true,
				sublideres: [],
				votante: {cedula: null, departamento_id: null, nombres: null, apellidos: null, municipio_id: null, estado: null, fecha_nac: null, zona: null, puesto: null, nombre_puesto: null, mesa: null, lidere_id: null, sublidere_id: 0, barrio_id: null, direccion: null, telefono: null, correo: null, perfil: null},
				zonas: [],
				loading: false,
				loadingSave: false,
				loadingUpdate: false,
				loadingDelete: false,
				lugarDesdeApi: false,
				isProcessing: false
			}
		},	
		mounted() {
			// this.verificaApi()
			/* if(this.$store.state.tokenApi === null){
				this.$refs.modalToken.showModalGenerate()
			} */
			this.hoy = this.formatingDate(new Date());
			this.getComunas();
			this.getDepartamentos();
			this.getLideres();
			this.getProfesiones();
		},
		methods: {
			async buscarVotante(){
				if(this.isProcessing) {
					return
				}
				this.isProcessing = true
				
				try {
					const res = await axios.get(`https://apiserver.convexosit.co/personas?id=${this.votante.cedula}`, {
						headers: {
							"Content-Type": "application/json",
							"api_key": this.apiKey
						}
					})
					
					console.log(res.data)
					if(res.data.datosPersona.length > 0){
						this.votante.estado = res.data.datosPersona[0].estado
						this.votante.fecha_nac = res.data.datosPersona[0].fecha_nac;
						this.votante.edad = this.calcularEdad();
						if(parseInt(this.votante.estado) > 0){
							this.votante.observacione_id = 3
							this.msnestado = res.data.datosPersona[0].desc_estado
							this.cedValida = false
						}
					}else{
						this.msnPersona = true
					}
					
					if(res.data.lugar.length > 0){
						this.votante.departamento_id = parseInt(res.data.lugar[0].cod_dpto)
						this.votante.municipio_id = parseInt(res.data.lugar[0].cod_mcpio)
						this.votante.zona = res.data.lugar[0].zona
						this.votante.puesto = res.data.lugar[0].puesto
						this.votante.nombre_puesto = res.data.lugar[0].nombre_puesto
						this.votante.mesa = res.data.lugar[0].mesa
						this.votante.comuna = res.data.lugar[0].comuna
						
						await this.getMunicipio()
						
						this.lugarDesdeApi = true
						this.votante.observacione_id = 1
					}else{
						this.msnLugar = true
						this.votante.observacione_id = 5
					}
				
					this.showForm = true
				} catch(err) {
					console.log('Error en buscarVotante:', err)
					// Solo mostrar mensaje de conexión si es un error de red real
					if(!err.response || err.message.includes('Network Error') || err.message.includes('CORS')) {
						this.msnconexion = true
					}
					this.msnLugar = true
					this.showForm = true
					this.msnPersona = true
				} finally {
					this.isProcessing = false
				}
			},
			calcularEdad(){
				/* console.log(this.hoy);
				console.log(this.votante.fecha_nac); */
				var date_1 = new Date(this.votante.fecha_nac);
				var date_2 = new Date(this.hoy);

				var day_as_milliseconds = 86400000;
				var diff_in_millisenconds = date_2 - date_1;
				var diff_in_days = diff_in_millisenconds / day_as_milliseconds;
				return parseInt(diff_in_days/365);

			},
			deleteVotante(){
				Swal.fire({
					icon: 'warning',
					title: 'Atención!',
					text: 'Estas tratando de eliminar un registro del sistema, deseas continuar?',
					showDenyButton: false,
					showCancelButton: true,
					confirmButtonText: 'Aceptar',
					denyButtonText: `Don't save`,
					}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						this.loadingDelete = true
						axios.delete(`/api/listadovotantes/${this.votante.id}`, {
							headers: {
								"Authorization": `Bearer ${this.$store.state.user.token}`
							}
						})
							.then(res => {
								this.loadingDelete = false
								if(res.data.status === 'success'){
									Swal.fire('Registro eliminado!', '', 'success')
									this.nuevaBusqueda()
								}else{
									Swal.fire('No tienes privilegios para esta accion!', '', 'error')
								}
							})
							.catch(err => {
								this.loadingDelete = false
								console.log(err)
							})
					} 
				})
			},			
			formatingDate(dateToFormat) {
                const d = new Date(dateToFormat);
                const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
                const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
                const year = d.getFullYear();
                return `${year}-${month}-${day}`;
            },
            formatFechaNac(fecha){
                const arrayFecha = fecha.split('/', 3);
                return arrayFecha[2]+'-'+arrayFecha[1]+'-'+arrayFecha[0];
            },
			getComunas(){
				axios.get(`/api/comunas/${this.$store.state.user.candidato[0].departamento_id}/${this.$store.state.user.candidato[0].municipio_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					for (let i = 0; i < res.data.comunas.length; i++) {
						this.comunas.push({
							text: res.data.comunas[i].comuna,
							value: res.data.comunas[i].comuna
						})						
					}
				})
				.catch(err => {
					console.log(err)
				})
			},
			getDepartamentos(){
				axios.get('/api/departamentos', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					this.departamentos = res.data.departamentos
				})
				.catch(err => {
					console.log(err)
				})
			},
			getLideres(){
				this.lideres = []
				
				axios.get(`/api/lideres/${this.$store.state.user.candidato_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)					
					const data = res.data.lideres;
					
					for (let i = 0; i < data.length; i++) {
						this.lideres.push({
							value: data[i].id,
							text: data[i].nombres + ' ' + data[i].apellidos,
						})						
					}

					if(this.$store.state.user.role_id === 5 ){
						this.votante.lidere_id = this.$store.state.user.id
						this.getSublideres();
					}
					
					// this.lideres = res.data.lideres
				})
				.catch(err => {
					console.log(err)
				})
			},
			agregarLiderASublider(data){
				// console.log(data.sublideres[0].nombre_lider + data.sublideres[0].apellido_lider)
				const value = (data.sublideres.length > 0) ? data.sublideres[0].lidere_id : data.lider[0].lidere_id;
				const texto = (data.sublideres.length > 0) ? data.sublideres[0].nombres_lider + data.sublideres[0].apellidos_lider : data.lider[0].nombres_lider + data.lider[0].apellidos_lider;
				
				this.lideres.push({
					value: value,
					text: texto,
				})			

			},
			async getMunicipio(){
				try {
					const dpto = this.votante.departamento_id
					const res = await axios.get(`/api/municipios/${dpto}`, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					// console.log(res.data)
					this.municipios = res.data.municipios			
					await this.getZonas()
				} catch(err) {
					console.log(err)
				}
			},
			getProfesiones(){
				this.profesiones = []
				axios.get('/api/profesiones', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						for (let i = 0; i < res.data.profesiones.length; i++) {
							this.profesiones.push({
								value: res.data.profesiones[i].id,
								text: res.data.profesiones[i].profesion
							})
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			async getPuestos(){
				try {
					const res = await axios.get(`/api/puestos/${this.votante.departamento_id}/${this.votante.municipio_id}/${this.votante.zona}`, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					// console.log(res.data)
					this.puestos = res.data.puestos
				} catch(err) {
					console.log(err)
				}
			},
			getSublideres(){
				this.sublideres = [];
				axios.get(`api/sublideres/${this.votante.lidere_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						for (let i = 0; i < res.data.sublideres.length; i++) {
							this.sublideres.push({
								value: res.data.sublideres[i].id,
								text: res.data.sublideres[i].nombres + ' ' + res.data.sublideres[i].apellidos,
							})						
						}
					})
					.catch(err => console.log(err))
				
			},
			async getZonas(){
				try {
					const res = await axios.get(`/api/zonas/${this.votante.departamento_id}/${this.votante.municipio_id}`, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					// console.log(res.data)
					this.zonas = res.data.zonas
					await this.getPuestos()
				} catch(err) {
					console.log(err)
				}
			},
			guardarVotante(){

				this.errores = null
				this.normalizarNombreCompleto()
				const validator = this.validarVotante()
				if(!validator){
					this.loadingSave = true
					axios.post('/api/listadovotantes', this.votante, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						this.loadingSave = false
						if(res.data.status === 'success'){
							Swal.fire({
								icon: 'success',
								title: 'Registro existoso',
								text: 'El votante fue agregado con exito'
							})
							this.nuevaBusqueda()
						}else{
							this.errores = res.data
						}
					})
					.catch(err => {
						this.loadingSave = false
						console.log(err)
					})				
					
				}else{
					Swal.fire({
						icon: 'error',
						title: 'Campos vacios',
						text: 'Todos los campos son requeridos'
						
					})
				}
			},
			newLider(){
                this.$refs.gestion.newLider()
            },
			newProfesion(){
                this.$refs.profesiones.newProfesion()
			},
			nuevaBusqueda(){
				this.msnconexion = false
				this.repetido = false
				this.nuevoVotante = false
				this.isProcessing = false
				this.lugarDesdeApi = false
				this.votante = {cedula: null, departamento_id: null, municipio_id: null, nombres: '', apellidos: '', comuna: null, estado: null, fecha_nac: null, direccion: null, telefono: null, correo: null, zona: null, puesto: null, nombre_puesto: null, mesa: null, perfil: null}
				this.msnestado = null
				this.showForm = true
				this.item = {
					text: '',
					value: ''
				}
			},
			selectProfesion(item){
				this.votante.profesione_id = item.value
				this.item = item
			},
			setLideres(){
				this.getLideres()
			},
			setPuesto(){
				const puesto = this.puestos.find(puesto => puesto.nombre_puesto === this.votante.nombre_puesto)
				this.votante.puesto = puesto.puesto
			},
			updateProfesioneid(item){
				this.votante.profesione_id = item.id
				this.item.value = item.id
				this.item.text = item.profesion
			},
			updateVotante(){
				this.normalizarNombreCompleto()
				const validator = this.validarVotante()
				if(!validator){
					this.loadingUpdate = true
					axios.put(`/api/listadovotantes/${this.votante.id}`, this.votante, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						this.loadingUpdate = false
						if(res.data.status === 'success'){
							Swal.fire({
								icon: 'success',
								title: 'Registro modificado',
								text: 'El votante fue modificado con exito!'
							})
							this.nuevaBusqueda()
						}else{
							Swal.fire({
								icon: 'info',
								title: 'Atencion',
								text: 'Comunicate con el administrador.'
							})
						}
					})
					.catch(err => {
						this.loadingUpdate = false
						console.log(err)
					})				
					
				}else{
					Swal.fire({
						icon: 'error',
						title: 'Campos vacios',
						text: 'Todos los campos son requeridos'
						
					})
				}
			},
			normalizarNombreCompleto(){
				this.votante.nombres = (this.votante.nombres || '').trim().toUpperCase()
				this.votante.apellidos = (this.votante.apellidos || '').trim().toUpperCase()
			},
			validarVotante(){
				if(this.votante.cedula === '' || this.votante.cedula === null || this.votante.nombres === '' || this.votante.nombres === null || this.votante.apellidos === '' || this.votante.apellidos === null || this.votante.estado === '' || this.votante.estado === null || this.votante.fecha_nac === '' || this.votante.fecha_nac === null || this.votante.departamento_id === '' || this.votante.departamento_id === null || this.votante.municipio_id === '' || this.votante.municipio_id === null || this.votante.zona === '' || this.votante.zona === null || this.votante.puesto === '' || this.votante.puesto === null || this.votante.nombre_puesto === '' || this.votante.nombre_puesto === null || this.votante.mesa === '' || this.votante.mesa === null || this.votante.direccion === '' || this.votante.direccion === null || this.votante.telefono === '' || this.votante.telefono === null || this.votante.lidere_id === null || this.votante.lidere_id === ''){				
					return true
				}
				return false

			},			
			verificaApi(){
				this.$store.dispatch('getUrlApi', this.$store.state.user.token);
			},
			async verificarVotanteConsultado(){
				// Prevenir múltiples ejecuciones simultáneas
				if(this.isProcessing || this.loading) {
					console.log('Ya hay una búsqueda en proceso, ignorando...')
					return
				}

				if(this.votante.cedula === null || this.votante.cedula === ''){
					Swal.fire({
						icon: 'warning',
						title: 'Campo requerido',
						text: 'El campo cedula es requerido'
					})
					return
				}

				this.isProcessing = true
				this.loading = true
				this.cedValida = true
				this.repetido = false
				this.msnconexion = false
				this.nuevoVotante = true
				this.showForm = false
				this.msnLugar = false
				this.msnPersona = false

				try {
					const parametros = {
						candidato: this.$store.state.user.candidato_id,
						corporacion: this.$store.state.user.candidato[0].corporacione_id,
						cedula: this.votante.cedula
					}

					const res = await axios.post('api/votantes-repetidos', parametros, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					
					this.loading = false
					console.log(res.data)
					
				if(res.data.votante.length > 0){
					this.votante = Object.assign({}, res.data.votante[0])
					this.votante.cedula = res.data.votante[0].id
					if(parseInt(this.votante.estado) > 0){
						this.msnestado = 'Cedula no apta para votar'
					}
					this.votante.departamento_id = parseInt(res.data.votante[0].departamento_id)
					await this.getMunicipio(this.votante.departamento_id)
					this.votante.municipio_id = parseInt(res.data.votante[0].municipio_id)
					this.votante.observacione_id = 4
					this.item.value = res.data.votante[0].profesion_id
					this.item.text = res.data.votante[0].profesion
					this.showForm = true
					this.repetido = true
					// this.cedValida = false
					this.$refs.votanteRepetido.showRepetidos(res.data.votante)
					this.lugarDesdeApi = true;
				}else{
					// No hay votante repetido, buscar en API externa
					this.isProcessing = false;
					await this.buscarVotante()
				}
			
		} catch(err) {
			console.log('Error en verificarVotanteConsultado:', err)
			this.msnconexion = true
			this.msnLugar = true
			this.showForm = true
			this.msnPersona = true
		} finally {
					this.loading = false
					this.isProcessing = false
				}
			}
		},
		computed:{
			getNewLideres(){
				return this.$store.getters.getLideres
			}
		}
	}
</script>
<style scoped>
	.b-icon.bi{
		cursor: pointer;
	}
	.custom-select{
		display: block !important;
	}
	.spinner-border-sm {
		width: 1rem;
		height: 1rem;
	}
	.btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
