<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
		<template #title>
            <div class="row">
                <div class="col-12 col-sm-7 mt-2">
                    <input type="number" id="id" v-model="votante.id" class="form-control" placeholder="id" @keypress.enter="verificarVotanteConsultado" />
                </div>	
                <div class="col-12 col-sm-5 mt-2">
					<button class="btn btn-primary btn-block" @click="verificarVotanteConsultado">Buscar</button>
				</div>	
            </div>
            <div class="row">
                <div class="col-12 col-sm-5 my-3 card p-3">
                    <h4>Datos militante</h4>
                    <hr>
                    <p><strong>id: </strong>{{votante.id}}</p>
                    <p><strong>Nombre: </strong>{{votante.nombres}} {{votante.apellidos}}</p>
                    <p><strong>Lugar de votacion: </strong>{{votante.nombre_puesto}} - Mesa {{votante.mesa}}</p>
                </div>
                <div class="col-12 col-sm-7 my-3 table-responsive card p-3">
                    <h4>Datos lideres</h4>
                    <hr>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Campaña</th>
                                <th>lider</th>
                                <th>Usuario registro</th>
                                <th>Fecha ingreso</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in votantes" :key="index">
                                <td>{{item.nombre_candidato}}</td>
                                <td>{{item.nombre_lider}}</td>
                                <td>{{item.name}}</td>
                                <td>{{formatFecha(item.created_at)}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="col-12">
					
					
					<div class="row">
						<div class="col-12 col-sm-3 mb-3">
							<div class="d-flex justify-content-between">
								<div>
									<label for="lider">Lider</label>
								</div>
							</div>
							<model-select :options="lideres" v-model="votante.lidere_id" id="lider"></model-select>
						</div>
						
						<div class="col-12 col-sm-3 mb-3">
							<label for="direccion">Direccion</label>
							<input type="text" id="direccion" class="form-control" v-model="votante.direccion">
						</div>
						<div class="col-12 col-sm-3 mb-3">
							<label for="telefono">Telefono</label>
							<input type="number" id="telefono" class="form-control" v-model="votante.telefono">
						</div>
                        <div class="col-12 my-3">
                            <button class="btn btn-warning mr-2" @click="updateVotante">Actualizar</button>
                            <button class="btn btn-danger" @click="deleteVotante" v-if="$store.state.user.candidato[0].corporacione_id !== 5">Eliminar</button>
                        </div>					
					</div>
				</div>
            </div>
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios'    
	import { ModelSelect, BasicSelect } from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    export default {
        components:{
            ModelSelect, BasicSelect
        },
        data() {
            return{
                item: {
                    text: '', value: ''
                },
                lideres: [],
                profesiones: [],
                votantes: [],
                votante: {}
            }
        },
        mounted(){
            this.getProfesiones()
        },
        methods: {
            deleteVotante(){
				Swal.fire({
					icon: 'warning',
					title: 'Atención!',
					text: 'Estas tratando de eliminar un registro del sistema, deseas continuar?',
					showDenyButton: false,
					showCancelButton: true,
					confirmButtonText: 'Aceptar',
					denyButtonText: `Don't save`,
					}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						axios.delete(`/api/listadovotantes/${this.votante.id}`, {
							headers: {
								"Authorization": `Bearer ${this.$store.state.user.token}`
							}
						})
							.then(res => {
								if(res.data.status === 'success'){
									Swal.fire('Registro eliminado!', '', 'success')
									this.votante = {}
                                    this.votantes = []
                                    this.item = {
                                        text: '', value: ''
                                    }
								}else{
									Swal.fire('No tienes privilegios para esta accion!', '', 'error')
								}
							})
							.catch(err => {
								console.log(err)
							})
					} 
				})
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
            formatFecha(fecha){
                return new Date(fecha).toLocaleDateString('es-co', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
            },            
			selectProfesion(item){
				this.votante.profesione_id = item.value
				this.item = item
			},
			updateProfesioneid(item){
				this.votante.profesione_id = item.id
				this.item.value = item.id
				this.item.text = item.profesion
			},            
			updateVotante(){
				const corporacion = this.$store.state.user.candidato[0].corporacione_id
                axios.put(`/api/listadovotantes/${corporacion}`, this.votante, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    if(res.data.status === 'success'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro gestionado',
                            html: `El votante ${this.votante.nombres} ${this.votante.apellidos} fue gestionado con exito.`
                        })
                        this.votante = {}
                        this.votantes = []
                        this.item = {
                            text: '', value: ''
                        }
                    }else{
                        Swal.fire({
                            icon: 'info',
                            title: 'Atencion',
                            text: 'Comunicate con el administrador.'
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })	
			},
            verificarVotanteConsultado(){				
                this.lideres = []
				if(this.votante.id === null){
					Swal.fire({
						icon: 'warning',
						title: 'Campo requerido',
						text: 'El campo id es requerido'
					})
					return
				}

				const parametros = {
					candidato: this.$store.state.user.candidato_id,
					corporacion: this.$store.state.user.candidato[0].corporacione_id,
					cedula: this.votante.id
				}

				axios.post('api/votantes-repetidos', parametros, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					console.log(res.data)
					if(res.data.votante.length > 0){
						this.votantes = res.data.votante	
                        this.votante = Object.assign({}, res.data.votante[0])
						this.item.value = res.data.votante[0].profesion_id
						this.item.text = res.data.votante[0].profesion
                        for (let i = 0; i < res.data.votante.length; i++) {
                            this.lideres.push({
                                text: res.data.votante[i].nombre_lider,
                                value: res.data.votante[i].lidere_id
                            })                            
                        }
					}else{
						Swal.fire({
                            icon: 'info',
                            title: 'No encontrado',
                            text: 'El numero de documento consultado no esta agregado.'
                        })
					}
					
				})
				.catch(err => {
					console.log(err)
				})
			}
        }
    }
</script>
