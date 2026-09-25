<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			
			<div class="row">
				<div class="col-12 my-3">
					<h2>Consultar</h2>
				</div>
				<div class="col-12 col-sm-6 mt-2">
					<input type="number" id="cedula" v-model="votante.cedula" class="form-control" placeholder="Cedula" @keypress.enter="verificarAsistencia" :disabled="nuevoVotante" />
				</div>	
				<div class="col-12 col-sm-6 mt-2">
					<button class="btn btn-primary btn-block"  @click="nuevaBusqueda" v-if="nuevoVotante">Nueva busqueda</button>
					<button class="btn btn-primary btn-block" @click="verificarAsistencia" v-else>Buscar</button>
				</div>	
			</div>
			<div class="row">
				<div class="col-md-12 mt-2" v-if="msnconexion">
					<p class="alert alert-info overflow-visible">No se recibio respuesta del servidor, puedes agregar el registro de forma manual o comunicarte con el administrador del sistema.</p>
				</div>
			</div>
			<div class="row mt-3 resultado-busqueda" v-if="showForm">
				<div class="col-12 mb-2">
					<label for="lider"><strong>Lider</strong></label>
					<model-select
						id="lider"
						:options="lideres"
						v-model="votante.lidere_id"
						:disabled="bloquearSeleccionLider"
					></model-select>
				</div>
				<div class="col-6">
					<h5 class="card-tag mt-3">Datos persona</h5>
					<hr>
					<h6><strong>Nombres: </strong></h6>
					<input type="text" class="form-control" v-model="votante.nombres">
					<h6><strong>Apellidos: </strong></h6>
					<input type="text" class="form-control" v-model="votante.apellidos">
					<h6><strong>Estado: </strong>{{votante.desc_estado}}</h6>					
					<h6 class="alert alert-danger overflow-visible" v-if="msnFallecido">Cedula: <strong>{{ votante.desc_estado }}</strong></h6>
					
					
					
				</div>
				<div class="col-6">
					<h5 class="card-tag mt-3">Lugar votación</h5>
					<hr>
					<h6><strong>Departamento: </strong>{{votante.desc_dpto}}</h6>
					<h6><strong>Municipio: </strong>{{votante.desc_mcpio}}</h6>
					<h6><strong>Puesto: </strong>{{votante.nombre_puesto}}</h6>
					<h6><strong>mesa: </strong>{{votante.mesa}}</h6>

					
				</div>
				<div class="col-12">
					<h5 class="card-tag mt-3">Observacion</h5>
					<textarea id="observacion" class="form-control" v-model="votante.observacion"></textarea>
					<button class="btn btn-primary mt-3" @click="guardarAsistencia" v-if="!asistencia">Registrar asistencia</button>
					<div v-if="errores" class="alert alert-danger mt-2">{{errores}}</div>
				</div>
				<div class="col-12 my-3">
					<div v-if="repetido">
						<p class="alert alert-success">Votante registrado en la BD.</p>
					</div>
					<div v-if="asistencia">
						<h5 class="alert alert-danger">{{msn_asistencia}}</h5>
					</div>
				</div>
			</div>
			<a-row type="flex" class="mt-30" v-else>
				<a-spin size="large" class="text-center"/>
			</a-row>
		</template>
	</a-card>
</template>

<script>

	import axios from 'axios';
	import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
	
	export default {
		components:{
			ModelSelect
		},
		data() {		
			return {
				apiKey: 'S3CUR32025',
				asistencia: false,
				busquedaValida: false,
				departamentos: [],
				errores: '',
				lideres: [],
				municipios: [],
				msn_asistencia: false,
				msnestado: null,
				msnFallecido: false,
				msnconexion: false,
				msnLugar: false,
				msnPersona: false,
				nuevoVotante: false,
				bloquearSeleccionLider: false,
				repetido: false,
				showForm: true,
				votante: {cedula: null, departamento_id: null, nombres: null, apellidos: null, municipio_id: null, estado: null, fecha_nac: null, zona: null, puesto: null, nombre_puesto: null, mesa: null, lidere_id: null, barrio_id: null, direccion: null, telefono: null, correo: null, perfil: null},
				puestos: [],
				zonas: []
			}
		},
		computed: {
			isLiderUser(){
				return Number(this.$store.state.user.role_id) === 5
			}
		},
		mounted() {
			this.setDefaultLider();
			this.getDepartamentos()
			this.getLideres()
		},
		methods: {
			setDefaultLider(){
				if(this.isLiderUser){
					this.votante.lidere_id = this.$store.state.user.id
				}
			},
			getLideres(aplicarLiderPorDefecto = true){
				this.bloquearSeleccionLider = false
				this.lideres = []

				return axios.get(`api/lideres/`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					const lideresFormateados = []
					if(res.data.status === 'success'){
						for (let i = 0; i < res.data.lideres.length; i++) {
							lideresFormateados.push({
								value: res.data.lideres[i].id,
								text: res.data.lideres[i].nombres + ' ' + res.data.lideres[i].apellidos,
							})
						}
					}
					this.lideres = lideresFormateados
					if(aplicarLiderPorDefecto){
						this.setDefaultLider()
					}
					return lideresFormateados
				})
				.catch(err => {
					console.log(err)
					return []
				})
			},
			getNombreLider(votanteRegistrado){
				return votanteRegistrado.nombre_lider
					|| votanteRegistrado.nombre_lidere
					|| `${votanteRegistrado.nombres_lider || votanteRegistrado.nombres_lidere || ''} ${votanteRegistrado.apellidos_lider || votanteRegistrado.apellidos_lidere || ''}`.trim()
			},
			getIdLider(votanteRegistrado){
				return Number(
					votanteRegistrado.lidere_id
					|| votanteRegistrado.lider_id
					|| votanteRegistrado.id_lider
					|| votanteRegistrado.id_lidere
					|| votanteRegistrado.lideres_id
					|| 0
				)
			},
			async buscarVotante(){
				// Restablece el select para mostrar todos los lideres en cada nueva busqueda.
				this.getLideres(false)

				const res = await axios.get(`https://apiserver.convexosit.co/personas?id=${this.votante.cedula}`, {
						headers: {
							"Content-Type": "application/json",
							"api_key": this.apiKey
						}
					})
				.then(res => {
					// console.log(res.data)
					if(res.data.datosPersona.length > 0){
						this.votante.nombres = res.data.datosPersona[0].nom1+' '+res.data.datosPersona[0].nom2
						this.votante.apellidos = res.data.datosPersona[0].ape1+' '+res.data.datosPersona[0].ape2
						this.votante.estado = res.data.datosPersona[0].estado
						this.votante.fecha_nac = res.data.datosPersona[0].fecha_nac
						if(parseInt(this.votante.estado) > 0){
							this.votante.observacione_id = 3
							this.votante.desc_estado = res.data.datosPersona[0].desc_estado
							this.msnFallecido = true
						}
						this.votante.desc_estado = res.data.datosPersona[0].desc_estado
					}else{
						this.msnPersona = true
					}
					if(res.data.lugar.length > 0){
						this.votante.departamento_id = parseInt(res.data.lugar[0].cod_dpto)
						this.getMunicipio(this.votante.departamento_id)
						this.votante.municipio_id = parseInt(res.data.lugar[0].cod_mcpio)
						this.votante.zona = res.data.lugar[0].zona
						this.votante.puesto = res.data.lugar[0].puesto
						this.votante.nombre_puesto = res.data.lugar[0].nombre_puesto
						this.votante.mesa = res.data.lugar[0].mesa
						this.votante.desc_dpto = res.data.lugar[0].desc_dpto
						this.votante.desc_mcpio = res.data.lugar[0].desc_mcpio
						this.votante.comuna = res.data.lugar[0].comuna

						//Valida si el votante pertenece al municipio del candidato.
						if(this.votante.departamento_id == this.$store.state.user.candidato.departamento_id && this.votante.municipio_id == this.$store.state.user.candidato.municipio_id){
							this.votante.observacione_id = 1
						}else{
							this.votante.observacione_id = 2
						}

					}else{
						this.msnLugar = true
						// this.asistencia = true
					}
					this.votante.lidere_id = null;
					this.showForm = true
				})
				.catch(err => {
					console.log(err)
					this.msnconexion = true
					this.msnLugar = true
					this.showForm = true
					this.msnPersona = true
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
			getMunicipio(dpto){
				axios.get(`/api/municipios/${dpto}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					this.municipios = res.data.municipios			
					// this.getZonas()	
				})
				.catch(err => {
					console.log(err)
				})
			},
			guardarAsistencia(){

				if(this.busquedaValida){
					if(!this.isLiderUser && !this.votante.lidere_id){
						Swal.fire({
							icon: 'warning',
							title: 'Lider requerido',
							text: 'Debe seleccionar un lider para registrar la asistencia.'
						})
						return
					}
					
					axios.post('api/dar_asistencia', this.votante, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						if(res.data.status === 'success'){
							Swal.fire({
								icon: 'success',
								text: 'Asistencia agregada exitosamente.'
							})
							this.nuevaBusqueda()
						}else{
							this.errores = res.data
						}
					})

				}else{
					Swal.fire({
						icon: 'error',
						title: 'No puede realizar esta accion',
						text: 'No hay datos para guardar.'
					})
				}
			},
			nuevaBusqueda(){
				this.nuevoVotante = false
				this.votante = {cedula: null, departamento_id: null, municipio_id: null, nombres: '', apellidos: '', comuna: null, estado: null, fecha_nac: null, direccion: null, telefono: null, correo: null, zona: null, puesto: null, nombre_puesto: null, mesa: null, lidere_id: null, perfil: null}
				this.setDefaultLider()
				this.msnestado = null
				this.msnFallecido = false
				this.repetido = false
				this.errores= '';
				this.asistencia = false;
			},
			verificarAsistencia(){

				this.errores = ''
				this.cedValida = true
				this.repetido = false
				this.msnconexion = false
				this.nuevoVotante = true
				this.showForm = false
				this.msnLugar = false
				this.msnPersona = false
				this.busquedaValida = true;
				this.asistencia = false;
				this.msn_asistencia = false;

				if(this.votante.cedula === null){
					Swal.fire({
						icon: 'warning',
						title: 'Campo requerido',
						text: 'El campo cedula es requerido'
					})
					this.showForm = true
					this.nuevaBusqueda()
					return
				}

				axios.get(`api/asistencia/${this.votante.cedula}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						if(res.data.status === 'success'){
							console.log(res.data)
							if(res.data.asistencia.length > 0){
								this.asistencia = true;
								this.showForm = true;
								this.msn_asistencia = 'La cedula consultada fue registrada por el lider: ' + res.data.asistencia[0].lider;
							}else{
								this.verificarVotanteConsultado()
							}
						}else{
							console.log('error en la consulta')
						}
					})
					.catch(err => {
						console.log(err)
						this.msnconexion = true
						this.msnLugar = true
						this.showForm = true
						this.msnPersona = true
					})

			},
			verificarVotanteConsultado(){				

				const parametros = {
					candidato: this.$store.state.user.candidato_id,
					corporacion: this.$store.state.user.candidato[0].corporacione_id,
					cedula: this.votante.cedula
				}

				axios.post('api/votantes-repetidos', parametros, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(async res => {
					// console.log(res.data)
					if(res.data.votante.length > 0){
						const votanteRegistrado = res.data.votante[0]
						this.votante = Object.assign({}, votanteRegistrado)
						this.votante.observacion = votanteRegistrado.nombre_lider
							? `VOTANTE REGISTRADO CON EL LIDER ${votanteRegistrado.nombre_lider}`
							: 'VOTANTE REGISTRADO SIN LIDER ASIGNADO';
						this.votante.cedula = votanteRegistrado.id
						if(parseInt(this.votante.estado) > 0){
							this.msnestado = 'Cedula no apta para votar'
						}

						const liderId = this.getIdLider(votanteRegistrado)
						let liderNombre = this.getNombreLider(votanteRegistrado)

						if(liderId){
							if(!liderNombre){
								const lideresDisponibles = await this.getLideres(false)
								const liderRegistrado = lideresDisponibles.find(lider => Number(lider.value) === liderId)
								liderNombre = liderRegistrado ? liderRegistrado.text : ''
							}
							this.lideres = [{
								value: liderId,
								text: liderNombre || `Lider ${liderId}`,
							}]
							this.votante.lidere_id = liderId
							this.bloquearSeleccionLider = true
						}else{
							await this.getLideres(false)
							this.votante.lidere_id = null
							this.bloquearSeleccionLider = false
						}

						this.votante.departamento_id = parseInt(votanteRegistrado.departamento_id)
						this.getMunicipio(this.votante.departamento_id)
						this.votante.municipio_id = parseInt(votanteRegistrado.municipio_id)
						this.votante.observacione_id = 4
						this.repetido = true
						this.showForm = true
					}
				})
				.catch(err => {
					console.log(err)
					this.msnconexion = true
					this.msnLugar = true
					this.showForm = true
					this.msnPersona = true
				})
			},
			verificaApi(){
				this.$store.dispatch('getUrlApi', this.$store.state.user.token);
			},
		},
	}
</script>
<style scoped>
	.resultado-busqueda{
		background-color: #EAEAEA;
		padding: 15px;
	}
</style>