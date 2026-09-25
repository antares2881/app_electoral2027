<template>
    <b-modal ref="modal-testigos" hide-footer :title="divipole.nombre_puesto" size="xl" no-close-on-backdrop>
        <div class="row">
            <div class="col-5 mesas">
                <b-list-group v-for="(item, index) in mesas" :key="index">
                    <b-list-group-item button class="d-flex justify-content-between align-items-center" @click="showDetails(item)">
                        Mesa {{item.mesa}}
                        <b-badge :variant="(item.testigo.length === 0)?'danger':'success'" pill>{{item.testigo.length}}</b-badge>
                    </b-list-group-item>
                </b-list-group>
            </div>
            <div class="col-7" v-if="showInfoMesa">
                <h4>INFO MESA {{infoMesa.numero}}</h4>
                <hr>
                <div v-if="agregarMesa">
                    <p><strong>TESTIGO A AGREGAR: </strong>{{testigo.nom1}} {{testigo.nom2}} {{testigo.ape1}} {{testigo.ape2}}</p>
                    
                    <button class="btn btn-primary" @click="saveTestigo">Agregar mesa {{infoMesa.numero}}</button>
                </div>
               
                <div class="mt-3 " v-if="infoMesa.testigos.length > 0">
                    <h5>Testigos agregados a la mesa</h5>
                    <div class="d-flex justify-content-between listado-testigos" v-for="(testigo, index) in infoMesa.testigos" :key="index">
                        <div>
                            <p class="text-md" >{{`${testigo.nom1} ${testigo.nom2} ${testigo.ape1} ${testigo.ape2}`}} <br>
                                <span class="text-sm text-muted">PARTIDO: {{findPartido(testigo.partido_id)}}</span> 
                            </p>
                        </div>
                        <div>
                            <b-icon icon="trash" @click="deleteTestigo(testigo, index)"></b-icon>
                        </div>
                    </div>
                </div>
                <div class="mt-3" v-else>
                    <p class="alert alert-danger">La mesa no tiene testigos agregados.</p>
                </div>
            </div>
        </div>
    </b-modal>
</template>
<script>
    import axios from 'axios';
    export default {
        data(){
            return{
                agregarMesa: false,
                divipole: {zona: null, puesto: null, nombre_puesto: null},
                infoMesa: {numero: null, testigos: []},
                mesas: [],
                partidos: [],
                showInfoMesa: false,
                testigo: {},
            }
        },
        mounted(){
            this.getPartidos();
        },
        methods: {
            addMesas(testigo){
                this.testigo = Object.assign({}, testigo)
                this.agregarMesa = true;
                this.showTestigos(testigo.zona, testigo.puesto, testigo.nombre_puesto);
                
            },
            deleteTestigo(item, index){
                // console.log(index)
                axios.delete(`api/testigos/${item.id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        if(res.data === 'ok'){
                            this.infoMesa.testigos.splice(index, 1);
                        }else{
                            Swal.fire({
                                icon: 'warning',
                                text: 'No se pudo realizar la accion, comunicate con el administrador del sistema'
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            findPartido(partido_id){
                const partido = this.partidos.find(({ id }) => id === partido_id);
                return partido.partido;
            },
            getPartidos(){

                this.partidos = []
                axios.get(`api/partidos`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        this.partidos = res.data.partidos
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            showDetails(item){
                this.showInfoMesa = true
                this.infoMesa = {
                    item: item,
                    numero: item.mesa,
                    testigos: item.testigo
                }
            },
            testigos(zona, puesto, nombre_puesto){
                this.agregarMesa = false
                this.showTestigos(zona, puesto, nombre_puesto);
            },
            saveTestigo(){

                const testigo = {
                    divipoletestigo_id: this.infoMesa.item.id,
                    candidato_id: this.$store.state.user.candidato_id,
                    partido_id: this.testigo.partido_id,
                    cedula: this.testigo.cedula,
                    nom1: this.testigo.nom1,
                    nom2: this.testigo.nom2,
                    ape1: this.testigo.ape1,
                    ape2: this.testigo.ape2,
                    email: this.testigo.email,
                    telefono: this.testigo.telefono
                };

                axios.post('api/testigos', testigo, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        // console.log(res.data.testigo)
                        this.infoMesa.testigos.push(res.data.testigo)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            showTestigos(zona, puesto, nombre_puesto){
                
                this.showInfoMesa = false;

                this.divipole = {
                    zona: zona,
                    puesto: puesto,
                    nombre_puesto: nombre_puesto
                }

                axios.post('api/testigos-puesto', this.divipole,  {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                    .then(res => {
                        this.mesas = res.data.testigos
                        // console.log(this.mesas)
                        this.$refs['modal-testigos'].show()
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }
    }
</script>
<style scoped>
    .listado-testigos{
        border: 1px solid green;
        margin: 2px;
        padding: 5px;
    }
    .mesas{
		display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
	}
    svg.bi-trash.b-icon.bi{
        cursor: pointer;
        color: red;
    }
</style>