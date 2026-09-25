<template>

	<!-- Active Users Card -->
	<a-card :bordered="false" class="dashboard-bar-chart" v-if="render">
		<template #title>
			<h6>Metas de votacion</h6>		
			<p>Votantes registrados: <span class="text-danger" :class="{'text-success': votantes.length > total/2}">{{votantes.length}}</span></p>	
		</template>
		<chart-bar :height="300" :data="barChartData"></chart-bar>
		<br>
		<a-row class="card-footer" type="flex" >
			<a-col :span="24">
				<span>Ultimo votante registrado:</span>
				<p>{{new Date(votantes[votantes.length-1].created_at)}}</p>
			</a-col>
		</a-row>
	</a-card>
	<!-- Active Users Card -->

</template>

<script>

	// Bar chart for "Active Users" card.
import ChartBar from '../Charts/ChartBar' ;
import axios from 'axios'

	export default ({
		components: {
			ChartBar,
		},
		data() {
			return {
				// Data for bar chart.
				barChartData: {
					labels: [],
					datasets: [{
						label: "Meta",
						backgroundColor: '#fff',
						borderWidth: 0,
						borderSkipped: false,
						borderRadius: 6,
						data: [],
						maxBarThickness: 20,
					}, ],
				},
				metas: [],
				total: 0,
				render: false,
				votantes: []
			}
		},
		mounted() {	
			this.getVotantes()
			this.getMetas()			
		},
		methods: {
			async getMetas(){
				const resm = await axios.get('/api/metas', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				this.metas = resm.data.metas
				
				this.setDataChart()
			},			
			async getVotantes(){
				const res = await axios.get('/api/listadovotantes', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				this.votantes = res.data.listadovotantes
                // console.log(this.votantes)
        	},
			setDataChart(){
				this.total = 0
				for (let i = 0; i < this.metas.length; i++) {
					this.barChartData.labels.push(this.metas[i].comuna)										
					this.barChartData.datasets[0].data.push(this.metas[i].meta)		
					this.total += this.metas[i].meta								
				}
				this.render = true
				
			},
			totalMetas(){
				for (let i = 0; i < this.metas.length; i++) {
					this.totalmetas+= parseInt(this.metas[i].meta)	
				}
			}
		},
		computed: {	
		},
	})

</script>