<template>
    <b-modal ref="estadistica" hide-footer no-close-on-backdrop :title="titulo" size="lg">
        <table class="table table-bordered">
            <caption>
                {{ data.nombre }}
            </caption>
            <thead>
                <tr>
                    <th>Meta</th>
                    <th>#Militantes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ data.meta }}</td>
                    <td>{{ data.militantes }}</td>
                </tr>
            </tbody>
        </table>
        <chart-pie :height="300" :data="barChartData"></chart-pie>
    </b-modal>
</template>
<script>
    import ChartPie from '../Charts/ChartPie.vue';
    export default {
        components:{
            ChartPie
        },
        data(){
            return{
                barChartData: {                
                    datasets: [
                        {
                            label: "",
                            backgroundColor: ['green', 'red'],
                            borderWidth: 5,
                            borderSkipped: false,
                            borderRadius: 0,
                            data: [],
                            maxBarThickness: 20,
                        }, 
                    ],
                    labels: ["Militantes", 'meta'],
                },
                data: {},
                titulo: ''
            }
        },
        methods: {
            setChart(meta, militantes, tipo, nombre){
                this.data = {
                    meta,
                    militantes,
                    nombre
                }
                this.titulo = (tipo === 1) ? 'Militantes x lider' : 'Militantes x sublider';
                this.barChartData.datasets[0].data[0] = militantes	
                this.barChartData.datasets[0].data[1] = meta
                this.$refs['estadistica'].show();
            },
        }
    }
</script>
