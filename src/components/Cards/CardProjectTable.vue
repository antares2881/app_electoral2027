<template>
				
	<!-- Projects Table Card -->
	<a-card :bordered="false" class="dashboard-bar-chart" :bodyStyle="{padding: 0,}">
		<template #title>
			<h6>Cumpleaños hoy {{total}}</h6>	
			<p></p>
			<a-row type="flex" align="middle">
				<a-col :span="24" :md="12">
				</a-col>
				<!-- <a-col :span="24" :md="12" style="display: flex; align-items: center; justify-content: flex-end">
					<a-radio-group v-model="projectHeaderBtns" size="small">
						<a-radio-button value="all">ALL</a-radio-button>
						<a-radio-button value="online">ONLINE</a-radio-button>
						<a-radio-button value="stores">STORES</a-radio-button>
					</a-radio-group>
				</a-col> -->
			</a-row>
		</template>
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
				<tr v-for="(item, index) in data" :key="index">
					<td>{{item.nombre}}</td>
					<td>{{item.direccion}}</td>
					<td>{{item.telefono}}</td>
					<td>{{item.cargo}}</td>
				</tr>
			</tbody>
		</table>
		
	</a-card>
	<!-- / Projects Table Card -->

</template>

<script>

	export default ({
		props: ['data', 'total'],
		data() {
			return {

				// Active button for the "Projects" table's card header radio button group.
				projectHeaderBtns: 'all',
			}
		},
	})

</script>