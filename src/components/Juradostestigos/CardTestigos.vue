<template>
	<div class="row mb-3">
		<b-modal ref="new-testigo" hide-footer title="Agregar testigo" size="xl" no-close-on-backdrop>
			<div class="row">
				<div class="col-6 mb-2">
					<label for="">Buscar por numero de cedula: </label>
					<Persona @setPersona="setPersona" />
				</div>

				<div class="col-12" v-if="results">					
					<p><strong>{{testigo.nom1}} {{testigo.nom2}} {{testigo.ape1}} {{testigo.ape2}} {{testigo.nombre_puesto}} MESA: {{testigo.mesa}}</strong></p>
				</div>
				<div class="col-6">
					<label for="partido">Partido</label>
					<model-select :options="partidos" v-model="testigo.partido_id"></model-select>
				</div>
				<div class="col-6">
					<label for="email">Email</label>
					<input type="email" class="form-control" id="email" v-model="testigo.email">
				</div>
				<div class="col-6">
					<label for="telefono">Telefono</label>
					<input type="number" class="form-control" id="telefono" v-model="testigo.telefono">
				</div>
				<div class="col-12 my-3" v-if="testigo.departamento_id === $store.state.user.candidato[0].departamento_id && testigo.municipio_id == $store.state.user.candidato[0].municipio_id ">
					<button class="btn btn-primary" @click="asignPuesto">Agregar mesas</button>
				</div>
			</div>
		</b-modal>
		<VerTestigos ref="verTestigos" />
		<div class="col-12">
			<span class="regresar" @click="regresar"><b-icon icon="arrow-left"></b-icon> Volver</span> <span>/ Testigos</span>
		</div>
		<div class="col-12 my-3">
			<button class="btn btn-success mr-2">Descargar testigos</button>
			<button class="btn btn-primary" @click="newTestigo">Nuevo testigo</button>
		</div>
		<div class="col-12 text-center" v-if="loader">
			<Loading />
		</div>
		<div class="col-5 col-sm-2 m-2 puestos text-center" v-for="(item, index) in puestos" :key="index" @click="showPuesto(item.zona, item.puesto, item.nombre_puesto)" :id="item.zona + item.puesto" >
			<p class="nombre-puesto">{{item.nombre_puesto}}</p>
			<p class="text-small"><strong># Mesas: </strong>{{item.mesas}}</p>
		</div>
	</div>	
</template>

<script>
	import axios from 'axios';
	import Loading from '../Loader/Loading.vue';
	import VerTestigos from './Testigos/VerTestigos.vue';
	import Persona from '../Persona/Persona.vue';
	import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
	export default {
		components:{
			Loading, ModelSelect, VerTestigos, Persona
		},
		data() {
			return {
				loader: false,
				partidos: [],
				puestos: [],
				results: false,
				testigo: {departamento_id: null}
			}
		},
		mounted(){
			
			this.loader = true
			this.getDivipole()
			this.getPartidos()
		},
		methods: {
			asignPuesto(){
				this.$refs['new-testigo'].hide()
				this.$refs.verTestigos.addMesas(this.testigo)
			},
			async getDivipole(){

				const corporacion = this.$store.state.user.candidato[0].corporacione_id 
				const departamento = this.$store.state.user.candidato[0].departamento_id 
				const municipio = this.$store.state.user.candidato[0].municipio_id
				const candidato = this.$store.state.user.candidato_id
				const parametros = {
					'dpto': departamento,
					'mcpio': municipio,
					'corporacion': corporacion,
					'candidato': candidato
				}
				
				await axios.post('api/divipoles', parametros, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						// console.log(res.data.divipoles)
						if(res.data.status === 'success'){
							for (let i = 0; i < res.data.divipoles.length; i++) {
								this.puestos.push({
									departamento_id: res.data.divipoles[i].departamento_id,
									municipio_id: res.data.divipoles[i].municipio_id,
									municipio: res.data.divipoles[i].municipio,
									zona: res.data.divipoles[i].zona,
									puesto: res.data.divipoles[i].puesto,
									nombre_puesto: res.data.divipoles[i].nombre_puesto,
									mesas: res.data.divipoles[i].mesas,
									potencial: res.data.divipoles[i].num_hombres + res.data.divipoles[i].num_mujeres,
									votantes: res.data.divipoles[i].votantes
								})								
							}

						}else{
							this.puestos = []
						}
						this.loader = false;
					})
					.catch(err => {
						this.render = true
						cosole.log(err)
					})
			},
			getPartidos(){
				axios.get('api/partidos', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					for (let i = 0; i < res.data.partidos.length; i++) {
						this.partidos.push({
							text: res.data.partidos[i].partido,
							value: parseInt(res.data.partidos[i].codigo_partido)
						})                    
					}
				})
				.catch(err => {
					this.partidos = []
					console.log(err)
				})
			},
			newTestigo(){
				this.testigo = {}
				this.results = false;
				this.$refs['new-testigo'].show()
			},
			regresar(){
				this.$emit('regresar', 0)
			},
			setPersona(){
				const persona = this.getPersona

                this.$set(this.testigo, 'id', persona.cedula)
                this.$set(this.testigo, 'nom1', persona.nom1)
                this.$set(this.testigo, 'nom2', persona.nom2)
                this.$set(this.testigo, 'ape1', persona.ape1)
                this.$set(this.testigo, 'ape2', persona.ape2)
                this.$set(this.testigo, 'cedula', persona.cedula)
                this.$set(this.testigo, 'estado', persona.estado)
                this.$set(this.testigo, 'departamento_id', persona.dpto)
                this.$set(this.testigo, 'municipio_id', persona.mcpio)
                this.$set(this.testigo, 'comuna', persona.comuna)
                this.$set(this.testigo, 'zona', persona.zona)
                this.$set(this.testigo, 'puesto', persona.puesto)
                this.$set(this.testigo, 'nombre_puesto', persona.nombre_puesto)
                this.$set(this.testigo, 'mesa', persona.mesa)
                this.results = true;
            },
			showPuesto(zona, puesto, nombre_puesto){
				this.$refs.verTestigos.testigos(zona, puesto, nombre_puesto)
			}
		},
        computed:{
            getPersona(){                
                return this.$store.getters.getPersona
            }
        }
	}
</script>
<style scoped>
	.nombre-puesto{
		font-weight: bold;
	}
	.puestos{
		background-color: #DFFEFF;
		border: 1px solid #cecece;
		border-radius: 5px;
		cursor: pointer;
		padding: 5px;
	}
	.regresar{
		cursor: pointer;
	}
</style>