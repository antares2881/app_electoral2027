<template>
    <div class="row">
        <ModalAgregarVotacion ref="addVotacion" @votacion-actualizada="actualizarMesasInformadas" />
        <ModalMesasInformadas ref="mesasInformadas" />
        <div class="col-12" v-if="loader">
            <Loading />
        </div>
        <div class="col-12 table-responsive tabla" v-else>
            <div class="d-flex justify-content-end mb-2" v-if="mostrarDetallePuestos">
                <button class="btn btn-secondary" @click="volverMunicipios">Regresar a municipios</button>
            </div>
            <div class="mb-2">
                <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery"
                    :placeholder="mostrarDetallePuestos ? 'Buscar por puesto' : 'Buscar por municipio'"
                />
            </div>

            <table class="table table-striped" v-if="!mostrarDetallePuestos">
                
                <thead>
                    <tr>
                        <th>Código municipio</th>
                        <th>Municipio</th>
                        <th>Mesas informadas</th>
                        <th>Total mesas</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in municipiosFiltrados" :key="`m-${index}`">
                        <td>{{ item.cod_mcpio }}</td>
                        <td>{{ item.mcpio }}</td>
                        <td>
                            <button class="btn btn-link p-0" :disabled="Number(item.mesas_informadas) === 0" @click="verMesasInformadas(item)">{{ item.mesas_informadas }}</button>
                        </td>
                        <td>{{ item.total_mesas }}</td>
                        <td>
                            <button class="btn btn-primary" @click="getPuestos(item.cod_mcpio)">Ver puestos</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-striped" v-else>
                
                <thead>
                    <tr>
                        <th>Municipio</th>
                        <th>Zona</th>
                        <th>Puesto</th>
                        <th>Mesas informadas</th>
                        <th>Mesas</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in puestosFiltrados" :key="`p-${index}`">
                        <td>{{item.mcpio}}</td>
                        <td>{{item.cod_zona}}</td>
                        <td>{{item.puesto}}</td>
                        <td>
                            <button class="btn btn-link p-0" :disabled="Number(item.mesas_informadas) === 0" @click="verMesasInformadas(item)">{{item.mesas_informadas}}</button>
                        </td>
                        <td>{{item.total_mesas}}</td>
                        <td>
                            <button class="btn btn-primary" :disabled="loaderAgregarVotacion && filaCargando === index" @click="agregarVotacion(item, index)">
                                {{ loaderAgregarVotacion && filaCargando === index ? 'Cargando...' : 'Gestionar' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>

    import axios from 'axios';
    import ModalAgregarVotacion from './ModalAgregarVotacion.vue';
    import ModalMesasInformadas from './ModalMesasInformadas.vue';
    import Loading from '../Loader/Loading.vue';

    export default {
        components: {
            ModalAgregarVotacion, ModalMesasInformadas, Loading
        },
        data(){
            return{
                loader: true,
                loaderAgregarVotacion: false,
                filaCargando: null,
                codMcpioActual: null,
                searchQuery: '',
                municipios: [],
                puestos: [],
                mostrarDetallePuestos: false
            }
        },
        computed: {
            municipiosFiltrados(){
                const query = (this.searchQuery || '').toLowerCase().trim();
                if(!query) return this.municipios;
                return this.municipios.filter(item => String(item.mcpio || '').toLowerCase().includes(query));
            },
            puestosFiltrados(){
                const query = (this.searchQuery || '').toLowerCase().trim();
                if(!query) return this.puestos;
                return this.puestos.filter(item => String(item.puesto || '').toLowerCase().includes(query));
            }
        },
        mounted(){
            this.getMunicipios();
        },
        methods: {
            async agregarVotacion(item, index){
                this.loaderAgregarVotacion = true;
                this.filaCargando = index;
                try {
                    await Promise.resolve(this.$refs.addVotacion.newVotacion(item));
                } catch (err) {
                    console.log(err)
                } finally {
                    setTimeout(() => {
                        this.loaderAgregarVotacion = false;
                        this.filaCargando = null;
                    }, 300);
                }
            },
            getMunicipios(){
                this.loader = true;
                this.municipios = [];
                this.puestos = [];
                this.codMcpioActual = null;
                this.searchQuery = '';
                this.mostrarDetallePuestos = false;
                axios.get(`api/divipole-preconteos/${this.$store.state.user.candidato[0].departamento_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data.municipios)
                    this.municipios = res.data.municipios
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            getPuestos(cod_mcpio){
                this.loader = true;
                this.puestos = [];
                this.codMcpioActual = cod_mcpio;
                axios.get(`api/divipole-preconteos/${this.$store.state.user.candidato[0].departamento_id}/${cod_mcpio}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data.puestos)
                    this.puestos = res.data.puestos
                    this.searchQuery = '';
                    this.mostrarDetallePuestos = true;
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            volverMunicipios(){
                this.mostrarDetallePuestos = false;
                this.searchQuery = '';
                this.puestos = [];
            },
            verMesasInformadas(item){
                this.$refs.mesasInformadas.viewMesasInformadas({
                    mostrarDetallePuestos: this.mostrarDetallePuestos,
                    cod_mcpio: item.cod_mcpio,
                    puesto: item.puesto
                });
            },
            actualizarMesasInformadas(payload = {}){
                const codMcpio = payload.cod_mcpio || this.codMcpioActual;
                if(codMcpio){
                    this.getPuestos(codMcpio);
                }
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