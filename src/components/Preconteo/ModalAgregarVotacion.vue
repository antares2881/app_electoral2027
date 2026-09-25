<template>
    <b-modal id="agregar-votacion-modal" ref="agregar-votacion" hide-footer :title="title" no-close-on-backdrop size="xl" @hidden="onModalHidden">
        <div class="row">
            <div class="col-4 col-sm-1" v-for="(item, index) in mesas" :key="index">
                <button
                    class="btn btn-secondary my-2"
                    :class="{
                        'btn-success': getMesaPreconteoList(item).length > 0,
                        'mesa-seleccionada': selected && mesaSeleccionadaIndex === index
                    }"
                    @click="selectMesa(item, index)"
                >
                    Mesa {{item.mesa}}
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-12 my-2" v-if="!selected">
                <p class="alert alert-info">No ha seleccionado ninguna mesa</p>
            </div>
            <div class="col-12 my-2" v-else>
                <h4 class="text-danger">MESA {{datosMesa.mesa}} SELECCIONADA</h4>
            </div>
            <div class="col-12 my-2">
                <h5>Informacion de los candidatos</h5>
            </div>
            <div class="col-6">
                <ModelSelect
                    placeholder="Candidato"
                    id="candidato"
                    v-model="candidato.preconteocandidato_id"
                    :options="candidatos"
                ></ModelSelect>
            </div>
            <div class="col-3">
                <input type="number" class="form-control" id="votos" v-model="candidato.total_votos" placeholder="Votos" @keypress.enter="addVotacionCandidato">
            </div>
            <div class="col-3">
                <button class="btn btn-success btn-block" :disabled="loaderAddVotacionCandidato" @click="addVotacionCandidato">
                    <span v-if="loaderAddVotacionCandidato" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    {{ loaderAddVotacionCandidato ? 'Agregando...' : 'Agregar' }}
                </button>
            </div>
            
        </div>
        <div class="row mt-3">
            
            <div class="col-12">
                <div class="d-flex justify-content-between my-1 candidatos" v-for="(item, index) in preconteo" :key="index">
                    <div>
                        <p>{{findCandidato(item.preconteocandidato_id)}} - {{item.total_votos}}</p>
                    </div>
                    <div>
                        <button class="btn btn-warning" @click="editVotacionCandidato(item, index)"><b-icon icon="pencil-square"></b-icon></button>
                    </div>
                </div>
                <div class="alert alert-light py-2 my-2" v-if="selected">
                    <strong>Total votos mesa:</strong> {{ totalVotosMesa }}
                </div>
            </div>
            <div class="col-3">
                <label for="sufragantes"># Firmas jurados</label>
                <input type="number" class="form-control" id="sufragantes" v-model.number="votacion.numero_firmas">
            </div>
            <div class="col-3">
                <label for="sufragantes"># votantes Formulario E-11</label>
                <input type="number" class="form-control" id="sufragantes" v-model.number="votacion.numero_sufragantes">
            </div>
            <div class="col-3">
                <label for="tachaduras">Tachaduras</label>
                <b-select :options="options" id="tachaduras" v-model="votacion.tachaduras"></b-select>
            </div>
            <div class="col-3">
                <label for="reconteo_votos">Reconteo</label>
                <b-select :options="options" id="reconteo_votos" v-model="votacion.reconteo_votos"></b-select>
            </div>
            <div class="col-3">
                <label for="numero_incinerados"># votos incinerados</label>
                <input type="number" class="form-control" id="numero_incinerados" v-model.number="votacion.numero_incinerados" min="0">
            </div>
            <div class="col-12">
                <label for="adjunto">Adjunto</label>
                <input type="text" id="adjunto" class="form-control" v-model="votacion.adjunto" />
            </div>
            <div class="col-12">
                <label for="observacion">Observaciones</label>
                <textarea
                    id="observacion"
                    class="form-control"
                    :class="{ 'is-invalid': requiereObservacion && !observacionValida }"
                    v-model="votacion.observaciones"
                ></textarea>
            </div>
            <div class="col-12" v-if="requiereObservacion && !observacionValida">
                <p class="alert alert-danger my-2 py-2">
                    La observación es obligatoria cuando: # votantes E-11 es 0 o menor al total de votos de mesa, # firmas jurados es menor a 3, hay tachaduras, hay reconteo o hay votos incinerados.
                </p>
            </div>
            <div class="col-12 my-2" v-if="preconteo.length > 0">
                <button class="btn btn-warning" :disabled="loaderUpdateVotacionMesa" @click="updateVotacionMesa" v-if="editarMesa">
                    <span v-if="loaderUpdateVotacionMesa" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    {{ loaderUpdateVotacionMesa ? 'Editando...' : 'Editar votacion de la mesa' }}
                </button>
                <button class="btn btn-primary" :disabled="loaderSaveVotacionMesa" @click="saveVotacionMesa" v-else>
                    <span v-if="loaderSaveVotacionMesa" class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
                    {{ loaderSaveVotacionMesa ? 'Guardando...' : 'Guardar votacion de la mesa' }}
                </button>
            </div>
            <div class="col-12 my-2" v-else>
                <p class="alert alert-danger">No hay votos por candidatos agregados.</p>
            </div>
            <div class="col-12" v-if="errores">
                {{errores}}
            </div>
        </div>
    </b-modal>
</template>
<script>

    import axios from 'axios';
    import Loading from '../Loader/Loading.vue';
    import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common';

    export default {
        components: {
            Loading, ModelSelect
        },
        data(){
            return{
                candidato: {preconteocandidato_id: null, total_votos: null},
                candidatos: [],
                datosMesa: null,
                editarMesa: false,
                errores: null,
                index: null,
                loader: false,
                loaderAddVotacionCandidato: false,
                loaderSaveVotacionMesa: false,
                loaderUpdateVotacionMesa: false,
                mesas: [],
                contextoMesa: null,
                mesaSeleccionadaIndex: null,
                options: [
                    {text: 'SI', value: 'SI'},
                    {text: 'NO', value: 'NO'}
                ],
                selected: false,
                totalVotosMesa: 0,
                title: null,
                votacion: {numero_firmas: 6, numero_sufragantes: 0, tachaduras: 'NO', reconteo_votos: 'NO', numero_incinerados: 0, adjunto: null, observaciones: null},
                preconteo: []
            }
        },
        mounted(){
            this.getCandidatos();
        },
        computed: {
            requiereObservacion(){
                const numeroSufragantes = Number(this.votacion.numero_sufragantes) || 0;
                const numeroFirmas = Number(this.votacion.numero_firmas) || 0;
                const numeroIncinerados = Number(this.votacion.numero_incinerados) || 0;

                return (
                    numeroSufragantes < this.totalVotosMesa ||
                    numeroFirmas < 3 ||
                    this.votacion.tachaduras === 'SI' ||
                    this.votacion.reconteo_votos === 'SI' ||
                    numeroSufragantes === 0 ||
                    numeroIncinerados > 0
                );
            },
            observacionValida(){
                return !!(this.votacion.observaciones && this.votacion.observaciones.toString().trim().length > 0);
            }
        },
        methods: {
            getMesaPreconteoList(item){
                if(!item){
                    return [];
                }

                if(Array.isArray(item.preconteo)){
                    return item.preconteo;
                }

                if(item.preconteo && Array.isArray(item.preconteo.preconteo_votaciones)){
                    return item.preconteo.preconteo_votaciones;
                }

                return [];
            },
            getMesaPreconteoMeta(item, mesaPreconteo = []){
                if(item && item.preconteo && typeof item.preconteo === 'object' && !Array.isArray(item.preconteo)){
                    return item.preconteo;
                }

                if(Array.isArray(mesaPreconteo) && mesaPreconteo.length > 0){
                    return mesaPreconteo[0];
                }

                return {};
            },
            getObservacioneIds(){
                const numeroSufragantes = Number(this.votacion.numero_sufragantes) || 0;
                const numeroFirmas = Number(this.votacion.numero_firmas) || 0;
                const numeroIncinerados = Number(this.votacion.numero_incinerados) || 0;
                const observaciones = [];

                if(numeroSufragantes < this.totalVotosMesa){
                    observaciones.push(6);
                }
                if(numeroSufragantes === 0){
                    observaciones.push(7);
                }
                if(numeroFirmas < 3){
                    observaciones.push(8);
                }
                if(this.votacion.tachaduras === 'SI'){
                    observaciones.push(9);
                }
                if(this.votacion.reconteo_votos === 'SI'){
                    observaciones.push(10);
                }
                if(numeroIncinerados > 0){
                    observaciones.push(11);
                }

                return observaciones;
            },
            buildVotacionPayload(){
                return {
                    ...this.votacion,
                    preconteo: this.preconteo,
                    divipolepreconteo_id: this.datosMesa.id,
                    numero_incinerados: Number(this.votacion.numero_incinerados) || 0,
                    observaciones_ids: this.getObservacioneIds()
                };
            },
            cerrarModalVotacion(){
                this.$nextTick(() => {
                    if(this.$bvModal && typeof this.$bvModal.hide === 'function'){
                        this.$bvModal.hide('agregar-votacion-modal');
                    }

                    const modalRef = this.$refs['agregar-votacion'];
                    if(modalRef && typeof modalRef.hide === 'function'){
                        modalRef.hide();
                    }
                });
            },
            validarObservacionObligatoria(){
                if(this.requiereObservacion && !this.observacionValida){
                    Swal.fire({
                        icon: 'error',
                        text: 'Debe diligenciar observaciones para continuar con esta votación.'
                    })
                    return false;
                }

                return true;
            },
            parseVotos(value){
                const numero = Number(value);
                if(Number.isNaN(numero) || numero < 0){
                    return null;
                }
                return Math.trunc(numero);
            },
            addVotacionCandidato(){

                if(this.loaderAddVotacionCandidato){
                    return;
                }

                if(this.candidato.preconteocandidato_id === null || this.candidato.total_votos === null || this.candidato.preconteocandidato_id === undefined || this.candidato.total_votos === undefined){
                    Swal.fire({
                        icon: 'warning',
                        text: 'Debes agregar informacion del candidato'
                    })
                    return;
                }

                const votos = this.parseVotos(this.candidato.total_votos);

                if(votos === null){
                    Swal.fire({
                        icon: 'warning',
                        text: 'El valor de votos debe ser un número válido mayor o igual a 0.'
                    })
                    return;
                }

                this.loaderAddVotacionCandidato = true;

                try {

                    this.preconteo.push({
                        preconteocandidato_id: this.candidato.preconteocandidato_id,
                        total_votos: votos,
                        id: (this.editarMesa)?this.candidato.id:null
                    })
                    this.totalVotosMesa += votos;
                    this.candidato.preconteocandidato_id = null;
                    this.candidato.total_votos = null;
                } finally {
                    this.loaderAddVotacionCandidato = false;
                }

            },
            editVotacionCandidato(item, index){
                // console.log(item)
                const votos = this.parseVotos(item.total_votos) || 0;
                this.totalVotosMesa = Math.max(0, this.totalVotosMesa - votos);
                this.preconteo.splice(index, 1);
                this.candidato.preconteocandidato_id = item.preconteocandidato_id;
                this.candidato.total_votos = item.total_votos;
                if(this.editarMesa){
                    this.candidato.id = item.id;
                }
            },
            newVotacion(item){
                // this.resetDatos();
                // console.log(item)
                this.contextoMesa = item;
                this.resetDatos();
                this.mesas = [];
                this.selected = false
                this.title = item.mcpio + '-' + 'ZZ' + item.cod_zona + ' PP' + item.cod_puesto + ' ' + item.puesto;

                let parametros = {
                    dpto: this.$store.state.user.candidato[0].departamento_id, 
                    mcpio: item.cod_mcpio,
                    zona: item.cod_zona,
                    puesto: item.cod_puesto
                }

                axios.post(`api/mostrar-mesas-preconteo`, parametros, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data)
                    this.mesas = res.data.mesas
                    this.resetDatos();
                    this.$refs['agregar-votacion'].show();
                })
                .catch(err => {
                    console.log(err)
                })
            },
            findCandidato(id){
               const result = this.candidatos.find(({ value }) => value === id);
               return result.text;
            },
            getCandidatos(){
                let corporacion = this.$store.state.user.candidato[0].corporacione_id;
                axios.get(`api/candidatos-preconteo/${corporacion}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    for (let i = 0; i < res.data.candidatos.length; i++) {
                        this.candidatos.push({
                            text: res.data.candidatos[i].numero +' - '+ res.data.candidatos[i].nombres + ' ' + res.data.candidatos[i].apellidos,
                            value: res.data.candidatos[i].id
                        })                        
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            saveVotacionMesa(){
                if(this.loaderSaveVotacionMesa){
                    return;
                }

                if(!this.validarObservacionObligatoria()){
                    return;
                }

                this.loaderSaveVotacionMesa = true;

                const payload = this.buildVotacionPayload();

                axios.post('api/preconteo', payload, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    // console.log(res.data);
                    if(res.data.status === 'success'){
                        this.mesas[this.index].preconteo = res.data.preconteo;
                        this.mesas[this.index].mesa = this.datosMesa.mesa;
                        this.$emit('votacion-actualizada', {
                            cod_mcpio: this.contextoMesa ? this.contextoMesa.cod_mcpio : null
                        });
                        this.cerrarModalVotacion();

                    }else{
                        this.errores = res.data
                    }
                    
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.loaderSaveVotacionMesa = false;
                })
            },
            resetDatos(){
                this.candidato = {preconteocandidato_id: null, total_votos: null}
                this.votacion.numero_firmas = 6;
                this.votacion.numero_sufragantes = 0;
                this.votacion.tachaduras = 'NO';
                this.votacion.reconteo_votos = 'NO';
                this.votacion.numero_incinerados = 0;
                this.votacion.adjunto = null;
                this.votacion.observaciones = null;
                this.preconteo = []
                this.totalVotosMesa = 0;
                this.errores = null;
            },
            selectMesa(item, index){

                console.log(item)
                this.index = index;
                this.mesaSeleccionadaIndex = index;
                this.selected = true;
                this.datosMesa = item;
                this.preconteo = [];
                this.totalVotosMesa = 0;
                const mesaPreconteo = this.getMesaPreconteoList(item);
                const mesaMeta = this.getMesaPreconteoMeta(item, mesaPreconteo);

                if(mesaPreconteo.length > 0){

                    this.editarMesa = true;
                    this.votacion.numero_firmas = Number(mesaMeta.numero_firmas ?? 6);
                    this.votacion.numero_sufragantes = Number(mesaMeta.numero_sufragantes ?? 0);
                    this.votacion.tachaduras = mesaMeta.tachaduras || 'NO';
                    this.votacion.reconteo_votos = mesaMeta.reconteo_votos || 'NO';
                    this.votacion.numero_incinerados = Number(mesaMeta.numero_incinerados ?? 0);
                    this.votacion.observaciones = mesaMeta.observaciones || null;
                    this.votacion.adjunto = mesaMeta.adjunto || null;

                    for (let i = 0; i < mesaPreconteo.length; i++) {
                        const votos = this.parseVotos(mesaPreconteo[i].total_votos) || 0;
                        this.preconteo.push({
                            id: mesaPreconteo[i].id,
                            preconteocandidato_id: mesaPreconteo[i].preconteocandidato_id,
                            total_votos: votos
                        })
                        this.totalVotosMesa += votos;
                    }

                }else{
                    this.editarMesa = false;
                    this.resetDatos();

                }
            },
            updateVotacionMesa(){
                if(this.loaderUpdateVotacionMesa){
                    return;
                }

                if(!this.validarObservacionObligatoria()){
                    return;
                }

                this.loaderUpdateVotacionMesa = true;

                const payload = this.buildVotacionPayload();

                axios.post('api/edit-preconteo', payload, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    if(res.data.status === 'success'){
                        this.mesas[this.index].preconteo = res.data.preconteo;
                        this.mesas[this.index].mesa = this.datosMesa.mesa;
                        this.$emit('votacion-actualizada', {
                            cod_mcpio: this.contextoMesa ? this.contextoMesa.cod_mcpio : null
                        });
                        this.cerrarModalVotacion();

                    }else{
                        this.errores = res.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.loaderUpdateVotacionMesa = false;
                })
            },
            onModalHidden(){
                this.resetDatos();
                this.selected = false;
                this.editarMesa = false;
                this.datosMesa = null;
                this.index = null;
                this.mesaSeleccionadaIndex = null;
                this.title = null;
                this.mesas = [];
                this.contextoMesa = null;
            }
        }
    }
</script>
<style scoped>
    .candidatos{
        border: 1px solid black;
        padding: 5px;
    }

    .mesa-seleccionada {
        background-color: #0d6efd !important;
        border-color: #0d6efd !important;
        color: #fff !important;
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }
</style>