<template>
    <div class="monteria-wrapper">
        <!-- Tooltip -->
        <div 
            v-if="tooltip.visible" 
            class="mapa-tooltip"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
            <div class="tooltip-titulo">{{ tooltip.titulo }}</div>
            <div class="tooltip-votantes">Votantes: {{ tooltip.votantes.toLocaleString() }}</div>
        </div>
        
        <div class="card-header">
            <h3 class="titulo-municipio">Montería</h3>
        </div>
        
        <div class="contenido">
            <div class="mapa-container">
                <!-- Aquí se agregará el SVG de Montería cuando esté disponible -->
                <div class="svg-placeholder">
                    
                </div>
            </div>
            
            <!-- Tabla de comunas con votantes y porcentajes -->
            <div class="tabla-comunas">
                <table>
                    <thead>
                        <tr>
                            <th>Comuna</th>
                            <th>Total Votantes</th>
                            <th>% Votación</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="comuna in comunasOrdenadas" :key="comuna.id">
                            <td>{{ comuna.nombre }}</td>
                            <td class="text-center">{{ comuna.votantes.toLocaleString() }}</td>
                            <td class="text-center">{{ comuna.porcentaje }}%</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="total-row">
                            <td><strong>TOTAL</strong></td>
                            <td class="text-center"><strong>{{ totalVotantes.toLocaleString() }}</strong></td>
                            <td class="text-center"><strong>100%</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Monteria',
    props: {
        data: {
            type: Array,
            default: () => []
        },
        departamentoId: {
            type: [String, Number],
            default: null
        },
        municipioId: {
            type: [String, Number],
            default: null
        }
    },
    data() {
        return {
            tooltip: {
                visible: false,
                x: 0,
                y: 0,
                titulo: '',
                votantes: 0
            },
            comunasData: []
        };
    },
    computed: {
        comunasOrdenadas() {
            // Ordenar comunas por número de votantes (descendente)
            return this.comunasData
                .filter(c => c.votantes > 0)
                .sort((a, b) => b.votantes - a.votantes);
        },
        totalVotantes() {
            return this.comunasData.reduce((sum, c) => sum + c.votantes, 0);
        }
    },
    watch: {
        data: {
            handler() {
                this.$nextTick(() => {
                    this.pintarComunas();
                });
            },
            deep: true
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.pintarComunas();
        });
    },
    methods: {
        obtenerTotalVotantes(item) {
            if (item && item.votantes_confirmados !== undefined && item.votantes_confirmados !== null) {
                return Number(item.votantes_confirmados) || 0;
            }
            if (item && item.total_votantes !== undefined && item.total_votantes !== null) {
                return Number(item.total_votantes) || 0;
            }
            if (item && item.votantes !== undefined && item.votantes !== null) {
                return Number(item.votantes) || 0;
            }
            return 0;
        },
        pintarComunas() {
            const paths = document.querySelectorAll('svg path[id]');
            
            // Array temporal para almacenar datos de comunas
            const tempComunasData = [];

            if (paths.length > 0) {
                // Si hay SVG, procesar los paths
                paths.forEach(path => {
                    const comunaId = path.id;
                    const votante = this.data.find(v => v.comuna_id === parseInt(comunaId));
                    const totalVotantes = this.obtenerTotalVotantes(votante);

                    if (votante && totalVotantes > 0) {
                        // Comunas con votantes
                        path.style.fill = '#a8e6a3'; // Verde suave
                        path.style.stroke = '#FFFFFF';
                        path.style.strokeWidth = '1';
                        
                        // Agregar clase para hover
                        path.classList.add('comuna-con-votantes');
                        
                        // Guardar datos de la comuna
                        tempComunasData.push({
                            id: comunaId,
                            nombre: votante.comuna,
                            votantes: totalVotantes,
                            porcentaje: 0
                        });
                        
                        // Agregar eventos de mouse
                        path.addEventListener('mouseenter', (e) => {
                            this.mostrarTooltip(e, totalVotantes, votante.comuna);
                        });

                        path.addEventListener('mousemove', (e) => {
                            this.actualizarPosicionTooltip(e);
                        });

                        path.addEventListener('mouseleave', () => {
                            this.ocultarTooltip();
                        });
                    } else {
                        // Comunas sin votantes - gris
                        path.style.fill = '#808080';
                        path.style.stroke = '#FFFFFF';
                        path.style.strokeWidth = '0.5';
                        
                        // Agregar clase para hover rojo
                        path.classList.add('comuna-sin-votantes');
                    }
                });
            } else {
                // Si no hay SVG, solo procesar los datos para la tabla
                this.data.forEach(item => {
                    const totalVotantes = this.obtenerTotalVotantes(item);
                    if (totalVotantes > 0) {
                        tempComunasData.push({
                            id: item.comuna_id,
                            nombre: item.comuna,
                            votantes: totalVotantes,
                            porcentaje: 0
                        });
                    }
                });
            }
            
            // Calcular total de votantes
            const total = tempComunasData.reduce((sum, c) => sum + c.votantes, 0);
            
            // Calcular porcentajes
            tempComunasData.forEach(c => {
                c.porcentaje = total > 0 ? ((c.votantes / total) * 100).toFixed(2) : 0;
            });
            
            // Asignar al data
            this.comunasData = tempComunasData;
        },
        
        mostrarTooltip(event, votantes, comuna) {
            this.tooltip.titulo = comuna;
            this.tooltip.votantes = votantes;
            this.tooltip.visible = true;
            this.actualizarPosicionTooltip(event);
        },
        
        actualizarPosicionTooltip(event) {
            this.tooltip.x = event.clientX + 15;
            this.tooltip.y = event.clientY + 15;
        },
        
        ocultarTooltip() {
            this.tooltip.visible = false;
        }
    }
}
</script>

<style scoped>
/* Contenedor principal sin scroll */
.monteria-wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.contenido {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1.5rem;
    overflow: hidden;
    min-height: 0;
}

.mapa-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
    height: 100%;
}

/* Placeholder temporal para el SVG */
.svg-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    border: 2px dashed #dee2e6;
}

.svg-placeholder p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #6c757d;
    margin: 0.5rem 0;
}

.placeholder-text {
    font-size: 1rem !important;
    font-weight: 400 !important;
    color: #adb5bd !important;
}

/* SVG que se ajusta sin scroll */
.svg-image {
    max-width: 100%;
    max-height: 100%;
    height: auto;
    width: auto;
    object-fit: contain;
    display: block;
}

/* Estilos para los paths del mapa */
.svg-image path[id] {
    cursor: pointer;
    transition: fill 0.3s ease, stroke-width 0.2s ease, filter 0.2s ease;
}

/* Estilos específicos para comunas con votantes */
.mapa-container svg path.comuna-con-votantes {
    fill: #a8e6a3 !important;
    stroke: #ffffff !important;
    stroke-width: 1 !important;
}

.mapa-container svg path.comuna-con-votantes:hover {
    fill: #85d47f !important;
    stroke-width: 2 !important;
    filter: brightness(1.1) drop-shadow(0 0 3px rgba(168, 230, 163, 0.6));
}

/* Estilos específicos para comunas sin votantes */
.mapa-container svg path.comuna-sin-votantes {
    fill: #808080 !important;
    stroke: #ffffff !important;
    stroke-width: 0.5 !important;
}

.mapa-container svg path.comuna-sin-votantes:hover {
    fill: #C60000 !important;
    stroke-width: 2 !important;
    filter: brightness(1.1) drop-shadow(0 0 3px rgba(198, 0, 0, 0.6));
}

/* Estilos para la tabla de comunas */
.tabla-comunas {
    flex-shrink: 0;
    background: white;
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    max-height: 100%;
    overflow-y: auto;
    width: 380px;
    min-width: 380px;
    align-self: stretch;
}

.tabla-comunas table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.tabla-comunas thead {
    position: sticky;
    top: 0;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    z-index: 1;
}

.tabla-comunas th {
    padding: 10px 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #16a34a;
    white-space: nowrap;
}

.tabla-comunas td {
    padding: 8px 12px;
    border-bottom: 1px solid #e5e7eb;
}

.tabla-comunas tbody tr:hover {
    background-color: #f0fdf4;
}

.tabla-comunas .text-center {
    text-align: center;
}

.tabla-comunas tfoot {
    position: sticky;
    bottom: 0;
    background: white;
}

.tabla-comunas .total-row {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-top: 2px solid #22c55e;
}

.tabla-comunas .total-row td {
    padding: 12px;
    font-size: 14px;
    border-bottom: none;
}

/* Tooltip */
.mapa-tooltip {
    position: fixed;
    background: linear-gradient(135deg, rgba(40, 167, 69, 0.98), rgba(25, 135, 84, 0.98));
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 10000;
    font-size: 0.9rem;
    min-width: 180px;
}

.tooltip-titulo {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: #ffffff;
}

.tooltip-votantes {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
}
</style>
