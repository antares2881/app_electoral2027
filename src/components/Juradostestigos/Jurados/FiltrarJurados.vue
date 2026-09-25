<template>
    <div class="row">
        <GuardarJurado ref="guardarJurado" @setJurado="setArrayJurados" />
        <div class="col-12 col-sm-6">
            <h6>Filtrar por: </h6>
            <b-select :options="filtros" id="filtrar" v-model="filtro.filtro" class="form-control" @change="showTable = false"></b-select>
        </div>     
        <div class="col-12 col-sm-6" v-if="filtro.filtro === 1">
            <h6>Profesiones: </h6>
            <model-select :options="profesiones" v-model="filtro.profesione_id" id="profesion"></model-select>
        </div>
        <div class="col-12 col-sm-6" v-if="filtro.filtro === 2">
            <h6>Puestos de votacion</h6>
            <model-select :options="puestos" v-model="filtro.puesto_votacion" id="puesto"></model-select>
        </div>
        <div class="col-12 my-3">
            <button class="btn btn-primary" @click="mostrarVotantes">Mostrar</button>
        </div>
        <div class="col-12">
            <span v-if="loader">
                <Loading />
            </span>
            <span v-else>
                <div class="table-responsive tabla" v-if="showTable">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Cedula</th>
                                <th>Votante</th>
                                <th>Profesion</th>
                                <th>Direccion</th>
                                <th>Puesto de votacion</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="msn">
                            <tr v-for="(item, index) in $store.state.jurados" :key="index">
                                <td>{{ item.id }}</td>
                                <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                <td>{{ item.profesion.profesion }}</td>
                                <td>{{ item.direccion }}</td>
                                <td>{{ item.nombre_puesto }}</td>
                                <td>
                                    <b-icon icon="dash-square" @click="agregarJurado(item, index)" v-if="item.jurado === null"></b-icon>
                                    <b-icon icon="check-lg" v-else></b-icon>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>No hay datos para mostrar</tr>
                        </tbody>
                    </table>
                </div>
            </span>
        </div>
    </div>
</template>
<script>
    import GuardarJurado from './ModalGuardarJurado.vue'
    import {ModelSelect} from '../../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    import axios from 'axios'
    import Loading from '../../Loader/Loading.vue'
    export default {
        components: {
            GuardarJurado,
            ModelSelect,
            Loading
        },
        data(){
            return{
                agregado: false,
                filtro: {},
                filtros: [
                    {text: 'Profesion', value: 1},
                    {text: 'Puesto de votacion', value: 2},
                ],
                loader: false,
                msn: true,
                profesiones: [],
                puestos: [],
                resultados: [],
                showTable: false
            }
        },
        mounted(){
            this.getProfesiones()
            this.getPuestos()
        },
        methods: {
            agregarJurado(item, index){
                
                let nombres = item.nombres.split(' ')
                let apellidos = item.apellidos.split(' ')
                item.nom1 = nombres[0]
                item.nom2 = nombres[1]
                item.ape1 = apellidos[0]
                item.ape2 = apellidos[1]
                item.celular = item.telefono
                item.cedula = item.id
                item.dpto = item.departamento_id
                item.mcpio = item.municipio_id

                this.$refs.guardarJurado.nuevoJurado(item, index)
            },
            getProfesiones(){
				this.profesiones = []
				axios.get('/api/profesiones', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						for (let i = 0; i < res.data.profesiones.length; i++) {
							this.profesiones.push({
								value: res.data.profesiones[i].id,
								text: res.data.profesiones[i].profesion
							})
						}
					})
					.catch(err => {
						console.log(err)
					})
			},
            getPuestos(){
                axios.get('api/puestosxvotantes', {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        if(res.data.puestos.length > 0){
                            for (let i = 0; i < res.data.puestos.length; i++) {
                                this.puestos.push({
                                    text: res.data.puestos[i].nombre_puesto,
                                    value: res.data.puestos[i].nombre_puesto,
                                })                                
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            mostrarVotantes(){
                this.loader = true
                this.showTable = false
                this.$store.state.jurados = []
                axios.post('api/votantes-jurados', this.filtro, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        if(res.data.votantes.length > 0){
                            for (let i = 0; i < res.data.votantes.length; i++) {
                                this.$store.commit('setJurados', res.data.votantes[i])                                
                            }
                        }else{
                            this.msn = true
                        }
                        // console.log(res.data.votantes)
                        this.showTable = true
                        this.loader = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            setArrayJurados(){
                console.log('jurado')
                // this.resultados[this.index].jurado = Object.assign({}, jurado)
                this.$set(this.resultados[this.index], 'jurado', jurado)
            }
        },
        computed: {
            getJurados(){
                return this.$store.getters.getJurados
            }
        }
    }
</script>
<style scoped>
    .b-icon.bi{
		cursor: pointer;
		color: #1890FF;
		font-size: 16pt;
		font-weight: bold;
	}
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>