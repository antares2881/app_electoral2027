<template>
    <b-modal ref="ver-votacion-mesa" hide-footer title="Mesas informadas" no-close-on-backdrop size="xl">
        <div class="row">
            <div class="col-6" v-if="!modoPuesto">
                <label for="puesto">Puesto de votacion</label>
                <ModelSelect
                    v-model="informada.puesto"
                    :options="puestos"
                    @input="selectMesas"
                ></ModelSelect>
            </div>
            <div class="col-6" v-else>
                <label for="puesto">Puesto de votacion</label>
                <input type="text" class="form-control" :value="informada.puesto" disabled>
            </div>
            <div class="col-6">
                <label for="mesa">Mesa</label>
                <b-select :options="mesas" v-model="informada.mesa" @change="mostrarInformacionMesa"></b-select>
            </div>
            <div class="col-12 my-2">
                <button class="btn btn-primary" :disabled="loaderMesa" @click="mostrarInformacionMesa">
                    <span v-if="loaderMesa" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    {{ loaderMesa ? 'Consultando mesa...' : 'Ver datos de la mesa' }}
                </button>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12 my-2" v-if="loaderMesa">
                <p class="alert alert-info">Cargando información de la mesa seleccionada...</p>
            </div>
            <div class="col-12 my-2" v-else-if="!informada.mesa">
                <p class="alert alert-info">Seleccione una mesa para visualizar su información.</p>
            </div>
            <div class="col-12 my-2" v-else-if="consultaRealizada && votacion.length === 0">
                <p class="alert alert-warning">No hay información registrada para la mesa seleccionada.</p>
            </div>
            <div class="col-md-8 offset-md-2 my-2" v-else-if="votacion.length > 0">
                <div class=""></div>
                <div class="d-flex justify-content-between">
                    <div>
                        <h6>DEPARTAMENTO: {{votacion[0].cod_dpto}} - {{votacion[0].dpto}}</h6>
                        <h6>MUNICIPIO: {{votacion[0].cod_mcpio}} - {{votacion[0].mcpio}}</h6>
                    </div>
                    <div>
                        <h6>LUGAR: {{votacion[0].puesto}}</h6>
                        <h6>ZONA: {{votacion[0].cod_zona}}  PUESTO: {{votacion[0].cod_puesto}}  MESA: {{votacion[0].mesa}}</h6>
                    </div>
                </div>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Candidato</th>
                            <th>Votacion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in votacion" :key="index">
                            <td>{{item.nombres}} {{item.apellidos}}</td>
                            <td>{{item.total_votos}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between">
                    <div>
                        <p><strong>Numero de sufragantes: </strong>{{votacion[0].numero_sufragantes}}</p>
                        <p><strong>Numero de firmas en el E-14: </strong>{{votacion[0].numero_firmas}}</p>
                    </div>
                    <div>
                        <p><strong>Acta con tachaduras: </strong>{{votacion[0].tachaduras}}</p>
                        <p><strong>Reconteo de votos x jurado: </strong>{{votacion[0].reconteo_votos}}</p>
                    </div>
                </div>
                <p><strong>Observaciones: </strong>{{votacion[0].observaciones}}</p>
                <p v-if="votacion[0].adjunto"><strong>Adjunto: </strong><a :href="votacion[0].adjunto" target="_blank" rel="noopener noreferrer"><b-icon icon="file-earmark-pdf-fill"></b-icon> Ver PDF</a></p>
                <p class="alert alert-info"><strong>Fecha ingreso: </strong>{{votacion[0].created_at}}</p>
            </div>
        </div>
    </b-modal>
</template>
<script>

    import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common';
    import axios from 'axios';

    export default {
        components: {
            ModelSelect
        },
        data(){
            return{
                datosMesa: {},
                dpto: null,
                informada: {},
                mesas: [],
                mcpio: null,
                modoPuesto: false,
                consultaRealizada: false,
                loaderMesa: false,
                puestos: [],
                selected: false,
                votacion: []
            }
        },
        mounted(){
            
        },
        methods: {
            getHora(fecha){
                let hora = fecha.split(" ");
                return hora[1];
            },
            getPuestosInformados(){

                this.puestos = [];
                if(!this.dpto){
                    this.dpto = this.$store.state.user.candidato[0].departamento_id;
                }
                if(!this.mcpio){
                    this.mcpio = this.$store.state.user.candidato[0].municipio_id;
                }

                axios.get(`api/preconteo-puestos-informados/${this.dpto}/${this.mcpio}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    for (let i = 0; i < res.data.puestos.length; i++) {
                        this.puestos.push({
                            text: res.data.puestos[i].puesto,
                            value: res.data.puestos[i].puesto
                        })                        
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            mostrarInformacionMesa(){

                this.votacion = [];
                if(!this.informada.mesa){
                    return;
                }

                this.consultaRealizada = true;
                this.loaderMesa = true;

                axios.get(`api/preconteo-votacion-mesa/${this.informada.mesa}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    this.votacion = res.data.votacion;
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.loaderMesa = false;
                })
            },
            selectMesas(){
                this.mesas = [];
                this.informada.mesa = null;
                this.consultaRealizada = false;
                this.votacion = [];
                const payload = Object.assign({}, this.informada, {
                    dpto: this.dpto,
                    mcpio: this.mcpio,
                    cod_mcpio: this.mcpio
                });
                axios.post('api/preconteo-mostrar-mesas', payload, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    // console.log(res.data)
                    for (let i = 0; i < res.data.mesas.length; i++) {
                        this.mesas.push({
                            text: 'MESA ' + res.data.mesas[i].mesa,
                            value: res.data.mesas[i].id
                        });
                    }
                }).
                catch(err => {
                    console.log(err)
                })
            },
            viewMesasInformadas(contexto = {}){
                this.informada = {};
                this.mesas = [];
                this.puestos = [];
                this.votacion = [];
                this.loaderMesa = false;
                this.consultaRealizada = false;
                this.dpto = this.$store.state.user.candidato[0].departamento_id;
                this.mcpio = contexto.cod_mcpio || this.$store.state.user.candidato[0].municipio_id;
                this.modoPuesto = !!contexto.mostrarDetallePuestos;

                if(this.modoPuesto){
                    this.informada = {
                        puesto: contexto.puesto || null,
                        mesa: null
                    };
                    if(this.informada.puesto){
                        this.selectMesas();
                    }
                }else{
                    this.getPuestosInformados();
                }

                this.$refs['ver-votacion-mesa'].show();
            }
        }
    }
</script>