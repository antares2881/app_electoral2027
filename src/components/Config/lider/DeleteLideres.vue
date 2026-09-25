<template>
    <b-modal ref="lideres" size="lg" hide-footer title="Eliminar lider">
        <div class="row">
            <div class="col-6 col-sm-12">
                <label for="cedula">No. de documento</label>
                <input type="number" id="cedula" class="form-control" v-model.number="lider.lidere_id">
            </div>
            <div class="col-12 my-3">
                <button class="btn btn-primary mr-2" @click="buscarLiderVotantes">Buscar</button>
                <button class="btn btn-success" @click="descargarExcel" v-if="votantes.length > 0">Descargar votantes</button>
            </div>
            <div class="col-12 my-2" v-if="msn">
                <p class="alert alert-danger">El lider no existe, verifica.</p>
            </div>
        </div>
        <div v-if="loader">
            <Loading />
        </div>
        <div class="table-responsive" v-if="votantes.length > 0 && !loader" >
            <table class="table table-hover tabla" id="votantes">
                <thead>
                    <tr>
                        <th>Camapaña</th>
                        <th>Coordinador</th>
                        <th>Lider</th>
                        <th>Votante asociado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in votantes" :key="index">
                        <td>{{ item.nombres }}</td>
                        <td>{{ item.nom_coor }} {{ item.ape_coor }}</td>
                        <td>{{ item.nom_lid }} {{ item.ape_lid }}</td>
                        <td>{{ item.nom_vot }} {{ item.ape_vot }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="row" v-if="votantes.length > 0">
            <div class="col-12">
                <button class="btn btn-danger" @click="deleteLider">Eliminar lider</button>
            </div>
        </div>
    </b-modal>
</template>
<script>

    import axios from 'axios';
    import Loading from '../../Loader/Loading.vue';

    export default {
        components: {
            Loading
        },
        data(){
            return{
                lider: {lidere_id: null},
                loader: false,
                msn: false,
                votantes: []
            }
        },
        methods: {
            buscarLiderVotantes(){

                this.loader = true;
                this.votantes = []
                this.msn = false;

                if(this.lider.lidere_id === null || this.lider.lidere_id === undefined){
                    Swal.fire({
                        icon: "warning",
                        text: "El campo cedula es requerido"
                    })
                    return;
                }
                axios.get(`api/lideresVotantes/${this.lider.lidere_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    if(res.data.lider_votantes.length > 0){
                        this.votantes = res.data.lider_votantes;
                    }else{
                        this.msn = true;
                    }
                    this.loader = false;
                })
                .catch(err => {
                    console.log(err)
                })
            },
            deleteLider(){
                this.loader = true;
                axios.delete(`api/lideresVotantes/${this.lider.lidere_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    if(res.data.status === 'success'){

                        //Elimina el registro del array global lideres
                        const index = this.$store.state.lideres.findIndex((e) => e.id === this.lider.lidere_id);
                        this.$store.state.lideres.splice(index, 1);

                        this.$refs['lideres'].hide();
                        Swal.fire({
                            icon: 'success',
                            text: 'Se eliminaron los registros correctamente'
                        });
                    }
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            descargarExcel(){
                const $tabla = document.querySelector("#votantes");
                let tableExport = new TableExport($tabla, {
                    exportButtons: false, // No queremos botones
                    filename: "votantes" + Date.now(), //Nombre del archivo de Excel
                    sheetname: "votantes", //Título de la hoja
                });
                let datos = tableExport.getExportData();
                let preferenciasDocumento = datos.votantes.xlsx;
                tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
            },
            showLider(){
                this.lider = {lidere_id: null};
                this.votantes = [];
                this.$refs['lideres'].show();
            }
        }
    }
</script>
<style scoped>
    
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 300px;
    }
</style>