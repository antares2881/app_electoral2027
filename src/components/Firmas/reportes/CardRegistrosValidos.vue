<template>   
    <div>
        <div class="row justify-content-center mt-3" v-if="spin">
            <div class="col-4">
                <a-spin size="large"/>
            </div>
        </div>
        <div v-else>
            <div class="table-responsive mt-3 tabla" v-if="!mensaje">
                
                <table class="table" id="tabla">
                    <thead>
                        <tr>
                            <th>{{filtro}}</th>
                            <th>Registros validos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in datos" :key="index">
                            <td v-if="tipoFiltro == 0">{{item.observacion}}</td>
                            <td v-else>{{(tipoFiltro == 1)?item.username:item.nombres+' '+item.apellidos}}</td>
                            <td>{{item.total}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <th>Total</th>
                        <th>{{totalRegistros}}</th>
                    </tfoot>
                </table>
            </div>
            <div class="mt-3" v-else>
                <p class="alert alert-info">No hay registros para mostrar</p>
            </div>
        </div>        
    </div>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                datos: [],
                descargar: false,
                filtro: 'Filtro',
                mensaje: false,
                spin: false,
                tipo: null,
                tipoFiltro: null
            }
        },
        methods: {
            getRegistrosValidos(data){

                this.spin = true
                this.mensaje = false
                this.tipo = data.tipo
                this.tipoFiltro = data.filtro

                if(data.filtro == 0){
                    this.filtro = 'Observación'
                }else if(data.filtro == 1){
                    this.filtro = 'Usuario'
                }else{
                    this.filtro = 'Recolector'
                }

                axios.post(`/api/reporte-firmas-validas`, data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.status === 'success'){
                        if(res.data.registros.length > 0){
                            this.datos = res.data.registros
                        }else{
                            this.mensaje = true
                        }
                    }
                    this.spin = false
                })
                .catch(err => {
                    this.spin = false
                    console.log(err)
                })

            },
        },        
        computed:{
            totalRegistros(){ //suma todos los votos en el array estadisticas.
                return this.datos.reduce((a, b) => a + b.total, 0)
            }
        }
    }
</script>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>