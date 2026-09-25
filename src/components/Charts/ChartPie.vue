<template>
	<div>
		<canvas ref="chart" :style="{'height': height + 'px'}"></canvas>
	</div>
</template>

<script>
	import { Chart, registerables } from 'chart.js';
	Chart.register(...registerables);

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
				type: "doughnut",
				data: this.data,
     			options: {
					layout: {
						padding: {
							top: 20,
							right: 10,
							left: 10,
							bottom: 10,
						},
					},
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: true,
							position: 'bottom',
							align: 'center',
							labels: {
								boxWidth: 12,
								boxHeight: 12,
								padding: 10,
								font: {
									size: 11,
									weight: '500'
								},
								usePointStyle: true,
								pointStyle: 'circle',
								textAlign: 'left',
								generateLabels: function(chart) {
									const data = chart.data;
									if (data.labels.length && data.datasets.length) {
										return data.labels.map((label, i) => {
											const value = data.datasets[0].data[i];
											// Acortar nombres largos
											const shortLabel = label.length > 20 ? label.substring(0, 17) + '...' : label;
											return {
												text: shortLabel,
												fillStyle: data.datasets[0].backgroundColor[i],
												hidden: false,
												index: i
											};
										});
									}
									return [];
								}
							},
							maxWidth: 350,
							maxHeight: 100,
						},
					},
					tooltips: {
						enabled: true,
						mode: "index",
						intersect: false,
					}
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
	div {
		position: relative;
		width: 100%;
		height: 100%;
	}

	canvas {
		max-width: 100%;
		max-height: 100%;
	}
</style>