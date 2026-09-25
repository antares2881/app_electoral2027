<template>
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <h1 class="text-center mb-4 text-primary">Consulta votante</h1>
                        
                        <div class="mb-3">
                            <label for="cedula" class="form-label fw-bold">No. Cédula</label>
                            <input 
                                type="number" 
                                id="cedula"
                                class="form-control form-control-lg" 
                                v-model="cedula"
                                placeholder="Ingrese el número de cédula"
                                :disabled="loading"
                            >
                        </div>
                        
                        <div class="d-grid">
                            <button 
                                class="btn btn-lg" 
                                :class="showVotante ? 'btn-primary' : 'btn-success'"
                                @click="handleConsulta"
                                :disabled="loading || !cedula"
                            >
                                <span v-if="!loading">
                                    <i :class="showVotante ? 'fas fa-sync-alt me-2' : 'fas fa-search me-2'"></i>
                                    {{ showVotante ? 'Nueva búsqueda' : 'Consultar' }}
                                </span>
                                <span v-else>
                                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Consultando...
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div class="row justify-content-center mt-4" v-if="noResults">
            <div class="col-md-8">
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>No se encontraron resultados</strong>
                    <p class="mb-0 mt-2">No se encontró información para la cédula ingresada. Por favor, verifique el número e intente nuevamente.</p>
                    <button type="button" class="btn-close" @click="noResults = false" aria-label="Close"></button>
                </div>
            </div>
        </div>

        <!-- Resultados -->
        <div class="row justify-content-center mt-4" v-if="showVotante">
            <div class="col-md-8">
                <div class="card p-3 shadow-sm">
                    <h3 class="mb-3 text-primary">Censo</h3>
                    <p><strong>Departamento:</strong> {{departamento}}</p>
                    <p><strong>Municipio:</strong> {{municipio}}</p>
                    <p><strong>Puesto:</strong> {{votante.nombre_puesto}}</p>
                    <p><strong>Mesa:</strong> {{votante.mesa}}</p>
                </div>
                <div class="row">
                    <!-- <div class="col-md-6">
                        <div class="card p-3 shadow-sm">
                            <h3 class="mb-3 text-primary">Resultados</h3>
                            <p><strong>Nombres:</strong> {{votante.nombres}}</p>
                            <p><strong>Apellidos:</strong> {{votante.apellidos}}</p>
                            <p><strong>Estado:</strong> <span :class="(votante.estado == '0' || votante.estado == '00') ? 'text-success' : 'text-danger'">{{(votante.estado == '0' || votante.estado == '00') ? 'Vigente' : 'No vigente'}}</span></p>
                        </div>
                    </div> -->
                    
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    border-radius: 15px;
}

.form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn-success {
    background: linear-gradient(135deg, #28a745 0%, #218838 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s;
}

.btn-success:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-primary {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-success:disabled,
.btn-primary:disabled {
    background: #6c757d;
    cursor: not-allowed;
}

.alert {
    border-radius: 10px;
}

h1 {
    font-weight: 700;
}

.card.shadow-sm {
    border-radius: 10px;
    transition: transform 0.2s;
}

.card.shadow-sm:hover {
    transform: translateY(-5px);
}
</style>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                apiKey: 'S3CUR32025',
                cedula: null,
                departamento: null,
                municipio: null,
                showVotante: false,
                noResults: false,
                loading: false,
                votante: {}
            }
        },
        mounted() {
            // this.getVotante()
        },
        methods: {
            handleConsulta() {
                if (this.showVotante) {
                    // Si ya hay resultados, limpiar todo para nueva búsqueda
                    this.limpiarBusqueda();
                } else {
                    // Si no hay resultados, realizar la consulta
                    this.getVotante();
                }
            },
            limpiarBusqueda() {
                this.showVotante = false;
                this.noResults = false;
                this.votante = {};
                this.departamento = null;
                this.municipio = null;
                this.cedula = null;
            },
            getDepartamento(id){
                axios.get(`/departamentos/${id}`)
                .then(res => {
                    console.log(res.data)
                    this.departamento = res.data.departamento.departamento
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getMunicipio(departamento_id, id){
                axios.get(`/get_municipio/${departamento_id}/${id}`)
                .then(res => {
                    console.log(res.data)
                    this.municipio = res.data.municipio.municipio
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getVotante(){
                this.loading = true;
                this.showVotante = false;
                this.noResults = false;
                this.votante = {};
                
				axios.get(`https://apiserver.convexosit.co/personas?id=${encodeURIComponent(this.cedula)}`, {
					headers: {
						"Content-Type": "application/json",
                        "api_key": this.apiKey
					}
				})
				.then(res => {
					// console.log(res.data)
					if(res.data.datosPersona.length > 0){
						this.votante.nombres = res.data.datosPersona[0].nom1+' '+res.data.datosPersona[0].nom2
						this.votante.apellidos = res.data.datosPersona[0].ape1+' '+res.data.datosPersona[0].ape2
						this.votante.estado = res.data.datosPersona[0].estado
						this.votante.fecha_nac = res.data.datosPersona[0].fecha_nac;
						if(parseInt(this.votante.estado) > 0){
							this.votante.observacione_id = 3
							this.msnestado = res.data.datosPersona[0].desc_estado
							this.cedValida = false
						}
					}else{
						this.msnPersona = true
					}
					if(res.data.lugar.length > 0){
						this.votante.departamento_id = parseInt(res.data.lugar[0].cod_dpto)
                        this.getDepartamento(this.votante.departamento_id)
						this.votante.municipio_id = parseInt(res.data.lugar[0].cod_mcpio)
                        this.getMunicipio(this.votante.departamento_id, this.votante.municipio_id)
						this.votante.zona = res.data.lugar[0].zona
						this.votante.puesto = res.data.lugar[0].puesto
						this.votante.nombre_puesto = res.data.lugar[0].nombre_puesto
						this.votante.mesa = res.data.lugar[0].mesa
						this.votante.comuna = res.data.lugar[0].comuna

						//Valida si el lugar de votación del votante, para corporacion senado cualquier colombiano es apto para votar, si es corporación camara debe validar si el votante esta inscrito en el departamento de la eleccion.

						if(this.$store.state.user.candidato[0].corporacione_id === 1){
							if(this.votante.departamento_id == this.$store.state.user.candidato[0].departamento_id){
								this.votante.observacione_id = 1;
							}else{
								this.votante.observacione_id = 2
							}
						}else if(this.$store.state.user.candidato[0].corporacione_id === 3){
							this.votante.observacione_id = 1;
						}else{
							this.votante.observacione_id = 5;
						}

						// Opciones para elecciones locales

						/* if(this.votante.departamento_id == this.$store.state.user.candidato[0].departamento_id && this.votante.municipio_id == this.$store.state.user.candidato[0].municipio_id){
							this.votante.observacione_id = 1
						}else{
							this.votante.observacione_id = 2
						} */

					}else{
						this.msnLugar = true
						this.votante.observacione_id = 5
					}
					this.showForm = true
                    
                    // Verificar si encontró datos válidos
                    if(res.data.lugar.length > 0){
                        this.showVotante = true
                    } else {
                        this.noResults = true
                    }
                    this.loading = false
				})
				.catch(err => {
					console.log(err)
                    this.noResults = true
                    this.loading = false
				})
			},
        },
    }
</script>