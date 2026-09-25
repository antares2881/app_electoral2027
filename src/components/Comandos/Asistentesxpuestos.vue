<template>
    <div class="row" v-if="loader">
        <div class="col-12">
            <Loading />
        </div>
    </div>
    <div class="row my-2" v-else>
        <votantesConfirmados ref="confirmados" />
        <div class="col-12 col-sm-8 table-responsive tabla">
            <div class="mb-2" v-if="historialFiltros.length > 0">
                <button class="btn btn-outline-primary btn-sm" @click="volverTablaAnterior">← Volver a la tabla anterior</button>
            </div>
            <table >
                <thead>
                    <tr>
                        <th>{{ encabezadoUbicacion }}</th>
                        <th>Esperados</th>
                        <th>Confirmados</th>
                        <th>Faltantes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in puestos" :key="index">
                        <td width="70">
                            <button v-if="mostrarDepartamento || mostrarMunicipio" class="btn btn-link p-0 text-left" @click="accionPrimeraColumna(item)">
                                {{ index+1 }} - {{ nombreUbicacion(item) }}
                            </button>
                            <span v-else>
                                {{ index+1 }} - {{ nombreUbicacion(item) }}
                            </span>
                        </td>
                        <td width="30">
                            <a v-if="esNivelPuesto" target="_blank" :href="reporteEsperados(item)">{{ Intl.NumberFormat("es-CO").format(item.esperados) }}</a>
                            <span v-else>{{ Intl.NumberFormat("es-CO").format(item.esperados) }}</span>
                        </td>
                        <td width="30">
                            <div class="progress-cell">
                                <div class="progress-bg progress-confirmados" :style="{ width: porcentajeConfirmados(item) + '%' }"></div>
                                <div class="progress-content" :class="{ 'progress-text-strong': porcentajeConfirmados(item) >= 80 }">
                                    <a v-if="esNivelPuesto" target="_blank" :href="urlReporteConfirmados(item)">{{ Intl.NumberFormat("es-CO").format(item.confirmados) }}</a>
                                    <span v-else>{{ Intl.NumberFormat("es-CO").format(item.confirmados) }}</span>
                                </div>
                            </div>
                        </td>
                        <td width="30">
                            <div class="progress-cell">
                                <div class="progress-bg" :style="{ width: porcentajeFaltantes(item) + '%', backgroundColor: colorFaltantes(item) }"></div>
                                <div class="progress-content" :class="{ 'progress-text-strong': porcentajeFaltantes(item) >= 80 }">
                                    <a v-if="esNivelPuesto" target="_blank" :href="reporteFaltantes(item)">{{ Intl.NumberFormat("es-CO").format(faltantesFila(item)) }}</a>
                                    <span v-else>{{ Intl.NumberFormat("es-CO").format(faltantesFila(item)) }}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>            
        </div>
        <div class="col-12 col-sm-4">
            <!-- <div class="card text-center mb-3 bg-light" >                
                <div class="card-body" >
                    <h5 class="card-title">ESPERADOS</h5>
                    <h4 class="text-success">{{totalEsperados()}}</h4>
                </div>
            </div> -->
            <div class="card text-center bg-light" @click="reporteConfirmados">                
                <div class="card-body">
                    <h5 class="card-title">CONFIRMADOS</h5>
                    <h4 class="text-success">{{totalConfirmados()}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import axios from 'axios';
    import Loading from '../Loader/Loading.vue';
    import votantesConfirmados from './ModalConfirmados.vue'

    export default{
        components: {
            Loading, votantesConfirmados
        },
        computed: {
            roleId(){
                return Number(this.$store.state.user.role_id);
            },
            liderId(){
                const userId = Number(this.$store.state.user.id);
                return Number.isFinite(userId) ? userId : -1;
            },
            comandoId(){
                const comandos = this.$store.state.user.comando;
                if (Array.isArray(comandos) && comandos.length > 0 && comandos[0] && comandos[0].id) {
                    return comandos[0].id;
                }
                return -1;
            },
            filtroConsultaId(){
                if(this.roleId === 0 || this.roleId === 1 || this.roleId === 2){
                    return -1;
                }
                if(this.roleId === 5){
                    return this.liderId;
                }
                return this.comandoId;
            },
            corporacioneId(){
                return this.$store.state.user.candidato[0].corporacione_id;
            },
            esNivelPuesto(){
                return this.nivelTabla === 'puesto';
            },
            mostrarDepartamento(){
                return this.nivelTabla === 'departamento';
            },
            mostrarMunicipio(){
                return this.nivelTabla === 'municipio';
            },
            nivelTabla(){
                if(this.currentDpto === -1 && this.currentMcpio === -1){
                    return 'departamento';
                }
                if(this.currentDpto !== -1 && this.currentMcpio === -1){
                    return 'municipio';
                }
                return 'puesto';
            },
            encabezadoUbicacion(){
                if(this.mostrarDepartamento){
                    return 'Departamento';
                }
                if(this.mostrarMunicipio){
                    return 'Municipio';
                }
                return 'Nombre puesto';
            }
        },
        data(){
            return{
                loader: true,
                puestos: [],
                currentDpto: null,
                currentMcpio: null,
                historialFiltros: []
            }
        },
        mounted(){
            this.inicializarFiltros();
            this.getPuestos()
            this.ejecutaAutomatico()
        },
        methods: {
            ejecutaAutomatico(){
                setInterval(this.getPuestos, 300000);
            },
            inicializarFiltros(){
                /* if(this.roleId === 5){
                    this.currentDpto = this.$store.state.user.candidato[0].departamento_id;
                    this.currentMcpio = this.$store.state.user.candidato[0].municipio_id;
                    return;
                } */

                if(this.corporacioneId === 3 || this.corporacioneId === 2){
                    this.currentDpto = -1;
                    this.currentMcpio = -1;
                }else if(this.corporacioneId === 1 || this.corporacioneId === 6 || this.corporacioneId === 7){
                    this.currentDpto = this.$store.state.user.candidato[0].departamento_id;
                    this.currentMcpio = -1;
                }else{
                    this.currentDpto = this.$store.state.user.candidato[0].departamento_id;
                    this.currentMcpio = this.$store.state.user.candidato[0].municipio_id;
                }
            },
            getPuestos(filtros = null, registrarHistorial = true){

                let dpto = null;
                let mcpio = null;
                this.loader = true;
                this.puestos = [];

                if(this.currentDpto === null || this.currentMcpio === null){
                    this.inicializarFiltros();
                }

                if(filtros){
                    const nuevoDpto = filtros.dpto !== undefined ? filtros.dpto : this.currentDpto;
                    const nuevoMcpio = filtros.mcpio !== undefined ? filtros.mcpio : this.currentMcpio;

                    if(registrarHistorial && (nuevoDpto !== this.currentDpto || nuevoMcpio !== this.currentMcpio)){
                        this.historialFiltros.push({
                            dpto: this.currentDpto,
                            mcpio: this.currentMcpio
                        });
                    }

                    this.currentDpto = nuevoDpto;
                    this.currentMcpio = nuevoMcpio;
                }

                //Valdamos la corporacion para saber si se asigan un departmento o un municipio o ninguno

                dpto = this.currentDpto;
                mcpio = this.currentMcpio;

                if(this.roleId === 5 && this.filtroConsultaId <= 0){
                    this.puestos = [];
                    this.loader = false;
                    return;
                }

                axios.get(`api/puestos_divipoles/${dpto}/${mcpio}/${this.filtroConsultaId}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data.puestos)
                    this.puestos = res.data.puestos
                    this.loader = false
                })
                .catch(err => {
                    console.log(err)
                    this.loader = false
                })
            },
            nombreUbicacion(item){
                if(this.mostrarDepartamento){
                    return item.departamento || item.nombre_departamento || item.desc_dpto || item.dpto || item.cod_dpto || 'Departamento';
                }
                if(this.mostrarMunicipio){
                    return item.municipio || item.nombre_municipio || item.desc_mcpio || item.mcpio || item.cod_mcpio || 'Municipio';
                }
                return item.nombre_puesto || item.puesto || 'Puesto';
            },
            obtenerDptoItem(item){
                return item.departamento_id || item.dpto_id || item.cod_dpto || item.departamento || null;
            },
            obtenerMcpioItem(item){
                return item.municipio_id || item.mcpio_id || item.cod_mcpio || item.mcpio || null;
            },
            accionPrimeraColumna(item){
                if(this.mostrarDepartamento){
                    const dpto = this.obtenerDptoItem(item);
                    if(dpto !== null){
                        this.getPuestos({ dpto, mcpio: -1 });
                    }
                    return;
                }

                if(this.mostrarMunicipio){
                    const dpto = this.obtenerDptoItem(item) || this.currentDpto;
                    const mcpio = this.obtenerMcpioItem(item);

                    if(mcpio !== null){
                        this.getPuestos({ dpto, mcpio });
                    }
                }
            },
            volverTablaAnterior(){
                if(this.historialFiltros.length === 0){
                    return;
                }

                const ultimoFiltro = this.historialFiltros.pop();
                this.getPuestos({ dpto: ultimoFiltro.dpto, mcpio: ultimoFiltro.mcpio }, false);
            },
            reporteEsperados(item){
                let url = 'https://apiparlamentarias.convexosit.co/reporte-esperados/' + this.currentDpto + '/' + this.currentMcpio + '/' + item.zona + '/' + item.puesto + '/' + item.nombre_puesto + '/' + this.roleId;
                if(this.roleId === 5){
                    url += '/' + this.$store.state.user.id;
                }
                return url;
            },
            urlReporteConfirmados(item){
                let url = 'https://apiparlamentarias.convexosit.co/reporte-confirmados/' + this.currentDpto + '/' + this.currentMcpio + '/' + item.zona + '/' + item.puesto + '/' + item.nombre_puesto + '/' + this.roleId;
                if(this.roleId === 5){
                    url += '/' + this.$store.state.user.id;
                }
                return url;
            },
            reporteFaltantes(item){
                let url = 'https://apiparlamentarias.convexosit.co/reporte-faltantes/' + this.currentDpto + '/' + this.currentMcpio + '/' + item.zona + '/' + item.puesto + '/' + item.nombre_puesto + '/' + this.roleId;
                if(this.roleId === 5){
                    url += '/' + this.$store.state.user.id;
                }
                return url;
            },
            faltantesFila(item){
                const faltantes = (item.esperados || 0) - (item.confirmados || 0);
                return faltantes > 0 ? faltantes : 0;
            },
            porcentajeConfirmados(item){
                const esperados = Number(item.esperados) || 0;
                if(esperados <= 0){
                    return 0;
                }
                const confirmados = Number(item.confirmados) || 0;
                const porcentaje = (confirmados / esperados) * 100;
                return Math.max(0, Math.min(100, porcentaje));
            },
            porcentajeFaltantes(item){
                const esperados = Number(item.esperados) || 0;
                if(esperados <= 0){
                    return 0;
                }
                const faltantes = this.faltantesFila(item);
                const porcentaje = (faltantes / esperados) * 100;
                return Math.max(0, Math.min(100, porcentaje));
            },
            colorFaltantes(item){
                return this.porcentajeFaltantes(item) < 50 ? '#c8f0d2' : '#f7c9c9';
            },
            reporteConfirmados(){
                this.$refs.confirmados.votantesConfirmados()
            },
            totalEsperados(){
                let total = 0
                for (let i = 0; i < this.puestos.length; i++) {
                    total += this.puestos[i].esperados                    
                }
                return Intl.NumberFormat("es-CO").format(total); 
            },
            totalConfirmados(){
                let total = 0
                for (let i = 0; i < this.puestos.length; i++) {
                    total += this.puestos[i].confirmados                    
                }
                return Intl.NumberFormat("es-CO").format(total); 
            }
        }
    }
</script>
<style scoped>
    .card{
        cursor: pointer;
    }
    .tabla{
        display: block;
        overflow-x: auto;
        padding: 10px;
        white-space: nowrap;
        height: 500px;
    }
    table {
        border: 1px solid #000;
        width: 100%;
    }
    th, td {
        /* width: 25%; */
        text-align: left;
        vertical-align: top;
        border: 1px solid #000;
        border-collapse: collapse;
        /* padding: 0.3em; */
        caption-side: bottom;
    }
    caption {
        /* padding: 0.3em; */
        color: #fff;
        background: #000;
    }
    th {
        background: #eee;
    }
    .progress-cell{
        position: relative;
        min-height: 28px;
    }
    .progress-bg{
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        border-radius: 4px;
        transition: width 0.3s ease;
        z-index: 1;
    }
    .progress-confirmados{
        background-color: #cfe9d4;
    }
    .progress-content{
        position: relative;
        z-index: 2;
        padding: 3px 6px;
        display: inline-block;
        width: 100%;
    }
    .progress-text-strong{
        font-weight: 700;
    }
</style>
