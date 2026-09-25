<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
        <template #title>
            <div class="row" v-if="showBuscar">
                <div class="col-12 col-sm-6">
                    <label for="tipo_reporte">Seleccione un tipo de reporte</label>
                    <select id="tipo_reporte" class="form-control" v-model="reporte.tipo" @change="tipoReporte">
                        <option v-for="(item, index) in reportes" :key="index" :value="item.id">{{ item.reporte }}</option>
                    </select>
                </div>
                <div class="col-6 col-sm-3" v-if="showFecha">
                    <label for="fecha_inicio">Fecha inicial</label>
                    <input type="date" class="form-control" id="fecha_inicio" v-model="reporte.fecha_inicial">
                </div>
                <div class="col-6 col-sm-3" v-if="showFecha">
                    <label for="fecha_final">Fecha final</label>
                    <input type="date" class="form-control" id="fecha_final" v-model="reporte.fecha_final">
                </div>
                <div class="col-12 col-sm-6 my-3" v-if="showFiltro">
                    <label for="filtro">Filtrar por</label>
                    <select id="filtro" class="form-control" v-model="reporte.filtro">
                        <option value="1">Usuario</option>
                        <option value="2">Recolector</option>
                    </select>
                </div>
                <div class="col-12 col-sm-6 my-3" v-if="reporte.filtro == 2">
                    <label for="recolector">Recolector</label>
                    <model-select
                        :options="recolectores"
                        v-model="reporte.recolectore_id"
                    ></model-select>
                </div>
                <div class="col-12 mt-3">
                    <a class="btn btn-success my-3" :href="'https://demo.convexosit.co/imprimir-excel/' + $store.state.user.token_id + '/' + reporte.fecha_inicial + '/' + reporte.fecha_final " target="_blank" v-if="reporte.tipo === 1">Descargar excel</a>
                    <!-- https://apisomoscapaces.convexosit.co -->
                    <button class="btn btn-primary" @click="buscar" v-else>Generar</button>
                </div>
            </div>
            <!-- <CardRegistrosExcel ref="registrosExcel" v-if="reporte.tipo === 1" /> -->
            <CardRegistrosxUsuario ref="registrosUsuarios" v-if="reporte.tipo === 2" />
            <CardRegistrosRepetidos ref="registrosRepetidos" v-if="reporte.tipo === 3" />
            <CardRegistrosNoRegion ref="registrosNoRegion" v-if="reporte.tipo === 4" />
            <CardRegistrosxRecolector ref="registrosRecolector" v-if="reporte.tipo === 5" />
            <CardRegistrosValidos ref="registrosValidos" v-if="reporte.tipo === 6" />
            <CardRegistrosNoValidos ref="registrosNoValidos" v-if="reporte.tipo === 7" />
        </template>
    </a-card>
</template>
<script>
    
    // import moment from 'moment'
    import axios from 'axios'
    import { ModelSelect } from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    import CardRegistrosExcel from './reportes/CardRegistrosExcel.vue'
    import CardRegistrosxUsuario from './reportes/CardRegistrosxUsuario.vue'
    import CardRegistrosRepetidos from './reportes/CardRegistrosRepetidos.vue'
    import CardRegistrosNoRegion from './reportes/CardRegistrosNoRegion.vue'
    import CardRegistrosxRecolector from './reportes/CardRegistrosxRecolector.vue'
    import CardRegistrosValidos from './reportes/CardRegistrosValidos.vue'
    import CardRegistrosNoValidos from './reportes/CardRegistrosNoValidos.vue'

    export default {
        components:{
            ModelSelect,
            CardRegistrosExcel,
            CardRegistrosxUsuario,
            CardRegistrosRepetidos,
            CardRegistrosNoRegion,
            CardRegistrosxRecolector,
            CardRegistrosValidos,
            CardRegistrosNoValidos
        },
        data() {
            
            return {
                dateFormat: 'YYYY/MM/DD',
                recolectores: [],
                reporte: {fecha_inicial: 0, fecha_final: 0, recolectore_id: 0, filtro: 0},
                reportes: [
                    {id: 1, reporte: 'Excel general de registros'},
                    {id: 6, reporte: 'Registros validos'},
                    {id: 7, reporte: 'Registros no validos'},
                    {id: 4, reporte: 'Registros de otra región'},
                    {id: 3, reporte: 'Registros duplicados'},
                    {id: 2, reporte: 'Total Registros ingresados x usuario'},
                    {id: 5, reporte: 'Total Registros reportados x recolector'},
                ],
                showBuscar: true,
                showFecha: false,
                showFiltro: false,
                tiporeporte: 0
            }
        },
        methods: {
            buscar(){
                const datos = {
                    fecha1: (this.reporte.tipo != 1)?this.reporte.fecha_inicial:null,
                    fecha2: (this.reporte.tipo != 1)?this.reporte.fecha_final:null,
                    tipo: this.reporte.tipo,
                    candidato: this.$store.state.user.candidato_id,
                    role: this.$store.state.user.role_id,
                    filtro: this.reporte.filtro,
                    recolectore_id: this.reporte.recolectore_id
                }
                // console.log(datos)
                if(this.reporte.tipo === 1){
                    this.$refs.registrosExcel.getRegistrosGeneral(datos)
                }else if(this.reporte.tipo === 2){
                    this.$refs.registrosUsuarios.getRegistrosxUsuarios(datos)
                }else if(this.reporte.tipo === 3){
                    this.$refs.registrosRepetidos.getRegistrosRepetidos(datos)
                }else if(this.reporte.tipo === 4){
                    this.$refs.registrosNoRegion.getRegistrosNoRegion(datos)
                }else if(this.reporte.tipo === 5){
                    this.$refs.registrosRecolector.getRegistrosxRecolector(datos)
                }else if(this.reporte.tipo === 6){
                    this.$refs.registrosValidos.getRegistrosValidos(datos)
                }else if(this.reporte.tipo === 7){
                    this.$refs.registrosNoValidos.getRegistrosNoValidos(datos)
                }
            },
            getRecolectores(){
                this.recolectores = []
                axios.get(`/api/recolectores/${this.$store.state.user.candidato_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    for (let i = 0; i < res.data.recolectores.length; i++) {
                        this.recolectores.push({
                            text: res.data.recolectores[i].nombres +' '+res.data.recolectores[i].apellidos,
                            value: res.data.recolectores[i].id
                        })                                      
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            tipoReporte(){         
                    
                if(this.reporte.tipo === 4){
                    this.showFecha = false
                }else{
                    this.showFecha = true
                }

                if(this.reporte.tipo === 6 || this.reporte.tipo === 7){
                    this.getRecolectores()
                    this.showFiltro = true
                }else{
                    this.reporte.filtro = 0   
                    this.showFiltro = false
                }
            },
        },
    }
</script>