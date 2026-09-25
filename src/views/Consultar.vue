<template>
	<div class="row">
		<div class="col-12">
			<button class="btn btn-primary mr-2"  @click="option=1"> <b-icon icon="person-check"></b-icon> Agregar asistencia</button>
            <button class="btn btn-dark mr-2"  @click="option=2" v-if="$store.state.user.role_id === 10 || $store.state.user.role_id === 2 || $store.state.user.role_id === 1"> <b-icon icon="bar-chart"></b-icon> Ver asistentes</button>
		</div>
		<div class="col-12 my-3">
			<ComandoRegistrar v-if="option === 1"></ComandoRegistrar>
            <ComandoConsultar v-if="option === 2"></ComandoConsultar>
		</div>
	</div>
</template>

<script>

	import ComandoRegistrar from '../components/Comandos/Registrar.vue';
	import ComandoConsultar from '../components/Comandos/Consultar.vue';

	export default {
		components:{
			ComandoRegistrar, ComandoConsultar
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