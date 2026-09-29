<template>    
    <a-card :bordered="false" class="header-solid h-full personal-admin" :bodyStyle="{padding: 0,}">
        <template #title>
            <GestionCoordinadores ref="gestionCoordinadores"></GestionCoordinadores>
            <div v-if="loader">
                <Loading />
            </div>
            <div v-else>
                <div class="personal-cabecera">
                    <div>
                        <h3>Gestión de coordinadores</h3>
                    </div>
                    <div>
                        <button class="btn btn-dark" @click="newCoordinador">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                <path d="M10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0Z" fill="currentColor"/>
                                <path d="M10 10C4.47715 10 0 14.4772 0 20H20C20 14.4772 15.5228 10 10 10Z" fill="currentColor"/>
                                <path d="M16 3H18V5H20V7H18V9H16V7H14V5H16V3Z" fill="currentColor"/>
                            </svg>
                            Nuevo coordinador
                        </button>
                    </div>
                </div>
                
                <!-- Campo de búsqueda -->
                <div class="row personal-busqueda">
                    <div class="col-md-6">
                        <div class="search-container">
                            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input 
                                type="text" 
                                class="form-control search-input" 
                                placeholder="Buscar por identificación o nombre..." 
                                v-model="searchQuery"
                                @input="onSearch"
                            >
                            <button 
                                v-if="searchQuery" 
                                class="clear-search" 
                                @click="clearSearch"
                                type="button"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="search-results-info" v-if="searchQuery">
                            <small class="text-muted">
                                Mostrando {{ filteredCoordinadores.length }} de {{ $store.state.coordinadores.length }} coordinadores
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="table-responsive tabla" >
                    <table class="table">
                        <thead>
                            <tr>
                                <th class="sortable" @click="sort('id')">
                                    Identificación
                                    <span class="sort-icons">
                                        <svg v-if="sortKey === 'id' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14L12 9L17 14H7Z"/>
                                        </svg>
                                        <svg v-else-if="sortKey === 'id' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10L12 15L17 10H7Z"/>
                                        </svg>
                                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                            <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                        </svg>
                                    </span>
                                </th>
                                <th class="sortable" @click="sort('nombres')">
                                    Nombres
                                    <span class="sort-icons">
                                        <svg v-if="sortKey === 'nombres' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14L12 9L17 14H7Z"/>
                                        </svg>
                                        <svg v-else-if="sortKey === 'nombres' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10L12 15L17 10H7Z"/>
                                        </svg>
                                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                            <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                        </svg>
                                    </span>
                                </th>
                                <th>Datos personales</th>
                                <th class="sortable" @click="sort('meta_votacion')">
                                    Meta votación
                                    <span class="sort-icons">
                                        <svg v-if="sortKey === 'meta_votacion' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14L12 9L17 14H7Z"/>
                                        </svg>
                                        <svg v-else-if="sortKey === 'meta_votacion' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10L12 15L17 10H7Z"/>
                                        </svg>
                                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                            <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                        </svg>
                                    </span>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="filteredAndSortedCoordinadores.length === 0 && searchQuery">
                                <tr class="no-results">
                                    <td colspan="5" class="text-center py-4">
                                        <div class="text-muted">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-2">
                                                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <p class="mb-1">No se encontraron coordinadores</p>
                                            <small>Intenta con otros términos de búsqueda</small>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-for="(item, index) in filteredAndSortedCoordinadores" :key="index">
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                    <td>{{ item.direccion }} / {{ item.barrio }} <br> {{ item.telefono }}</td>
                                    <td>{{ item.meta_votacion }}</td>
                                    <td>
                                        <b-icon icon="pencil-square" aria-hidden="true" @click="editCoordinador(item, index)"></b-icon>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr class="table-footer">
                                <td colspan="3" class="text-end font-weight-bold">
                                    <strong>Total Meta Votación:</strong>
                                </td>
                                <td class="font-weight-bold text-primary">
                                    <strong>{{ totalMetaVotacion.toLocaleString() }}</strong>
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios';
    import GestionCoordinadores from '../Config/coordinador/GestionCoordinadores.vue';
    import Loading from '../Loader/Loading.vue'
    export default{
        components:{
            GestionCoordinadores,
            Loading
        },
        data(){
            return{
                loader: false,
                searchQuery: '',
                sortKey: '',
                sortOrder: 'asc'
            }
        },
        mounted(){
            this.loader = true
            
            this.$store.state.coordinadores = []
            this.getCoordinadores()
        },
        methods:{
            editCoordinador(item, index){
                this.$refs.gestionCoordinadores.editCoordinador(item, index)
            },
            getCoordinadores(){
                axios.get(`api/coordinadores/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data.coordinadores[0])
                    for (let i = 0; i < res.data.coordinadores.length; i++) {
                        this.$store.commit('setCoordinadores', res.data.coordinadores[i]) 
                    }
                    this.loader = false
                })
                .catch(err => {
                    this.loader = false
                    console.log(err)
                })
            },
            newCoordinador(){
                
                this.$refs.gestionCoordinadores.newCoordinador()
            },
            sort(key) {
                if (this.sortKey === key) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
                } else {
                    this.sortKey = key
                    this.sortOrder = 'asc'
                }
            },
            onSearch() {
                // La búsqueda se ejecuta automáticamente con el computed property
            },
            clearSearch() {
                this.searchQuery = ''
            }
        },
        computed: {
            filteredCoordinadores() {
                if (!this.searchQuery.trim()) {
                    return this.$store.state.coordinadores
                }
                
                const query = this.searchQuery.toLowerCase().trim()
                
                return this.$store.state.coordinadores.filter(coordinador => {
                    // Buscar en ID (identificación)
                    const id = String(coordinador.id || '').toLowerCase()
                    
                    // Buscar en nombres completos
                    const nombreCompleto = `${coordinador.nombres || ''} ${coordinador.apellidos || ''}`.toLowerCase()
                    
                    return id.includes(query) || nombreCompleto.includes(query)
                })
            },
            sortedCoordinadores() {
                if (!this.sortKey) {
                    return this.filteredCoordinadores
                }
                
                return [...this.filteredCoordinadores].sort((a, b) => {
                    let aVal = a[this.sortKey]
                    let bVal = b[this.sortKey]
                    
                    // Para nombres, concatenar nombres y apellidos
                    if (this.sortKey === 'nombres') {
                        aVal = `${a.nombres} ${a.apellidos}`.toLowerCase()
                        bVal = `${b.nombres} ${b.apellidos}`.toLowerCase()
                    }
                    
                    // Para números
                    if (this.sortKey === 'id' || this.sortKey === 'meta_votacion') {
                        aVal = Number(aVal) || 0
                        bVal = Number(bVal) || 0
                    }
                    
                    // Para strings
                    if (typeof aVal === 'string') {
                        aVal = aVal.toLowerCase()
                        bVal = bVal.toLowerCase()
                    }
                    
                    if (aVal < bVal) {
                        return this.sortOrder === 'asc' ? -1 : 1
                    }
                    if (aVal > bVal) {
                        return this.sortOrder === 'asc' ? 1 : -1
                    }
                    return 0
                })
            },
            filteredAndSortedCoordinadores() {
                return this.sortedCoordinadores
            },
            totalMetaVotacion() {
                return this.filteredAndSortedCoordinadores.reduce((total, coordinador) => {
                    const meta = Number(coordinador.meta_votacion) || 0
                    return total + meta
                }, 0)
            }
        }
    }
</script>
<style scoped>
    svg.bi-pencil-square.b-icon.bi{
        color: orange;
        cursor: pointer !important;
        height: 1.5em;
        width: 1.5em;
    }
    .tabla{
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
    
    .sortable {
        cursor: pointer;
        user-select: none;
        position: relative;
        transition: background-color 0.2s ease;
    }
    
    .sortable:hover {
        background-color: #f8f9fa;
    }
    
    .sort-icons {
        display: inline-block;
        margin-left: 5px;
        vertical-align: middle;
    }
    
    .sort-neutral {
        opacity: 0.3;
    }
    
    .sortable:hover .sort-neutral {
        opacity: 0.6;
    }
    
    /* Estilos para el campo de búsqueda */
    .search-container {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-input {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 0.95rem;
        transition: all 0.3s ease;
    }
    
    .search-input:focus {
        border-color: #C60000;
        box-shadow: 0 0 0 0.2rem rgba(198, 0, 0, 0.15);
        outline: none;
    }
    
    .search-icon {
        position: absolute;
        left: 0.75rem;
        color: #6c757d;
        z-index: 1;
        pointer-events: none;
    }
    
    .clear-search {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: #6c757d;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        transition: all 0.2s ease;
    }
    
    .clear-search:hover {
        background-color: #f8f9fa;
        color: #495057;
    }
    
    .search-results-info {
        display: flex;
        align-items: center;
        height: 100%;
        padding-left: 1rem;
    }
    
    /* Estilos para el pie de tabla */
    .table-footer {
        background-color: #f8f9fa;
        border-top: 2px solid #C60000;
    }
    
    .table-footer td {
        padding: 1rem 0.75rem;
        font-size: 0.95rem;
        vertical-align: middle;
    }
    
    .table-footer .font-weight-bold {
        font-weight: 600;
    }
    
    .table-footer .text-primary {
        color: #C60000 !important;
        font-size: 1.1rem;
    }
</style>

<style scoped src="../../assets/styles/personal-admin.css"></style>
