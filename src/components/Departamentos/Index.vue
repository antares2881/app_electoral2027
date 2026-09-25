<template>
    <div class="departamentos-container">
        <!-- Loader -->
        <div v-if="cargando" class="loader-container">
            <div class="spinner"></div>
            <p class="loader-text">Cargando datos del departamento...</p>
        </div>
        
        <!-- Componentes de departamento -->
        <template v-else-if="departamentoId">
            <Cordoba v-if="departamentoId == 13" :data="datosVotantes" />
            <General v-else :departamentoId="Number(departamentoId)" :data="datosVotantes" />
        </template>
    </div>
</template>

<script>
import axios from 'axios';
import Cordoba from './Cordoba.vue';
import General from './General.vue';

export default {
    name: 'DepartamentosIndex',
    components: {
        Cordoba,
        General
    },
    data() {
        return {
            datosVotantes: [],
            departamentoId: null,
            cargando: false
        }
    },
    mounted() {
        console.log('Index.vue mounted, route params:', this.$route.params);
        this.departamentoId = this.$route.params.id;
        console.log('departamentoId asignado:', this.departamentoId);
        if (this.departamentoId) {
            this.votantesPorMunicipio();
        } else {
            console.warn('No se encontró departamentoId en los params');
        }
    },
    watch: {
        '$route.params.id'(newId) {
            console.log('Route params.id cambió a:', newId);
            this.departamentoId = newId;
            if (newId) {
                this.votantesPorMunicipio(); // Recargar datos cuando cambie el departamento
            }
        }
    },
    methods: {
        votantesPorMunicipio() {
            console.log('Llamando API para departamento:', this.departamentoId);
            this.cargando = true;
            axios.get(`/api/votantesxmunicipio/${this.departamentoId}`, {
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
.departamentos-container {
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