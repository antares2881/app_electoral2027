<template>
    <b-modal ref="lideres" size="xl" hide-footer :title="title + ' Lider'" @hidden="clearErrors">
        <div class="text-center" v-if="loader">
            <Loading />
        </div>
        <div class="row" v-else>
            <GestionProfesiones ref="profesiones" @profesion_id="updateProfesioneid" />
            <div class="col-md-12 mb-2" v-if="!editar">
                <label for="cedula">Cedula <b-icon icon="info-circle-fill" aria-hidden="true" v-b-tooltip.hover title="Presiona Enter para buscar datos de la cedula digitada"></b-icon></label>
                <Persona @setPersona="setPersona" />
            </div>
            <div class="col-12 my-2" v-if="lider_repetido">
                <p class="alert alert-danger"><strong>{{tipoPersona}}</strong></p>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="nombres">Nombres</label>
                <input type="text" id="nombres" class="form-control" v-model="lider.nombres">
                <div v-if="errores.nombres" class="error-message">{{ errores.nombres[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="apellidos">Apellidos</label>
                <input type="text" id="apellidos" class="form-control" v-model="lider.apellidos">
                <div v-if="errores.apellidos" class="error-message">{{ errores.apellidos[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="fecha_nac">Fecha Nac.</label>
                <input type="date" id="fecha_nac" class="form-control" v-model="lider.fecha_nac">
            </div>
            <!-- <div class="col-md-4 mb-2" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                <label for="tipo">Tipo de coordinador</label>
                <b-select :options="tipos" v-model="lider.tipo"></b-select>
            </div> -->
            <div class="col-lg-4 col-md-6 col-6 mb-2" v-if="!editar && $store.state.user.role_id !==5">
                <label for="esSublider">Es sublider ?</label>
                <b-select :options="opcionesSublider" v-model="lider.esSublider"></b-select>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2" v-if="lider.esSublider === 1 && !editar && $store.state.user.role_id !==6 && $store.state.user.role_id !==5">
                <label for="coordinador">Coordinador</label>
                <model-select
                    id="coordinador"
                    :options="coordinadores"
                    v-model="lider.coordinadore_id"
                ></model-select>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2" v-if="lider.esSublider !== 1 && !editar">
                <label for="lider">Lider</label>
                <model-select
                    id="lider"
                    :options="lideres"
                    v-model="lider.lidere_id"
                ></model-select>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="direccion">Direccion</label>
                <input type="text" class="form-control" id="direccion" v-model="lider.direccion">
                <div v-if="errores.direccion" class="error-message">{{ errores.direccion[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="telefono">Telefono</label>
                <input type="text" class="form-control" id="telefono" v-model="lider.telefono">
                <div v-if="errores.telefono" class="error-message">{{ errores.telefono[0] }}</div>
            </div>
            <div class="col-lg-4 col-md-6 col-6 mb-2">
                <label for="meta_votantes">Meta votantes</label>
                <input type="number" id="meta_votantes" class="form-control" v-model="lider.meta_votantes">
                <div v-if="errores.meta_votantes" class="error-message">{{ errores.meta_votantes[0] }}</div>
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
                    v-model="lider.profesione_id"
                ></model-select>
                <div v-if="errores.profesione_id" class="error-message">{{ errores.profesione_id[0] }}</div>
            </div>
            <div class="col-12 my-3" v-if="errorMessage">
                <p class="alert alert-danger">{{ errorMessage }}</p>
            </div>
            <div class="col-md-12 mt-3" v-if="coordinadores.length > 0 ">
                <button class="btn btn-warning mr-2" v-if="editar" @click="update" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Actualizando...' : 'Actualizar' }}
                </button>
                <button class="btn btn-primary mr-2" v-else @click="create" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
                <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
            </div>
        </div>
    </b-modal>
</template>
<script>
    import Persona from '../../Persona/Persona.vue'
    import GestionProfesiones from "../profesiones/GestionProfesiones.vue";
    import axios from 'axios';
    import { ModelSelect, BasicSelect } from '../../../../node_modules/vue-search-select/dist/VueSearchSelect.common';  
    import Loading from '../../Loader/Loading.vue'
import lider from '@/modules/lider';
    export default{
        components:{
            BasicSelect,
            GestionProfesiones,
            Loading,
            ModelSelect,
            Persona
        },
        data(){
            return{
                coordinadores: [],
                editar: false,
                errores: {},
                errorMessage: '',
                errors: false,
                index: null,
                loading: false,
                item: {
                    value: '',
                    text: ''
                },
                lider: {},
                lideres: [],
                lider_repetido: false,
                loader: false,
                opcionesSublider: [
                    {text: 'NO', value: 1},
                    {text: 'SI', value: 2}
                ],
                profesiones: [],
                subcoordinadores: [],
                tipoPersona: '',
                tipos: [
                    {text: 'Coordinador', value: 1},
                    {text: 'Sub Coordinador', value: 2}
                ],

                title: null
            }
        },
        mounted(){
            this.getProfesiones();
        },
        methods:{
            cancelar(){
                this.$refs['lideres'].hide()
            },
            create(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                this.lider.candidato_id = this.$store.state.user.candidato_id
                if(this.$store.state.user.role_id === 6 ){
                    this.lider.tipo = 1
                    this.lider.coordinadore_id = this.$store.state.user.id
                }
                if(this.$store.state.user.role_id === 5){
                    this.lider.esSublider = 2
                    this.lider.lidere_id = this.$store.state.user.id
                }
                axios.post(`api/lideres`, this.lider,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        if(res.data.status === 'success'){
                            this.$store.commit('setLideres', res.data.lideres[0])
                            /* if(this.$store.state.user.role_id === 8){
                                this.$emit('setLideres')
                            } */
                            this.$refs['lideres'].hide()
                        }else if(res.data.status === 'fail'){
                            this.lider_repetido = true
                            this.tipoPersona = res.data.error
                        }
                        else{
                            this.errores = res.data
                            this.errors = true
                        }
                        this.loading = false
                    })
                    .catch(err => {
                        this.loading = false
                        console.log('Error completo en CREATE:', err)
                        
                        if(err.response && err.response.data && err.response.status === 422){
                            this.errores = err.response.data.errors || {}
                        } else {
                            this.errorMessage = 'Error de conexión. Intente nuevamente.'
                        }
                        this.errors = true
                    })
            },
            editLider(item, index, tipo){    
                this.lider_repetido = false
                this.clearErrors()            
                this.lider = Object.assign({}, item)
                this.lider.esSublider = tipo;
                this.editar = true
                this.getCoordinadores();
                if(this.$store.state.user.role_id === 6){
                    this.lider.coordinadore_id = this.$store.state.user.id
                }
                this.index = index
                this.title = 'Editar'
                this.$refs['lideres'].show()
            },
            getCoordinadores(){
                this.coordinadores = []
                axios.get(`api/coordinadores/${this.$store.state.user.candidato_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.coordinadores.length; i++) {
                            this.coordinadores.push({
                                text: res.data.coordinadores[i].nombres + ' ' + res.data.coordinadores[i].apellidos,
                                value: res.data.coordinadores[i].id
                            })
                        }
                        this.getLideres();

                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getLideres(){
				this.lideres = []
				axios.get(`/api/lideres/${this.$store.state.user.candidato_id}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				.then(res => {
					// console.log(res.data)
					for (let i = 0; i < res.data.lideres.length; i++) {
						this.lideres.push({
							value: res.data.lideres[i].id,
							text: res.data.lideres[i].nombres + ' ' + res.data.lideres[i].apellidos,
						})						
					}
					// this.lideres = res.data.lideres
				})
				.catch(err => {
					console.log(err)
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
            newLider(){
                this.lider_repetido = false
                this.clearErrors()
                this.getCoordinadores();
                // this.getSubCoordinadores()
                this.title = 'Nuevo'
                this.lider = {esSublider: 1}
                this.editar = false
                this.$refs['lideres'].show()
                if(this.$store.state.user.role_id === 8){
                    this.lider.subcoordinadore_id = this.$store.state.user.id
                }else if(this.$store.state.user.role_id === 6){
                    this.lider.coordinadore_id = this.$store.state.user.id
                }
            },   
            
			newProfesion(){
                this.$refs.profesiones.newProfesion()

			},
			selectProfesion(item){
				this.lider.profesione_id = item.value
				this.item = item
			}, 
            setLider(persona){
                this.$set(this.lider, 'candidato', persona.lider.candidato.nombres)
                this.$set(this.lider, 'id', persona.lider.id)
                this.$set(this.lider, 'nombres', persona.lider.nombres )
                this.$set(this.lider, 'apellidos', persona.lider.apellidos )
                this.$set(this.lider, 'fecha_nac', persona.lider.fecha_nac )     
                this.$set(this.lider, 'edad', persona.lider.edad )     
                this.$set(this.lider, 'direccion', persona.lider.direccion)
                this.$set(this.lider, 'telefono', persona.lider.telefono)
                this.$set(this.lider, 'barrio', persona.lider.barrio)
                this.$set(this.lider, 'correo', persona.lider.correo )      
                this.$set(this.lider, 'observaciones', persona.lider.observaciones )      
                this.$set(this.lider, 'empleado', persona.lider.empleado )      
                this.$set(this.lider, 'perfil', persona.lider.perfil )      
                this.$set(this.lider, 'meta_votantes', persona.lider.meta_votantes )                   
                
                
            },
            setPersona(){
                this.lider_repetido = false
                this.editar = false
                const persona = this.getPersona

                if(parseInt(persona.estado) > 0){
                    this.$set(this.lider, 'observacione_id', 3)
                }else if(persona.dpto == this.$store.state.user.candidato.departamento_id && persona.mcpio == this.$store.state.user.candidato.municipio_id){
                    this.$set(this.lider, 'observacione_id', 1)
                }else{
                    this.$set(this.lider, 'observacione_id', 2)
                }

                this.$set(this.lider, 'id', persona.cedula)
                this.$set(this.lider, 'nombres', persona.nom1 + ' ' + persona.nom2)
                this.$set(this.lider, 'apellidos', persona.ape1 + ' ' + persona.ape2)
                this.$set(this.lider, 'fecha_nac', persona.fecha_nac )
                this.$set(this.lider, 'edad', persona.edad )
                this.$set(this.lider, 'id', persona.cedula)
                this.$set(this.lider, 'estado', persona.estado)
                this.$set(this.lider, 'departamento_id', persona.dpto)
                this.$set(this.lider, 'municipio_id', persona.mcpio)
                this.$set(this.lider, 'comuna', persona.comuna)
                this.$set(this.lider, 'zona', persona.zona)
                this.$set(this.lider, 'puesto', persona.puesto)
                this.$set(this.lider, 'nombre_puesto', persona.nombre_puesto)
                this.$set(this.lider, 'mesa', persona.mesa)
            },
            update(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                axios.put(`api/lideres/${this.lider.id}`, this.lider,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        //console.log(res.data)
                        if(res.data.status === 'success'){
                            this.$refs['lideres'].hide()
                            this.$store.commit('deleteLider', this.index)
                            this.$store.commit('setLideres', res.data.lideres[0])
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                        this.loading = false
                    })
                    .catch(err => {
                        this.loading = false
                        console.log('Error completo en UPDATE:', err)
                        
                        if(err.response && err.response.data && err.response.status === 422){
                            this.errores = err.response.data.errors || {}
                        } else {
                            this.errorMessage = 'Error de conexión. Intente nuevamente.'
                        }
                        this.errors = true
                    })
            },            
			updateProfesioneid(item){
				this.lider.profesione_id = item.id
				this.item.value = item.id
				this.item.text = item.profesion
			},
            clearErrors(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
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

/* Alerta de errores */
.alert-danger {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    color: #721c24;
    padding: 1rem;
    margin: 0;
    animation: fadeIn 0.3s ease-in;
}

/* Selectores personalizados */
:deep(.vue-search-select) {
    border: 2px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.3s ease;
}

:deep(.vue-search-select:focus-within) {
    border-color: #C60000;
    box-shadow: 0 0 0 0.2rem rgba(198, 0, 0, 0.15);
}

/* Animación de entrada */
:deep(.modal.fade .modal-dialog) {
    transition: transform 0.4s ease-out;
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

/* Iconos de profesión */
.bi-plus-square {
    cursor: pointer;
    color: #C60000;
    transition: all 0.2s ease;
}

.bi-plus-square:hover {
    color: #8B0000;
    transform: scale(1.1);
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
