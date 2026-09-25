<template>
    <div class="general-wrapper">
        <div class="card-header">
            <h3 class="titulo-departamento">{{ nombreDepartamento }}</h3>
        </div>
        
        <div class="contenido">
            <!-- Tabla o visualización general de municipios con votantes -->
            <div v-if="data && data.length > 0" class="tabla-municipios">
                <h5 class="mb-3">Municipios con Votantes Registrados</h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Municipio</th>
                                <th>Total Votantes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="municipio in data" :key="municipio.municipio_id || municipio.id">
                                <td>{{ municipio.municipio || `Municipio ${municipio.municipio_id || municipio.id}` }}</td>
                                <td>
                                    <span class="badge badge-success">
                                        {{ formatearVotantes(municipio) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- Resumen -->
                <div class="resumen mt-4">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-building"></i>
                                </div>
                                <div class="stat-content">
                                    <h6>Total Municipios</h6>
                                    <h3>{{ data.length }}</h3>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="stat-card">
                                <div class="stat-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-content">
                                    <h6>Total Votantes</h6>
                                    <h3>{{ calcularTotalVotantes() }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="alert alert-info">
                <i class="fas fa-info-circle mr-2"></i>
                No hay datos de votantes para este departamento
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'General',
    props: {
        departamentoId: {
            type: [String, Number],
            required: true
        },
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            nombreDepartamento: '',
            departamentos: {
                '1': 'Antioquia',
                '3': 'Atlántico',
                '5': 'Bolívar',
                '7': 'Boyacá',
                '9': 'Caldas',
                '11': 'Cauca',
                '12': 'Cesar',
                '13': 'Córdoba',
                '15': 'Cundinamarca',
                '16': 'Bogotá D.C.',
                '17': 'Chocó',
                '19': 'Huila',
                '21': 'Magdalena',
                '23': 'Nariño',
                '24': 'Risaralda',
                '25': 'Norte de Santander',
                '26': 'Quindío',
                '27': 'Santander',
                '28': 'Sucre',
                '29': 'Tolima',
                '31': 'Valle del Cauca',
                '40': 'Arauca',
                '44': 'Caquetá',
                '46': 'Casanare',
                '48': 'La Guajira',
                '50': 'Guainia',
                '52': 'Meta',
                '54': 'Guaviare',
                '56': 'San Andres y Providencia',
                '60': 'Amazonas',
                '64': 'Putumayo',
                '68': 'Vaupes',
                '72': 'Vichada',
                '88': 'Consulados',
            }
        }
    },
    mounted() {
        this.obtenerNombreDepartamento();
    },
    watch: {
        departamentoId() {
            this.obtenerNombreDepartamento();
        }
    },
    methods: {
        obtenerNombreDepartamento() {
            this.nombreDepartamento = this.departamentos[this.departamentoId.toString()] || `Departamento ${this.departamentoId}`;
        },
        valorVotantes(municipio) {
            if (municipio && municipio.votantes_confirmados !== undefined && municipio.votantes_confirmados !== null) {
                return Number(municipio.votantes_confirmados) || 0;
            }
            if (municipio && municipio.total_votantes !== undefined && municipio.total_votantes !== null) {
                return Number(municipio.total_votantes) || 0;
            }
            if (municipio && municipio.votantes !== undefined && municipio.votantes !== null) {
                return Number(municipio.votantes) || 0;
            }
            return 0;
        },
        formatearVotantes(municipio) {
            return this.valorVotantes(municipio).toLocaleString();
        },
        calcularTotalVotantes() {
            return this.data.reduce((total, municipio) => {
                const votantes = this.valorVotantes(municipio);
                return total + votantes;
            }, 0);
        }
    }
}
</script>

<style scoped>
.general-wrapper {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 120px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.card-header {
    flex-shrink: 0;
    padding: 1.5rem;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.95), rgba(25, 135, 84, 0.95));
    border-radius: 12px 12px 0 0;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.titulo-departamento {
    color: white;
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    letter-spacing: 0.5px;
}

.contenido {
    flex: 1;
    padding: 1.5rem;
    background: #ffffff;
    border-radius: 0 0 12px 12px;
    overflow-y: auto;
}

.tabla-municipios h5 {
    color: #495057;
    font-weight: 600;
    margin-bottom: 1rem;
}

.table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.table thead th {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(25, 135, 84, 0.1));
    color: #198754;
    font-weight: 600;
    border-bottom: 2px solid #28a745;
    padding: 1rem;
}

.table tbody tr {
    transition: all 0.2s ease;
}

.table tbody tr:hover {
    background-color: rgba(40, 167, 69, 0.05);
    transform: translateX(4px);
}

.table tbody td {
    padding: 0.875rem 1rem;
    vertical-align: middle;
}

.badge-success {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.95), rgba(25, 135, 84, 0.95));
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    border-radius: 20px;
}

.resumen {
    margin-top: 2rem;
}

.stat-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.stat-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.95), rgba(25, 135, 84, 0.95));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.stat-content h6 {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-content h3 {
    margin: 0.5rem 0 0 0;
    color: #198754;
    font-size: 2rem;
    font-weight: 700;
}

.alert-info {
    background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
    border: 1px solid #bee5eb;
    border-radius: 8px;
    padding: 1.5rem;
    color: #0c5460;
}

.alert-info i {
    font-size: 1.2rem;
    vertical-align: middle;
}
</style>
