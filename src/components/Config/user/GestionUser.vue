<template>    
    <b-modal ref="visible" hide-footer :title="title + ' Usuario'" size="lg">
        <div class="text-center" v-if="loader">
            <Loading />
        </div>
        <div class="row" v-else>
            <div class="col-md-6 mb-3">
                <label for="role">Role</label>
                <b-select :options="roles" v-model="user.role_id" @change="getPersons" :disabled="$store.state.user.role_id === 6"></b-select>               
            </div>
            <div class="col-12 col-sm-6 mb-3" v-if="user.role_id === 5 && user.create ">
                <label for="lider">Lider</label>
                <model-select id="lider" :options="lideres" v-model="item" @input="setNombres"></model-select>
            </div>
            <div class="col-12 col-sm-6 mb-3" v-if="user.role_id === 6 && user.create ">
                <label for="coordinador">Coordinador</label>
                <model-select id="coordinador" :options="coordinadores" v-model="item" @input="setNombres"></model-select>
            </div>
            <div class="col-12 col-sm-6 mb-3" v-if="user.role_id === 8 && user.create ">
                <label for="subcoordinador">Sub Coordinador</label>
                <model-select id="subcoordinador" :options="subcoordinadores" v-model="item" @input="setNombres"></model-select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="nombres">Nombres</label>
                <input type="text" class="form-control" id="nombres" v-model="user.name" />
            </div>
            <div class="col-md-6 mb-3">
                <label for="username">Username</label>
                <input type="text" id="username" class="form-control" v-model="user.username">
            </div>
            
            <div class="col-md-6 mb-3" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 6 ">
                <label for="candidato">Candidato</label>
                <select id="candidato" class="form-control" v-model="user.candidato_id">
                    <option v-for="(item, index) in candidatos" :key="index" :value="item.id">{{ item.nombres }}</option>
                </select>
            </div>
            <div class="col-md-6 mb-3" v-if="user.role_id === 10 || user.role_id === 11 ">
                <label for="comando">Asociar comando</label>
                <ModelSelect
                    :options="comandos"
                    v-model="user.comando_id"
                ></ModelSelect>
            </div>
            <div class="col-md-6 mb-3" v-if="user.create">
                <label for="password">Clave</label>
                <input type="password" id="password" v-model="user.password" class="form-control">
            </div>
            <div class="col-md-6 mb-3" v-else>
                <label for="estado">Estado</label>
                <select id="estado" v-model="user.estado_id" class="form-control">
                    <option v-for="(item, index) in estados" :key="index" :value="item.id">{{item.estado}}</option>
                </select>
            </div>
            <div class="col-md-12 mt-3">
                <p v-if="msnError" class="alert alert-danger mb-3">{{errors}}</p>
                <button class="btn btn-warning" @click="updateUser" v-if="user.update">Actualizar</button>
                <button class="btn btn-primary" @click="saveUser" v-else>Guardar</button>                
            </div>
        </div>
    </b-modal>
</template>
<script>
    import axios from 'axios'
    import { message } from 'ant-design-vue'
    import { ModelSelect } from '../../../../node_modules/vue-search-select/dist/VueSearchSelect.common'
    import Loading from '../../Loader/Loading.vue'
    export default {
        components:{
            ModelSelect, 
            Loading
        },
        data() {
            return {
                candidatos: [],
                comandos: [],
                coordinadores: [],
                errors: '',
                estados: [
                    {id: 1, estado: 'Activo'},
                    {id: 2, estado: 'Inactivo'}
                ],
                index: null,
                item: {value: "", text: ""},
                lideres: [],
                loader: false,
                msnError: false,
                roles: [],
                subcoordinadores: [],
                title: '',
                user: {update: false, id: null},
                visible: false
            }
        },
        mounted() {            
            this.getCandidatos()
            this.getComandos()
            this.getRoles()
        },
        methods: {
            async createUserApi(){

                const url = this.getUrlApi
                let json = JSON.stringify(this.user)
                let params = "json="+json

                const newUser = await axios.post(`http://eleccioneslocales2023.duckdns.org:8000/api/users`, params, {
                    headers:{
                        "Authorization": `Bearer ${this.$store.state.tokenApi}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                console.log(newUser)
            },
            async updateUserApi(){ //PENDIENTE DE PRUEBA
                let json = JSON.stringify(this.user)
                let params = "json="+json
                const newUser = await axios.put(`http://eleccioneslocales2023.duckdns.org:8000/api/users/${this.user.id}`, params, {
                    headers:{
                        "Authorization": `Bearer ${this.$store.state.tokenApi}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            },
            getCandidatos(){
                axios.get('/api/candidatos', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    this.candidatos = res.data.candidatos
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getComandos(){
                axios.get(`api/comandos`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    for (let i = 0; i < res.data.comandos.length; i++) {
                        this.comandos.push({
                            text: res.data.comandos[i].nombre,
                            value: res.data.comandos[i].id
                        })                        
                    }
                })
                .catch(err => {
                    this.loader = false
                    console.log(err)
                })
            },
            getCoordinadores(){
                this.coordinadores = []
                axios.get(`api/coordinadores/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data.coordinadores[0])
                    for (let i = 0; i < res.data.coordinadores.length; i++) {
                        this.coordinadores.push({
                            text: res.data.coordinadores[i].nombres +' '+  res.data.coordinadores[i].apellidos,
                            value: res.data.coordinadores[i].id
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getSubCoordinadores(){
                this.subcoordinadores = []
                axios.get(`api/subcoordinadores/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data.coordinadores[0])
                    for (let i = 0; i < res.data.subcoordinadores.length; i++) {
                        this.subcoordinadores.push({
                            text: res.data.subcoordinadores[i].nombres +' '+  res.data.subcoordinadores[i].apellidos,
                            value: res.data.subcoordinadores[i].id
                        })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            getPersons(){
                this.item = {text: '', value: ''}
                this.user.id = ''
                this.user.name = ''
                this.user.username = ''

                if(this.user.role_id === 5){
                    this.getLideres()
                }else if(this.user.role_id === 6){
                    this.getCoordinadores()
                }else if(this.user.role_id === 8){
                    this.getSubCoordinadores()
                }
            },
            getLideres(){
                this.lideres = []            
                axios.get(`api/lideres/${this.$store.state.user.candidato_id}`,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        
                        for (let i = 0; i < res.data.lideres.length; i++) {
                            this.lideres.push({
                                text: res.data.lideres[i].nombres +' '+  res.data.lideres[i].apellidos,
                                value: res.data.lideres[i].id
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            getRoles(){
                axios.get('/api/roles', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    
                    let roles = res.data.roles
                    if(this.$store.state.user.role_id === 2){
                        roles = roles.filter((item) => item.id !== 1)
                    }
                    for (let i = 0; i < roles.length; i++) {
                        this.roles.push({
                            value: roles[i].id,
                            text: roles[i].role
                        })                   
                    }
                    
                })
                .catch(err => {
                    console.log(err)
                })
            },
            saveUser(){
                this.msnError = false
                this.loader = true
                const validate = this.validateUser()
                if(validate)return
                
                if(this.user.role_id === 5 || this.user.role_id === 6){
                    if(this.user.id === null || this.user.id === '' || this.user.id === undefined){
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'No ha creado lideres o coordinadores'
                        })
                        this.loader = false
                        return;
                    }
                }

                const pass = this.user.password.split('')                
                if(pass.length < 6){
                    Swal.fire({
                        icon: 'error',
                        title: 'Contraseña invalida',
                        text: 'La contraseña debe tener minimo 6 caracteres'
                    })
                    this.loader = false
                    return
                }

                /* if(this.$store.state.user.role_id === 2){
                    this.user.candidato_id = this.$store.state.user.candidato_id
                } */

                axios.post('/api/users', this.user, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.user){
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario fue creado con exito.'
                        })	
                        this.$store.commit('setUsers',res.data.user[0])   
                        // this.createUserApi()
                        this.$refs['visible'].hide()
                    }else{
                        this.errors = res.data
                        this.msnError = true
                    }
                    this.loader = false
                })
                .catch(err => {
                    console.log(err)
                })
            },
            setNombres(searchText){
                
                const name = searchText.text
                const cedula = searchText.value
                this.user.id = cedula
                this.user.name = name
                this.user.username = name.substr(0,3)+''+cedula
            },
            showModalUser(item, opc, index){
                this.errors = ''
                // this.visible = true
                this.$refs['visible'].show()
                this.msnError = false
                if(opc === 1){
                    this.user = {name: null, username: null, role_id: null, password: null}
                    this.user.create = true
                    this.user.update = false
                    this.title = 'Nuevo'
                    
                    // Si el usuario logueado es coordinador (role_id = 6), asignar automáticamente role_id = 5 (Lider)
                    if(this.$store.state.user.role_id === 6){
                        this.user.role_id = 5
                        this.$nextTick(() => {
                            this.getPersons()
                        })
                    }
                }else{
                    this.title = 'Editar'
                    this.user = item
                    this.user.update = true
                    this.user.create = false
                }
                this.index = index      
                // this.user.candidato_id = this.$store.state.user.candidato_id
            },
            updateUser(){
                this.msnError = false
                this.loader = true
                const validate = this.validateUser()
                if(validate){
                    this.loader = false
                    return
                }
                axios.put(`/api/users/${this.user.id}`, this.user, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    
                    if(res.data.user){
                        message.success('Usuario modificado con exito', 5)		
                        this.$store.commit('deleteUser',this.index)   //El orden importa.
                        this.$store.commit('setUsers',res.data.user[0])   
                        // this.updateUserApi()
                        this.$refs['visible'].hide()
                    }else{
                        this.errors = res.data
                        this.msnError = true
                    }
                    this.loader = false
                })
                .catch(err => {
                    console.log(err)
                })
            },
            validateUser(){
                if(this.user.name === null || this.user.name === '' || this.user.username === null || this.user.username === '' || this.user.role_id === null || this.user.role_id === '' || this.user.password === null || this.user.password === ''){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos invalidos',
                        text: 'Hay campos vacios o nulos, revisar'
                    })
                    return true
                }
            },
        },        
		computed:{
			ipPublica(){
				return this.$store.getters.getUrlApi
			}
		}
    }
</script>
<style scoped>
    .ant-modal-title{
        font-weight: 700 !important;
        font-size: 20px !important;
    }
    .ant-select{
        display: block !important;
    }
</style>