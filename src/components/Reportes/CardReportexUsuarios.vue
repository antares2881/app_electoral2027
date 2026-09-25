<template>
    <div>
        <div class="card-header">
            <h3 class="titulo-estadisticas">Estadísticas por Usuario</h3>
        </div>
        
        <div class="filtros-container">
            <div class="row align-items-end">
                <div class="col-12 col-md-4 mb-3">
                    <label for="user_id" class="form-label">Usuario</label>
                    <model-select :options="users" id="user_id" v-model="reporte.user_id" placeholder="Seleccione un usuario"></model-select>
                </div>
                <div class="col-12 col-md-3 mb-3">
                    <label for="fecha_inicial" class="form-label">Fecha inicial</label>
                    <input type="date" id="fecha_inicial" v-model="reporte.fecha_inicial" class="form-control">
                </div>
                <div class="col-12 col-md-3 mb-3">
                    <label for="fecha_final" class="form-label">Fecha final</label>
                    <input type="date" id="fecha_final" v-model="reporte.fecha_final" class="form-control">
                </div>
                <div class="col-12 col-md-2 mb-3">
                    <button class="btn btn-generar" @click="generarEstadisticas">
                        <span>Generar</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="contenido-resultados" v-if="loader">
            <loading />
        </div>
        <div class="contenido-resultados" v-else>
            <div class="row">
                <div class="col-12 col-lg-4 mb-4" v-if="resultados.length > 0">
                    <div class="tabla-card">
                        <h5 class="tabla-titulo">Resumen de Registros</h5>
                        <div class="table-responsive">
                            <table class="table tabla-estadisticas">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th class="text-center">Registros</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in resultados" :key="index">
                                        <td class="nombre-usuario">{{ item.name }}</td>
                                        <td class="text-center">
                                            <span class="badge-registros">{{ item.total }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-4 mb-4" v-else>
                    <div class="alert-sin-datos">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        <p>Sin datos para mostrar</p>
                        <small>Seleccione un usuario y rango de fechas</small>
                    </div>
                </div>
                <div class="col-12 col-lg-8" v-if="chartVisible">
                    <div class="chart-card">
                        <div class="text-center mb-4">
                            <div class="agrupacion-switch">
                                <label class="switch-label" :class="{ active: reporte.agrupacion === 1 }">
                                    <input 
                                        type="radio" 
                                        :value="1" 
                                        v-model="reporte.agrupacion" 
                                        @change="generarEstadisticas"
                                        class="switch-input"
                                    >
                                    <span class="switch-text">Puesto de votación</span>
                                </label>
                                <label class="switch-label" :class="{ active: reporte.agrupacion === 2 }">
                                    <input 
                                        type="radio" 
                                        :value="2" 
                                        v-model="reporte.agrupacion" 
                                        @change="generarEstadisticas"
                                        class="switch-input"
                                    >
                                    <span class="switch-text">Comunas</span>
                                </label>
                            </div>
                        </div>
                        <chart-bar :data="barChartData" :height="400" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import axios from 'axios';
    import {ModelSelect} from '../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    import Loading from '../Loader/Loading.vue';
    import ChartBar from '../Charts/ChartBar.vue';

    export default {
        components: {
            ModelSelect,
            Loading,
            ChartBar
        },
        data(){
            return{
                chartVisible: false,
                barChartData: null,
                loader: false,
                reporte: {user_id: -1, fecha_inicial: 0, fecha_final: 0, agrupacion: 1},
                resultados: [],
                users: []
            }
        },
        mounted(){
            this.getUsers();
        },
        methods: {
            generarEstadisticas(){

                this.loader = true;
                this.resultados = [];

                //Se realiza para que la fecha final se mantenga en el frontend
                const params = {
                    fecha_inicial: this.reporte.fecha_inicial,
                    fecha_final: this.sumarDias(this.reporte.fecha_final),
                    user_id: this.reporte.user_id,
                    agrupacion: this.reporte.agrupacion
                }

                axios.post('api/listadovotantes-usuarios', params, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if(res.data.resultado.length > 0){
                        this.resultados = res.data.resultado;
                        if(res.data.dataChart.length > 0){
                            this.setChart(res.data.dataChart);
                            this.chartVisible = true;
                        } else {
                            this.chartVisible = false;
                        }
                    }
                    this.loader = false;
                })
                .catch(err => {
                    this.loader = false;
                    console.log(err)
                })
            },
            getUsers(){
                axios.get('api/users', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    for (let i = 0; i < res.data.users.length; i++) {
                        if(res.data.users[i].role_id !== 1){                            
                            this.users.push({
                                text: res.data.users[i].name,
                                value: res.data.users[i].id
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            setChart(info){
                // console.log(info);
                
                const colores = [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
                    '#FF9F40', '#E74C3C', '#C9CBCF', '#3498DB', '#FF9F40',
                    '#2ECC71', '#F39C12', '#8B5CF6', '#EC4899', '#10B981',
                    '#F59E0B', '#EF4444', '#3B82F6', '#8B5A00', '#14B8A6',
                    '#F97316', '#06B6D4', '#84CC16', '#A855F7', '#F43F5E',
                    '#6366F1', '#22C55E', '#EAB308', '#D946EF', '#0EA5E9',
                    '#65A30D', '#DC2626', '#7C3AED', '#059669', '#CA8A04',
                    '#DB2777', '#2563EB', '#16A34A', '#EA580C', '#0284C7',
                    '#4D7C0F', '#BE123C', '#4F46E5', '#15803D', '#B45309',
                    '#9F1239', '#1D4ED8', '#166534', '#C2410C', '#075985'
                ];
                
                // Crear un dataset por cada puesto para que la leyenda muestre correctamente
                const datasets = info.map((item, index) => ({
                    label: this.reporte.agrupacion === 1 ? item.nombre_puesto : item.comuna,
                    backgroundColor: colores[index % colores.length],
                    borderWidth: 0,
                    borderSkipped: false,
                    borderRadius: 4,
                    data: [item.total_militantes],
                    maxBarThickness: 30,
                }));
                
                this.barChartData = {                
                    datasets: datasets,
                    labels: ['Militantes por Puesto']
                };
            },
            sumarDias(fecha){
                let new_fecha = new Date(fecha);
                new_fecha.setDate(new_fecha.getDate() + 1);
                return new_fecha;
            }
        }
    }
</script>
<style scoped>
    /* Header */
    .card-header {
        padding: 1.5rem;
        background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
        border-radius: 12px 12px 0 0;
        margin-bottom: 1.5rem;
        box-shadow: 0 4px 12px rgba(198, 0, 0, 0.2);
    }
    
    .titulo-estadisticas {
        color: white;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    /* Filtros */
    .filtros-container {
        padding: 1.5rem;
        background: #f8f9fa;
        border-radius: 12px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .form-label {
        font-weight: 600;
        color: #495057;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .form-control {
        border: 2px solid #e9ecef;
        border-radius: 8px;
        padding: 0.6rem 1rem;
        transition: all 0.3s ease;
        font-size: 0.95rem;
    }
    
    .form-control:focus {
        border-color: #4EB037;
        box-shadow: 0 0 0 0.2rem rgba(198, 0, 0, 0.1);
    }
    
    .btn-generar {
        width: 100%;
        height: 46px;
        background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
        border: none;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(198, 0, 0, 0.3);
    }
    
    .btn-generar:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(198, 0, 0, 0.4);
    }
    
    .btn-generar:active {
        transform: translateY(0);
    }
    
    /* Contenido */
    .contenido-resultados {
        min-height: 300px;
    }
    
    /* Tabla */
    .tabla-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        height: 100%;
    }
    
    .tabla-titulo {
        color: #2d3748;
        font-weight: 700;
        font-size: 1.1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 3px solid #4EB037;
    }
    
    .tabla-estadisticas {
        margin: 0;
    }
    
    .tabla-estadisticas thead th {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        color: #495057;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
        padding: 1rem;
        border: none;
    }
    
    .tabla-estadisticas tbody tr {
        transition: all 0.3s ease;
        border-bottom: 1px solid #f1f3f5;
    }
    
    .tabla-estadisticas tbody tr:hover {
        background-color: #f8f9fa;
        transform: scale(1.01);
    }
    
    .tabla-estadisticas tbody td {
        padding: 1rem;
        vertical-align: middle;
        color: #495057;
    }
    
    .nombre-usuario {
        font-weight: 600;
        color: #2d3748;
    }
    
    .badge-registros {
        display: inline-block;
        background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 700;
        font-size: 0.95rem;
        min-width: 60px;
        box-shadow: 0 2px 8px rgba(198, 0, 0, 0.25);
    }
    
    /* Sin datos */
    .alert-sin-datos {
        background: white;
        border-radius: 12px;
        padding: 3rem 2rem;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        color: #6c757d;
    }
    
    .alert-sin-datos svg {
        color: #4EB037;
        margin-bottom: 1rem;
        opacity: 0.7;
    }
    
    .alert-sin-datos p {
        font-size: 1.1rem;
        font-weight: 600;
        color: #495057;
        margin: 1rem 0 0.5rem;
    }
    
    .alert-sin-datos small {
        color: #868e96;
        font-size: 0.9rem;
    }
    
    /* Chart */
    .chart-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    /* Switch de agrupación */
    .agrupacion-switch {
        display: inline-flex;
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 0.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 2px solid #e9ecef;
    }
    
    .switch-label {
        position: relative;
        margin: 0;
        cursor: pointer;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-weight: 600;
        font-size: 0.95rem;
        color: #6c757d;
    }
    
    .switch-label:hover {
        color: #495057;
    }
    
    .switch-label.active {
        background: linear-gradient(135deg, #4EB037 0%, #0C9E4D 100%);
        color: white;
        box-shadow: 0 4px 12px rgba(198, 0, 0, 0.3);
    }
    
    .switch-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .switch-text {
        user-select: none;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .card-header {
            padding: 1rem;
        }
        
        .titulo-estadisticas {
            font-size: 1.25rem;
        }
        
        .filtros-container {
            padding: 1rem;
        }
        
        .tabla-card, .chart-card {
            margin-bottom: 1rem;
        }
    }
</style>