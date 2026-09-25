
<template>
	<div v-if="!render">
		<Loading />
	</div>
	<div v-else>
		<div class="row" >
			<ModalGrafico ref="modalGrafico" />
			<ModalHistoricoElecciones ref="modalHistorico" />
			
			<div class="col-12 col-md-7 p-2 table-responsive tabla">
				<a-card :bordered="false" class="widget-1">
					<h4>Divipol</h4>
					<table class="table table-striped">
						<thead>
							<tr>
								<th>Departamento</th>
								<th v-if="($store.state.user.candidato[0].corporacione_id != 3)">Municipio</th>
								<th v-if="($store.state.user.candidato[0].corporacione_id != 3)">Zona</th>
								<th v-if="($store.state.user.candidato[0].corporacione_id != 3)">Puesto</th>
								<th>No. mesas</th>
								<th>Potencial</th>
								<th>Militantes</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(divipol, index) in divipoles" :key="index">
								<td>{{ divipol.departamento }}</td>
								<td v-if="($store.state.user.candidato[0].corporacione_id != 3)">{{ divipol.municipio }}</td>
								<td v-if="($store.state.user.candidato[0].corporacione_id != 3)">{{ divipol.zona }}</td>
								<td v-if="($store.state.user.candidato[0].corporacione_id != 3)">{{ divipol.nombre_puesto }}</td>
								<td>{{ divipol.mesas }}</td>
								<td>{{ new Intl.NumberFormat().format(divipol.potencial) }}</td>
								<td>{{ new Intl.NumberFormat().format(divipol.votantes) }}</td>
								<td>
									<button class="btn btn-sm btn-success" @click="historicoVotantes(divipol)" v-if="$store.state.user.candidato[0].corporacione_id === 4">Historico</button>									
								</td>
							</tr>
						</tbody>
					</table>
				</a-card>
			</div>
			<div class="col-12 col-md-5 p-2">
				<a-card :bordered="false" class="widget-1" v-if="render">
					
					<div class="d-flex justify-content-between">
						<div>
							<h4>Candidato</h4>										
						</div>
						<div>
							<b-icon icon="person"></b-icon>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table">
							<thead>
								<tr class="text-center">
									<th>Nombres</th>
									<th>Corporacion</th>
									<th>Meta</th>
									<th>Detalle</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(meta, index) in metas" :key="index" class="text-center">
									<td>{{ meta.nombres }}</td>
									<td>{{ meta.corporacion }}</td>
									<td>{{ new Intl.NumberFormat().format(meta.meta_votacion) }}</td>
									<td>
										<b-icon icon="bar-chart" @click="showChart(meta)"></b-icon>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					
				</a-card>
				<a-card :bordered="false" class="widget-1 mt-2">
					<div class="d-flex justify-content-between">
						<div>								
							<h4><b-icon icon="calendar"></b-icon> # Cumpleaños: {{ totalcumple }} </h4>
						</div>
						<div>
							<label for="fecha"><h5>Cambiar fecha</h5></label>
							<input type="date" id="fecha" class="form-control mb-2" v-model="fecha_cumple" @input="getFechas">
						</div>
					</div>
					<div class="table-responsive cumple">

						<table class="table table-striped">
							<thead>
								<tr>
									<th>Nombres</th>
									<th>Direccion</th>
									<th>Telefono</th>
									<th>Cargo</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in tableData" :key="index">
									<td>{{item.nombre}}</td>
									<td>{{item.direccion}}</td>
									<td>{{item.telefono}}</td>
									<td>{{item.cargo}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</a-card>
			</div>
			
		</div>
	</div>
</template>

<script>

	// Bar chart for "Active Users" card.
	import CardBarChart from '../components/Cards/CardBarChart' ;

	import axios from 'axios'	

	import ModalGrafico from "../components/Dashboard/ModalGrafico.vue";
	import ModalHistoricoElecciones from "../components/Dashboard/ModalHistoricoelecciones.vue";
	import Loading from '../components/Loader/Loading.vue'

	export default ({
		components: {
			CardBarChart,
			ModalGrafico,
			ModalHistoricoElecciones,
			Loading
		},
		data() {
			return {				
				coordinadores: [],
				divipoles: [],
				fecha_cumple: this.formatingDate(new Date()),
				lideres: [],
				metas: [],
				tableData: [],
				render: false,
				totalcumple: 0,
				totalmetas: [],
				votantes: []
			}
		},
		mounted() {	
			this.getVotantes()	
			this.getFechas()			
			this.getMetas()
			// this.fechasEspeciales()
		},
		methods: {
			calcularPorcentaje(votantes, potencial){
				return (votantes/potencial).toFixed(2)
			},
			async getDivipoles(){

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
								this.divipoles.push({
									departamento: res.data.divipoles[i].departamento,
									departamento_id: res.data.divipoles[i].departamento_id,
									municipio_id: (corporacion != 3 ) ? res.data.divipoles[i].municipio_id: '',
									municipio: (corporacion != 3 ) ? res.data.divipoles[i].municipio : '',
									zona: (corporacion != 3) ? res.data.divipoles[i].zona : '',
									puesto: (corporacion != 3) ? res.data.divipoles[i].puesto : '',
									nombre_puesto: (corporacion != 3) ? res.data.divipoles[i].nombre_puesto : '',
									mesas: res.data.divipoles[i].mesas,
									potencial: parseInt(res.data.divipoles[i].num_hombres) + parseInt(res.data.divipoles[i].num_mujeres),
									votantes: res.data.divipoles[i].votantes
								})								
							}

						}else{
							this.divipoles = []
						}
						this.render = true
					})
					.catch(err => {
						this.render = true
						console.log(err)
					})
			},
			async getFechas(){
				const fecha = this.fecha_cumple;
				this.lideres = [];
				this.coordinadores = [];
				
				const res = await axios.get(`/api/fecha_cumple/${fecha}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				// console.log(res.data)
				this.lideres = res.data.lideres
				this.coordinadores = res.data.coordinadores
				this.totalcumple = this.lideres.length + this.coordinadores.length
				this.fechasEspeciales()
			},
			async getMetas(){
				let candidato = this.$store.state.user.candidato_id
				/* if(this.$store.state.user.candidato[0].corporacione_id !== 5){
					candidato = 0
				} */
				const params = {
					dpto: this.$store.state.user.candidato[0].departamento_id,
					mcpio: this.$store.state.user.candidato[0].municipio_id,
					candidato: candidato
				}
				// console.log(params)
				const resm = await axios.post('/api/metasvotantes', params,  {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})

				// console.log(resm.data)
				this.metas = resm.data.metas
				this.getDivipoles()
			},
			async getVotantes(){
				const res = await axios.get('/api/listadovotantes', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				this.votantes = res.data.listadovotantes
                
        	},
			fechasEspeciales(){
				const tableData = []
				for (let i = 0; i < this.lideres.length; i++) {
					tableData.push(
						{
							nombre: this.lideres[i].nombres+' '+this.lideres[i].apellidos,
							direccion: this.lideres[i].direccion,
							telefono: this.lideres[i].telefono,
							cargo: 'Lider',
						}
					)
				}
				for (let j = 0; j < this.coordinadores.length; j++) {
					tableData.push(
						{
							nombre: this.coordinadores[j].nombres+' '+this.coordinadores[j].apellidos,
							direccion: this.coordinadores[j].direccion,
							telefono: this.coordinadores[j].telefono,
							cargo: 'Coordinador',
						}
					)
				}
				this.tableData = tableData
			},
			formatingDate(dateToFormat){
				const d = new Date(dateToFormat);
				const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
				const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
				const year = d.getFullYear();
				return `${year}-${month}-${day}`
			},  
			historicoVotantes(item){
				this.$refs.modalHistorico.getHistoricoVotacion(item)
			},
			showChart(item){
				this.$refs.modalGrafico.getVotantesxCadidatos(item)
			}
		},
		computed: {
		},
	})

</script>
<style scoped>
	.b-icon.bi{
		cursor: pointer;
		
		font-size: 16pt;
		font-weight: bold;
	}
	.tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 600px;
    }
	.cumple{
		display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 200px;
	}
</style>