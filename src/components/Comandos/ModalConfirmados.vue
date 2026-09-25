<template>
    <b-modal ref="votantes-confirmados" hide-footer title="CONFIRMADOS" size="xl">
      <div class="row">
        <div class="col-6">
            <label for="opcion">Filtrar por</label>
            <b-select :options="opciones" id="opcion" v-model="filtro.opcion" @change="filtro.parametro = null"></b-select>
        </div>
        <div class="col-6">
            <label for="parametro">Parametro</label>
            <input type="text" class="form-control" id="parametro" v-model="filtro.parametro">
        </div>
        <div class="col-12 my-2">
            <button class="btn btn-primary mr-2" @click="getConfirmados">Buscar</button>
            <a target="_blank" :href="excelGeneralUrl" class="btn btn-success" v-if="$store.state.user.role_id <=2">Excel general</a>
        </div>
        <div class="col-12 table-responsive tabla" v-if="votantes.length > 0">
            <table class="table">
                <thead>
                    <tr>
                        <th>Lider</th>
                        <th>Cedula</th>
                        <th>Votante</th>
                        <th>Puesto</th>
                        <th>Mesa</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in votantes" :key="index">
                        <td>{{item.lider}}</td>
                        <td>{{item.cedula}}</td>
                        <td>{{item.nombres}}</td>
                        <td>{{item.nombre_puesto}}</td>
                        <td>{{item.mesa}}</td>
                        <td>{{item.created_at}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-12" v-else>
            <p class="alert alert-info">No hay datos para mostrar</p>
        </div>
      </div>
    </b-modal>
</template>
<script>

    
    import axios from "axios";    

    export default{
        components:{
            
        },
        computed: {
            excelGeneralUrl(){
                const baseUrl = (axios.defaults.baseURL || '').replace(/\/?$/, '/');
                return `${baseUrl}total-confirmados`;
            }
        },
        data(){
            return{
                filtro: {opcion: 0, parametro: null},
                opciones: [
                    {text: 'Nombres', value: 1},
                    {text: 'Cedula', value: 2}
                ],
                votantes: []
            }
        },
        mounted(){
        },
        methods:{
            getConfirmados(){

                if(this.filtro.parametro === null && this.parametro === undefined || this.parametro === ""){
                    Swal.fire({
                        icon: 'warning',
                        text: 'No hay parametros para la consulta.'
                    })
                    return;
                }

                axios.post('api/votantes-confirmados', this.filtro, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log()
                    this.votantes = res.data.confirmados
                })
                .catch(err => {
                    console.log(err)
                })
            },
            votantesConfirmados(){
                this.filtro.opcion = 0
                this.filtro.parametro = null
                this.votantes = []
                this.$refs['votantes-confirmados'].show()                
                
            }
        }
    }
</script>
<style scoped>
</style>
