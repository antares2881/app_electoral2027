<template>
    <b-modal ref="comandos" hide-footer :title=" title + ' COMANDO' " size="lg">
      <div class="row">
        <div class="col-6">
            <label for="nombre">Nombre comando</label>
            <input type="text" id="nombre" class="form-control" v-model="comando.nombre">
        </div>
        <div class="col-6">
            <label for="proyectados">Personal proyectado</label>
            <input type="text" id="proyectados" class="form-control" v-model="comando.proyectados">
        </div>
        <div class="col-6">
            <label for="contacto">Contacto del comando</label>
            <input type="text" id="contacto" class="form-control" v-model="comando.contacto">
        </div>
        <div class="col-12 my-3">
            <button class="btn btn-primary" v-if="!editar" @click="saveComando">Guardar</button>
            <button class="btn btn-warning" v-if="editar" @click="updateComando">Actualizar</button>
            <button class="btn btn-secondary ml-2" @click="close">Cancelar</button>
        </div>
        <div class="col-12 my-2" v-if="errores">
            <ul v-for="(item, index) in errores" :key="index">
                <li>{{item}}</li>
            </ul>
        </div>
      </div>
    </b-modal>
</template>
<script>

    import axios from 'axios';
    export default {
        data() {
            return{
                comando: {},
                editar: false,
                errores: null,
                index: null,
                title: null
            }
        },
        methods:{
            close(){
                this.$refs['comandos'].hide()
            },
            editComando(item, index){
                this.editar = true;
                this.index = index
                this.title = 'EDITAR'
                this.comando = item
                this.$refs['comandos'].show()
            },
            newComando(){
                this.editar = false;
                this.title = 'NUEVO'
                this.$refs['comandos'].show()
            },
            saveComando(){

                this.errores = null;

                axios.post('api/comandos', this.comando, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data.comando)
                    if(res.data.status === 'success'){
                        this.$store.commit('setComandos', res.data.comando)
                        this.$refs['comandos'].hide()
                    }else{
                        this.errores = res.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            updateComando(index){
                this.errores = null;

                axios.put(`api/comandos/${this.comando.id}`, this.comando, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    // console.log(res.data.comando)
                    if(res.data.status === 'success'){
                        this.$store.commit('deleteComando', this.index)
                        this.$store.commit('setComandos', res.data.comando)
                        this.$refs['comandos'].hide()
                    }else{
                        this.errores = res.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>