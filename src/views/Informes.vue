<template>
    <div v-if="loader">
        <Loading />
    </div>
    <div v-else class="informes-container">
        <div class="informes-header">
            <h1 class="informes-title">Votacion Córdoba (Congresistas electos)</h1>
            
            <div class="filters-row">
                <!-- Selección de informe -->
                <div class="selector-container">
                    <label class="selector-label">Seleccione un informe:</label>
                    <a-select
                        v-model="selectedInforme"
                        placeholder="Seleccione un informe"
                        class="informes-select"
                        :options="opciones"
                        size="large"
                    />
                </div>

                <!-- Selección de tipo de reporte -->
                <div class="selector-container">
                    <label class="selector-label">Tipo de reporte:</label>
                    <a-select
                        v-model="tipoReporte"
                        placeholder="Seleccione tipo"
                        class="informes-select"
                        :options="tiposReporte"
                        size="large"
                    />
                </div>

                <!-- Selección de región (solo si tipoReporte es 'regiones') -->
                <div class="selector-container" v-if="tipoReporte === 'regiones'">
                    <label class="selector-label">Región:</label>
                    <a-select
                        v-model="selectedRegion"
                        placeholder="Seleccione región"
                        class="informes-select"
                        :options="regionesOpciones"
                        size="large"
                        :loading="loadingRegiones"
                    />
                </div>

                <!-- Botón de búsqueda -->
                <a-button 
                    type="primary" 
                    size="large"
                    class="btn-buscar"
                    @click="buscarReporte"
                    :disabled="!puedeRealizarBusqueda"
                >
                    🔍 Buscar
                </a-button>
            </div>
        </div>

        <div class="informes-content" v-if="mostrarResultados">
            <Cordoba 
                v-if="tipoReporte === 'municipios'" 
                ref="cordobaComponent"
                :corporacion="parseInt(selectedInforme)" 
            />
            <Regiones 
                v-if="tipoReporte === 'regiones'" 
                ref="regionesComponent"
                :regionSeleccionada="selectedRegion"
                :corporacion="parseInt(selectedInforme)" 
            />
        </div>
        <div class="informes-empty" v-else>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M36 12a12 12 0 00-12 12v72a12 12 0 0012 12h48a12 12 0 0012-12V42.828a12 12 0 00-3.515-8.485L67.657 9.515A12 12 0 0059.172 6H36zm12 60a6 6 0 10-12 0v12a6 6 0 1012 0V72zm12-18a6 6 0 016 6v24a6 6 0 11-12 0V60a6 6 0 016-6zm24-6a6 6 0 10-12 0v36a6 6 0 1012 0V48z" fill="#E5E7EB"/>
            </svg>
            <p class="empty-text">Seleccione las opciones y haga clic en "Buscar" para visualizar los datos</p>
        </div>
    </div>
</template>
<script>
    import Loading from '@/components/Loader/Loading.vue';
    import Cordoba from '@/components/Mapas/Cordoba.vue';
    import Regiones from '@/components/Mapas/Regiones.vue';
    // import axios from 'axios'; // Comentado temporalmente

    export default {
        components: {
            Loading, 
            Cordoba,
            Regiones
        },
        data(){
            return{
                loader: true,
                opciones: [
                    { label: 'Senado 2022', value: '1' },
                    { label: 'Camara 2022', value: '2' },
                ],
                selectedInforme: null,
                tiposReporte: [
                    { label: 'Municipios', value: 'municipios' },
                    { label: 'Regiones', value: 'regiones' }
                ],
                tipoReporte: null,
                regiones: [],
                regionesOpciones: [],
                selectedRegion: null,
                loadingRegiones: false,
                mostrarResultados: false
            }
        },
        computed: {
            puedeRealizarBusqueda() {
                // Validar si se puede realizar la búsqueda
                if (!this.selectedInforme || !this.tipoReporte) {
                    return false;
                }
                // Si es tipo regiones, debe tener región seleccionada
                if (this.tipoReporte === 'regiones' && !this.selectedRegion) {
                    return false;
                }
                return true;
            }
        },
        mounted(){
            // Restaurar el informe seleccionado desde localStorage
            const informeGuardado = localStorage.getItem('selectedInforme');
            if (informeGuardado) {
                this.selectedInforme = informeGuardado;
            }

            const tipoReporteGuardado = localStorage.getItem('tipoReporte');
            if (tipoReporteGuardado) {
                this.tipoReporte = tipoReporteGuardado;
            }

            const regionGuardada = localStorage.getItem('selectedRegion');
            if (regionGuardada) {
                this.selectedRegion = regionGuardada;
            }

            const mostrarResultadosGuardado = localStorage.getItem('mostrarResultados');
            if (mostrarResultadosGuardado === 'true') {
                this.mostrarResultados = true;
            }
            
            // Cargar regiones al montar el componente
            this.obtenerRegiones();

            setTimeout(() => {
                this.loader = false;
                
                // Después de cargar, verificar si debe mostrar resultados automáticamente
                this.$nextTick(() => {
                    this.verificarEstadoCompleto();
                });
            }, 1000);
        },
        watch: {
            selectedInforme(newValue) {
                // Guardar en localStorage cuando cambia la selección
                if (newValue) {
                    localStorage.setItem('selectedInforme', newValue);
                } else {
                    localStorage.removeItem('selectedInforme');
                }
            },
            tipoReporte(newValue) {
                if (newValue) {
                    localStorage.setItem('tipoReporte', newValue);
                } else {
                    localStorage.removeItem('tipoReporte');
                }
                // Solo resetear si es un cambio manual del usuario (no durante la carga inicial)
                if (this.loader === false) {
                    this.mostrarResultados = false;
                    localStorage.removeItem('mostrarResultados');
                }
            },
            selectedRegion(newValue) {
                if (newValue) {
                    localStorage.setItem('selectedRegion', newValue);
                } else {
                    localStorage.removeItem('selectedRegion');
                }
            }
        },
        methods: {
            async obtenerRegiones() {
                this.loadingRegiones = true;
                try {
                    // Por ahora usamos datos de prueba hasta que la API esté disponible
                    // const response = await axios.get('/api/regiones');
                    // this.regiones = response.data.regiones;
                    
                    // Regiones reales de Córdoba
                    this.regiones = [
                        { id: 1, nombre: 'Alto Sinú' },
                        { id: 2, nombre: 'Bajo Sinú' },
                        { id: 3, nombre: 'Medio Sinú' },
                        { id: 4, nombre: 'San Jorge' },
                        { id: 5, nombre: 'Costanera' },
                        { id: 6, nombre: 'Sabanas' }
                    ];
                    
                    // Mapear regiones a opciones para el select
                    this.regionesOpciones = this.regiones.map(region => ({
                        label: region.nombre || region.region || region.name || `Región ${region.id}`,
                        value: String(region.id || region.codigo || region.value)
                    }));
                } catch (error) {
                    console.error('Error al obtener regiones:', error);
                    // Datos de respaldo en caso de error
                    this.regionesOpciones = [
                        { label: 'Alto Sinú', value: '1' },
                        { label: 'Bajo Sinú', value: '2' },
                        { label: 'Medio Sinú', value: '3' },
                        { label: 'San Jorge', value: '4' },
                        { label: 'Costanera', value: '5' },
                        { label: 'Sabanas', value: '6' }
                    ];
                } finally {
                    this.loadingRegiones = false;
                }
            },
            buscarReporte() {
                if (!this.puedeRealizarBusqueda) {
                    return;
                }
                
                this.mostrarResultados = true;
                localStorage.setItem('mostrarResultados', 'true');
                
                // Esperar a que el componente se renderice y luego emitir el evento
                this.$nextTick(() => {
                    if (this.tipoReporte === 'municipios' && this.$refs.cordobaComponent) {
                        // Emitir evento al componente Cordoba
                        this.$refs.cordobaComponent.getVotacionPorMunicipios();
                    } else if (this.tipoReporte === 'regiones' && this.$refs.regionesComponent) {
                        // Emitir evento al componente Regiones
                        this.$refs.regionesComponent.cargarDatosRegion();
                    }
                });
            },
            
            verificarEstadoCompleto() {
                // Verificar si se puede mostrar resultados automáticamente al regresar
                if (this.selectedInforme && this.tipoReporte) {
                    // Si es municipios y ya había hecho búsqueda
                    if (this.tipoReporte === 'municipios') {
                        const resultadosGuardados = localStorage.getItem('mostrarResultados');
                        if (resultadosGuardados === 'true') {
                            this.mostrarResultados = true;
                        }
                    }
                    // Si es regiones y tiene región seleccionada
                    else if (this.tipoReporte === 'regiones' && this.selectedRegion) {
                        const resultadosGuardados = localStorage.getItem('mostrarResultados');
                        if (resultadosGuardados === 'true') {
                            this.mostrarResultados = true;
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
.informes-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    padding: 24px;
}

.informes-header {
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.informes-title {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 24px 0;
    letter-spacing: -0.5px;
}

.filters-row {
    display: flex;
    align-items: flex-end;
    gap: 16px;
    flex-wrap: wrap;
}

.selector-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.selector-label {
    font-size: 16px;
    font-weight: 500;
    color: #4b5563;
    white-space: nowrap;
}

.informes-select {
    width: 280px;
}

.informes-select :deep(.ant-select-selector) {
    border-radius: 8px !important;
    border: 2px solid #e5e7eb !important;
    transition: all 0.3s ease;
}

.informes-select :deep(.ant-select-selector:hover) {
    border-color: #3b82f6 !important;
}

.informes-select :deep(.ant-select-focused .ant-select-selector) {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.btn-buscar {
    height: 40px;
    padding: 0 32px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.btn-buscar:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(59, 130, 246, 0.4);
}

.btn-buscar:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
}

.informes-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    animation: fadeIn 0.4s ease;
}

.informes-empty {
    background: white;
    border-radius: 16px;
    padding: 80px 32px;
    text-align: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.empty-text {
    font-size: 18px;
    color: #9ca3af;
    margin: 0;
    font-weight: 500;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .informes-container {
        padding: 16px;
    }

    .informes-header {
        padding: 24px 20px;
    }

    .informes-title {
        font-size: 20px;
        margin-bottom: 20px;
    }

    .filters-row {
        flex-direction: column;
        align-items: stretch;
    }

    .selector-container {
        width: 100%;
    }

    .informes-select {
        width: 100%;
    }

    .btn-buscar {
        width: 100%;
    }

    .informes-content {
        padding: 16px;
    }

    .informes-empty {
        padding: 60px 20px;
    }

    .empty-text {
        font-size: 16px;
    }
}
</style>