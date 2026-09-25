<template>
    <div>
        <b-modal ref="ver-mesas-faltantes" hide-footer :title="tituloMesasFaltantes" no-close-on-backdrop size="xl">
            <div v-if="loader">
                <Loading />
            </div>
            <div class="table-responsive tabla" v-else>
                <div class="mb-2" v-if="!vistaMunicipios">
                    <button class="btn btn-outline-primary" @click="volverMunicipios">← Volver al listado de municipios</button>
                </div>
                <table class="table table-hover">
                    <thead>
                        <tr v-if="vistaMunicipios">
                            <th>Código Municipio</th>
                            <th>Municipio</th>
                            <th># Mesas Faltantes</th>
                        </tr>
                        <tr v-else>
                            <th>Zona</th>
                            <th>Puesto</th>
                            <th># Mesas Faltantes</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="vistaMunicipios">
                            <tr
                                v-for="(item, index) in municipiosFaltantes"
                                :key="`m-${index}`"
                                style="cursor: pointer"
                                @click="mesasFaltantesMunicipio(item.municipio_id || item.mcpio_id || item.cod_mcpio || item.cod_municipio || item.mcpio, item.mcpio || item.municipio || item.nombre_municipio)"
                            >
                                <td>{{ item.cod_mcpio || item.cod_municipio || item.municipio_id || item.mcpio_id || item.mcpio }}</td>
                                <td>{{ item.mcpio || item.municipio || item.nombre_municipio }}</td>
                                <td>
                                    <button class="btn btn-primary" @click.stop="mesasFaltantesMunicipio(item.municipio_id || item.mcpio_id || item.cod_mcpio || item.cod_municipio || item.mcpio, item.mcpio || item.municipio || item.nombre_municipio)">{{ item.faltantes }}</button>
                                </td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr v-for="(item, index) in faltantes" :key="`d-${index}`">
                                <td>{{item.cod_zona}}</td>
                                <td>{{item.cod_puesto}} - {{item.puesto}}</td>
                                <td>{{item.faltantes}}</td>
                                <td>
                                    <button class="btn btn-primary" @click="verMesas(item)">Ver mesas</button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="mt-2" v-if="!vistaMunicipios">
                    <button class="btn btn-secondary" @click="volverMunicipios">Regresar municipios</button>
                </div>
            </div>
        </b-modal>
        <b-modal ref="mesas" hide-footer :title="title" no-close-on-backdrop size="xl">
            <div class="row">
                <div class="col-2" v-for="(item, index) in mesas" :key="index">
                    <b-badge variant="dark">MESA {{item.mesa}}</b-badge>
                </div>
                <div class="col-12 my-3">
                    <button class="btn btn-primary" @click="regresar">Regresar</button>
                </div>
            </div>

        </b-modal>
    </div>
    
</template>
<script>

    import axios from 'axios';
    import Loading from '../Loader/Loading.vue';

    export default {
        components: {
            Loading
        },
        data(){
            return{
                dpto: null,
                municipiosFaltantes: [],
                faltantes: [],
                loader: true,
                mesas: [],
                title: null,
                vistaMunicipios: true,
                tituloMesasFaltantes: 'Mesas faltantes'
            }
        },
        methods:{
            mesasFaltantes(){
                this.loader = true;
                this.vistaMunicipios = true;
                this.tituloMesasFaltantes = 'Mesas faltantes';
                this.municipiosFaltantes = [];
                this.faltantes = [];
                this.dpto = this.$store.state.user.candidato[0].departamento_id;

                axios.get(`api/preconteo-mesas-faltantes/${this.dpto}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    this.municipiosFaltantes = res.data.mesas_faltantes;
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            mesasFaltantesMunicipio(mcpio, nombreMunicipio = null){
                this.loader = true;
                this.faltantes = [];
                this.tituloMesasFaltantes = nombreMunicipio ? `Mesas faltantes - ${nombreMunicipio}` : 'Mesas faltantes';

                axios.get(`api/preconteo-mesas-faltantes/${this.dpto}/${mcpio}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    this.faltantes = res.data.mesas_faltantes;
                    this.vistaMunicipios = false;
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            modalMesasFaltantes(){
                this.mesasFaltantes();
                this.$refs['ver-mesas-faltantes'].show();
            },
            volverMunicipios(){
                this.vistaMunicipios = true;
                this.faltantes = [];
                this.tituloMesasFaltantes = 'Mesas faltantes';
            },
            regresar(){
                this.$refs['mesas'].hide();
                this.$refs['ver-mesas-faltantes'].show();

            },
            verMesas(item){

                this.mesas = [];
                this.title = 'ZZ'+item.cod_zona+' PP'+item.cod_puesto+' '+item.puesto;

                axios.post('api/preconteo-mesas-faltantes', item, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    this.$refs['ver-mesas-faltantes'].hide();
                    this.mesas = res.data.mesas;
                    this.$refs['mesas'].show();
                })
                .catch(err => {
                    console.log(err => {
                        console.log(err)
                    })
                })
            }
        }
    }
</script>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        padding: 10px;
        white-space: nowrap;
        height: 500px;
    }
</style>