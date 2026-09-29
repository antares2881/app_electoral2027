<template>
	<a-card :bordered="false" class="header-solid h-full reporte-repetidos" :bodyStyle="{padding: 0,}">
		<template #title>
            <div v-if="loader">
                <Loading />
            </div>
            <div v-else>
                <div class="cabecera-repetidos">
                    <h3>Militantes repetidos</h3>
                    <div class="acciones-repetidos">
                <a v-if="canDescargarExcel" :href=" url + '/imprimir-votantes-repetidos/' + $store.state.user.token_id " class="btn btn-success" target="_blank"><b-icon icon="file-excel"></b-icon> Descargar Excel</a>
                <button v-if="canDescargarExcelFront" class="btn btn-success" @click="descargarExcelFront">
                    <b-icon icon="file-excel"></b-icon> Descargar registros (tabla)
                </button>
				</div>
                </div>
                <div class="table-responsive tabla">
                <table id="tabla-votantes-repetidos" class="table table-striped">
                    <thead>
                        <tr v-if="isAdminRole">
                            <th>Cédula</th>
                            <th>Militante</th>
                            <th>Teléfono</th>
                            <th>Puesto</th>
                            <th>Mesa</th>
                            <th>Líderes</th>
                            <th>Sublíderes</th>
                        </tr>
                        <tr v-else>
                            <th>Cédula</th>
                            <th>Militante</th>
                            <th>Candidato</th>
                            <th>Líder</th>
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
.reporte-repetidos { white-space: normal; }
.cabecera-repetidos {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    background: #f8faf9;
    border: 1px solid #e1e8e4;
    border-radius: 12px;
}
.cabecera-repetidos h3 { margin: 0; color: #198754; font-size: 1.15rem; font-weight: 700; }
.acciones-repetidos { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.acciones-repetidos .btn-success { min-height: 44px; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; background: #198754; border: 1px solid #198754; color: #fff; }
.acciones-repetidos .btn-success:hover { background: #146c43; border-color: #146c43; }
.acciones-repetidos .btn-success:focus-visible { outline: 3px solid rgba(25,135,84,0.35); outline-offset: 2px; }
.tabla { width: 100%; max-height: 500px; overflow: auto; border: 1px solid #e1e8e4; border-radius: 12px; }
.tabla .table { margin: 0; border-collapse: separate; border-spacing: 0; font-size: 0.9rem; color: #334155; }
.tabla th, .tabla td { padding: 0.75rem 0.875rem; vertical-align: middle; border: 0; border-bottom: 1px solid #e1e8e4; }
.tabla thead th { position: sticky; top: 0; z-index: 1; background: #eef6f1; color: #166534; font-weight: 700; white-space: nowrap; }
.tabla tbody tr:nth-child(odd) { background: #fff; }
.tabla tbody tr:nth-child(even) { background: #f8faf9; }
.tabla tbody tr:hover { background: #f0f7f3; }
.tabla td { min-width: 110px; }
.tabla td:first-child { white-space: nowrap; }
@media (max-width: 767px) {
    .cabecera-repetidos { padding: 1rem; }
    .acciones-repetidos, .acciones-repetidos .btn { width: 100%; }
    .tabla th, .tabla td { padding: 0.6rem 0.75rem; }
}
</style>
