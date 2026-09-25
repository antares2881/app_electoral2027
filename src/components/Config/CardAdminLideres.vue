<template>    
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}">
        <GestionLideres ref="gestion"></GestionLideres>
        <DeleteLideres ref="delete" />
        <template #title>
            <div v-if="loader">
                <Loading />
            </div>
            <div v-else>
                <div class="d-flex justify-content-between my-2">
                    <div>
                        <h3>Gestión de lideres</h3>
                    </div>
                    <div>    
                        <button class="btn btn-success mr-2" @click="descargarExcel" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="m14,2 6,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="m16,13 -4,0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="m16,17 -4,0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Excel
                        </button>
                        <button class="btn btn-dark mr-2" @click="newLider">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                <path d="M10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0Z" fill="currentColor"/>
                                <path d="M10 10C4.47715 10 0 14.4772 0 20H20C20 14.4772 15.5228 10 10 10Z" fill="currentColor"/>
                                <path d="M16 3H18V5H20V7H18V9H16V7H14V5H16V3Z" fill="currentColor"/>
                            </svg>
                            Nuevo líder
                        </button>
                        <button class="btn btn-danger" @click="deleteLider" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19ZM10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
                
                <!-- Campo de búsqueda -->
                <div class="row mb-3">
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
                                Mostrando {{ filteredLideres.length }} de {{ $store.state.lideres.length }} líderes
                            </small>
                        </div>
                    </div>
                </div>
                
                <div class="table-responsive tabla">
                    <table class="table" id="tabla">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th class="sortable" @click="sort('nom_jefe')">
                                    Coordinador
                                    <span class="sort-icons">
                                        <svg v-if="sortKey === 'nom_jefe' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14L12 9L17 14H7Z"/>
                                        </svg>
                                        <svg v-else-if="sortKey === 'nom_jefe' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10L12 15L17 10H7Z"/>
                                        </svg>
                                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                            <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                        </svg>
                                    </span>
                                </th>
                                <th class="sortable" @click="sort('id')">
                                    Id. líder
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
                                    Nombre
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
                                <th class="sortable" @click="sort('meta_votantes')">
                                    Meta
                                    <span class="sort-icons">
                                        <svg v-if="sortKey === 'meta_votantes' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 14L12 9L17 14H7Z"/>
                                        </svg>
                                        <svg v-else-if="sortKey === 'meta_votantes' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10L12 15L17 10H7Z"/>
                                        </svg>
                                        <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                            <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                        </svg>
                                    </span>
                                </th>
                                <th>Datos</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="filteredAndSortedLideres.length === 0 && searchQuery">
                                <tr class="no-results">
                                    <td colspan="7" class="text-center py-4">
                                        <div class="text-muted">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-2">
                                                <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <p class="mb-1">No se encontraron líderes</p>
                                            <small>Intenta con otros términos de búsqueda</small>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-for="(item, index) in filteredAndSortedLideres" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.nom_jefe + ' ' + item.ape_jefe }}</td>
                                    <td>{{ item.id }}</td>
                                    <td>{{ item.nombres }} {{ item.apellidos }}</td>
                                    <td>{{ item.meta_votantes }}</td>
                                    <td>{{ item.direccion }} / {{ item.barrio }} <br> {{ item.telefono }} </td>
                                    <td>                                    
                                        <b-icon icon="pencil-square" aria-hidden="true" @click="editLider(item, index, 1)"></b-icon>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                        <tfoot>
                            <tr class="table-footer">
                                <td colspan="4" class="text-end font-weight-bold">
                                    <strong>Total Meta Votantes:</strong>
                                </td>
                                <td class="font-weight-bold text-primary">
                                    <strong>{{ totalMetaVotantes.toLocaleString() }}</strong>
                                </td>
                                <td colspan="2"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </template>
    </a-card>
</template>
<script>

    import GestionLideres from "../Config/lider/GestionLideres.vue";
    import Loading from '../Loader/Loading.vue';
    import axios from 'axios';
    import DeleteLideres from './lider/DeleteLideres.vue';

    export default{
        components:{
            GestionLideres,
            Loading,
            DeleteLideres
        },
        data(){            
            return{
                coordinadores: [],
                filtro: 0,
                loader: false,
                opcionesLideres: [
                    {text: 'Coordinador', value: 1},
                    {text: 'Sub Coordinador', value: 2}
                ],
                searchQuery: '',
                sortKey: '',
                sortOrder: 'asc'
            }
        },
        mounted(){
            this.loader = true
            
            this.$store.state.lideres = []
            this.getLideres()
        },
        methods:{
            descargarExcel(){
                const $tabla = document.querySelector("#tabla");
                let tableExport = new TableExport($tabla, {
                    exportButtons: false, // No queremos botones
                    filename: "lideres" + Date.now(), //Nombre del archivo de Excel
                    sheetname: "lideres", //Título de la hoja
                });
                let datos = tableExport.getExportData();
                let preferenciasDocumento = datos.tabla.xlsx;
                tableExport.export2file(preferenciasDocumento.data, preferenciasDocumento.mimeType, preferenciasDocumento.filename, preferenciasDocumento.fileExtension, preferenciasDocumento.merges, preferenciasDocumento.RTL, preferenciasDocumento.sheetname);
            },
            deleteLider(){
                this.$refs.delete.showLider()
            },
            editLider(item, index, tipo){
                this.$refs.gestion.editLider(item, index, tipo)
            },
            generateExcel(){
                this.$refs['excel'].show()
            },
            getLideres(){
                axios.get(`api/lideres/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        console.log(res.data.lideres)
                        for (let i = 0; i < res.data.lideres.length; i++) {
                            this.$store.commit('setLideres', res.data.lideres[i]) 
                        }
                    this.loader = false
                    })
                    .catch(err => {
                        console.log(err)
                        this.loader = false
                    })
            },
            newLider(){
                this.$refs.gestion.newLider()
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
            filteredLideres() {
                if (!this.searchQuery.trim()) {
                    return this.$store.state.lideres
                }
                
                const query = this.searchQuery.toLowerCase().trim()
                
                return this.$store.state.lideres.filter(lider => {
                    // Buscar en ID (identificación)
                    const id = String(lider.id || '').toLowerCase()
                    
                    // Buscar en nombres completos del líder
                    const nombreCompleto = `${lider.nombres || ''} ${lider.apellidos || ''}`.toLowerCase()
                    
                    // Buscar en nombre del coordinador
                    const coordinador = `${lider.nom_jefe || ''} ${lider.ape_jefe || ''}`.toLowerCase()
                    
                    return id.includes(query) || nombreCompleto.includes(query) || coordinador.includes(query)
                })
            },
            sortedLideres() {
                if (!this.sortKey) {
                    return this.filteredLideres
                }
                
                return [...this.filteredLideres].sort((a, b) => {
                    let aVal = a[this.sortKey]
                    let bVal = b[this.sortKey]
                    
                    // Para nombres del líder, concatenar nombres y apellidos
                    if (this.sortKey === 'nombres') {
                        aVal = `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase()
                        bVal = `${b.nombres || ''} ${b.apellidos || ''}`.toLowerCase()
                    }
                    
                    // Para nombres del coordinador
                    if (this.sortKey === 'nom_jefe') {
                        aVal = `${a.nom_jefe || ''} ${a.ape_jefe || ''}`.toLowerCase()
                        bVal = `${b.nom_jefe || ''} ${b.ape_jefe || ''}`.toLowerCase()
                    }
                    
                    // Para números
                    if (this.sortKey === 'id' || this.sortKey === 'meta_votantes') {
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
            filteredAndSortedLideres() {
                return this.sortedLideres
            },
            totalMetaVotantes() {
                return this.filteredAndSortedLideres.reduce((total, lider) => {
                    const meta = Number(lider.meta_votantes) || 0
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