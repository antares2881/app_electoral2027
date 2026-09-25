
<template>
	<div v-if="!render">
		<Loading />
	</div>
	<div v-else>
        <div class="row">
            <div class="col-8">
                <Colombia v-if="isCorporacionSenado" />
				<Index v-else />
            </div>
            <div class="col-4">
				<!-- Tabla de departamentos con votantes y porcentajes -->
                <div class="tabla-departamentos">
                    <div v-if="loadingTabla" class="loader-container">
                        <div class="spinner"></div>
                        <p>Cargando datos...</p>
                    </div>
                    <table v-else>
                        <thead>
                            <tr>
                                <th>Departamento</th>
                                <th>Total Militantes</th>
                                <th>% Militantes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="departamento in departamentosOrdenados" :key="departamento.id">
                                <td>{{ departamento.nombre }}</td>
                                <td class="text-center">{{ departamento.votantes.toLocaleString() }}</td>
                                <td class="text-center">{{ departamento.porcentaje }}%</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td><strong>TOTAL</strong></td>
                                <td class="text-center"><strong>{{ totalVotantesDepartamentos.toLocaleString() }}</strong></td>
                                <td class="text-center"><strong>100%</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
	</div>
</template>

<script>

	// Bar chart for "Active Users" card.
	import CardBarChart from '../components/Cards/CardBarChart' ;

	import axios from 'axios'	

	
	import Loading from '../components/Loader/Loading.vue';
    import Colombia from '../components/Mapas/Colombia.vue';
	import Index from '@/components/Departamentos/Index.vue';

	export default ({
		components: {
			CardBarChart,
			Loading,
			Colombia,
			Index
		},
		data() {
			return {				
                candidato: {},
				coordinadores: [],
				divipoles: [],
				fecha_cumple: this.formatingDate(new Date()),
				lideres: [],
				metas: [],
				tableData: [],
				render: false,
				loadingTabla: true,
				totalcumple: 0,
				totalmetas: [],
				departamentosData: [],
				departamentosCache: null
			}
		},
		mounted() {	
            this.inicializarDatos();
		},
		methods: {
			async inicializarDatos() {
				try {
					// Ejecutar llamadas en paralelo para mejorar rendimiento
					await this.getCandidato();
					
					// Estas llamadas pueden ejecutarse en paralelo
					await Promise.all([
						this.getVotantesPorDepartamento(),
						this.getFechas()
					]);
					
					// Esto depende de getMetas
					await this.getMetas();
				} catch (error) {
					console.error('Error al inicializar datos:', error);
					this.render = true;
					this.loadingTabla = false;
				}
			},
			calcularPorcentaje(votantes, potencial){
				return (votantes/potencial).toFixed(2)
			},
            async getCandidato(){
                const res = await axios.get('/api/mi-candidato', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                this.candidato = res.data.candidato;
            },
			async getDivipoles(){

				const corporacion = this.$store.state.user.candidato[0].corporacione_id 
				const departamento = this.$store.state.user.candidato[0].departamento_id 
				const municipio = this.$store.state.user.candidato[0].municipio_id
				const candidato = this.$store.state.user.candidato_id
				const parametros = {
					'dpto': departamento,
					'mcpio': municipio,
					'corporacion': corporacion,
					'candidato': candidato
				}
				
				await axios.post('api/divipoles', parametros, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
					.then(res => {
						// console.log(res.data.divipoles)
						if(res.data.status === 'success'){
							for (let i = 0; i < res.data.divipoles.length; i++) {
								this.divipoles.push({
									departamento: res.data.divipoles[i].departamento,
									departamento_id: res.data.divipoles[i].departamento_id,
									municipio_id: (corporacion != 3 ) ? res.data.divipoles[i].municipio_id: '',
									municipio: (corporacion != 3 ) ? res.data.divipoles[i].municipio : '',
									zona: (corporacion != 3) ? res.data.divipoles[i].zona : '',
									puesto: (corporacion != 3) ? res.data.divipoles[i].puesto : '',
									nombre_puesto: (corporacion != 3) ? res.data.divipoles[i].nombre_puesto : '',
									mesas: res.data.divipoles[i].mesas,
									potencial: parseInt(res.data.divipoles[i].num_hombres) + parseInt(res.data.divipoles[i].num_mujeres),
									votantes: res.data.divipoles[i].votantes
								})								
							}

						}else{
							this.divipoles = []
						}
						this.render = true
					})
					.catch(err => {
						this.render = true
						console.log(err)
					})
			},
			async getFechas(){
				const fecha = this.fecha_cumple;
				this.lideres = [];
				this.coordinadores = [];
				
				const res = await axios.get(`/api/fecha_cumple/${fecha}`, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
				// console.log(res.data)
				this.lideres = res.data.lideres
				this.coordinadores = res.data.coordinadores
				this.totalcumple = this.lideres.length + this.coordinadores.length
				this.fechasEspeciales()
			},
			async getMetas(){
				let candidato = this.$store.state.user.candidato_id
				/* if(this.$store.state.user.candidato[0].corporacione_id !== 5){
					candidato = 0
				} */
				const params = {
					dpto: this.$store.state.user.candidato[0].departamento_id,
					mcpio: this.$store.state.user.candidato[0].municipio_id,
					candidato: candidato
				}
				// console.log(params)
				const resm = await axios.post('/api/metasvotantes', params,  {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})

				// console.log(resm.data)
				this.metas = resm.data.metas
				this.getDivipoles()
			},
			async getVotantesPorDepartamento() {
				try {
					// Verificar si hay datos en caché
					if (this.departamentosCache) {
						this.departamentosData = this.departamentosCache;
						this.loadingTabla = false;
						return;
					}
					
					const res = await axios.get('/api/votantesxdepartamento', {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					});
					
					const datosVotantes = (res.data && (
						res.data.votantes_por_departamento ||
						res.data.votantes_por_dpto ||
						res.data.votantes_por_departamentos ||
						[]
					));

					if (Array.isArray(datosVotantes)) {
						
						// Filtrar y procesar datos en una sola pasada
						const tempDepartamentosData = datosVotantes
							.filter(item => Number(item.votantes_confirmados ?? item.total_votantes ?? item.votantes ?? 0) > 0)
							.map(item => ({
								id: item.departamento_id,
								nombre: item.departamento,
								votantes: Number(item.votantes_confirmados ?? item.total_votantes ?? item.votantes ?? 0),
								porcentaje: 0
							}));

						// Calcular total y porcentajes
						const total = tempDepartamentosData.reduce((sum, d) => sum + d.votantes, 0);
						
						if (total > 0) {
							tempDepartamentosData.forEach(d => {
								d.porcentaje = ((d.votantes / total) * 100).toFixed(2);
							});
						}

						// Asignar al data y guardar en caché
						this.departamentosData = tempDepartamentosData;
						this.departamentosCache = tempDepartamentosData;
					}
				} catch (err) {
					console.error('Error al obtener votantes por departamento:', err);
				} finally {
					this.loadingTabla = false;
				}
			},
			fechasEspeciales(){
				const tableData = []
				for (let i = 0; i < this.lideres.length; i++) {
					tableData.push(
						{
							nombre: this.lideres[i].nombres+' '+this.lideres[i].apellidos,
							direccion: this.lideres[i].direccion,
							telefono: this.lideres[i].telefono,
							cargo: 'Lider',
						}
					)
				}
				for (let j = 0; j < this.coordinadores.length; j++) {
					tableData.push(
						{
							nombre: this.coordinadores[j].nombres+' '+this.coordinadores[j].apellidos,
							direccion: this.coordinadores[j].direccion,
							telefono: this.coordinadores[j].telefono,
							cargo: 'Coordinador',
						}
					)
				}
				this.tableData = tableData
			},
			formatingDate(dateToFormat){
				const d = new Date(dateToFormat);
				const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
				const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
				const year = d.getFullYear();
				return `${year}-${month}-${day}`
			},  
			historicoVotantes(item){
				this.$refs.modalHistorico.getHistoricoVotacion(item)
			},
			showChart(item){
				this.$refs.modalGrafico.getVotantesxCadidatos(item)
			}
		},
		computed: {
			// Validar si el candidato pertenece a la corporación 3 (Senado)
			isCorporacionSenado() {
				if (this.candidato && this.candidato.corporacione_id === 3) {
					return this.candidato.corporacione_id === 3;
				}

				this.$router.push({
                    name: 'Departamentos',
                    params: { id: this.candidato.departamento_id }
                }).then(() => {
                    console.log('Navegación exitosa a departamento:', this.candidato.departamento_id);
                }).catch(err => {
                    console.error('Error al navegar:', err);
                });
			},
			departamentosOrdenados() {
				// Ordenar departamentos por número de votantes (descendente)
				return this.departamentosData
					.filter(d => d.votantes > 0)
					.sort((a, b) => b.votantes - a.votantes);
			},
			totalVotantesDepartamentos() {
				return this.departamentosData.reduce((sum, d) => sum + d.votantes, 0);
			}
		},
	})

</script>
<style scoped>
	.b-icon.bi{
		cursor: pointer;
		
		font-size: 16pt;
		font-weight: bold;
	}
	.tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 600px;
    }
	.cumple{
		display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 200px;
	}

	/* Estilos para la tabla de departamentos */
	.tabla-departamentos {
		background: white;
		padding: 0;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		max-height: calc(100vh - 200px);
		overflow-y: auto;
	}

	.tabla-departamentos table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}

	.tabla-departamentos thead {
		position: sticky;
		top: 0;
		background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
		color: white;
		z-index: 1;
	}

	.tabla-departamentos th {
		padding: 10px 12px;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid #16a34a;
		white-space: nowrap;
	}

	.tabla-departamentos td {
		padding: 8px 12px;
		border-bottom: 1px solid #e5e7eb;
	}

	.tabla-departamentos tbody tr:hover {
		background-color: #f0fdf4;
	}

	.tabla-departamentos .text-center {
		text-align: center;
	}

	.tabla-departamentos tfoot {
		position: sticky;
		bottom: 0;
		background: white;
	}

	.tabla-departamentos .total-row {
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border-top: 2px solid #22c55e;
	}

	.tabla-departamentos .total-row td {
		padding: 12px;
		font-size: 14px;
		border-bottom: none;
	}

	/* Estilos para el loader de la tabla */
	.loader-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 40px;
	}

	.spinner {
		border: 4px solid #f3f4f6;
		border-top: 4px solid #22c55e;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
		margin-bottom: 15px;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.loader-container p {
		color: #6b7280;
		font-size: 14px;
		margin: 0;
	}
</style>