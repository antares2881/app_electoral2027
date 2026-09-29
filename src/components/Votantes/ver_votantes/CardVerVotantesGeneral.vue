<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>
        <div v-if="data.length > 0" class="row mt-3 resumen-general">
            <div class="col-md-5">
                <table class="table tabla-resumen">
                    <thead>
                        <tr>
                            <th>Observación</th>
                            <th>Militantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in data" :key="index" class="text-center">
                            <td>{{ item.observacion }}</td>
                            <td>{{ formatearNumero(item.votantes) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="text-center">
                            <td><strong>Total</strong></td>
                            <td><strong>{{ formatearNumero(totalVotantes) }}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="col-md-7" v-if="render">
                <chart-pie :key="claveGrafico" :height="340" :data="barChartData"></chart-pie>
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
						backgroundColor: ['#198754', '#b45309', '#2563eb', '#7c3aed'],
                        datalabels: {
                            color: '#ffffff',
                            backgroundColor: '#1e293b',
                            borderRadius: 5,
                            padding: 6,
                            font: { weight: 'bold', size: 12 },
                            formatter: value => new Intl.NumberFormat('es-CO').format(Number(value) || 0)
                        },
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const total = context.dataset.data.reduce((sum, value) => sum + Number(value), 0);
                                    const valor = Number(context.raw) || 0;
                                    const porcentaje = total ? valor / total * 100 : 0;
                                    return `${context.label}: ${new Intl.NumberFormat('es-CO').format(valor)} (${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(porcentaje)} %)`;
                                }
                            }
                        },
						borderWidth: 5,
						borderSkipped: false,
						borderRadius: 0,
						data: [],
						maxBarThickness: 20,
					}, ],
				},
                loader: true,
                render: false,
                claveGrafico: 0
            }
        },
        mounted() {
            // console.log(this.data)
            this.setChart()
        },
        watch: {
            data: {
                deep: true,
                handler() { this.setChart(); }
            }
        },
        methods: {
            formatearNumero(valor) {
                return new Intl.NumberFormat('es-CO').format(Number(valor) || 0);
            },
            setChart(){
                this.barChartData.labels = [];
                this.barChartData.datasets[0].data = [];
                this.claveGrafico += 1;
                for (let i = 0; i < this.data.length; i++) {
                    this.barChartData.labels.push(this.data[i].observacion)										
					this.barChartData.datasets[0].data.push(Number(this.data[i].votantes) || 0)		        
                }
                this.render = true
                this.loader = false
            }
        },
        computed:{
            totalVotantes(){
                return this.data.reduce((a, b) => a + (Number(b.votantes) || 0), 0)
            }
        }
    }
</script>
<style scoped>
.resumen-general { white-space: normal; align-items: start; }
.tabla-resumen { width: 100%; margin: 0 0 1.25rem; border: 1px solid #e1e8e4; border-collapse: separate; border-spacing: 0; border-radius: 12px; overflow: hidden; color: #334155; font-size: 0.95rem; }
.tabla-resumen th { background: #eef6f1; color: #166534; font-weight: 700; }
.tabla-resumen th, .tabla-resumen td { padding: 0.8rem 1rem; border: 0; border-bottom: 1px solid #e1e8e4; }
.tabla-resumen th:first-child, .tabla-resumen td:first-child { text-align: left; }
.tabla-resumen th:last-child, .tabla-resumen td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
.tabla-resumen tbody tr:nth-child(even) { background: #f8faf9; }
.tabla-resumen tbody tr:hover { background: #f0f7f3; }
.tabla-resumen tfoot { background: #e7f3ec; color: #166534; }
.tabla-resumen tfoot td { border-bottom: 0; }
</style>
