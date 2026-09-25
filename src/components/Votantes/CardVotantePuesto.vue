<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>			
			<div class="row">
				<div class="col-md-12">
					<h5>Filtrar x </h5>
				</div>
				<div class="col-md-4">
					<b-form-select id="tipo" v-model="votantes.tipo" :options="options" @change="setArray">
						<template #first>
							<b-form-select-option :value="null" disabled>-- Seleccione el filtro --</b-form-select-option>
						</template>
					</b-form-select>
					
				</div>
				<div class="col-md-4">
					<select name="" id="tipo" v-model="votantes.opcion" class="form-control">
						<option v-for="(item, index) in arrayOpt" :key="index" :value="item.id">{{item.text}}</option>
					</select>
				</div>
				<div class="col-md-4">
					<button class="btn btn-success" @click="verVotantes" :disabled="cargando">
						<span v-if="cargando">
							<i class="fas fa-spinner fa-spin"></i> Cargando...
						</span>
						<span v-else>Ver</span>
					</button>
				</div>
			</div>
			<div v-if="cargando" class="loader-container">
				<Loading />
			</div>
			<div v-else>
				<CardVerVotantesGeneral v-if="respuesta == 0" :data="resultados"></CardVerVotantesGeneral>
				<CardVerVotantesxLugar v-if="respuesta == 1" :data="resultados"></CardVerVotantesxLugar>
				<CardVerVotantesxPersonal v-if="respuesta == 2" :data="resultados"></CardVerVotantesxPersonal>
			</div>
		</template>
	</a-card>
</template>

<script>

	import CardVerVotantesGeneral from './ver_votantes/CardVerVotantesGeneral.vue'
	import CardVerVotantesxLugar from './ver_votantes/CardVerVotantesxLugar.vue'
	import CardVerVotantesxPersonal from './ver_votantes/CardVerVotantesxPersonal.vue'
	import Loading from '../Loader/Loading.vue'
	import axios from 'axios'

	export default {
		components: {
			CardVerVotantesxLugar,
			CardVerVotantesxPersonal,
			CardVerVotantesGeneral,
			Loading
		},
		data() {
			return {
				arrayOpt: [],
				cargando: false,
				options: [
					{text: 'General', value: 0},
					{text: 'Puesto de votación', value: 1},
					{text: 'Personal', value: 2},
				],
				respuesta: null,
				resultados: [],
				votantes: {tipo: null, opcion: 1}
			}
		},
		mounted() {
			// this.votantesGeneral()
		},
		methods: {
			setArray(){
				// console.log(this.votantes.tipo)
				this.respuesta = null
				this.arrayOpt = []
				if(this.votantes.tipo == 2){
					if(this.$store.state.user.role_id === 6 || this.$store.state.user.role_id === 8){
						this.arrayOpt = [
							{id: 2, text: 'Lider'}
						]	
					}else{
						this.arrayOpt = [
							{id: 1, text: 'Coordinador'},
							{id: 2, text: 'Lider'},
							{id: 3, text: 'Sublider'},
						]
					}
				}else if(this.votantes.tipo == 0){
					this.arrayOpt = [
						{id: 1, text: 'Mayores de 18'},
						{id: 2, text: 'Entre 14 y 28 años'}
					]
				}
			},
			verVotantes(){
				if(this.votantes.tipo == 0){
					this.votantesGeneral()
				}else{

					this.cargando = true
					this.respuesta = null
					this.resultados = []
					this.votantes.role = this.$store.state.user.role_id
					this.votantes.candidato = this.$store.state.user.candidato_id
	
					axios.post(`/api/ver-votantes`, this.votantes, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
					.then(res => {
						// console.log(res.data)
						if(this.votantes.tipo === 2){
							for (let i = 0; i < res.data.length; i++) {
								this.resultados.push({
									opcion: this.votantes.opcion,
									nombres: res.data[i].nombres +' ' +res.data[i].apellidos,
									votantes: res.data[i].votantes,
									meta_votantes: res.data[i].meta_votantes,
									lidere_id: res.data[i].lidere_id
								})							
							}
						}else{
							this.resultados = res.data
						}
						this.respuesta = this.votantes.tipo
						
					})
					.catch(err => {
						console.log(err)
					})
					.finally(() => {
						this.cargando = false
					})
				}
			},
			votantesGeneral(){
				this.cargando = true
				axios.get(`/api/ver-votantes/${this.votantes.opcion}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					this.resultados = res.data
					this.respuesta = 0
					
				})
				.catch(err => {
					console.log(err)
				})
				.finally(() => {
					this.cargando = false
				})
			}
		},
	}
</script>
<style scoped>
	.loader-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 40px;
	}

	.btn-success:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>