<template>
    <a-card :bordered="false" class="header-solid h-full personal-admin" :bodyStyle="{padding: 0,}">
        <GestionUser ref="gestionUser" />
        
        <!-- Modal de cambio de contraseña -->
        <b-modal ref="changePasswordModal" size="md" hide-footer title="Cambiar Contraseña">
            <div class="row">
                <div class="col-12">
                    <p class="mb-3">Usuario: <strong>{{ selectedUser ? selectedUser.username : '' }}</strong></p>
                    <label for="newPassword">Nueva Contraseña</label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        class="form-control" 
                        v-model="newPassword"
                        placeholder="Mínimo 6 caracteres"
                        @keyup.enter="changePassword"
                    >
                    <div v-if="passwordError" class="error-message mt-2">{{ passwordError }}</div>
                    <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
                </div>
                <div class="col-12 mt-4">
                    <button class="btn btn-primary mr-2" @click="changePassword" :disabled="loadingPassword">
                        <span v-if="loadingPassword" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {{ loadingPassword ? 'Cambiando...' : 'Cambiar Contraseña' }}
                    </button>
                    <button class="btn btn-secondary" @click="closePasswordModal">Cancelar</button>
                </div>
            </div>
        </b-modal>
        <template #title>
            <a-row v-if="loader">
                <Loading />
            </a-row>
            <a-row type="flex" v-else>
                <a-col :span="24" :md="24" >
                    <div class="personal-cabecera">
                        <div>
                            <h4><strong>Usuarios </strong></h4>
                        </div>
                        <div>
                            <button class="btn btn-dark" @click="gestionUser(null, 1, 0)" v-if="$store.state.user.role_id <= 2 || $store.state.user.role_id === 6">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                                    <path d="M10 0C7.79086 0 6 1.79086 6 4C6 6.20914 7.79086 8 10 8C12.2091 8 14 6.20914 14 4C14 1.79086 12.2091 0 10 0Z" fill="currentColor"/>
                                    <path d="M10 10C4.47715 10 0 14.4772 0 20H20C20 14.4772 15.5228 10 10 10Z" fill="currentColor"/>
                                    <path d="M16 3H18V5H20V7H18V9H16V7H14V5H16V3Z" fill="currentColor"/>
                                </svg>
                                Nuevo usuario
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
                                    placeholder="Buscar por usuario o candidato..." 
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
                                    Mostrando {{ filteredUsers.length }} de {{ $store.state.users.length }} usuarios
                                </small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="table-responsive tabla">
                        <table class="table mt-3">
                            <thead>
                                <tr>
                                    <th class="sortable" @click="sort('nombre_candidato')">
                                        Candidato
                                        <span class="sort-icons">
                                            <svg v-if="sortKey === 'nombre_candidato' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 14L12 9L17 14H7Z"/>
                                            </svg>
                                            <svg v-else-if="sortKey === 'nombre_candidato' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 10L12 15L17 10H7Z"/>
                                            </svg>
                                            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                                <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th class="sortable" @click="sort('username')">
                                        Usuario
                                        <span class="sort-icons">
                                            <svg v-if="sortKey === 'username' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 14L12 9L17 14H7Z"/>
                                            </svg>
                                            <svg v-else-if="sortKey === 'username' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 10L12 15L17 10H7Z"/>
                                            </svg>
                                            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                                <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th class="sortable" @click="sort('role')">
                                        Role
                                        <span class="sort-icons">
                                            <svg v-if="sortKey === 'role' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 14L12 9L17 14H7Z"/>
                                            </svg>
                                            <svg v-else-if="sortKey === 'role' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 10L12 15L17 10H7Z"/>
                                            </svg>
                                            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                                <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th class="sortable" @click="sort('estado')">
                                        Estado
                                        <span class="sort-icons">
                                            <svg v-if="sortKey === 'estado' && sortOrder === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 14L12 9L17 14H7Z"/>
                                            </svg>
                                            <svg v-else-if="sortKey === 'estado' && sortOrder === 'desc'" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7 10L12 15L17 10H7Z"/>
                                            </svg>
                                            <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="sort-neutral">
                                                <path d="M12 5.83L15.17 9L16.58 7.59L12 3L7.41 7.59L8.83 9L12 5.83ZM12 18.17L8.83 15L7.41 16.41L12 21L16.59 16.41L15.17 15L12 18.17Z"/>
                                            </svg>
                                        </span>
                                    </th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>  
                            <tbody>
                                <template v-if="filteredAndSortedUsers.length === 0 && searchQuery">
                                    <tr class="no-results">
                                        <td colspan="5" class="text-center py-4">
                                            <div class="text-muted">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-2">
                                                    <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <p class="mb-1">No se encontraron usuarios</p>
                                                <small>Intenta con otros términos de búsqueda</small>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr v-for="(user, index) in filteredAndSortedUsers" :key="index">
                                        <td>{{user.nombre_candidato}}</td>
                                        <td>{{user.username}}</td>
                                        <td>{{user.role}}</td>
                                        <td>{{user.estado}}</td>
                                        <td>
                                            <a-icon type="form" theme="outlined" class="iconos editar" v-if="$store.state.user.role_id <= 2 || $store.state.user.role_id === 6" @click="gestionUser(user, 2, index)" />
                                            <a-icon type="lock" theme="outlined" class="iconos cambiar-clave ml-2" v-if="$store.state.user.role_id <= 2 || $store.state.user.role_id === 6" @click="openChangePasswordModal(user, index)" title="Cambiar contraseña" />
                                        </td>
                                    </tr>
                                </template>
                            </tbody> 
                        </table>  
                    </div>
                </a-col>
            </a-row>
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios';
    import GestionUser from '../Config/user/GestionUser.vue';
    import Loading from '../Loader/Loading.vue'

    export default {
        components:{
            GestionUser,
            Loading
        },
        data() {
            return {
                loader: false,
                users: [],
                searchQuery: '',
                sortKey: '',
                sortOrder: 'asc',
                selectedUser: null,
                selectedUserIndex: null,
                newPassword: '',
                passwordError: '',
                successMessage: '',
                loadingPassword: false
            }
        },
        mounted() {
            this.loader = true;
            this.$store.state.users = [];
            this.verificaApi();			
            this.getUsers();
        },
        methods: {
            gestionUser(user, opc, index){
                this.$refs.gestionUser.showModalUser(user, opc, index)
            },
            getUsers(){

                // this.$store.commit('cleanUsers')
                let corporacion = this.$store.state.user.candidato[0].corporacione_id
                axios.get(`/api/users/${corporacion}`, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    for (let i = 0; i < res.data.users.length; i++) {
                        if(this.$store.state.user.role_id === 1){
                            this.$store.commit('setUsers', res.data.users[i])      
                            
                        }else{
                            if(res.data.users[i].role_id !== 1){
                                this.$store.commit('setUsers', res.data.users[i])   
                            }
                        }
                    }
                    this.loader = false
                    // this.users = this.setUser
                })
                .catch(err => {
                    this.loader = false
                    console.log(err)
                })
            },            
            verificaApi(){
				this.$store.dispatch('getUrlApi', this.$store.state.user.token);
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
            },
            openChangePasswordModal(user, index) {
                this.selectedUser = user
                this.selectedUserIndex = index
                this.newPassword = ''
                this.passwordError = ''
                this.successMessage = ''
                this.$refs.changePasswordModal.show()
            },
            closePasswordModal() {
                this.$refs.changePasswordModal.hide()
                this.selectedUser = null
                this.selectedUserIndex = null
                this.newPassword = ''
                this.passwordError = ''
                this.successMessage = ''
            },
            changePassword() {
                this.passwordError = ''
                this.successMessage = ''
                
                // Validar que la contraseña tenga al menos 6 caracteres
                if (!this.newPassword || this.newPassword.length < 6) {
                    this.passwordError = 'La contraseña debe tener al menos 6 caracteres'
                    return
                }
                
                this.loadingPassword = true
                
                axios.post('/api/change-password', {
                    username: this.selectedUser.username,
                    password: this.newPassword
                }, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    if(res.data.status !== 'success') {
                        this.loadingPassword = false
                        this.passwordError = res.data.message || 'Error al cambiar la contraseña. Intente nuevamente.'
                        return
                    }
                    console.log('Contraseña cambiada:', res.data)
                    this.loadingPassword = false
                    this.successMessage = 'Contraseña cambiada exitosamente'
                    
                    // Cerrar el modal después de 1.5 segundos
                    setTimeout(() => {
                        this.closePasswordModal()
                    }, 1500)
                })
                .catch(err => {
                    this.loadingPassword = false
                    console.log('Error al cambiar contraseña:', err)
                    
                    if(err.response && err.response.data && err.response.data.message) {
                        this.passwordError = err.response.data.message
                    } else {
                        this.passwordError = 'Error al cambiar la contraseña. Intente nuevamente.'
                    }
                })
            }
        },
        computed: {
            getUser(){
                return this.$store.getters.getUsers
            },
            filteredUsers() {
                if (!this.searchQuery.trim()) {
                    return this.$store.state.users
                }
                
                const query = this.searchQuery.toLowerCase().trim()
                
                return this.$store.state.users.filter(user => {
                    // Buscar en nombre de usuario
                    const username = String(user.username || '').toLowerCase()
                    
                    // Buscar en nombre del candidato
                    const candidato = String(user.nombre_candidato || '').toLowerCase()
                    
                    // Buscar en rol
                    const role = String(user.role || '').toLowerCase()
                    
                    return username.includes(query) || candidato.includes(query) || role.includes(query)
                })
            },
            sortedUsers() {
                if (!this.sortKey) {
                    return this.filteredUsers
                }
                
                return [...this.filteredUsers].sort((a, b) => {
                    let aVal = a[this.sortKey]
                    let bVal = b[this.sortKey]
                    
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
            filteredAndSortedUsers() {
                return this.sortedUsers
            }
        },
    }
</script>
<style scoped>
	.editar{
		color: orange;
	}
	.cambiar-clave{
		color: #007bff;
		cursor: pointer;
	}
	.cambiar-clave:hover{
		color: #0056b3;
	}
	.guardar{
		color: green;
	}
	.iconos{
		font-size: 16pt;
		margin-right: 5px;
        cursor: pointer;
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
</style>
<style scoped src="../../assets/styles/personal-admin.css"></style>
