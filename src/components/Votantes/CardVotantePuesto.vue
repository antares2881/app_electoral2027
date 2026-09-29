<template>
	<a-card :bordered="false" class="header-solid h-full votantes-puesto" :bodyStyle="{padding: 0,}">
		<template #title>			
			<div class="caja-filtros">
				<div class="titulo-filtros">
					<h5>Filtrar militantes</h5>
				</div>
				<div class="campo-filtro">
                    <label for="tipo-filtro-votantes">Tipo de filtro</label>
					<b-form-select class="control-filtro" id="tipo-filtro-votantes" v-model="votantes.tipo" :options="options" @change="setArray">
						<template #first>
							<b-form-select-option :value="null" disabled>-- Seleccione el filtro --</b-form-select-option>
						</template>
					</b-form-select>
					
				</div>
				<div class="campo-filtro">
                    <label for="opcion-filtro-votantes">Opción</label>
					<select id="opcion-filtro-votantes" v-model="votantes.opcion" class="form-control control-filtro">
						<option v-for="(item, index) in arrayOpt" :key="index" :value="item.id">{{item.text}}</option>
					</select>
				</div>
				<div class="accion-filtro">
					<button class="btn btn-consultar" @click="verVotantes" :disabled="cargando">
						<span v-if="cargando">
							<i class="fas fa-spinner fa-spin"></i> Cargando...
						</span>
						<span v-else>Ver militantes</span>
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
    .caja-filtros {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
        align-items: end;
        gap: 1rem;
        padding: 1.25rem;
        margin-bottom: 1.5rem;
        background: #f8faf9;
        border: 1px solid #e1e8e4;
        border-radius: 12px;
        white-space: normal;
    }
    .titulo-filtros { grid-column: 1 / -1; border-bottom: 1px solid #d8e0dc; padding-bottom: 0.875rem; }
    .titulo-filtros h5 { margin: 0; color: #198754; font-size: 1.1rem; font-weight: 700; }
    .campo-filtro { min-width: 0; }
    .campo-filtro label { display: block; margin: 0 0 0.4rem; color: #475569; font-size: 0.875rem; font-weight: 600; line-height: 1.4; }
    .campo-filtro .control-filtro { display: block; width: 100%; height: 44px; padding: 0.5rem 2rem 0.5rem 0.75rem; background-color: #fff; border: 1px solid #d8e0dc; border-radius: 8px; font-size: 0.95rem; color: #334155; }
    .campo-filtro .control-filtro:focus { border-color: #198754; box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.12); outline: none; }
    .btn-consultar { width: 100%; min-height: 44px; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; background: #198754; border: 1px solid #198754; color: #fff; }
    .btn-consultar:hover { background: #146c43; border-color: #146c43; color: #fff; }
    .btn-consultar:focus-visible { outline: 3px solid rgba(25, 135, 84, 0.35); outline-offset: 2px; }
    @media (max-width: 767px) {
        .caja-filtros { grid-template-columns: minmax(0, 1fr); padding: 1rem; }
    }

	.loader-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 40px;
	}

	.btn-consultar:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>