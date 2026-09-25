<template>
    <b-modal ref="grafico" hide-footer :title="titulo" size="lg">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Meta</th>
                        <th>Militantes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in metas" :key="index">
                        <td>{{ item.nombres }}</td>
                        <td>{{ new Intl.NumberFormat().format(item.meta_votacion) }}</td>
                        <td>{{ new Intl.NumberFormat().format(item.votantes) }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="text-center"><strong>Total</strong></td>
                        <td>{{votantes}}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <chart-pie :height="300" :data="barChartData"></chart-pie>
    </b-modal>
</template>
<script>

import ChartPie from "../Charts/ChartPie.vue";
import axios from "axios";

export default {
    components: {
        ChartPie
    },
    data() {
        return{
            barChartData: {                
                datasets: [
                    {
                        label: "",
                        backgroundColor: ['red', 'green'],
                        borderWidth: 5,
                        borderSkipped: false,
                        borderRadius: 0,
                        data: [],
                        maxBarThickness: 20,
                    }, 
                ],
                labels: ["Votantes", 'meta'],
            },
            metas: [],
            render: false,
            titulo: '',
            votantes: 0
        }
    },
    methods: {
        getVotantesxCadidatos(item){
            console.log(item)
            axios.get(`api/votantesxcandidato/${item.corporacione_id}/${item.id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    // console.log(res.data)
                    if(res.data.status === 'success'){
                        this.metas = res.data.votantes
                        this.setChart(item, this.sumaVotantes(res.data.votantes))
                    }else{
                        console.log(res.data)
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        },
        setChart(item, votantes){
            this.titulo = item.nombres
            this.barChartData.datasets[0].data[0] = votantes	
            this.barChartData.datasets[0].data[1] = item.meta_votacion
        
            this.$refs['grafico'].show()
        },
        sumaVotantes(datos){
            
            this.votantes = 0
            for (let i = 0; i < datos.length; i++) {
                this.votantes += datos[i].votantes          
            }
            return this.votantes
        }
    }
}
</script>