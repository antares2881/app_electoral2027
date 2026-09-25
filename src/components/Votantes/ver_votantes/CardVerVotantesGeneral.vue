<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>
        <div v-if="data.length > 0" class="row mt-3">
            <div class="col-md-5">
                <table class="table table-bordered p-1 mt-3">
                    <thead>
                        <tr>
                            <th>Observacion</th>
                            <th>#Militantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data" :key="index" class="text-center">
                            <td>{{ item.observacion }}</td>
                            <td>{{ item.votantes }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="text-center">
                            <td><strong>Total</strong></td>
                            <td><strong>{{ totalVotantes }}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="col-md-7" v-if="render">
                <chart-pie :height="300" :data="barChartData"></chart-pie>
            </div>
        </div>
        <div v-else class="my-2">
            <p class="alert alert-info">La consulta no arrojo datos</p>
        </div>
    </div>
</template>
<script>
    import ChartPie from '../../Charts/ChartPie.vue' ;
    import Loading from "../../Loader/Loading.vue";
    export default {
        components:{
            ChartPie,
            Loading
        },
        props: ['data'],
        data() {
            return {
                barChartData: {
					labels: [],
					datasets: [{
						label: "",
						backgroundColor: ['red', 'green', 'rgb(255, 205, 86)'],
						borderWidth: 5,
						borderSkipped: false,
						borderRadius: 0,
						data: [],
						maxBarThickness: 20,
					}, ],
				},
                loader: true,
                render: false
            }
        },
        mounted() {
            // console.log(this.data)
            this.setChart()
        },
        methods: {
            setChart(){
                for (let i = 0; i < this.data.length; i++) {
                    this.barChartData.labels.push(this.data[i].observacion)										
					this.barChartData.datasets[0].data.push(this.data[i].votantes)		        
                }
                this.render = true
                this.loader = false
            }
        },
        computed:{
            totalVotantes(){
                return this.data.reduce((a, b) => a + b.votantes, 0)
            }
        }
    }
</script>