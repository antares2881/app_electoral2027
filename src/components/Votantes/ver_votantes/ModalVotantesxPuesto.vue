<template>
     <b-modal ref="votantes" size="lg" hide-footer :title="nombre_puesto">
        <div class="row">
            <div class="col-12 mt-2">
                <a-card :bordered="false" class="widget-1">
                    <h5><strong>Potencial x puesto: </strong>{{ total_votantes }}</h5>
                    <h6><strong>Numero de mesas: </strong>{{ num_mesas }}</h6>
                </a-card>                
            </div>
            <div class="col-12 table-responsive tabla">
                <table class="table table-striped p-1 mt-3">
                    <thead>
                        <tr>
                            <th>Candidato</th>
                            <th>Lider</th>
                            <th># Militantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in votantes" :key="index">
                            <td>{{  item.candidato }}</td>
                            <td>{{item.nombres}} {{item.apellidos}}</td>
                            <td>{{item.votos}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
     </b-modal>
</template>
<script>
    
    export default{
        data(){
            return{
                nombre_puesto: null,
                num_mesas: 0,
                total_votantes: 0,
                votantes: []
            }
        },
        methods:{
            verVotantes(item){

                this.total_votantes = item[0].num_hombres + item[0].num_mujeres
                this.num_mesas = item[0].mesas
                this.nombre_puesto = item[0].nombre_puesto
                this.votantes = item

                this.$refs['votantes'].show()
            },
        }
    }
</script>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 400px;
    }
</style>