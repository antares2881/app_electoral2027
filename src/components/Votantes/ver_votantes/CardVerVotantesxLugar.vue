<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>

        <div v-if="data.length > 0" class="contenedor-principal">
            <VotantesxPuesto ref="votantesxpuesto" />
            
            <!-- Filtros -->
            <div class="filtros-container">
                <div class="filtro-item">
                    <label>Departamento:</label>
                    <input 
                        type="text" 
                        v-model="filtros.departamento" 
                        class="form-control" 
                        placeholder="Filtrar por departamento..."
                    />
                </div>
                <div class="filtro-item">
                    <label>Municipio:</label>
                    <input 
                        type="text" 
                        v-model="filtros.municipio" 
                        class="form-control" 
                        placeholder="Filtrar por municipio..."
                    />
                </div>
                <div class="filtro-item">
                    <label>Puesto:</label>
                    <input 
                        type="text" 
                        v-model="filtros.puesto" 
                        class="form-control" 
                        placeholder="Filtrar por puesto..."
                    />
                </div>
            </div>

            <div class="table-responsive tabla">
                <table class="table">
                    <thead>
                        <tr class="text-center">
                            <th @click="ordenarPor('departamento')" class="sortable">
                                Departamento 
                                <i class="fas" :class="getIconoOrden('departamento')"></i>
                            </th>
                            <th @click="ordenarPor('municipio')" class="sortable">
                                Municipio 
                                <i class="fas" :class="getIconoOrden('municipio')"></i>
                            </th>
                            <th @click="ordenarPor('lugar')" class="sortable">
                                Puesto 
                                <i class="fas" :class="getIconoOrden('lugar')"></i>
                            </th>
                            <th @click="ordenarPor('votantes')" class="sortable">
                                #Militantes 
                                <i class="fas" :class="getIconoOrden('votantes')"></i>
                            </th>
                            <th> </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in datosFiltradosYOrdenados" :key="index" class="text-center">
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.municipio }}</td>
                            <td>{{ item.lugar }}</td>
                            <td>{{ formatearNumero(item.votantes) }}</td>
                            <td>
                                <b-icon icon="search" title="Detalle" @click="showDetail(item)"></b-icon>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="text-center">
                            <th colspan="3">Total</th>
                            <th>{{ formatearNumero(totalVotantes) }}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div v-else>
            <p class="alert alert-info">La consulta no arrojo datos</p>
        </div>
    </div>
</template>
<script>
    import ChartBar from '../../Charts/ChartBar.vue'
    import axios from "axios"
    import VotantesxPuesto from './ModalVotantesxPuesto.vue'
    import Loading from '../../Loader/Loading.vue'
    export default {
        components:{
            ChartBar,
            Loading,
            VotantesxPuesto
        },
        props: ['data'],
        data() {
            return {
                barChartData: {
					labels: [],
					datasets: [{
						label: "",
						backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 205, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)','rgba(153, 102, 255, 0.2)','rgba(201, 203, 207, 0.2)'],                        
                        borderColor: ['rgb(255, 99, 132)','rgb(255, 159, 64)','rgb(255, 205, 86)','rgb(75, 192, 192)','rgb(54, 162, 235)','rgb(153, 102, 255)','rgb(201, 203, 207)'],
						borderWidth: 1,
						borderSkipped: false,
						borderRadius: 0,
						data: [],
						maxBarThickness: 20,
					}, ],
				},
                loader: true,
                render: false,
                filtros: {
                    departamento: '',
                    municipio: '',
                    puesto: ''
                },
                ordenActual: {
                    campo: 'departamento',
                    direccion: 'asc'
                },
                datosOrdenados: []
            }
        },
        mounted() {
            // console.log(this.data)
            this.ordenarDatosIniciales()
            this.setChart()
        },
        methods: {
            ordenarDatosIniciales(){
                // Ordenar alfabéticamente por departamento al inicio
                this.datosOrdenados = [...this.data].sort((a, b) => {
                    return a.departamento.localeCompare(b.departamento)
                })
            },
            ordenarPor(campo){
                // Si se hace clic en la misma columna, cambiar dirección
                if(this.ordenActual.campo === campo){
                    this.ordenActual.direccion = this.ordenActual.direccion === 'asc' ? 'desc' : 'asc'
                } else {
                    // Si es una nueva columna, ordenar ascendente
                    this.ordenActual.campo = campo
                    this.ordenActual.direccion = 'asc'
                }
            },
            getIconoOrden(campo){
                if(this.ordenActual.campo !== campo){
                    return 'fa-sort'
                }
                return this.ordenActual.direccion === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
            },
            formatearNumero(numero){
                return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            setChart(){
                for (let i = 0; i < this.data.length; i++) {
                    this.barChartData.labels.push(this.data[i].lugar)										
					this.barChartData.datasets[0].data.push(this.data[i].votantes)		        
                }
                this.render = true
                this.loader = false
            },
            showDetail(item){

                const divipol = {dpto: item.departamento_id, mcpio: item.municipio_id, zona: item.zona, puesto: item.puesto, candidato: this.$store.state.user.candidato_id}
                
                axios.post('/api/votantesxpuesto', divipol, {
						headers: {
							"Authorization": `Bearer ${this.$store.state.user.token}`
						}
					})
                    .then(res => {
                        console.log(res.data)
                        this.$refs.votantesxpuesto.verVotantes(res.data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        computed:{
            datosFiltradosYOrdenados(){
                // Primero filtrar
                let resultado = this.datosOrdenados.filter(item => {
                    const cumpleDepartamento = !this.filtros.departamento || 
                        item.departamento.toLowerCase().includes(this.filtros.departamento.toLowerCase())
                    
                    const cumpleMunicipio = !this.filtros.municipio || 
                        item.municipio.toLowerCase().includes(this.filtros.municipio.toLowerCase())
                    
                    const cumplePuesto = !this.filtros.puesto || 
                        item.lugar.toLowerCase().includes(this.filtros.puesto.toLowerCase())
                    
                    return cumpleDepartamento && cumpleMunicipio && cumplePuesto
                })

                // Luego ordenar según el campo actual
                resultado.sort((a, b) => {
                    let valorA = a[this.ordenActual.campo]
                    let valorB = b[this.ordenActual.campo]

                    // Si es número, comparar numéricamente
                    if(this.ordenActual.campo === 'votantes'){
                        valorA = Number(valorA)
                        valorB = Number(valorB)
                        return this.ordenActual.direccion === 'asc' ? valorA - valorB : valorB - valorA
                    }

                    // Si es texto, comparar alfabéticamente
                    if(this.ordenActual.direccion === 'asc'){
                        return valorA.localeCompare(valorB)
                    } else {
                        return valorB.localeCompare(valorA)
                    }
                })

                return resultado
            },
            totalVotantes(){
                return this.datosFiltradosYOrdenados.reduce((a, b) => a + b.votantes, 0)
            }
        }
    }
</script>
<style scoped>
    .contenedor-principal {
        padding: 20px;
        width: 100%;
    }

    /* Contenedor de filtros */
    .filtros-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-bottom: 20px;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .filtro-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .filtro-item label {
        font-weight: 600;
        color: #374151;
        font-size: 13px;
    }

    .filtro-item input.form-control {
        border: 2px solid #22c55e;
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 14px;
        transition: all 0.3s ease;
    }

    .filtro-item input.form-control:focus {
        outline: none;
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    /* Estilos de la tabla */
    .tabla {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 0;
        display: block;
        overflow-x: auto;
        overflow-y: auto;
        max-height: 500px;
        position: relative;
    }

    .table {
        width: 100%;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 14px;
    }

    .table thead {
        position: sticky;
        top: 0;
        z-index: 20;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .table thead th {
        color: white !important;
        font-weight: 600;
        padding: 14px 15px;
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 0.5px;
        border: none;
        background: transparent;
    }

    .table thead th:first-child {
        border-top-left-radius: 12px;
    }

    .table thead th:last-child {
        border-top-right-radius: 12px;
    }

    .table thead th.sortable {
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
    }

    .table thead th.sortable:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .table thead th i {
        margin-left: 5px;
        font-size: 12px;
    }

    .table tbody tr {
        transition: all 0.2s ease;
        background: white;
    }

    .table tbody tr:hover {
        background: #f0fdf4;
        transform: scale(1.002);
    }

    .table tbody td {
        padding: 12px 15px;
        border-bottom: 1px solid #e5e7eb;
        vertical-align: middle;
        color: #374151;
    }

    .table tfoot {
        position: sticky;
        bottom: 0;
        background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
        font-weight: 600;
        border-top: 3px solid #22c55e;
        z-index: 15;
        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
    }

    .table tfoot th {
        padding: 14px 15px;
        border: none;
        color: #166534;
        font-size: 15px;
        background: inherit;
    }

    .table tfoot th:first-child {
        border-bottom-left-radius: 12px;
    }

    .table tfoot th:last-child {
        border-bottom-right-radius: 12px;
    }

    .b-icon.bi{
        color: #22c55e;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s ease;
    }

    .b-icon.bi:hover {
        color: #16a34a;
        transform: scale(1.2);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .filtros-container {
            grid-template-columns: 1fr;
            padding: 15px;
        }

        .tabla {
            max-height: 400px;
            padding: 0;
        }

        .table {
            font-size: 12px;
        }

        .table thead th,
        .table tbody td,
        .table tfoot th {
            padding: 8px 10px;
        }
    }
</style>