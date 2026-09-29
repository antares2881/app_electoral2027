<template>
    <div class="general-wrapper">
        <div class="card-header">
            <h3 class="titulo-municipio">{{ titulo || nombreMunicipio }}</h3>
        </div>
        
        <div class="contenido">
            <!-- Tabla o visualización general de comunas con votantes -->
            <div v-if="data && data.length > 0" class="tabla-comunas">
                <section v-if="totalGrafico > 0" class="resumen-puestos" aria-labelledby="titulo-peso-puestos">
                    <div class="encabezado-grafico">
                        <h5 id="titulo-peso-puestos">Peso de los primeros {{ primerosPuestos.length }} puestos</h5>
                        <label class="selector-puestos">
                            Mostrar
                            <select v-model.number="cantidadPuestos" class="form-select form-select-sm">
                                <option v-for="cantidad in opcionesCantidad" :key="cantidad" :value="cantidad">{{ cantidad }} puestos</option>
                            </select>
                        </label>
                    </div>
                    <p class="escala-grafico">Porcentaje del total de votantes del municipio · Escala de 0 a 100 %</p>
                    <ol class="barras-puestos">
                        <li v-for="(puesto, index) in primerosPuestos" :key="index">
                            <span class="nombre-puesto">{{ index + 1 }}. {{ puesto.nombre_puesto || 'Puesto sin nombre' }}</span>
                            <div class="pista-barra" aria-hidden="true">
                                <div class="barra-puesto" :style="{ width: porcentajePuesto(puesto) + '%' }"></div>
                            </div>
                            <strong>{{ formatearPorcentaje(porcentajePuesto(puesto)) }}</strong>
                        </li>
                    </ol>
                    <p class="peso-total">Los primeros {{ primerosPuestos.length }} puestos suman el <strong>{{ formatearPorcentaje(pesoPrimeros) }}</strong> del total de votantes del municipio.</p>
                </section>
                <h5 class="mb-3">Militantes Registrados por Puesto</h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th v-if="municipioId === 1">Comuna</th>
                                <th>Puesto</th>
                                <th>Total Militantes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(comuna, index) in puestosOrdenados" :key="index">
                                <td v-if="municipioId === 1">{{comuna.comuna}}</td>
                                <td>{{comuna.nombre_puesto }}</td>
                                <td>
                                    <span class="badge badge-success">
                                        {{ formatearVotantes(comuna) }}
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
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-content">
                                    <h6>Total Militantes</h6>
                                    <h3>{{ calcularTotalVotantes() }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="alert alert-info">
                <i class="fas fa-info-circle mr-2"></i>
                No hay datos de votantes para este municipio
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MunicipiosGeneral',
    props: {
        titulo: {
            type: String,
            default: ''
        },
        municipioId: {
            type: [String, Number],
            required: true
        },
        data: {
            type: Array,
            default: () => []
        },
        departamentoId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            nombreMunicipio: '',
            cantidadPuestos: 5,
            municipios: {
                '1': 'Montería',
                '4': 'Ayapel',
                '7': 'Buenavista',
                '9': 'Canalete',
                '10': 'Cereté',
                '13': 'Ciénaga de Oro',
                '14': 'Cotorra',
                '16': 'Chimá',
                '19': 'Chinú',
                '20': 'La Apartada',
                '22': 'Lorica',
                '23': 'Los Córdobas',
                '24': 'Momil',
                '25': 'Montelíbano',
                '27': 'Moñitos',
                '28': 'Planeta Rica',
                '31': 'Pueblo Nuevo',
                '32': 'Puerto Escondido',
                '33': 'Puerto Libertador',
                '34': 'Purísima',
                '37': 'Sahagún',
                '40': 'San Andrés Sotavento',
                '43': 'San Antero',
                '46': 'San Bernardo del Viento',
                '49': 'San Carlos',
                '52': 'San Jose De Ure',
                '55': 'San Pelayo',
                '58': 'Tierralta',
                '60': 'Tuchín',
                '61': 'Valencia',
            }
        }
    },
    mounted() {
        this.obtenerNombreMunicipio();
    },
    watch: {
        opcionesCantidad(opciones) {
            if (!opciones.includes(this.cantidadPuestos)) {
                this.cantidadPuestos = opciones[opciones.length - 1];
            }
        },
        municipioId() {
            this.obtenerNombreMunicipio();
        }
    },
    computed: {
        opcionesCantidad() {
            return [5, 10, 15].filter(cantidad => cantidad === 5 || this.data.length >= cantidad);
        },
        totalGrafico() {
            return this.calcularTotalVotantes();
        },
        primerosPuestos() {
            return this.puestosOrdenados.slice(0, this.cantidadPuestos);
        },
        pesoPrimeros() {
            const suma = this.primerosPuestos.reduce((total, puesto) => total + this.obtenerVotantes(puesto), 0);
            return this.totalGrafico > 0 ? suma / this.totalGrafico * 100 : 0;
        },
        puestosOrdenados() {
            return [...this.data].sort((a, b) => this.obtenerVotantes(b) - this.obtenerVotantes(a));
        }
    },
    methods: {
        porcentajePuesto(puesto) {
            return this.totalGrafico > 0 ? this.obtenerVotantes(puesto) / this.totalGrafico * 100 : 0;
        },
        formatearPorcentaje(valor) {
            return `${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(valor)} %`;
        },
        obtenerNombreMunicipio() {
            this.nombreMunicipio = this.municipios[this.municipioId.toString()] || `Municipio ${this.municipioId}`;
        },
        obtenerVotantes(comuna) {
            if (comuna && comuna.votantes_confirmados !== undefined && comuna.votantes_confirmados !== null) {
                return Number(comuna.votantes_confirmados) || 0;
            }
            if (comuna && comuna.total_votantes !== undefined && comuna.total_votantes !== null) {
                return Number(comuna.total_votantes) || 0;
            }
            if (comuna && comuna.votantes !== undefined && comuna.votantes !== null) {
                return Number(comuna.votantes) || 0;
            }
            return 0;
        },
        formatearVotantes(comuna) {
            return this.obtenerVotantes(comuna).toLocaleString();
        },
        calcularTotalVotantes() {
            return this.data.reduce((total, comuna) => {
                const votantes = this.obtenerVotantes(comuna);
                return total + votantes;
            }, 0);
        }
    }
}
</script>

<style scoped>
.resumen-puestos {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f8faf9;
}
.encabezado-grafico {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
}
.selector-puestos { display: flex; align-items: center; gap: 0.5rem; margin: 0; }
.selector-puestos select { width: auto; }
.escala-grafico { color: #6b7280; font-size: 0.8rem; margin: 0.75rem 0; }
.barras-puestos { padding: 0; margin: 0; list-style: none; }
.barras-puestos li {
    display: grid;
    grid-template-columns: minmax(140px, 1fr) minmax(100px, 2fr) 80px;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem 0;
    font-size: 0.85rem;
}
.nombre-puesto { overflow-wrap: anywhere; }
.barras-puestos strong { text-align: right; }
.pista-barra { height: 18px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.barra-puesto { height: 100%; background: #198754; border-radius: 4px; transition: width 0.2s ease; }
@media (max-width: 575px) {
    .barras-puestos li { grid-template-columns: minmax(0, 1fr) 75px; gap: 0.35rem; }
    .nombre-puesto { grid-column: 1 / -1; }
}
.peso-total { margin: 1rem 0 0; color: #166534; }

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

.titulo-municipio {
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

.tabla-comunas h5 {
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
    padding: 0.6rem 0.875rem;
}

.table tbody tr {
    transition: all 0.2s ease;
}

.table tbody tr:hover {
    background-color: rgba(40, 167, 69, 0.05);
    transform: translateX(4px);
}

.table tbody td {
    padding: 0.45rem 0.875rem;
    vertical-align: middle;
}

.badge-success {
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.95), rgba(25, 135, 84, 0.95));
    padding: 0.3rem 0.75rem;
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
