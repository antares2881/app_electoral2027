<template>
    <div>
        <div class="row" v-if="!spinner">
            <div class="col-md-6" >
                <label for="password">Nuev clave</label>
                <input type="password" class="form-control" id="password" v-model="user.password">
            </div>
            <div class="col-md-6">
                <label for="password_confirmation">Confirmar clave</label>
                <input type="password" class="form-control" id="password_confirmation" v-model="user.password_confirmation">
                
            </div>
        </div>
        <div class="row"  v-else>
            <div class="col-12 text-center my-3">
                <b-spinner type="grow" label="Spinning"></b-spinner>
            </div>
        </div>
        <div class="row">
            <div class="col-12 my-2" v-if="errors">
                <p class="text-danger" v-for="(error, index) in errors.password" :key="index">{{error}}</p>
            </div>
            <div class="col-12 my-3" v-if="mensaje">
                <p class="alert alert-success">{{mensaje}}</p>
            </div>
            <div class="col-12 my-3">
                <button class="btn btn-primary" @click="savePassword">Guardar</button>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    export default { 
        data() {
            return{
                errors: '',
                mensaje: '',
                spinner: false,
                user: {password: null, username: this.$store.state.user.username}
            }
        },
        mounted() {
			this.verificaApi()
		},
        methods:{
            async changePasswordApi(){
                let json = JSON.stringify(this.user)
                let params = "json="+json

                const newUser = await axios.post(`http://eleccioneslocales2023.duckdns.org:8000/api/change-password`, params, {
                    headers:{
                        "Authorization": `Bearer ${this.$store.state.tokenApi}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                this.mensaje = 'Clave cambiada con exito'
                this.user.password = null
                this.user.password_confirmation = null
                this.spinner = false
                // console.log(newUser)
            },
            savePassword(){

                if(this.user.password === null || this.user.password === ''){
                    Swal.fire({
                        icon: 'error',
                        text: 'El password es requerido'
                    })
                    return
                }

                this.spinner = true
                this.errors = ''
                this.mensaje = ''
                axios.post('/api/change-password', this.user, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data)
                    if(res.data.status === 'success'){
                        this.changePasswordApi()                        
                    }else{
                        this.errors = res.data
                        this.spinner = false
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },            
			verificaApi(){
				this.$store.dispatch('getUrlApi', this.$store.state.user.token);
			},
        }
    }
</script>