<template>
	<div class="row">
		<div class="col-12">
			<button class="btn btn-primary mr-2"  @click="option=1"> <b-icon icon="person-check"></b-icon> Agregar votacion</button>
            <button class="btn btn-dark mr-2"  @click="option=2" v-if="$store.state.user.role_id === 10 || $store.state.user.role_id === 2 || $store.state.user.role_id === 1"> <b-icon icon="bar-chart"></b-icon> Ver resultados</button>
			<button class="btn btn-success mr-2" @click="option=3" v-if="canSeeReportes"> <b-icon icon="table"></b-icon> Reportes</button>
		</div>
		<div class="col-12 my-3">
			<PreconteoAgregar v-if="option === 1"></PreconteoAgregar>
            <PreconteoResultados v-if="option === 2"></PreconteoResultados>
			<PreconteoReportes v-if="option === 3 && canSeeReportes"></PreconteoReportes>
		</div>
	</div>
</template>

<script>

	import PreconteoAgregar from '../components/Preconteo/Agregar.vue';
    import PreconteoResultados from '../components/Preconteo/Resultados.vue'
	import PreconteoReportes from '../components/Preconteo/Reportes.vue';

	export default {
		components:{
			PreconteoAgregar, PreconteoResultados, PreconteoReportes
		},
		computed: {
			canSeeReportes() {
				return this.$store.state.user.role_id === 1 || this.$store.state.user.role_id === 2;
			}
		},
		data() {		
			return {
				option: 0
			}
		},	
		mounted() {
		},
		methods: {
			
		},
	}
</script>