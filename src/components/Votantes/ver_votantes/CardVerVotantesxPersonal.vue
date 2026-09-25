<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else>
        <div v-if="data.length > 0" class="contenedor-principal" :class="{'tabla-completa': !mostrarGrafico}">
            <div class="contenedor-tabla">
                <div class="mb-3">
                    <input 
                        type="text" 
                        v-model="filtro" 
                        class="form-control" 
                        placeholder="Buscar por nombre del lider/coordinador..."
                    />
                </div>
                <div class="tabla-wrapper">
                    <table class="table">
                        <thead>
                            <tr class="text-center">
                                <th>Item</th>
                                <th>{{ (data[0].opcion == 2)?'Lider':'Coordinador' }}</th>
                                <th>Meta</th>
                                <th>#Ingresados</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in datosFiltrados" :key="index" class="text-center">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                <td>{{ formatearNumero(item.meta_votantes) }}</td>
                                <td>{{ formatearNumero(item.votantes) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="text-center">
                                <td></td>
                                <th>Total</th>
                                <th>{{ formatearNumero(totalProyectado) }}</th>
                                <th>{{ formatearNumero(totalVotantes) }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>        
            <div class="contenedor-grafico" v-if="render && mostrarGrafico">
                <button @click="abrirModal" class="btn-ver-grafico">
                    <i class="fas fa-chart-pie"></i> Ver Gráfico Completo
                </button>
                <div class="grafico-preview">
                    <chart-pie :height="280" :data="barChartData"></chart-pie>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="alert alert-info">La consulta no arrojo datos</p>
        </div>

        <!-- Modal para gráfico grande -->
        <div v-if="mostrarModal" class="modal-overlay" @click="cerrarModal">
            <div class="modal-contenido" @click.stop>
                <button @click="cerrarModal" class="btn-cerrar">
                    <i class="fas fa-times"></i>
                </button>
                <h3 class="modal-titulo">{{ (data[0].opcion == 2)?'Distribución por Lider':'Distribución por Coordinador' }}</h3>
                <div class="modal-grafico">
                    <chart-pie :height="500" :data="barChartData"></chart-pie>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ChartPie from '../../Charts/ChartPie.vue' ;
    import Loading from '../../Loader/Loading.vue'
    export default {        
        components:{
            ChartPie,
            Loading
        },
        props: ['data'],
        data() {
            return {
                barChartData: {
					labels: [],
					datasets: [
                        {
                            label: "",
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                            ],
                            borderWidth: 5,
                            borderSkipped: false,
                            borderRadius: 0,
                            data: [],
                            maxBarThickness: 20,
                            spacing: 2,
                        }, 
                    ],
				},
                loader: true,
                render: false,
                filtro: '',
                datosOrdenados: [],
                mostrarModal: false
            }
        },
        mounted() {
            console.log(this.data)
            this.ordenarDatos()
            this.setChart()
        },        
        methods:{
            ordenarDatos(){
                // Ordenar los datos por número de votantes de mayor a menor
                this.datosOrdenados = [...this.data].sort((a, b) => b.votantes - a.votantes)
            },
            setChart(){
                for (let i = 0; i < this.datosOrdenados.length; i++) {
                    this.barChartData.labels.push(this.datosOrdenados[i].nombres)										
					this.barChartData.datasets[0].data.push(this.datosOrdenados[i].votantes)		        
                }
                this.render = true
                this.loader = false
            },
            formatearNumero(numero){
                return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            abrirModal(){
                this.mostrarModal = true
                document.body.style.overflow = 'hidden'
            },
            cerrarModal(){
                this.mostrarModal = false
                document.body.style.overflow = 'auto'
            }
        },
        computed:{
            mostrarGrafico(){
                return this.data.length > 0 && this.data[0].opcion === 1
            },
            datosFiltrados(){
                if (!this.filtro) {
                    return this.datosOrdenados
                }
                const filtroLower = this.filtro.toLowerCase()
                return this.datosOrdenados.filter(item => {
                    const nombreCompleto = `${item.nombres} ${item.apellidos}`.toLowerCase()
                    return nombreCompleto.includes(filtroLower)
                })
            },
            totalProyectado(){
                return this.datosFiltrados.reduce((a, b) => a + b.meta_votantes, 0)
            },
            totalVotantes(){
                return this.datosFiltrados.reduce((a, b) => a + b.votantes, 0)
            },
        }
    }
</script>
<style scoped>
    /* Contenedor principal */
    .contenedor-principal {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 20px;
        width: 100%;
        padding: 20px;
    }

    /* Cuando no hay gráfico, la tabla ocupa todo el ancho */
    .contenedor-principal.tabla-completa {
        grid-template-columns: 1fr;
    }

    /* Contenedor de tabla - Ocupa todo el ancho disponible */
    .contenedor-tabla {
        width: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }

    /* Estilos del buscador */
    .mb-3 input.form-control {
        border: 2px solid #22c55e;
        border-radius: 8px;
        padding: 12px 15px;
        font-size: 14px;
        transition: all 0.3s ease;
        width: 100%;
    }

    .mb-3 input.form-control:focus {
        outline: none;
        border-color: #16a34a;
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    /* Wrapper de tabla con scroll */
    .tabla-wrapper {
        width: 100%;
        overflow-x: auto;
        overflow-y: auto;
        max-height: 500px;
        margin-top: 15px;
    }

    /* Estilos de la tabla */
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
        z-index: 10;
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
        border-top-left-radius: 8px;
    }

    .table thead th:last-child {
        border-top-right-radius: 8px;
    }

    .table tbody tr {
        transition: all 0.2s ease;
        background: white;
    }

    .table tbody tr:hover {
        background: #f0fdf4;
        transform: scale(1.005);
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
    }

    .table tfoot th,
    .table tfoot td {
        padding: 14px 15px;
        border: none;
        color: #166534;
        font-size: 15px;
    }

    /* Contenedor del gráfico */
    .contenedor-grafico {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .grafico-preview {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Botón para ver gráfico */
    .btn-ver-grafico {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    }

    .btn-ver-grafico:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
    }

    .btn-ver-grafico:active {
        transform: translateY(0);
    }

    /* Modal */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-contenido {
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 1200px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-titulo {
        margin: 0 0 20px 0;
        color: #166534;
        font-size: 24px;
        font-weight: 700;
        text-align: center;
    }

    .modal-grafico {
        width: 100%;
        min-height: 500px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-cerrar {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #ef4444;
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }

    .btn-cerrar:hover {
        background: #dc2626;
        transform: rotate(90deg);
    }

    /* Alerta de sin datos */
    .alert-info {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 20px;
        font-size: 16px;
        color: #1e40af;
        text-align: center;
        margin: 20px;
    }

    /* Responsive para pantallas menores a 992px */
    @media (max-width: 992px) {
        .contenedor-principal {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 15px;
        }

        .contenedor-tabla {
            padding: 15px;
        }

        .tabla-wrapper {
            max-height: 400px;
        }

        .table {
            font-size: 13px;
        }

        .table thead th,
        .table tbody td,
        .table tfoot th,
        .table tfoot td {
            padding: 10px 8px;
        }

        .mb-3 input.form-control {
            font-size: 13px;
            padding: 10px 12px;
        }

        .contenedor-grafico {
            padding: 15px;
        }

        .modal-contenido {
            padding: 20px;
            max-width: 95%;
        }

        .modal-titulo {
            font-size: 20px;
        }

        .modal-grafico {
            min-height: 400px;
        }
    }

    /* Responsive para móviles (menor a 576px) */
    @media (max-width: 576px) {
        .contenedor-principal {
            padding: 10px;
        }

        .contenedor-tabla {
            padding: 10px;
        }

        .tabla-wrapper {
            max-height: 350px;
        }

        .table {
            font-size: 11px;
        }

        .table thead th {
            font-size: 10px;
            padding: 8px 5px;
        }

        .table tbody td,
        .table tfoot th,
        .table tfoot td {
            padding: 8px 5px;
        }

        .mb-3 input.form-control {
            font-size: 12px;
            padding: 8px 10px;
        }

        .contenedor-grafico {
            padding: 10px;
        }

        .btn-ver-grafico {
            font-size: 12px;
            padding: 10px 15px;
        }

        .modal-contenido {
            padding: 15px;
        }

        .modal-titulo {
            font-size: 18px;
        }

        .modal-grafico {
            min-height: 300px;
        }

        .btn-cerrar {
            width: 35px;
            height: 35px;
            font-size: 16px;
        }
    }
</style>