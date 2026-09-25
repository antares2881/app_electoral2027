<template>
    <div class="municipios-container">
        <!-- Loader -->
        <div v-if="cargando" class="loader-container">
            <div class="spinner"></div>
            <p class="loader-text">Cargando datos del municipio...</p>
        </div>
        
        <!-- Componentes de municipio -->
        <template v-else-if="municipioId">
            
            <General
                :municipioId="Number(municipioId)" 
                :data="datosVotantes"
                :departamentoId="Number(departamentoId)"
            />
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Monteria from './Monteria.vue';
import General from './General.vue';

export default {
    name: 'MunicipiosIndex',
    components: {
        Monteria,
        General
    },
    data() {
        return {
            datosVotantes: [],
            municipioId: null,
            departamentoId: null,
            cargando: false
        }
    },
    mounted() {
        // console.log('Municipios Index.vue mounted, route params:', this.$route.params);
        // console.log('Route query:', this.$route.query);
        this.municipioId = this.$route.params.id;
        this.departamentoId = this.$route.query.departamento_id;
        console.log('municipioId asignado:', this.municipioId);
        console.log('departamentoId asignado:', this.departamentoId);
        if (this.municipioId) {
            this.votantesPorMunicipio();
        } else {
            console.warn('No se encontró municipioId en los params');
        }
    },
    watch: {
        '$route.params.id'(newId) {
            console.log('Route params.id cambió a:', newId);
            this.municipioId = newId;
            if (newId) {
                this.votantesPorMunicipio(); // Recargar datos cuando cambie el municipio
            }
        },
        '$route.query.departamento_id'(newDptoId) {
            console.log('Route query.departamento_id cambió a:', newDptoId);
            this.departamentoId = newDptoId;
        }
    },
    methods: {
        votantesPorMunicipio() {
            console.log('Llamando API para municipio:', this.municipioId);
            this.cargando = true;
            axios.get(`/api/votantesxmcpio/${this.departamentoId}/${this.municipioId}`, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
            .then(response => {
                console.log('Datos recibidos de votantes por municipio:', response.data);
                this.datosVotantes = response.data.votantes_por_municipio;
                console.log('datosVotantes asignados:', this.datosVotantes);
            })
            .catch(error => {
                console.error('Error al obtener votantes por municipio:', error);
            })
            .finally(() => {
                this.cargando = false;
            });
        }
    }
}
</script>

<style scoped>
.municipios-container {
    width: 100%;
    height: 100%;
    max-height: calc(100vh - 120px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Loader */
.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
    gap: 1.5rem;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(40, 167, 69, 0.2);
    border-top: 4px solid rgba(40, 167, 69, 0.9);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loader-text {
    color: #495057;
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}
</style>
