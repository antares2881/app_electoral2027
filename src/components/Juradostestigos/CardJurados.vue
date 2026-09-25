<template>	
	<div>
		<div class="row mb-3">
			<div class="col-12">
				<span class="regresar" @click="regresar"><b-icon icon="arrow-left"></b-icon> Volver</span> <span>/ Jurados</span>
			</div>
			<div class="col-12 my-2">
				<button class="btn btn-primary mr-2" @click="opcion=1"><b-icon icon="plus"></b-icon> Agregar</button>
				<!-- <button class="btn btn-dark mr-2" @click="opcion=2"><b-icon icon="search"></b-icon> Buscar en militantes</button> -->
				<button class="btn btn-dark" @click="opcion=3"><b-icon icon="eye"></b-icon> Ver jurados</button>
			</div>
		</div>
		<AgregarJurado v-if="opcion === 1" />
		<FiltrarJurados v-if="opcion === 2" />
		<VerJurados v-if="opcion === 3" />
	</div>		
</template>

<script>
	import AgregarJurado from './Jurados/AgregarJurado.vue'
	import FiltrarJurados from './Jurados/FiltrarJurados.vue'
	import VerJurados from "./Jurados/VerJurados.vue";
	export default {
		components: {
			AgregarJurado, FiltrarJurados, VerJurados
		},
		data() {
			return {
				opcion: 0
			}
		},
		methods:{
			regresar(){
				this.$emit('regresar', 0)
			}
		}
	}
</script>
<style scoped>
	.regresar{
		cursor: pointer;
	}
</style>