<template>
    <a-card :bordered="false" class="header-solid h-full gestion-militantes" :bodyStyle="{padding: 0,}">
		<template #title>
            <div class="caja-gestion busqueda-gestion">
                <div class="campo-gestion">
                    <label for="id">Cédula</label>
                    <input type="number" id="id" v-model="votante.id" class="form-control" placeholder="Número de cédula" @keypress.enter="verificarVotanteConsultado" />
                </div>	
                <div class="accion-busqueda">
					<button class="btn btn-verde btn-block" @click="verificarVotanteConsultado">Buscar</button>
				</div>	
            </div>
            <div class="paneles-gestion">
                <div class="caja-gestion">
                    <h4>Datos del militante</h4>
                    <hr>
                    <p><strong>Cédula: </strong>{{votante.id}}</p>
                    <p><strong>Nombre: </strong>{{votante.nombres}} {{votante.apellidos}}</p>
                    <p><strong>Lugar de votación: </strong>{{votante.nombre_puesto}} - Mesa {{votante.mesa}}</p>
                </div>
                <div class="caja-gestion table-responsive">
                    <h4>Datos de líderes</h4>
                    <hr>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Campaña</th>
                                <th>Líder</th>
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
                
                <div class="caja-gestion edicion-gestion">
					
					
					<div class="campos-gestion">
						<div class="campo-gestion">
							<div class="d-flex justify-content-between">
								<div>
									<label for="lider">Líder</label>
								</div>
							</div>
							<model-select :options="lideres" v-model="votante.lidere_id" id="lider"></model-select>
						</div>
						
						<div class="campo-gestion">
							<label for="direccion">Dirección</label>
							<input type="text" id="direccion" class="form-control" v-model="votante.direccion">
						</div>
						<div class="campo-gestion">
							<label for="telefono">Teléfono</label>
							<input type="number" id="telefono" class="form-control" v-model="votante.telefono">
						</div>
                        <div class="acciones-gestion">
                            <button class="btn btn-verde" @click="updateVotante">Actualizar</button>
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

<style scoped>
.gestion-militantes { white-space: normal; }
.caja-gestion { min-width: 0; padding: 1.25rem; background: #f8faf9; border: 1px solid #e1e8e4; border-radius: 12px; }
.busqueda-gestion { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1rem; align-items: end; margin-bottom: 1.25rem; }
.paneles-gestion { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 1.25rem; }
.caja-gestion h4 { margin: 0; color: #198754; font-size: 1.1rem; font-weight: 700; }
.caja-gestion hr { margin: 0.875rem 0 1rem; border-color: #d8e0dc; }
.caja-gestion p { color: #475569; font-size: 0.95rem; line-height: 1.6; margin: 0 0 0.5rem; overflow-wrap: anywhere; }
.edicion-gestion { grid-column: 1 / -1; }
.campos-gestion { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.campo-gestion { min-width: 0; }
.campo-gestion label { display: block; margin: 0 0 0.4rem; color: #475569; font-size: 0.875rem; font-weight: 600; }
.campo-gestion .form-control, .campo-gestion ::v-deep .ui.selection.dropdown { width: 100%; min-width: 0; min-height: 44px; border: 1px solid #d8e0dc; border-radius: 8px; font-size: 0.95rem; box-shadow: none; }
.campo-gestion .form-control { height: 44px; padding: 0.5rem 0.75rem; }
.campo-gestion .form-control:focus, .campo-gestion ::v-deep .ui.selection.dropdown:focus-within { border-color: #198754; box-shadow: 0 0 0 3px rgba(25,135,84,0.12); }
.acciones-gestion { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 0.75rem; }
.gestion-militantes .btn { min-height: 44px; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; }
.btn-verde { background: #198754; border: 1px solid #198754; color: white; }
.btn-verde:hover { background: #146c43; border-color: #146c43; color: white; }
.btn-verde:focus-visible { outline: 3px solid rgba(25,135,84,0.35); outline-offset: 2px; }
.table { margin-bottom: 0; font-size: 0.875rem; background: white; }
.table thead th { background: #eef6f1; color: #166534; border-bottom: 2px solid #d8e0dc; }
.table th, .table td { padding: 0.7rem 0.8rem; vertical-align: middle; border-color: #e1e8e4; }
.table tbody tr:hover { background: #f0f7f3; }
@media (max-width: 991px) { .paneles-gestion { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 767px) {
    .campos-gestion, .busqueda-gestion { grid-template-columns: minmax(0, 1fr); }
    .caja-gestion { padding: 1rem; }
    .accion-busqueda .btn { width: 100%; }
}
</style>
