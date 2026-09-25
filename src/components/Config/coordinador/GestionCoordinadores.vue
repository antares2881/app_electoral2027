<template>
    <div>
        <!-- Modal de confirmación de eliminación -->
        <b-modal ref="confirmDelete" size="md" hide-footer title="Confirmar eliminación">
        <div class="text-center">
            <div class="mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-warning">
                    <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h5>¿Está seguro de eliminar este coordinador?</h5>
            <div class="alert alert-warning mx-3 mb-3">
                <strong>Atención:</strong> Esta acción eliminará todos los votantes y líderes que estén asociados a este coordinador.
            </div>
            <p class="text-muted">Esta acción no se puede deshacer.</p>
            <div class="mt-4">
                <button class="btn btn-danger me-2" @click="confirmDelete" :disabled="deleting">
                    <span v-if="deleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ deleting ? 'Eliminando...' : 'Sí, eliminar' }}
                </button>
                <button class="btn btn-secondary" @click="cancelDelete">Cancelar</button>
            </div>
        </div>
    </b-modal>

    <!-- Modal de información de eliminación -->
    <b-modal ref="deleteInfo" size="lg" hide-footer title="Coordinador eliminado exitosamente">
        <div class="text-center" v-if="deleteResponse">
            <div class="mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-success">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <h5 class="text-success mb-3">{{ deleteResponse.message }}</h5>
            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h6 class="card-title">Coordinadores</h6>
                            <h4 class="text-primary">{{ deleteResponse.eliminados.coordinador }}</h4>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h6 class="card-title">Líderes</h6>
                            <h4 class="text-info">{{ deleteResponse.eliminados.lideres }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <div class="card bg-light">
                        <div class="card-body text-center">
                            <h6 class="card-title">Votantes afectados</h6>
                            <h4 class="text-warning">{{ deleteResponse.eliminados.votantes || 0 }}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <button class="btn btn-primary" @click="closeDeleteInfo">Entendido</button>
            </div>
        </div>
    </b-modal>

    <b-modal ref="coordinadores" size="xl" hide-footer :title="title + ' Coordinador'" @hidden="clearErrors">
        <div class="col-12 text-center" v-if="loader">
            <Loading />
        </div>
        <div class="row" v-else>
            <GestionProfesiones ref="profesiones" @profesion_id="updateProfesioneid" />
            <div class="col-md-12" v-if="!editar">
                <label for="cedula">Cedula <b-icon icon="info-circle-fill" aria-hidden="true" v-b-tooltip.hover title="Presiona Enter para buscar datos de la cedula digitada"></b-icon></label>
                <Persona @setPersona="setPersona" />
            </div>
            <div class="col-12 my-2" v-if="coordinador_repetido">
                <p class="alert alert-danger">Persona ya existe en la campaña <strong>{{this.coordinador.candidato}}</strong> con el rol de <strong>{{tipoPersona}}</strong></p>
            </div>
            <div class="col-lg-4 col-md-6 col-6">
                <label for="nombres">Nombres</label>
                <input type="text" id="nombres" class="form-control" v-model="coordinador.nombres">
                <div v-if="errores.nombres" class="error-message">{{ errores.nombres[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6">
                <label for="apellidos">Apellidos</label>
                <input type="text" id="apellidos" class="form-control" v-model="coordinador.apellidos">
                <div v-if="errores.apellidos" class="error-message">{{ errores.apellidos[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="fecha_nac">Fecha Nac.</label>
                <input type="date" id="fecha_nac" class="form-control" v-model="coordinador.fecha_nac">
                <div v-if="errores.fecha_nac" class="error-message">{{ errores.fecha_nac[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="direccion">Direccion</label>
                <input type="text" class="form-control" id="direccion" v-model="coordinador.direccion">
                <div v-if="errores.direccion" class="error-message">{{ errores.direccion[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="barrio">Barrio</label>
                <input type="text" class="form-control" id="barrio" v-model="coordinador.barrio">
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="telefono">Telefono</label>
                <input type="text" class="form-control" id="telefono" v-model="coordinador.telefono">
                <div v-if="errores.telefono" class="error-message">{{ errores.telefono[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="observaciones">Observacion</label>
                <input type="text" class="form-control" id="observaciones" v-model="coordinador.observaciones">
            </div>       
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="meta_votantes">Meta votantes</label>
                <input type="number" id="meta_votantes" class="form-control" v-model="coordinador.meta_votacion">
                <div v-if="errores.meta_votacion" class="error-message">{{ errores.meta_votacion[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <div class="d-flex justify-content-between">
                    <div>
                        <label for="profesion">Profesion</label>
                    </div>
                    <div>
                        <b-icon icon="plus-square" @click="newProfesion"></b-icon>
                    </div>
                </div>
                <model-select
                    id="profesion"
                    :options="profesiones"
                    v-model="coordinador.profesione_id"
                ></model-select>
            </div>
            <div class="col-md-12 mb-2">
                <label for="perfil">Perfil</label>
                <textarea id="perfil" v-model="coordinador.perfil" class="form-control"></textarea>
            </div>
            <div class="col-12 my-3" v-if="errorMessage">
                <p class="alert alert-danger">{{ errorMessage }}</p>
            </div>
            <div class="col-md-12 mt-3">
                <button class="btn btn-warning mr-2" v-if="editar" @click="update" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Actualizando...' : 'Actualizar' }}
                </button>
                <button class="btn btn-primary mr-2" v-else @click="create" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-danger mr-2" v-if="editar" @click="showDeleteConfirmation">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                        <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19ZM10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Eliminar
                </button>
                <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
            </div>
        </div>
    </b-modal>
    </div>
</template>
<script>
    import axios from 'axios'
    import GestionProfesiones from "../profesiones/GestionProfesiones.vue";
    import Persona from '../../Persona/Persona.vue'
    import Loading from '../../Loader/Loading.vue'
    import { ModelSelect } from '../../../../node_modules/vue-search-select/dist/VueSearchSelect.common';  
    export default{
        components: {
            GestionProfesiones, Persona, Loading, ModelSelect
        },
        data(){
            return{
                coordinador: {},
                coordinador_repetido: false,
                deleting: false,
                deleteResponse: null,
                editar: false,
                errores: {},
                errorMessage: '',
                errors: false,
                index: null,
                item: {
                    value: '',
                    text: ''
                },
                loader: false,
                loading: false,
                profesiones: [],
                tipoPersona: '',
                title: null
            }
        },
        mounted() {
            this.getProfesiones();
        },
        methods:{
            cancelar(){
                this.$refs['coordinadores'].hide()
            },
            create(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                this.coordinador.candidato_id = this.$store.state.user.candidato_id
                
                axios.post(`api/coordinadores`, this.coordinador,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        this.loading = false
                        if(res.data.status === 'success'){
                            this.$refs['coordinadores'].hide()
                            this.$store.commit('setCoordinadores', res.data.coordinador)
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        this.loading = false
                        console.log('Error completo en CREATE:', err)
                        
                    })
            },
            editCoordinador(item, index){
                this.coordinador_repetido = false
                this.editar = true
                this.clearErrors()
                this.coordinador = Object.assign({}, item)
                this.title = 'Editar'
                this.index = index
                this.$refs['coordinadores'].show()
            },
            newCoordinador(){
                this.coordinador_repetido = false
                this.coordinador = {}
                this.editar = false
                this.clearErrors()
                this.title = 'Nuevo'
                this.$refs['coordinadores'].show()
            },
            clearErrors(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
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
            newProfesion(){
                this.$refs.profesiones.newProfesion()

			},
            setCoordinador(persona){
                this.$set(this.coordinador, 'candidato', persona.coordinador.candidato.nombres)
                this.$set(this.coordinador, 'id', persona.coordinador.id)
                this.$set(this.coordinador, 'nombres', persona.coordinador.nombres )
                this.$set(this.coordinador, 'apellidos', persona.coordinador.apellidos )
                this.$set(this.coordinador, 'fecha_nac', persona.coordinador.fecha_nac )     
                this.$set(this.coordinador, 'direccion', persona.coordinador.direccion)
                this.$set(this.coordinador, 'telefono', persona.coordinador.telefono)
                this.$set(this.coordinador, 'barrio', persona.coordinador.barrio) 
                this.$set(this.coordinador, 'observaciones', persona.coordinador.observaciones )
                this.$set(this.coordinador, 'perfil', persona.coordinador.perfil )      
                this.$set(this.coordinador, 'meta_votacion', persona.coordinador.meta_votacion )   
                
            },            
			selectProfesion(item){
				this.coordinador.profesione_id = item.value
				this.item = item
			}, 
            setPersona(){        

                this.coordinador_repetido = false        
                this.editar = false
                const persona = this.getPersona     

                // console.log(persona)
                if(persona.coordinador_encontrado || persona.lider_encontrado){
                    this.coordinador_repetido = true
                    this.tipoPersona = (persona.coordinador_encontrado)?'Coordinador':'Lider'
                    this.editar = (persona.coordinador_encontrado)?true:false
                    
                    this.setCoordinador(persona)
                    return   
                }
                this.$set(this.coordinador, 'id', persona.cedula)
                this.$set(this.coordinador, 'nombres', persona.nom1 + ' ' + persona.nom2)
                this.$set(this.coordinador, 'apellidos', persona.ape1 + ' ' + persona.ape2)
                this.$set(this.coordinador, 'fecha_nac', persona.fecha_nac )                
            },
            update(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                
                axios.put(`api/coordinadores/${this.coordinador.id}`, this.coordinador,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        this.loading = false
                        if(res.data.status === 'success'){
                            this.$refs['coordinadores'].hide()
                            this.$store.commit('deleteCoordinador', this.index)
                            this.$store.commit('setCoordinadores', res.data.coordinador)
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        this.loading = false
                        console.log('Error completo en UPDATE:', err)
                        
                    })
            },                      
			updateProfesioneid(item){
				this.coordinador.profesione_id = item.id
				this.item.value = item.id
				this.item.text = item.profesion
			},
            showDeleteConfirmation(){
                this.$refs['confirmDelete'].show()
            },
            cancelDelete(){
                this.$refs['confirmDelete'].hide()
            },
            confirmDelete(){
                this.deleting = true
                
                axios.delete(`api/coordinadores/${this.coordinador.id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        this.deleting = false
                        console.log('Respuesta de eliminación:', res.data)
                        this.deleteResponse = res.data
                        this.$refs['confirmDelete'].hide()
                        this.$refs['coordinadores'].hide()
                        this.$refs['deleteInfo'].show()
                        
                        // Eliminar del store
                        this.$store.commit('deleteCoordinador', this.index)
                    })
                    .catch(err => {
                        this.deleting = false
                        console.log('Error al eliminar:', err)
                        this.$refs['confirmDelete'].hide()
                        
                        if(err.response && err.response.data){
                            this.errorMessage = err.response.data.message || 'Error al eliminar el coordinador'
                        } else {
                            this.errorMessage = 'Error de conexión. Intente nuevamente.'
                        }
                        this.errors = true
                    })
            },
            closeDeleteInfo(){
                this.$refs['deleteInfo'].hide()
                this.deleteResponse = null
            },
        },
        computed:{
            getPersona(){                
                return this.$store.getters.getPersona
            }
        }
    }
</script>

<style scoped>
/* Estilos del modal */
:deep(.modal-header) {
    background: linear-gradient(135deg, #C60000 0%, #8B0000 100%);
    color: white;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
}

:deep(.modal-title) {
    font-weight: 600;
    font-size: 1.25rem;
}

:deep(.modal-content) {
    border: none;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

:deep(.modal-body) {
    padding: 2rem;
    background-color: #f8f9fa;
}

/* Estilos de formulario */
.row {
    margin: 0;
}

label {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    display: block;
}

.form-control {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #C60000;
    box-shadow: 0 0 0 0.2rem rgba(198, 0, 0, 0.15);
    outline: none;
}

/* Estilos de botones */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    margin-right: 0.5rem;
}

.btn-primary {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-warning {
    background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
    color: #212529;
    box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
}

.btn-warning:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
    color: #212529;
}

.btn-secondary {
    background: linear-gradient(135deg, #6c757d 0%, #545b62 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
    color: white;
}

.btn-danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
    color: white;
}

/* Estilos para las tarjetas de información */
.card {
    border: none;
    border-radius: 8px;
}

.card-body {
    padding: 1rem;
}

.btn-danger {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.btn-danger:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
    color: white;
}

/* Estilos para las tarjetas de información */
.card {
    border: none;
    border-radius: 8px;
}

.card-body {
    padding: 1rem;
}

/* Alerta de errores */
.alert-danger {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    color: #721c24;
    padding: 1rem;
    margin: 0;
}

/* Estilos para las tarjetas de información */
.card {
    border: none;
    border-radius: 8px;
}

.card-body {
    padding: 1rem;
}

/* Animación de entrada */
:deep(.modal.fade .modal-dialog) {
    transition: transform 0.4s ease-out;
}

/* Mensajes de error */
.error-message {
    color: #dc3545 !important;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.35rem;
    padding: 0.4rem 0.6rem;
    background-color: rgba(220, 53, 69, 0.1);
    border-left: 3px solid #dc3545;
    border-radius: 4px;
    display: block;
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Spinner de carga */
.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

.btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
    :deep(.modal-body) {
        padding: 1rem;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
</style>