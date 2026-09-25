<template>
	<div>
		<canvas ref="chart" :style="{'height': height + 'px'}"></canvas>
	</div>
</template>

<script>
	import { Chart, registerables } from 'chart.js';
	import ChartDataLabels from 'chartjs-plugin-datalabels';
	Chart.register(...registerables, ChartDataLabels);

	export default ({
		props: [
			'data',
			'height',
		],
		data(){
			return {
				chart: null,
			} ;
		},
		mounted () { 
    		let ctx = this.$refs.chart.getContext("2d");
			this.chart = new Chart(ctx, {
				type: "bar",
				data: this.data,
     			options: {
					layout: {
						padding: {
							top: 30,
							right: 15,
							left: 10,
							bottom: 60,
						},
					},
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: true,
							position: 'bottom',
							align: 'start',
							labels: {
								boxWidth: 15,
								padding: 15,
								font: {
									size: 12,
									weight: '500'
								},
								usePointStyle: true,
								pointStyle: 'circle'
							}
						},
						tooltip: {
							enabled: false
						},
						datalabels: {
							anchor: 'end',
							align: 'top',
							color: '#000',
							font: {
								size: 14,
								weight: 'bold'
							},
							formatter: function(value) {
								return value;
							}
						}
					},
					scales: {
						y: {
							grid: {
								display: true,
								// color: "rgba(255, 255, 255, .2)",
								zeroLineColor: "#ffffff",
								// borderDash: [6],
								// borderDashOffset: [6],
							},
							ticks: {
								suggestedMin: 0,
								suggestedMax: 5000,
								display: true,
								// color: "#fff",
								font: {
									size: 14,
									lineHeight: 2.5,
									weight: '600',
									family: "Open Sans",
								},
							},
						},
						x: {
							grid: {
								display: false,
							},
							ticks: {
								display: false,
								// color: "#fff",
								font: {
									size: 14,
									lineHeight: 1.5,
									weight: '600',
									family: "Open Sans",
								},
							},
						},
					},
				}
			}) ;
		},
		// Right before the component is destroyed,
		// also destroy the chart.
		beforeDestroy: function () {
			this.chart.destroy() ;
		},
	})

</script>

<style lang="scss" scoped>
	
</style>