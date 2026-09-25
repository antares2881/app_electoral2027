<template>   
    <div>
        <div class="row justify-content-center mt-3" v-if="spin">
            <div class="col-4">
                <a-spin size="large"/>
            </div>
        </div>
        <div v-else>
            <div class="table-responsive mt-3 tabla" v-if="!mensaje">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Recolector</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in datos" :key="index">
                            <td>{{ item.nombres }} {{ item.apellidos }}</td>
                            <td>{{ item.total }}</td>
                        </tr>
                    </tbody>
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
                mensaje: false,
                spin: false,
                tipo: null
            }
        },
        methods: {
            getRegistrosxRecolector(data){

                this.mensaje = false
                this.tipo = data.tipo
                this.spin = true

                axios.post('/api/reporte-firmas-recolectores', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    console.log(res.data)
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

            }
        },
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