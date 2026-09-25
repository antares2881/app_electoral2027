<template>
    <b-modal ref="generate" centered hide-footer no-close-on-backdrop>
        <template #modal-header>
            <h4>Generador de token</h4>
        </template>
        <div class="row">
            <div class="col-12" v-if="!$store.state.loading">
                <div  v-if="$store.state.token_err">
                    <h6  class="alert alert-danger">El token no fue generado, verifica la contraseña ingresada</h6>
                </div>
                <div v-else>
                    <h6 class="alert alert-success" v-if="$store.state.tokenApi">Token generado con exito</h6>
                    <h6 class="alert alert-warning" v-else>Atencion, por seguridad digita tu clave nuevamente!</h6>
                </div>
            </div>
            <div class="col-12 text-center my-3" v-else>
                <b-spinner type="grow" label="Spinning"></b-spinner>
            </div>
            <div class="col-12">
                <input class="form-control" type="password" v-model="password" placeholder="Digita la Clave" @keypress.enter="generateToken">
            </div>
            <div class="col-12 my-3">
                <button class="btn btn-dark" @click="cerrarModal" v-if="$store.state.tokenApi">Cerrar</button>
                <button class="btn btn-primary mr-2" @click="generateToken" v-else>Genera token</button>
            </div>

        </div>
    </b-modal>
</template>
<script>
    export default{
        data(){
            return{
                noGenerado: false,
                generate: false,
                password: null,
                tokenErr: false
            }
        },
        methods:{
            cerrarModal(){
                this.$refs['generate'].hide()
            },
            showModalGenerate(){
                this.$refs['generate'].show()
            },
            generateToken(){
                this.$store.commit('isLoading')
				const credentials = {
					username: this.$store.state.user.username,
					password: this.password,
				}
				this.$store.dispatch("getTokenApi", credentials)
                this.spinner = false
				// console.log(this.$store.state.tokenApi)
			},
        }
    }
</script>