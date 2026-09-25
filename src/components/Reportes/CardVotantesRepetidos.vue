<template>
	<a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
            <div v-if="loader">
                <Loading />
            </div>
            <div class="table-responsive tabla" v-else>
                <a v-if="canDescargarExcel" :href=" url + '/imprimir-votantes-repetidos/' + $store.state.user.token_id " class="btn btn-success my-3" target="_blank"><b-icon icon="file-excel"></b-icon> Descargar excel</a>
                <button v-if="canDescargarExcelFront" class="btn btn-success my-3 ml-2" @click="descargarExcelFront">
                    <b-icon icon="file-excel"></b-icon> Descargar registros (tabla)
                </button>
				<table id="tabla-votantes-repetidos" class="table table-striped">
                    <thead>
                        <tr v-if="isAdminRole">
                            <th>Cedula</th>
                            <th>Militante</th>
                            <th>Telefono</th>
                            <th>Puesto</th>
                            <th>Mesa</th>
                            <th>Lideres</th>
                            <th>Sublideres</th>
                        </tr>
                        <tr v-else>
                            <th>Cedula</th>
                            <th>Militante</th>
                            <th>Candidato</th>
                            <th>Lider</th>
                            <th>Fecha ingreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in repetidos" :key="index">
                            <template v-if="isAdminRole">
                                <td>{{ item.id }}</td>
                                <td>{{ item.votante_nombres }} {{ item.votante_apellidos }}</td>
                                <td>{{ item.votante_telefono }}</td>
                                <td>{{ item.nombre_puesto }}</td>
                                <td>{{ item.mesa }}</td>
                                <td>{{ item.lideres }}</td>
                                <td>{{ item.sublideres }}</td>
                            </template>
                            <template v-else>
                                <td>{{ item.id }}</td>
                                <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                <td>{{ item.candidato }}</td>
                                <td>{{ item.nombre_lider }} {{ item.apellidos_lider }}</td>
                                <td>{{ formatFecha(item.fecha_ingreso) }}</td>
                            </template>
                        </tr>
                    </tbody>
                </table>
			</div>
		</template>
	</a-card>
</template>

<script>
    import axios from 'axios'
    import Loading from '../Loader/Loading.vue'
    export default {
        components: {
            Loading
        },
        computed: {
            roleId(){
                const user = this.$store.state.user || {}
                const role = user.role_id || (user.role && user.role.id) || user.role
                return Number(role)
            },
            isAdminRole(){
                return this.roleId === 1 || this.roleId === 2
            },
            canDescargarExcel(){
                return this.isAdminRole
            },
            canDescargarExcelFront(){
                return (this.roleId === 5 || this.roleId === 6) && this.repetidos.length > 0
            }
        },
        data() {
            return {
                excel: false,
                loader: true,
                repetidos: [],
                url: 'https://apidemo.convexosit.co'
            }
        },
        mounted(){
            this.getVotantes()
            console.log(this.$store.state.user)
        },
        methods: {
            formatFecha(fecha){
                return new Date(fecha).toLocaleDateString('es-co', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
            },
            getVotantes(){
 
                this.repetidos = []
                const corporacion = this.$store.state.user.candidato[0].corporacione_id
                const user = this.$store.state.user || {}
                const role = user.role_id || (user.role && user.role.id) || user.role
                const roleNumber = Number(role)
                const endpoint = (roleNumber === 1 || roleNumber === 2)
                    ? 'api/reporte-repetidos-admin'
                    : `api/reporte-votantes-repetidos/${corporacion}`

                axios.get(endpoint, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        // console.log(res.data)
                        if(res.data.status === 'success'){
                            this.repetidos = res.data.repetidos
                            this.excel = (this.repetidos.length > 0)?true:false
                        }else{
                            console.log(res.data)
                        }
                        this.loader = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            descargarExcelFront(){
                const $tabla = document.getElementById('tabla-votantes-repetidos')
                if(!$tabla){
                    return
                }

                const tableExport = new TableExport($tabla, {
                    exportButtons: false,
                    filename: `votantes_repetidos_${new Date().toISOString().slice(0,10)}`
                })
                const datos = tableExport.getExportData()
                const nombreTabla = 'tabla-votantes-repetidos'
                const preferenciasDocumento = datos[nombreTabla].xlsx
                tableExport.export2file(
                    preferenciasDocumento.data,
                    preferenciasDocumento.mimeType,
                    preferenciasDocumento.filename,
                    preferenciasDocumento.fileExtension,
                    preferenciasDocumento.merges,
                    preferenciasDocumento.RTL,
                    preferenciasDocumento.sheetname
                )
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