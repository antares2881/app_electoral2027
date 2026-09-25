<template>
     <b-modal ref="candidatos" size="xl" hide-footer :title="title + ' Candidato'" @hidden="clearErrors">
        <div class="row">
            <div class="col-6 mb-3">
                <label for="corporacion">Aspiración</label>
                <model-select id="corporacion" :options="corporaciones" v-model="candidato.corporacione_id"></model-select>
                <div v-if="errores.corporacione_id" class="error-message">{{ errores.corporacione_id[0] }}</div>
            </div>
            <div class="col-6 mb-3">
                <label for="partido">Partido</label>
                <model-select id="partido" :options="partidos" v-model="candidato.partido_id"></model-select>
                <div v-if="errores.partido_id" class="error-message">{{ errores.partido_id[0] }}</div>
            </div>
            <div class="col-6 mb-3">
                <label for="nombres">Nombres aspirante</label>
                <input type="text" id="nombres" class="form-control" v-model="candidato.nombres">
                <div v-if="errores.nombres" class="error-message">{{ errores.nombres[0] }}</div>
            </div>
            <div class="col-3 mb-3">
                <label for="direccion">Direccion</label>
                <input type="text" id="direccion" class="form-control" v-model="candidato.direccion">
                <div v-if="errores.direccion" class="error-message">{{ errores.direccion[0] }}</div>
            </div>
            <div class="col-3 mb-3">
                <label for="telefono">Telefono</label>
                <input type="number" id="telefono" class="form-control" v-model.number="candidato.telefono">
                <div v-if="errores.telefono" class="error-message">{{ errores.telefono[0] }}</div>
            </div>
            
            <div class="col-6 mb-3">
                <label for="departamento">Departamento aspiración</label>
                <model-select id="departamento" :options="departamentos" v-model="candidato.departamento_id" @input="getMunicipios"></model-select>
                <div v-if="errores.departamento_id" class="error-message">{{ errores.departamento_id[0] }}</div>
            </div>
            <div class="col-6 mb-3">
                <label for="municipio">Municipio aspiración (Si aplica)</label>
                <model-select id="municipio" :options="municipios" v-model="candidato.municipio_id"></model-select>
                <div v-if="errores.municipio_id" class="error-message">{{ errores.municipio_id[0] }}</div>
            </div>
            <div class="col-6 mb-3">
                <label for="meta_votacion">Meta de votación</label>
                <input type="number" id="meta_votacion" class="form-control" v-model.number="candidato.meta_votacion">
                <div v-if="errores.meta_votacion" class="error-message">{{ errores.meta_votacion[0] }}</div>
            </div>
            <div class="col-12 my-3" v-if="errorMessage">
                <p class="alert alert-danger">{{ errorMessage }}</p>
            </div>
            <div class="col-12 my-3">
                <button class="btn btn-warning" v-if="edit" @click="update" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Actualizando...' : 'Actualizar' }}
                </button>
                <button class="btn btn-primary" v-else @click="create" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </div>
     </b-modal>
</template>
<script>
    import axios from 'axios'
    import { ModelSelect } from '../../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    export default{
        components:{
            ModelSelect
        },
        data(){
            return{
                candidato: {},
                corporaciones: [],
                departamentos: [],
                edit: false,
                errores: {},
                errorMessage: '',
                errors: false,
                index: null,
                loading: false,
                municipios: [],
                partidos: [],
                title: null
            }
        },
        mounted(){
            
        },
        methods:{
            create(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                
                axios.post(`api/candidatos`, this.candidato,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        this.loading = false
                        if(res.data.status === 'success'){
                            this.$refs['candidatos'].hide()
                            this.$store.commit('setCandidatos', res.data.candidato[0])
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
            editCandidato(candidato, index){
                this.index = index;
                this.clearErrors()
                this.getCorporaciones()
                this.getPartidos()
                this.getDepartamentos()
                this.title = 'Editar'
                this.candidato = Object.assign({}, candidato);
                this.$refs['candidatos'].show()
                this.edit = true
            },
            getCorporaciones(){
                this.corporaciones = []
                axios.get('api/corporaciones', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.corporaciones.length; i++) {
                            this.corporaciones.push({
                                text: res.data.corporaciones[i].corporacion,
                                value: res.data.corporaciones[i].id,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getDepartamentos(){
                this.departamentos = []
                axios.get('api/departamentos', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.departamentos.length; i++) {
                            this.departamentos.push({
                                text: res.data.departamentos[i].departamento,
                                value: res.data.departamentos[i].id,
                            })                            
                        }
                        this.getMunicipios()
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getMunicipios(){
                this.municipios = []
                axios.get(`api/municipios/${this.candidato.departamento_id}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.municipios.length; i++) {
                            this.municipios.push({
                                text: res.data.municipios[i].municipio,
                                value: res.data.municipios[i].id,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getPartidos(){
                this.partidos = []
                axios.get('api/partidos', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        for (let i = 0; i < res.data.partidos.length; i++) {
                            this.partidos.push({
                                text: res.data.partidos[i].partido,
                                value: res.data.partidos[i].id,
                            })                            
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            newCandidato(){
                this.candidato = {}
                this.edit = false
                this.clearErrors()
                this.getCorporaciones()
                this.getPartidos()
                this.getDepartamentos()
                this.title = 'Nuevo'
                this.$refs['candidatos'].show()
            },
            clearErrors(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
            },
            update(){
                this.errors = false
                this.errores = {}
                this.errorMessage = ''
                this.loading = true
                
                axios.put(`api/candidatos/${this.candidato.id}`, this.candidato,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        this.loading = false
                        if(res.data.status === 'success'){
                            this.$refs['candidatos'].hide()
                            this.$store.commit('deleteCandidato', this.index)
                            this.$store.commit('setCandidatos', res.data.candidato[0])
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        this.loading = false
                        console.log('Error completo en UPDATE:', err)                        
                    })
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

/* Alerta de errores */
.alert-danger {
    background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
    border: 1px solid #f5c6cb;
    border-radius: 8px;
    color: #721c24;
    padding: 1rem;
    margin: 0;
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

/* Mensajes de error */
.text-danger {
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
}

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

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.25rem;
    padding: 0.25rem 0.5rem;
    background-color: rgba(220, 53, 69, 0.1);
    border-left: 3px solid #dc3545;
    border-radius: 4px;
    display: block;
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