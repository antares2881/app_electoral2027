<template>
    <b-modal ref="visible" hide-footer :title="title + ' Recolector'" size="lg">
        <div class="row">
            <div class="col-md-6">
                <label for="cedula">Cedula</label>
                <input type="number" class="form-control" v-model.number="recolector.id" />
            </div>
            <div class="col-md-6">
                <label for="nombres">Nombres</label>
                <input type="text" class="form-control" v-model="recolector.nombres" />
            </div>
            <div class="col-md-6">
                <label for="apellidos">Apellidos</label>
                <input type="text" class="form-control" v-model="recolector.apellidos" />
            </div>
            <div class="col-md-6">
                <label for="telefono">Telefono</label>
                <input type="number" class="form-control" v-model.number="recolector.telefono" />
            </div>
            <div class="col-md-12 mt-3">
                <p v-if="msnError" class="alert alert-danger mb-3">{{errors}}</p>
                <button class="btn btn-warning" @click="updateRecolector" v-if="recolector.update">Actualizar</button>
                <button class="btn btn-primary" @click="saveRecolector" v-else>Guardar</button>
            </div>
        </div>        
    </b-modal>
</template>
<script>
    import axios from 'axios'
    import { message } from 'ant-design-vue'
    export default {
        data() {
            return {
                errors: '',
                index: null,
                msnError: false,
                recolector: {update: false},
                title: '',
                visible: false
            }
        },
        mounted() {
        },
        methods: {
            showModalRecolector(item, opc, index){
                this.errors = ''
                this.$refs['visible'].show()
                this.msnError = false
                if(opc === 1){
                    this.title = 'Nuevo'
                    this.recolector = {id: null, nombres: null, apellidos: null, telefono: null}
                }else{
                    this.title = 'Editar'
                    this.recolector = item
                    this.recolector.update = true
                }
                this.index = index      
            },
            saveRecolector(){
                this.msnError = false

                const validate = this.validateRecolector()
                if(validate)return
                this.recolector.candidato = this.$store.state.user.candidato_id
                axios.post('/api/recolectores', this.recolector, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    // console.log(res.data)
                    if(res.data.status === 'success'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Registro exitoso',
                            text: 'Recolector creado con exito'
                        })		
                        this.$store.commit('setRecolector',this.recolector)   
                        this.$refs['visible'].hide()
                    }else{
                        this.errors = res.data
                        this.msnError = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            updateRecolector(){
                this.msnError = false
                
                const validate = this.validateRecolector()
                if(validate)return
                axios.put(`/api/recolectores/${this.recolector.id}/update`, this.recolector, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                .then(res => {
                    
                    if(res.data.recolector){
                        Swal.fire({
                            icon: 'success',
                            title: 'Actualizacion exitoso',
                            text: 'Recolector modificado con exito'
                        })	
                        this.$store.commit('deleteRecolector',this.index)   //El orden importa.
                        this.$store.commit('setRecolector',res.data.recolector)   
                        this.$refs['visible'].hide()
                    }else{
                        this.errors = res.data
                        this.msnError = true
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            },
            validateRecolector(){
                if(this.recolector.id === null || this.recolector.id === '' || this.recolector.nombres === null || this.recolector.nombres === '' || this.recolector.apellidos === null || this.recolector.apellidos === '' || this.recolector.telefono === null || this.recolector.telefono === ''){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Campos invalidos',
                        text: 'Hay campos vacios o nulos, revisar'
                    })
                    return true
                }                
            }
        },
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