<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<ModalGenerateToken ref="modalToken" />
			<b-modal ref="visible" hide-footer title="Nuevo recolector" size="lg">
				<div class="row">
					<div class="col-md-6">
						<label for="cedula">Cedula</label>
						<input type="number" class="form-control" v-model.number="recolector.id" />
					</div>
					<div class="col-md-6">
						<label for="nombres">Nombres</label>
						<input type="text" class="form-control" v-model="recolector.nombres" />
					</div>
					<div class="col-md-6">
						<label for="apellidos">Apellidos</label>
						<input type="text" class="form-control" v-model="recolector.apellidos" />
					</div>
					<div class="col-md-6">
						<label for="telefono">Telefono</label>
						<input type="number" class="form-control" v-model.number="recolector.telefono" />
					</div>
					<div class="col-md-12 mt-3">
						<p v-if="msnError" class="alert alert-danger mb-3">{{errors}}</p>
						<button class="btn btn-primary" @click="saveRecolector">Crear</button>
					</div>
				</div>        
			</b-modal>
			<div class="row">
				<div class="col-12 col-sm-7 mt-2">
					<input type="number" v-model="firma.cedula" class="form-control" placeholder="Cedula" @keypress.enter="verificarFirma" :disabled="nuevaFirma" />
				</div>
				<div class="col-12 col-sm-5 mt-2">
					<button class="btn btn-primary btn-block"  @click="nuevaBusqueda" v-if="nuevaFirma">Nueva busqueda</button>
					<button class="btn btn-primary btn-block" @click="verificarFirma" v-else>Buscar</button>
				</div>
				<div class="col-md-12 mt-2" v-if="msnFirma">
					<p class="alert alert-info overflow-visible">El numero de documento corresponde a un registro ya ingresado</p>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12 mt-2" v-if="msnconexion">
					<p class="alert alert-info overflow-visible">No se recibio respuesta del servidor, puedes agregar el registro de forma manual o comunicarte con el administrador del sistema.</p>
				</div>
			</div>
			<div class="row" v-if="showForm">
				<div class="col-12 col-sm-6">
					<h5 class="card-tag mt-3">Datos persona</h5>
					<hr>
					<div class="row">
						<div class="col-12 col-sm-6 mb-3">
							<label for="nombres">Nombres</label>
							<input type="text" class="form-control" id="nombres" v-model="firma.nombres" :disabled="readonlyPersona" />
						</div>
						<div class="col-12 col-sm-6 mb-3">
							<label for="apellidos">Apellidos</label>
							<input type="text" class="form-control" id="apellidos" v-model="firma.apellidos" :disabled="readonlyPersona" />
						</div>
						<div class="col-12 col-sm-6 mb-3">
							<label for="estado">Estado persona</label>
							<select id="estado" class="form-control" v-model="firma.estado" :disabled="readonlyPersona">
								<option v-for="(item, index) in estados" :key="index" :value="item.id">{{ item.estado }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-6">
							<label for="folio">Numero folio</label>
							<input type="text" id="folio" class="form-control" v-model="firma.numero_folio">
							<span class="text-sm text-danger">{{errors.numero_folio}}</span>
						</div>
						<div class="col-12 col-sm-6">
							<label for="renglon">Renglon</label>
							<select id="renglon" class="form-control" v-model="firma.renglon">
								<option v-for="(item, index) in renglones" :key="index" :value="item.value">{{item.text}}</option>
							</select>
							<span class="text-sm text-danger">{{errors.renglon}}</span>
						</div>
						<div class="col-12 col-sm-6">
							<div class="d-flex justify-content-between">
								<div>
									<label for="recolector">Recolector de registro</label>
								</div>
								<div>
									<b-icon icon="plus-lg" aria-hidden="true" @click="showModal" title="Agregar recolector"></b-icon>
								</div>
							</div>
							<model-select :options="recolectores" v-model="item"></model-select>
							<span class="text-sm text-danger">{{errors.recolectore_id}}</span>
						</div>
						
						<div class="col-12 mt-2" v-if="msnFallecido">
							<p class="alert alert-danger overflow-visible">Cedula: <strong>{{ firma.desc_estado }}</strong></p>
						</div>
					</div>
				</div>
				<div class="col-12 col-sm-6">
					<h5 class="card-tag mt-3">Lugar votación</h5>
					<hr>
					<div class="row">
						<div class="col-12 col-sm-6 mb-3">
							<label for="departamento">Departamento votación</label>
							<select id="departamento" class="form-control" v-model="firma.departamento_id" @change="getMunicipios" :disabled="readonlyLugar">
								<option v-for="(item, index) in departamentos" :key="index" :value="item.id">{{ item.departamento }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-6 mb-3">
							<label for="municipio">Municipio votación</label>
							<select id="municipio" class="form-control" v-model="firma.municipio_id" :disabled="readonlyLugar">
								<option v-for="(item, index) in municipios" :key="index" :value="item.id">{{ item.municipio }}</option>
							</select>
						</div>
						<div class="col-12 col-sm-8 mb-3">
							<label for="puesto">Puesto votación</label>
							<input type="text" class="form-control" v-model="firma.puesto" readonly>
						</div>
						<div class="col-12 col-sm-4 mb-3">
							<label for="mesa">Mesa</label>
							<input type="text" class="form-control" v-model="firma.mesa" readonly>
						</div>
						<div class="col-12 col-sm-6">
							<label for="observacion">Observación registro</label>
							<select id="observacion" class="form-control" v-model="firma.observacione_id">
								<option v-for="(item, index) in observaciones" :key="index" :value="item.id">{{ item.observacion }}</option>
							</select>
						</div>
					</div>
				</div>
				<div class="col-12 mt-3" v-if="!spin">
					<button class="btn btn-primary" @click="guardarFirma">Guardar registro</button>
				</div>
				<div class="col-12 mt-3" v-else>
					<a-spin size="large" />
				</div>
			</div>
			<div class="row justify-content-center mt-3" v-else>
				<div class="col-4">
					<a-spin size="large" class="text-center"/>
				</div>
			</div>
			<!-- <p class="mt-30 text-danger">{{ errors }}</p> -->
		</template>
	</a-card>
</template>

<script>

	// import { message } from 'ant-design-vue';
	import axios from 'axios'
	import ModalGenerateToken from "../Token/GenerateToken.vue";
	import { ModelSelect } from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'

	export default {
		components:{
			ModalGenerateToken,
			ModelSelect
		},
		data() {
			return {
				censo: false,
				departamentos: [],
				errors: '',
				estados: [
					{id: '00', estado: 'Activo'},
					{id: '21', estado: 'Cedula no apta para votar'}
				],
				firma: {cedula: null, observacione_id: null, estado: null, nombres: '', apellidos: '', recolectore_id: null},				
				item: {
				value: '',
				text: ''
				},
				msnconexion: false,
				msnError: false,
				msnFallecido: false,
				msnFirma: false,
				msnLugar: false,
				msnPersona: false,
				municipios: [],
				nuevaFirma: false,
				observaciones: [
					{id: 1, observacion: 'Registro valido'},
					{id: 2, observacion: 'Registro no pertenece a la region de la eleccion'},
					{id: 3, observacion: 'Registro no valido'},
					{id: 4, observacion: 'Registro ya ingresado'},
				],
				password: null,
				readonlyLugar: false,
				readonlyPersona: false,
				recolector: {id: null, nombres: null, apellidos: null, telefono: null},
				recolectores: [],
				renglones: [
					{value: 1, text: 'Renglon 1'},
					{value: 2, text: 'Renglon 2'},
					{value: 3, text: 'Renglon 3'},
					{value: 4, text: 'Renglon 4'},
					{value: 5, text: 'Renglon 5'},
					{value: 6, text: 'Renglon 6'},
					{value: 7, text: 'Renglon 7'},
					{value: 8, text: 'Renglon 8'},
					{value: 9, text: 'Renglon 9'},
					{value: 10, text: 'Renglon 10'},
					{value: 11, text: 'Renglon 11'},
					{value: 12, text: 'Renglon 12'},
					{value: 13, text: 'Renglon 13'},
					{value: 14, text: 'Renglon 14'},
					{value: 15, text: 'Renglon 15'},
				],
				showForm: true,
				spin: false
			}
		},	
		mounted() {
			this.verificaApi()
			if(this.$store.state.tokenApi === null){
				this.$refs.modalToken.showModalGenerate()
			}
			this.getDepartamentos()
			this.getRecolectores()
		},
		methods: {
			buscarfirma(){
				// const url = this.ipPublica
				axios.get(`http://eleccioneslocales2023.duckdns.org:8000/api/personas/${this.firma.cedula}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.tokenApi}`
					}
				})
				.then(res => {
					// console.log(res.data)
					if(res.data.datosPersona.length > 0){
						this.readonlyPersona = true
						this.firma.nombres = res.data.datosPersona[0].nom1+' '+res.data.datosPersona[0].nom2
						this.firma.apellidos = res.data.datosPersona[0].ape1+' '+res.data.datosPersona[0].ape2
						this.firma.estado = res.data.datosPersona[0].estado
						if(this.firma.estado == '21' || this.firma.estado == '51'){
							this.msnFallecido = true
							this.firma.desc_estado = res.data.datosPersona[0].desc_estado
							this.firma.observacione_id = 3
							this.censo = true
						}
						
					}else{
						this.msnPersona = true
					}
					if(res.data.lugar.length > 0){
						this.readonlyLugar = true
						this.censo = true
						this.firma.departamento_id = parseInt(res.data.lugar[0].cod_dpto)
						this.getMunicipios(this.firma.departamento_id)
						this.firma.municipio_id = parseInt(res.data.lugar[0].cod_mcpio)	
						this.firma.puesto = res.data.lugar[0].nombre_puesto
						this.firma.mesa = res.data.lugar[0].mesa
						if(this.firma.departamento_id === this.$store.state.user.candidato.departamento_id ){
							this.firma.observacione_id = 1
						}else{
							this.firma.observacione_id = 2
						}
						this.firma.recolectore_id = null
					}else{
						this.firma.observacione_id = 3
						this.msnLugar = true
					}
					this.showForm = true
				})
				.catch(err => {
					this.$store.state.tokenApi = null
					this.msnconexion = true
					this.msnPersona = true
					this.msnLugar = true
					this.showForm = true
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
			getMunicipios(dpto){
				axios.get(`/api/municipios/${dpto}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					this.municipios = res.data.municipios
					
				})
				.catch(err => {
					console.log(err)
				})
			},
			getRecolectores(){
				this.recolectores = []
				axios.get(`/api/recolectores/${this.$store.state.user.candidato_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					for (let i = 0; i < res.data.recolectores.length; i++) {
						this.recolectores.push({
							text: res.data.recolectores[i].nombres + ' ' +res.data.recolectores[i].apellidos,
							value: res.data.recolectores[i].id
						})											
					}					
				})
				.catch(err => {
					console.log(err)
				})
			},
			guardarFirma(){
				this.firma.recolectore_id = this.item.value
				this.spin = true
				if(this.firma.cedula === null || this.firma.nombres === null || this.firma.apellidos === null || this.firma.nombres === '' || this.firma.apellidos === '' || this.firma.estado === null || this.firma.observacione_id === null){
					Swal.fire({
						icon: 'warning',
						title: 'Campos invalidos',
						text: 'Hay campos vacios o nulos'
					})
					this.spin = false
					return
				}	
				this.firma.user_id = this.$store.state.user.id
				axios.post(`/api/firmas`, this.firma, 
						{
							headers: {
								"Authorization": `Bearer ${this.$store.state.user.token}`
							}
						})
						.then(res => {
							if(res.data.status === 'success'){
								Swal.fire({
									icon: 'success',
									title: 'Registro exitoso',
									text: 'El registro fue ingreado con exito.'
								})
								this.nuevaBusqueda()
							}else{
								this.errors = res.data
							}
							this.spin = false
						})
						.catch(err => {
							console.log(err)
						})
			},
			nuevaBusqueda(){
				this.readonlyLugar = false
				this.readonlyPersona = false
				this.msnFallecido = false
				this.msnconexion = false
				this.errors = ''
				this.nuevaFirma = false
				this.msnFirma = false
				this.firma = {cedula: null, nombres: '', apellidos: '', estado: null, estado_id: null}
				this.item = {
					text: '',
					value: ''
				}
			},
			refresh(){
				location.reload()
			},
			saveRecolector(){
                this.msnError = false
				this.errors = ''
                const validate = this.validateRecolector()
                if(validate)return
                this.recolector.candidato = this.$store.state.user.candidato_id
                axios.post('/api/recolectores', this.recolector, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.status === 'success'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro exitoso',
                            text: 'Recolector creado con exito'
                        })	 
                        this.$refs['visible'].hide()
						this.getRecolectores()
                    }else{
                        this.errors = res.data
                        this.msnError = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
			showModal(){
				this.$refs['visible'].show()
			},
            validateRecolector(){
                if(this.recolector.id === null || this.recolector.id === '' || this.recolector.nombres === null || this.recolector.nombres === '' || this.recolector.apellidos === null || this.recolector.apellidos === '' || this.recolector.telefono === null || this.recolector.telefono === ''){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos invalidos',
                        text: 'Hay campos vacios o nulos, revisar'
                    })
                    return true
                }                
            },
			verificaApi(){
				this.$store.dispatch('getUrlApi', this.$store.state.user.token);
			},
			verificarFirma(){
				this.censo = false
				this.msnFallecido = false
				this.nuevaFirma = true
				this.showForm = false
				this.msnLugar = false
				this.msnFirma = false
				this.msnconexion = false
				this.firma.recolectore_id = null

				if(this.firma.cedula === null){
					Swal.fire({
						icon: 'warning',
						title: 'Campo requerido',
						text: 'El campo cedula es requerido'
					})
					this.showForm = true
					this.nuevaBusqueda()
					return
				}
				if(isNaN(this.firma.cedula)){
					Swal.fire({
						icon: 'error',
						title: 'Atención',
						text: 'Campo solo permite valores numericos'
					})
					this.showForm = true
					this.nuevaBusqueda()
					return
				}

				axios.get(`/api/firmas/${this.firma.cedula}/${this.$store.state.user.candidato_id}`, 
					{
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {						
						if(res.data.firma.length > 0){
							this.msnFirma = true
							this.msnPersona = true
							this.msnLugar = true
							this.showForm = true
							this.firma = res.data.firma[0]
							this.firma.observacione_id = 4
							this.censo = true
							this.getMunicipios(this.firma.departamento_id)
						}else{
							this.buscarfirma()
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
			selectFromParentComponent1 () {
				// select option from parent component
				// this.item = this.options[0]
			},
		},
		computed:{
			ipPublica(){
				return this.$store.getters.getUrlApi
			}
		}
	}
</script>
<style scoped>
	p {
		width: 100%;
		/* BOTH of the following are required for text-overflow */
		white-space: nowrap;
		overflow: hidden;
	}
	.overflow-visible {
		white-space: initial;
	}
	.b-icon.bi{
		cursor: pointer;
	}
</style>