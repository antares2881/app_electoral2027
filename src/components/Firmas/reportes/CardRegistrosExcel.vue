<template>   
    <div>
        <div class="row justify-content-center mt-3" v-if="spin">
            <div class="col-4">
                <a-spin size="large"/>
            </div>
        </div>
        <div v-else>
            <div class="table-responsive mt-3 tabla" v-if="!mensaje">
                <a class="btn btn-success my-3" :href="'https://api.convexosit.co/imprimir-excel/' + $store.state.user.token_id" target="_blank" v-if="descargar">Descargar excel</a>
                <table class="table" id="tabla">
                    <thead>
                        <tr>
                            <th>Cedula</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Municipio</th>
                            <th>Puesto</th>
                            <th>Mesa</th>
                            <th>Fecha</th>
                            <th>usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in datos" :key="index">
                            <td>{{item.cedula}}</td>
                            <td>{{item.nombres}}</td>
                            <td>{{item.apellidos}}</td>
                            <td>{{item.municipio}}</td>
                            <td>{{item.puesto}}</td>
                            <td>{{item.mesa}}</td>
                            <td>{{item.fecha_firma}}</td>
                            <td>{{item.username}}</td>
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
                descargar: false,
                mensaje: false,
                spin: false,
                tipo: null
            }
        },
        methods: {
            getRegistrosGeneral(data){
                this.descargar = false
                this.spin = true
                this.mensaje = false
                this.tipo = data.tipo

                axios.get(`/api/reporte-firmas-general/${data.candidato}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.status === 'success'){
                        if(res.data.registros.length > 0){
                            this.datos = res.data.registros
                            this.descargar = true
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
            
            descargarExcel(){
                
                const $tabla = document.querySelector("#tabla");
                let tableExport = new TableExport($tabla, {
                    exportButtons: false, // No queremos botones
                    filename: "reporte_votantes", //Nombre del archivo de Excel
                    sheetname: "Reporte", //Título de la hoja
                });
                let datos = tableExport.getExportData();
                let preferenciasDocumento = datos.tabla.csv;
                tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
                
            },
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