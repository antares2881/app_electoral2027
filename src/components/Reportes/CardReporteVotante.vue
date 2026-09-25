<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
			<div class="row">
				<!-- <div class="col-12">
					<h6>Tipo de coordinador</h6>
				</div>
				<div class="col-md-6 my-3">					
					<b-select :options="tipos" v-model="tipo"></b-select>
				</div> -->
				<div class="col-12">
					<a :href=" url + '/imprimir-votantes-general/' + $store.state.user.token_id + '/1' " target="_blank" class="btn btn-success"><b-icon icon="file-earmark-excel"></b-icon> Descargar excel general</a>
				</div>
			</div>
		</template>
	</a-card>
</template>

<script>
export default {
    data() {
        return {
			tipo: 0,
			tipos: [
				{text: 'Coordinador', value: 1},
				{text: 'Subcoordinador', value: 2}
			],
            url: 'https://apidemo.convexosit.co'
        }
    },
}
</script>