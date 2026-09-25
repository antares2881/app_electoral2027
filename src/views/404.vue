<template>
	<a-result status="404" title="404" sub-title="Lo sentimos, la pagina que buscas no existe.">
		<template #extra>
			<button class="ant-btn ant-btn-primary" @click="back">Volver</button>
			
		</template>
	</a-result>
</template>
<script>
	export default {
		data(){
			return{

			}
		},
		methods:{
			back(){
				this.$router.go(-1)
			}
		}
	}
</script>